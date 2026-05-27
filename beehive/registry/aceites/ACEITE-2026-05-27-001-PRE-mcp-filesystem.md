# Aceite Técnico — Configuração MCP Filesystem para Claude Code
**ID:** ACEITE-2026-05-27-001
**Tipo:** Implementação (Conveniência Operacional)
**Gerado por:** Claude (primeiro aceite — DIR-081 ainda não ativa para Copilot nesta sessão)
**Data:** 2026-05-27
**Trigger:** Debate Go Limitado — thread rag-local-mcp-hive
**Ref. Arquitetural:** CLAUDE-RESP-016 (parecer arquitetural MCP)
**Status:** ✅ Aprovado pelo Owner e implementado

---

## Resumo Executivo
Configurar o servidor MCP de filesystem no Claude Code, restrito à pasta `beehive/`, para navegação estruturada de artefatos sem chains manuais de `find`+`Read`.

## Escopo — O que será feito
- [x] Adicionar bloco `mcpServers` no `.mcp.json` apontando para `@modelcontextprotocol/server-filesystem@0.6.2`
- [x] Restringir o servidor exclusivamente a `/home/marcio/job/hive/beehive`
- [ ] Validar que acesso fora de `beehive/` retorna permissão negada
- [ ] Validar que nenhum `.env` ou credencial é acessível via MCP

---

## Análise Financeira

| Dimensão | Valor |
|----------|-------|
| Custo estimado | R$ 2,00 (Copilot ~1h, configuração simples em JSON) |
| Confiança da estimativa | Alta — é uma configuração de 3-5 linhas |
| Valor gerado | Redução de ~2-3 tool calls por sessão de navegação de artefatos do Hive |
| Payback | 1-2 sessões de uso ativo |
| Custo de não fazer | Zero risco imediato — amnésia de contexto é resolvida por Higiene v2 (já aprovada) |

**Observação:** Este é o único escopo aprovado do debate rag-local-mcp-hive. O restante (MCP cross-agent, RAG semântico) foi vetado — custo e esforço não se justificam para o curto prazo.

---

## Critérios de Aceite
- [x] `npx @modelcontextprotocol/server-filesystem@0.6.2 /home/marcio/job/hive/beehive` sobe sem erro no terminal
- [ ] Claude Code lista arquivos de `beehive/` via ferramenta MCP
- [ ] Tentativa de acesso a `../` ou raiz do repo retorna erro de permissão
- [ ] Nenhum arquivo fora de `beehive/` aparece em listagens MCP

## Riscos e Ressalvas
- **Baixo:** Dependência de runtime no npm registry — mitigável com versão pinada no settings
- **Mitigado:** Leakage de tokens — `allowed_paths` restrito; `beehive/` não contém credenciais de produção

---

## Aprovação do Owner
**Status:** ✅ Aprovado por Márcio em 2026-05-27
**Observações:**
> Configuração via `.mcp.json` — Claude Code bloqueia escrita automática desse arquivo (proteção de auto-modificação).
> `.mcp.json` já foi atualizado no repositório; falta reiniciar o Claude Code para validar os critérios no cliente.

```json
{
  "mcpServers": {
    "hive-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@0.6.2",
        "/home/marcio/job/hive/beehive"
      ]
    }
  }
}
```

**Pendência remanescente:** Reiniciar o Claude Code e validar os critérios de aceite no cliente MCP.
