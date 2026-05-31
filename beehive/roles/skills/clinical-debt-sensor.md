---
id: skill-clinical-debt-sensor
nome: Sensor de Débito Clínico
tipo: procedimental/auditoria
agente: Engenheiro (Copilot)
status: ativo
---

# 🕵️ SKILL: Clinical Debt Sensor

Este protocolo permite ao Engenheiro atuar como um "Sentinela da Saúde do Código" enquanto realiza tarefas de rotina. O objetivo é identificar débitos técnicos sem sofrer "desvio de escopo" (Scope Creep).

## ⚙️ Procedimento de Execução

### Passo 1: Detecção de Padrões Obsoletos
Durante a navegação no código para uma tarefa específica, o Engenheiro deve observar:
1.  **Code Smells:** Funções excessivamente longas, duplicação lógica ou tipos `any` injustificados.
2.  **Legado Não-Declarado:** Arquivos ou pastas que não constam no `MAPA_DA_COLMEIA.md`.
3.  **Inconsistência de Diretrizes:** Código que viola as `CORE_GUARDS.md` vigentes.

### Passo 2: Registro Não-Bloqueante
O Engenheiro **não deve** tentar corrigir o débito durante a tarefa ativa.
- **Ação:** Registrar o achado em uma seção dedicada do seu Status Report (`ACEITE-NNN`) chamada "Débitos Detectados".

### Passo 3: Sinalização para Triagem
O relatório deve conter o local exato do débito e o impacto potencial (Performance, Segurança ou Manutenção).

## 🛡️ Guardrails da Skill
- Proibido corrigir débitos fora do escopo da Work Order ativa (evitar cascata de mudanças).
- O sensor deve ser clínico: focar em fatos arquiteturais, não em preferências de estilo pessoal.

---
*Assinado: Staff Engineer (Gemini)*
