# 🌐 Cano: Conectividade (External Bridge)
**Vínculo:** `beehive/dna/HIVE_PROCESS_TOPOLOGY.md`

## 📥 [IN] Entrada (Válvula)
- Manifestos ou requisitos vindos de IAs externas ou clientes (comando `client:connect`).

## ⚙️ [RULES] Paredes do Cano (Regras)
1. **ISOLAMENTO DE KERNEL:** Proibido expor segredos ou o core do Hive para o exterior.
2. **SKILL MAPPING:** Traduzir pedidos externos para os processos [Canos] internos existentes.
3. **GAP ALERT:** Sinalizar imediatamente se a requisição exigir uma Skill que o Hive ainda não possui.

## 📤 [OUT] Saída (Bocal)
- Relatório de Compatibilidade e próximos passos em `beehive/collective_intelligence/`.
