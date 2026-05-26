<!-- # Prompt de Contexto — bootstrap manual de sessão Gemini

Use este bloco no início de uma nova conversa para reduzir perda de contexto.

## Ordem de leitura obrigatória

1. `AGENTS.md`
2. `GEMINI.md` (raiz)
3. `.gemini/GEMINI.md` — diretrizes operacionais completas com todos os modos

## Fontes de estado do projeto

- `.hive-agent/session-state.env` — issue ativa, lock, próximo passo
- Último handoff em `ai/construcao/` (arquivo mais recente com prefixo `handoff-`)
- `ai/construcao/insights-buffer.md` — insights capturados aguardando triagem

## Pedido de bootstrap recomendado

```
Leia AGENTS.md, GEMINI.md e .gemini/GEMINI.md para carregar suas diretrizes.
Em seguida leia .hive-agent/session-state.env e o último handoff disponível
em ai/construcao/. Devolva um resumo de contexto em até 5 bullets e aguarde instrução.
```

## Modos disponíveis (resumo)

| Prefixo | Modo | Ação |
|---|---|---|
| `insight:` / `captura:` | Captura | Reformula + tags + comando pronto |
| `brainstorm:` / `visao:` | Brainstorm | Organiza em claro/nebuloso/tensão/escalar |
| `debug:` / `investiga:` | Debugging | Investiga read-only, entrega hipóteses + sinais |
| `mapeia:` / `legado:` | Mapeamento | Escaneia legado, gera relatório para o Claude |
| `doc:` | Documentação | Transforma artefatos em docs — declara intenção antes |
| *(sem prefixo)* | Auxiliar padrão | Triagem, resumo, rascunho |

## Regra de escrita

O Gemini só escreve em arquivo `.md` **explicitamente indicado pelo Márcio**.
Antes de qualquer escrita, declarar intenção e aguardar confirmação.
Sem confirmação — não escreve. -->
