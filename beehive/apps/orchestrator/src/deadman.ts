import { OrchestratorLogger } from './logger';
import { StateStore } from './state';

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export class DeadmanSwitch {
  private lastFailedItem: string | null = null;

  constructor(
    private readonly stateStore: StateStore,
    private readonly logger: OrchestratorLogger,
  ) {}

  async startDispatch(entryId: string): Promise<void> {
    await this.stateStore.updateState((current) => ({
      ...current,
      status: 'dispatching',
      currentItem: entryId,
      pauseReason: null,
    }));
  }

  async resumeWatching(): Promise<void> {
    await this.stateStore.updateState((current) => ({
      ...current,
      status: current.status === 'paused' ? current.status : 'watching',
      currentItem: current.status === 'paused' ? current.currentItem : null,
      pauseReason: current.status === 'paused' ? current.pauseReason : null,
    }));
  }

  async recordSuccess(): Promise<void> {
    this.lastFailedItem = null;
    await this.stateStore.updateState((current) => ({
      ...current,
      status: current.status === 'paused' ? current.status : 'watching',
      currentItem: null,
      pauseReason: current.status === 'paused' ? current.pauseReason : null,
      consecutiveFailures: 0,
    }));
  }

  async recordFailure(entryId: string, reason: string): Promise<void> {
    const nextCount = this.lastFailedItem === entryId ? undefined : 1;
    this.lastFailedItem = entryId;

    const nextState = await this.stateStore.updateState((current) => ({
      ...current,
      status: current.status === 'paused' ? current.status : 'watching',
      currentItem: null,
      consecutiveFailures:
        nextCount ?? (current.currentItem === entryId ? current.consecutiveFailures + 1 : 1),
    }));

    await this.logger.log(
      'warn',
      `Falha ao despachar ${entryId} (${nextState.consecutiveFailures}/3): ${reason}`,
    );

    if (nextState.consecutiveFailures >= 3) {
      await this.pause(`3 falhas consecutivas na entrada ${entryId}`);
    }
  }

  async checkForTimeout(): Promise<void> {
    const state = await this.stateStore.readState();
    if (!state || state.status !== 'dispatching' || !state.currentItem) {
      return;
    }

    const elapsed = Date.now() - new Date(state.updatedAt).getTime();
    if (elapsed < THIRTY_MINUTES_MS) {
      return;
    }

    await this.pause(`timeout de 30 minutos sem progresso em ${state.currentItem}`);
  }

  async pause(reason: string): Promise<void> {
    await this.stateStore.updateConfig({ autoMode: false });
    await this.stateStore.updateState((current) => ({
      ...current,
      status: 'paused',
      pauseReason: reason,
      currentItem: current.currentItem,
    }));
    await this.logger.log('warn', `Piloto automático pausado: ${reason}`);
  }
}
