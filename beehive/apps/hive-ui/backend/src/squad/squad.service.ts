import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DEFAULT_SQUAD_MEMBERS, type SquadMember, type SquadMemberId } from './squad.types';

@Injectable()
export class SquadService {
  private readonly hiveRoot = process.env.HIVE_ROOT || path.resolve(process.cwd(), '../../..');
  private readonly squadPath = path.join(this.hiveRoot, 'beehive', 'squad.json');

  async getSquad(): Promise<SquadMember[]> {
    try {
      const content = await fs.readFile(this.squadPath, 'utf-8');
      return this.parseSquadContent(content);
    } catch (error) {
      if (this.isMissingFile(error)) {
        return DEFAULT_SQUAD_MEMBERS.map((member) => ({ ...member }));
      }

      throw error;
    }
  }

  async updateSquad(payload: unknown): Promise<SquadMember[]> {
    const current = await this.getSquad();
    const next = this.normalizeUpdate(payload, current);
    await this.writeAtomically(next);
    return next;
  }

  private parseSquadContent(content: string): SquadMember[] {
    try {
      const parsed = JSON.parse(content) as unknown;
      return this.normalizeStoredMembers(parsed);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException('squad.json inválido.');
    }
  }

  private normalizeStoredMembers(payload: unknown): SquadMember[] {
    if (!Array.isArray(payload)) {
      throw new BadRequestException('squad.json deve conter um array de membros.');
    }

    const ids = new Set<SquadMemberId>();
    const members = payload.map((entry) => this.normalizeStoredMember(entry));

    for (const member of members) {
      if (ids.has(member.id)) {
        throw new BadRequestException(`Membro duplicado em squad.json: ${member.id}.`);
      }
      ids.add(member.id);
    }

    const expectedIds = DEFAULT_SQUAD_MEMBERS.map((member) => member.id);
    if (members.length !== expectedIds.length || expectedIds.some((id) => !ids.has(id))) {
      throw new BadRequestException('squad.json deve conter exatamente os quatro membros esperados.');
    }

    return DEFAULT_SQUAD_MEMBERS.map((fallbackMember) => {
      const stored = members.find((member) => member.id === fallbackMember.id);
      if (!stored) {
        throw new BadRequestException(`Membro ausente em squad.json: ${fallbackMember.id}.`);
      }

      return stored;
    });
  }

  private normalizeStoredMember(entry: unknown): SquadMember {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new BadRequestException('Membro de squad inválido.');
    }

    const candidate = entry as Partial<SquadMember>;
    if (!this.isSquadMemberId(candidate.id)) {
      throw new BadRequestException('id de membro inválido em squad.json.');
    }

    return {
      id: candidate.id,
      name: this.cleanText(candidate.name, 'name'),
      role: this.cleanText(candidate.role, 'role'),
      model: this.cleanText(candidate.model, 'model'),
      initial: this.cleanInitial(candidate.initial),
      inbox: this.cleanText(candidate.inbox, 'inbox'),
      active: this.cleanBoolean(candidate.active, 'active'),
    };
  }

  private normalizeUpdate(payload: unknown, current: SquadMember[]): SquadMember[] {
    if (!Array.isArray(payload)) {
      throw new BadRequestException('Payload inválido. Envie um array de membros.');
    }

    const currentById = new Map(current.map((member) => [member.id, member]));
    const seen = new Set<SquadMemberId>();

    for (const entry of payload) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new BadRequestException('Payload inválido. Cada membro deve ser um objeto.');
      }

      const candidate = entry as Partial<SquadMember>;
      if (!this.isSquadMemberId(candidate.id) || !currentById.has(candidate.id)) {
        throw new BadRequestException('Payload inválido. Encontrado id de membro desconhecido.');
      }

      if (seen.has(candidate.id)) {
        throw new BadRequestException(`Payload inválido. Membro duplicado: ${candidate.id}.`);
      }

      seen.add(candidate.id);
    }

    if (seen.size !== current.length) {
      throw new BadRequestException('Payload inválido. Todos os membros do squad devem ser enviados.');
    }

    return current.map((member) => {
      const update = payload.find(
        (entry): entry is Partial<SquadMember> =>
          typeof entry === 'object' &&
          entry !== null &&
          !Array.isArray(entry) &&
          'id' in entry &&
          entry.id === member.id,
      );

      if (!update) {
        throw new BadRequestException(`Payload inválido. Membro ausente: ${member.id}.`);
      }

      return {
        ...member,
        name: this.cleanText(update.name, `name de ${member.id}`),
        role: this.cleanText(update.role, `role de ${member.id}`),
        model: this.cleanText(update.model, `model de ${member.id}`),
        initial: this.cleanInitial(update.initial),
      };
    });
  }

  private async writeAtomically(members: SquadMember[]): Promise<void> {
    const dir = path.dirname(this.squadPath);
    const tempPath = `${this.squadPath}.tmp`;
    const content = `${JSON.stringify(members, null, 2)}\n`;

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(tempPath, content, 'utf-8');
    await fs.rename(tempPath, this.squadPath);
  }

  private cleanText(value: unknown, field: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(`${field} deve ser texto.`);
    }

    const cleaned = value.trim();
    if (!cleaned) {
      throw new BadRequestException(`${field} não pode ficar vazio.`);
    }

    return cleaned;
  }

  private cleanInitial(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('initial deve ser texto.');
    }

    const cleaned = value.trim().toUpperCase();
    if (!cleaned) {
      throw new BadRequestException('initial não pode ficar vazio.');
    }

    if (cleaned.length > 2) {
      throw new BadRequestException('initial deve ter no máximo 2 caracteres.');
    }

    return cleaned;
  }

  private cleanBoolean(value: unknown, field: string): boolean {
    if (typeof value !== 'boolean') {
      throw new BadRequestException(`${field} deve ser boolean.`);
    }

    return value;
  }

  private isSquadMemberId(value: unknown): value is SquadMemberId {
    return ['claude', 'copilot', 'gemini', 'marcio'].includes(String(value));
  }

  private isMissingFile(error: unknown): error is NodeJS.ErrnoException {
    return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
  }
}
