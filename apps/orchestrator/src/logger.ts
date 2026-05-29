export class OrchestratorLogger {
  private readonly endpoint: string;

  constructor(endpoint = 'http://localhost:3001/api/hive/orchestrator/event') {
    this.endpoint = endpoint;
  }

  async log(level: 'info' | 'warn' | 'error', msg: string): Promise<void> {
    console.log(`[orchestrator:${level}] ${msg}`);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ level, msg }),
      });

      if (!response.ok) {
        console.warn(
          `[orchestrator:warn] failed to POST event (${response.status} ${response.statusText})`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[orchestrator:warn] failed to POST event: ${message}`);
    }
  }
}
