import { promises as fs } from 'fs';
import * as path from 'path';

import YAML from 'yaml';

import { InboxEntry, RouteDecision, RoutingRule } from './types';

interface RoutingFile {
  rules?: RoutingRule[];
}

export class Router {
  private readonly routingPath: string;
  private rules: RoutingRule[] = [];

  constructor(rootDir: string) {
    this.routingPath = path.join(rootDir, 'beehive', 'apps', 'orchestrator', 'routing.yaml');
  }

  async load(): Promise<void> {
    const content = await fs.readFile(this.routingPath, 'utf8');
    const parsed = YAML.parse(content) as RoutingFile | null;
    this.rules = parsed?.rules ?? [];
  }

  resolve(entry: InboxEntry): RouteDecision | null {
    if (entry.id.startsWith('ORCH-')) {
      return null;
    }

    for (const rule of this.rules) {
      if (rule.default) {
        continue;
      }

      if (!rule.match || !rule.action) {
        continue;
      }

      if (rule.match.tipo && rule.match.tipo !== (entry.tipo ?? '')) {
        continue;
      }

      if (rule.match.destinatario && rule.match.destinatario !== (entry.destinatario ?? '')) {
        continue;
      }

      if (rule.match.source && rule.match.source !== entry.source) {
        continue;
      }

      if (rule.match.pattern) {
        const pattern = new RegExp(rule.match.pattern);
        if (!pattern.test(entry.id)) {
          continue;
        }
      }

      return {
        action: rule.action,
        target:
          rule.action === 'dispatch_to_copilot'
            ? 'copilot'
            : rule.action === 'dispatch_to_copilot_hive'
              ? 'copilot-hive'
              : rule.action === 'dispatch_to_copilot_tos'
                ? 'copilot-tos'
                : rule.action === 'notify_claude'
                  ? 'claude'
                  : null,
      };
    }

    const defaultRule = this.rules.find((rule) => rule.default);
    if (!defaultRule?.default) {
      return null;
    }

    return {
      action: defaultRule.default,
      target: null,
    };
  }
}
