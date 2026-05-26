# Processo: Conectividade (Client-IA)

## 🎯 Objetivo
Gerenciar a interconectividade entre o HIVE e inteligências artificiais externas para integração de fluxos e requisitos.

## 📜 Regras e Contratos
- Isolamento de Kernel: Nunca expor o código fonte ou segredos internos do HIVE para a IA externa.
- Tradução de Protocolo: Mapear os requisitos da IA externa para as Skills e Processos internos do HIVE.
- GAP Analysis: Gerar relatório de incompatibilidade caso o HIVE não possua a habilidade solicitada.

## ⚡ Gatilhos (Triggers)
- Comando: `client:connect`.
- Recebimento de manifestos externos em `ai/inbox/`.

## 🔗 Conexões
- [ai/roles/po.md]
- [ai/cognition/registry/active-processes.md]
