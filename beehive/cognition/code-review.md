# 🛡️ Cano: Auditoria & Code Review
**Vínculo:** `beehive/docs/HIVE_PROCESS_TOPOLOGY.md`

## 📥 [IN] Entrada (Válvula)
- Código gerado (Git Diff / File Content).
- `BLUEPRINT.md` de referência.

## ⚙️ [RULES] Paredes do Cano (Regras)
1. **COMPLIANCE CHECK:** Validar se o código segue o Blueprint 1:1.
2. **SENTINEL CHECK:** Rodar `npm run hive:check`.
3. **ZERO DÉBITO:** Bloquear se houver `TODO` ou hacks não documentados.

## 📤 [OUT] Saída (Bocal)
- Parecer Aprovado/Vetado no chat.
- `SENTINEL_LOG.md` em `beehive/docs/materializacao/`.
