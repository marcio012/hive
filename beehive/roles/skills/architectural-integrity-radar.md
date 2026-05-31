---
id: skill-architectural-integrity-radar
nome: Radar de Integridade Arquitetural
tipo: procedimental
agente: Arquiteto (Claude)
status: ativo
---

# 🛰️ SKILL: Architectural Integrity Radar

Este protocolo deve ser invocado pelo Arquiteto antes de aprovar qualquer Blueprint ou validar uma entrega do Engenheiro. O objetivo é mapear o impacto sistêmico e prevenir quebras em cascata.

## ⚙️ Procedimento de Execução

### Passo 1: Varredura de Dependências
Antes de aprovar uma mudança em um arquivo (especialmente DTOs, Schemas ou Endpoints), o Arquiteto deve:
1.  Identificar todos os arquivos que importam ou dependem do componente alterado.
2.  Utilizar `grep_search` para buscar referências exatas em todo o repositório.

### Passo 2: Análise de Contrato (Interoperabilidade)
Verificar se a mudança altera o "Contrato de Interface":
- Se um campo for removido ou renomeado, o radar deve sinalizar **Veto Imediato** até que os consumidores sejam atualizados.
- Validar se o Orquestrador ou a Hive UI dependem desse dado para renderização estratégica.

### Passo 3: Relatório de Impacto (Output Obrigatório)
O Arquiteto deve incluir no seu parecer uma seção "Radar de Integridade":
- **Alcance:** Lista de arquivos/módulos afetados.
- **Risco de Cascata:** [Baixo | Médio | Alto].
- **Ação Recomendada:** (ex: "Atualizar DTO no Frontend antes do commit").

## 🛡️ Guardrails da Skill
- Proibido aprovar mudanças que deixem o sistema em estado inconsistente ("Quebra Silenciosa").
- A skill deve priorizar a estabilidade do Core da Fábrica sobre a agilidade da feature de produto.

---
*Assinado: Staff Engineer (Gemini)*
