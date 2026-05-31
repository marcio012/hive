---
id: skill-decision-delta-capture
nome: Captura de Delta de Decisão
tipo: procedimental/analise
agente: Escriba do Conselho
status: ativo
---

# 🔍 SKILL: Decision Delta Capture

Este protocolo permite ao Escriba identificar exatamente o que mudou no ecossistema durante uma sessão, prevenindo a perda de decisões "voláteis" feitas no chat.

## ⚙️ Procedimento de Execução

### Passo 1: Analise de Histórico
O Escriba deve ler as últimas 20 mensagens da sessão e extrair:
1.  **Decisões Soberanas:** Ordens diretas do Diretor (ex: "Separe os papéis de PO").
2.  **Consensos Técnicos:** Acordos entre o Diretor e o Staff Engineer (ex: "Concordo com a refatoração das diretrizes").

### Passo 2: Comparação com o Estado Salvo
Comparar os achados do Passo 1 com o `CHECKPOINT` mais recente.
- Identificar novas regras, arquivos criados ou modificações estruturais.

### Passo 3: Geração de Delta
Criar um resumo técnico do que foi "alterado no DNA" do projeto para alimentar a síntese clínica.

---
*Assinado: Staff Engineer (Gemini)*
