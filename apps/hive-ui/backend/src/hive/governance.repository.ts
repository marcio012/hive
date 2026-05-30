import { Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface DirectiveEntry {
  id: string;
  titulo: string;
  resumo: string;
  data?: string;
  status?: string;
}

export interface ManifestoContent {
  principios: Array<{ titulo: string; corpo: string }>;
}

export interface RoleEntry {
  agente: string;
  papel: string;
  descricao: string;
}

export interface GovernanceData {
  directives: DirectiveEntry[];
  manifesto: ManifestoContent;
  roles: RoleEntry[];
}

export interface GovernanceRepository {
  listDirectives(): Promise<DirectiveEntry[]>;
  getManifesto(): Promise<ManifestoContent>;
  listRoles(): Promise<RoleEntry[]>;
  getAll(): Promise<GovernanceData>;
}

const ROLE_ORDER = ['claude', 'copilot', 'gemini', 'marcio'] as const;

export class FileBasedGovernanceRepository implements GovernanceRepository {
  private readonly logger = new Logger(FileBasedGovernanceRepository.name);
  private readonly directivesPath: string;
  private readonly manifestoPath: string;
  private readonly rolesYamlPath: string;
  private readonly rolesDirPath: string;

  constructor(private readonly hiveRoot: string) {
    this.directivesPath = path.join(this.hiveRoot, 'beehive', 'cognition', 'diretrizes.md');
    this.manifestoPath = path.join(this.hiveRoot, 'beehive', 'dna', 'manifesto.md');
    this.rolesYamlPath = path.join(this.hiveRoot, 'beehive', 'roles', 'roles.yaml');
    this.rolesDirPath = path.join(this.hiveRoot, 'beehive', 'roles');
  }

  async getAll(): Promise<GovernanceData> {
    const [directives, manifesto, roles] = await Promise.all([
      this.listDirectives(),
      this.getManifesto(),
      this.listRoles(),
    ]);

    return {
      directives,
      manifesto,
      roles,
    };
  }

  async listDirectives(): Promise<DirectiveEntry[]> {
    const content = await this.readFile(this.directivesPath, 'diretrizes');
    if (!content) {
      return [];
    }

    try {
      const metadata = this.parseFrontmatter(content);
      const historicalSection = this.extractSection(
        content,
        /##\s+4\.\s+Registro Histórico de Diretrizes \(DIR\)/i,
      );
      const directives = (historicalSection ? this.parseDirectiveTable(historicalSection) : [])
        .map((directive) => ({
          ...directive,
          data: metadata.ultima_revisao ?? directive.data,
        }))
        .filter((directive) => directive.id && directive.titulo && directive.resumo);

      return this.uniqueById(directives);
    } catch (error) {
      this.warn('Falha ao interpretar diretrizes.', error);
      return [];
    }
  }

  async getManifesto(): Promise<ManifestoContent> {
    const content = await this.readFile(this.manifestoPath, 'manifesto');
    if (!content) {
      return { principios: [] };
    }

    try {
      const principios = [...content.matchAll(/^##\s+\d+\.\s+(.+)$/gm)]
        .map((match, index, matches) => {
          const title = this.cleanInlineMarkdown(match[1]);
          const start = match.index ?? 0;
          const bodyStart = start + match[0].length;
          const nextStart = matches[index + 1]?.index ?? content.length;
          const body = content
            .slice(bodyStart, nextStart)
            .trim()
            .replace(/^\n+|\n+$/g, '');

          return {
            titulo: title,
            corpo: body,
          };
        })
        .filter((item) => item.titulo && item.corpo);

      return { principios };
    } catch (error) {
      this.warn('Falha ao interpretar manifesto.', error);
      return { principios: [] };
    }
  }

  async listRoles(): Promise<RoleEntry[]> {
    const yamlContent = await this.readFile(this.rolesYamlPath, 'roles.yaml');
    if (yamlContent) {
      try {
        const parsed = this.parseRolesYaml(yamlContent);
        if (parsed.length > 0) {
          return parsed;
        }
        this.warn('roles.yaml lido, mas sem agentes reconhecidos.');
      } catch (error) {
        this.warn('Falha ao interpretar roles.yaml.', error);
      }
    }

    return this.listRolesFromMarkdownFallback();
  }

  private async listRolesFromMarkdownFallback(): Promise<RoleEntry[]> {
    const fallbackMap = [
      { agente: 'claude', file: 'claude.md', defaultRole: 'Arquiteto + Auditor Técnico' },
      { agente: 'copilot', file: 'copilot.md', defaultRole: 'Engenheiro / Executor' },
      { agente: 'gemini', file: 'coordenador.md', defaultRole: 'Facilitador Estratégico / Squad Lead' },
      { agente: 'marcio', file: 'marcio.md', defaultRole: 'Owner / The Gate' },
    ] as const;

    const roles = await Promise.all(
      fallbackMap.map(async (entry) => {
        const content = await this.readFile(path.join(this.rolesDirPath, entry.file), `role ${entry.agente}`);
        if (!content) {
          return {
            agente: entry.agente,
            papel: entry.defaultRole,
            descricao: '',
          } satisfies RoleEntry;
        }

        const heading = content.match(/^#\s+Papel:\s*.+?[—-]\s*(.+)$/m);
        const strongLine = content.match(/\*\*([^*]+)\*\*/);
        const firstParagraph = content
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('#') && !line.startsWith('---'))
          .slice(0, 4)
          .join(' ');

        return {
          agente: entry.agente,
          papel: this.cleanInlineMarkdown(heading?.[1] ?? entry.defaultRole),
          descricao: this.cleanInlineMarkdown(strongLine?.[1] ?? firstParagraph),
        } satisfies RoleEntry;
      }),
    );

    return this.sortRoles(roles.filter((role) => role.papel || role.descricao));
  }

  private parseDirectiveTable(section: string): DirectiveEntry[] {
    return section
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^\|\s*DIR-\d+/i.test(line))
      .map((line) => this.parseMarkdownTableRow(line))
      .map((cells) => {
        const id = this.cleanInlineMarkdown(cells[0] ?? '');
        const titulo = this.cleanInlineMarkdown(cells[1] ?? '');
        const resumo = this.cleanInlineMarkdown(cells[2] ?? '');
        const status = /revogad/i.test(`${titulo} ${resumo}`) ? 'revogado' : 'ativo';

        return {
          id,
          titulo,
          resumo,
          status,
        } satisfies DirectiveEntry;
      });
  }

  private parseRolesYaml(content: string): RoleEntry[] {
    const lines = content.split('\n');
    const agentsIndex = lines.findIndex((line) => line.trim() === 'agents:');
    if (agentsIndex === -1) {
      return [];
    }

    const roles: RoleEntry[] = [];
    let current: RoleEntry | null = null;

    const flushCurrent = () => {
      if (current?.agente && current.papel && current.descricao) {
        roles.push(current);
      }
    };

    for (const line of lines.slice(agentsIndex + 1)) {
      if (/^\S/.test(line) && line.trim() !== '') {
        break;
      }

      const agentMatch = line.match(/^  ([a-z0-9_-]+):\s*$/i);
      if (agentMatch) {
        flushCurrent();
        current = {
          agente: agentMatch[1].trim().toLowerCase(),
          papel: '',
          descricao: '',
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const roleMatch = line.match(/^    role:\s*(.+)$/);
      if (roleMatch) {
        current.papel = this.cleanYamlScalar(roleMatch[1]);
        continue;
      }

      const descriptionMatch = line.match(/^    description:\s*(.+)$/);
      if (descriptionMatch) {
        current.descricao = this.cleanYamlScalar(descriptionMatch[1]);
      }
    }

    flushCurrent();
    return this.sortRoles(roles);
  }

  private cleanYamlScalar(value: string): string {
    return value.trim().replace(/^['"]|['"]$/g, '');
  }

  private extractSection(content: string, headingRegex: RegExp): string | null {
    const match = headingRegex.exec(content);
    if (!match || match.index === undefined) {
      return null;
    }

    const start = match.index + match[0].length;
    const remainder = content.slice(start);
    const nextHeading = remainder.search(/\n##\s+\d+\./);
    const end = nextHeading >= 0 ? start + nextHeading : content.length;
    return content.slice(start, end).trim();
  }

  private parseFrontmatter(content: string): Record<string, string> {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return {};
    }

    return match[1].split('\n').reduce<Record<string, string>>((acc, line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private parseMarkdownTableRow(line: string): string[] {
    return line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
  }

  private cleanInlineMarkdown(value: string): string {
    return value
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .trim();
  }

  private uniqueById(entries: DirectiveEntry[]): DirectiveEntry[] {
    const seen = new Set<string>();
    return entries.filter((entry) => {
      if (seen.has(entry.id)) {
        return false;
      }
      seen.add(entry.id);
      return true;
    });
  }

  private sortRoles(entries: RoleEntry[]): RoleEntry[] {
    return [...entries].sort((left, right) => {
      const leftIndex = ROLE_ORDER.indexOf(left.agente as (typeof ROLE_ORDER)[number]);
      const rightIndex = ROLE_ORDER.indexOf(right.agente as (typeof ROLE_ORDER)[number]);
      return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
    });
  }

  private async readFile(filePath: string, label: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      this.warn(`Nao foi possivel ler ${label}.`, error);
      return null;
    }
  }

  private warn(message: string, error?: unknown): void {
    const suffix = error instanceof Error ? ` ${error.message}` : '';
    this.logger.warn(`${message}${suffix}`.trim());
  }
}
