import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as chokidar from 'chokidar';
import type { FSWatcher } from 'chokidar';
import * as path from 'path';
import { Server, Socket } from 'socket.io';
import { HiveService } from './hive.service';

@WebSocketGateway({
  namespace: '/hive',
  cors: { origin: 'http://localhost:5174' },
})
export class HiveGateway
  implements OnGatewayConnection, OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  private server!: Server;

  private watcher?: FSWatcher;
  private debounceTimer?: NodeJS.Timeout;
  private unsubscribeState?: () => void;

  constructor(private readonly hiveService: HiveService) {}

  async handleConnection(client: Socket): Promise<void> {
    client.emit('hive:update', await this.hiveService.getState());
  }

  onModuleInit(): void {
    this.unsubscribeState = this.hiveService.subscribeState(async (state) => {
      this.server.emit('hive:update', state);
    });

    this.watcher = chokidar.watch(this.hiveService.getWatchPaths(), {
      persistent: true,
      ignoreInitial: true,
      ignored: (filePath: string) => {
        if (filePath.includes('.hive-agent')) {
          return false;
        }

        return /(^|[/\\])\./.test(filePath);
      },
    });

    this.watcher.on('all', (eventName, filePath) => {
      const normalized = filePath.replace(/\\/g, '/');
      const basename = path.basename(normalized);

      if (basename === 'locks.json') {
        this.hiveService.addEvent('lock', `lock atualizado (${eventName})`);
      } else if (basename === 'orchestrator-state.json') {
        this.hiveService.addEvent('info', `orchestrator atualizado (${eventName})`);
      } else if (basename.startsWith('inbox-')) {
        this.hiveService.addEvent('info', `${basename} atualizado (${eventName})`);
      } else if (basename === 'debates-abertos.md') {
        this.hiveService.addEvent('info', `${basename} atualizado (${eventName})`);
      } else if (basename.startsWith('FILA_')) {
        this.hiveService.addEvent('info', `${basename} atualizado (${eventName})`);
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        void this.broadcastState();
      }, 300);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.unsubscribeState?.();
    await this.watcher?.close();
  }

  private async broadcastState(): Promise<void> {
    const state = await this.hiveService.getState();
    this.server.emit('hive:update', state);
  }
}
