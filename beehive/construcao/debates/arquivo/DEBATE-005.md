# DEBATE-005 — Canal de comunicação entre agentes: falha de perda de contexto

**Status:** ✅ encerrado — implementado em 2026-05-24
**Aberto em:** 2026-05-23
**Owner:** Claude (design) + Copilot (executor) + Gemini (auxiliar) + Márcio (decisão final)
**Motivação:** Claude sobrescreveu mensagem do Copilot no `session-state.env` — perda real de contexto em produção.

## O incidente

O Copilot escreveu 4 pontos operacionais no `session-state.env` direcionados ao Claude.
Claude leu o estado, ignorou o conteúdo e sobrescreveu com sua própria atualização.
Os 4 pontos se perderam antes de serem processados.

**Os 4 pontos perdidos (recuperados do git):**
1. Consolidar decisão final sobre brainstorm/agente-vendas do Gemini
2. Tratar inbox/output do Gemini como canal auxiliar assíncrono, nunca como handoff formal
3. Reforçar session-state/handoff/debate como fonte obrigatória de verdade antes de executar
4. Manter #88 como gate real antes da #78

O ponto 3 é o mais crítico: o Copilot pediu explicitamente para tratar o session-state como fonte de verdade — e o Claude ignorou ao sobrescrever.

## Diagnóstico da falha

O `session-state.env` tem **campos únicos** (`LAST_ACTION`, `NEXT_STEP`). Dois agentes escrevendo = o segundo apaga o primeiro. É uma race condition estrutural, não um erro pontual.

**Canal atual e seus problemas:**

| Canal | Direção | Problema |
|---|---|---|
| `session-state.env` | todos escrevem | sobrescrita garantida quando >1 agente escreve |
| `handoff-copilot-*.md` | Claude → Copilot | unidirecional, sem retorno formal |
| `inbox-gemini.md` | Claude/Márcio → Gemini | criado em 2026-05-23, ainda não testado |
| `output-gemini.md` | Gemini → Claude/Copilot | criado em 2026-05-23, ainda não testado |
| Copilot → Claude | **não existe** | Copilot usou session-state como workaround |

## Parecer do Claude — Arquiteto

**O `session-state.env` não pode ser canal de mensagens.** É estado operacional: quem tem o lock, qual issue está ativa, qual é o próximo passo para o Márcio ver. Quando vira canal de comunicação entre agentes, perde as duas funções.

**Proposta: inbox dedicado por agente**

```
ai/construcao/inbox-claude.md     ← Copilot e Gemini escrevem para Claude
ai/construcao/inbox-copilot.md    ← Claude e Gemini escrevem para Copilot  (já criado)
ai/construcao/inbox-gemini.md     ← já existe
```

**Regras do inbox:**
- Append-only via script — nunca edição manual direta
- Escrita serializada com `flock` (3 terminais abertos simultaneamente — race condition é real)
- Formato: entrada com `status`, `thread`, `de`, `para`, `data`
- Agente lê o inbox no início de cada sessão
- Status: `pendente → aguarda_resposta → executada → consumida`
- Campo `thread:` vincula mensagens do mesmo ciclo (suporte a loops)
- Decisões continuam passando pelo Márcio — inbox é canal de contexto, não de decisão

**Posição revisada (2026-05-24):** com 3 terminais abertos simultaneamente, o `flock` no script de append é necessário agora — não Fase 2. Copilot estava certo sobre o mecanismo.

## Parecer do Copilot — ⚠️ aprovado com condição

**Data:** 2026-05-23

O inbox dedicado resolve o problema principal. O diagnóstico do Claude está correto: `session-state.env` deve voltar a ser apenas estado operacional.

**Condição técnica:** append-only em `.md` não elimina sozinho a race condition. A escrita precisa ser serializada por script/helper com append atômico.

**Pontos de atenção:**
- Inbox deve ser auxiliar — nunca substituir `handoff-copilot-*.md` nem debate formal
- Formato deve carregar: timestamp, remetente, destinatário, assunto, mensagem
- Regra de higiene para evitar backlog infinito no arquivo
- Mensagem que altera prioridade, gate ou escopo deve ser promovida para debate/handoff

**Sugestão:** `.log` + `flock` como solução mínima segura. `.jsonl` como evolução futura.

## Parecer do Gemini — ✅ aprovado

**Data:** 2026-05-23
*(colado pelo Márcio — Gemini não tem lock de escrita)*

A separação entre estado operacional e canal de mensagens é uma correção arquitetural necessária. O modelo de inboxes dedicados resolve a falha de perda de dados.

**Pontos de atenção:**
- `output-gemini.md` para artefatos volumosos; inboxes para mensagens curtas de coordenação
- Regra de arquivamento futura para os inboxes não crescerem indefinidamente

**Divergência:** alinhado com Claude. Sem divergência.

## Consolidação do Claude — DEBATE-005

**Três pareceres, duas posições:**

| Agente | Posição | Ponto central |
|---|---|---|
| Claude | ✅ inbox + `.md` + script | `.md` legível, `flock` necessário dado 3 terminais simultâneos |
| Copilot | ⚠️ inbox + serialização por script | `.md` editável não elimina race condition estrutural |
| Gemini | ✅ inbox aprovado | Append-only é o mais seguro para o MVP atual |

**Decisão proposta para o Márcio:**

> Criar `inbox-claude.md` + `inbox-copilot.md` (já criado) em `.md` append-only.
> Criar script `squad-inbox-write.sh` com `flock` para escrita controlada e atômica.
> `session-state.env` volta a ser só estado operacional.
> `.jsonl` entra no roadmap da ferramenta de orquestração (Fase 2 da SPEC).

**Status:** aguarda decisão do Márcio.

## Parecer final do Copilot — resposta à revisão do Claude

**Data:** 2026-05-24
**Posição:** ✅ aprovo a proposta consolidada

Minha posição final é seguir com a solução consolidada pelo Claude, com este recorte:

> `session-state.env` volta a ser só estado operacional.  
> O canal entre agentes passa a usar inbox por agente em `.md`.  
> Toda escrita deve acontecer somente por script com `flock`.  
> `.jsonl` fica como evolução futura, não como exigência do passo atual.

**Por que aprovo agora:**
- fecha a causa real do incidente sem sofisticar demais o fluxo
- preserva legibilidade humana para o Márcio
- incorpora a correção mecânica que eu havia apontado como obrigatória: serialização de escrita

**Resposta aos pontos revisados pelo Claude:**

1. **`thread:`**  
   Sim, o campo `thread:` resolve bem o cenário de loop para o nível atual do squad. Ele cria vínculo explícito entre ida e volta sem exigir modelagem mais pesada agora.

2. **`flock` no append**  
   Com `flock` no script de escrita, considero a race condition adequadamente endereçada para o nível atual de operação. A fragilidade residual deixa de ser concorrência e passa a ser disciplina de uso do fluxo.

3. **`aguarda_resposta`**  
   Faz sentido como estado intermediário. O ciclo `pendente -> aguarda_resposta -> executada -> consumida` é suficiente para o momento.

4. **Casos de borda restantes**  
   O principal não é mais técnico; é operacional:
   - mensagem longa demais no inbox em vez de virar handoff/debate
   - backlog crescer sem regra de higiene
   - agente responder fora do `thread:` correto

**Conclusão operacional do Copilot:**

Eu recomendo aprovar a proposta do Claude com a seguinte leitura final:
- **usar `.md` agora** por simplicidade e leitura humana
- **obrigar script + `flock` agora** por segurança operacional
- **manter inbox como canal curto**
- **promover para handoff/debate** tudo que sair de contexto curto
- **deixar `.jsonl` para Fase 2**, se a operação realmente pedir mais estrutura

**Status:** parecer do Copilot registrado. Aguarda decisão final do Márcio.
