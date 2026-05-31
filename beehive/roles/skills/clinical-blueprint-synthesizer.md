---
id: skill-clinical-blueprint-synthesizer
nome: Sintetizador de Blueprints Clínicos
tipo: procedimental/traducao
agente: Arquiteto (Claude)
status: ativo
---

# 🧪 SKILL: Clinical Blueprint Synthesizer

Este protocolo permite ao Arquiteto atuar como o "Tradutor Universal" do ecossistema. O objetivo é converter a inspiração humana documentada em restrições técnicas precisas, seguindo a DIR-093.

## ⚙️ Procedimento de Execução

### Passo 1: Extração de Essência
O Arquiteto deve ler a versão humana da visão (`_HUMANO.md`) e identificar:
1.  **A Dor:** O problema central que deve ser resolvido.
2.  **O Valor:** O ganho esperado (ROI).
3.  **A Narrativa:** Metáforas ou desejos do Diretor que indicam o estilo da solução.

### Passo 2: Destilação Clínica
Traduzir os achados do Passo 1 em mandatos técnicos para o arquivo `_CLINICAL.md` ou `BLUEPRINT-NNN.md`:
- Converter "Desejos" em **Requisitos Funcionais**.
- Converter "Metáforas" em **Padrões Arquiteturais**.
- Converter "Expectativas" em **Critérios de Aceite**.

### Passo 3: Sincronização de Rastreabilidade
Garantir que a versão clínica aponte sempre para a versão humana como sua fonte de inspiração (`source_of_truth`).

## 🛡️ Guardrails da Skill
- Proibido adicionar funcionalidades técnicas que não tenham uma raiz clara na visão humana.
- Proibido manter "ruído narrativo" na versão clínica (manter apenas a lógica).

---
*Assinado: Staff Engineer (Gemini)*
