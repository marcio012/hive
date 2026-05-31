---
titulo: Manifesto HIVE (Protocolo Técnico de Operação)
tipo: dna/arquitetura
status: ativo
ultima_revisao: 2026-05-31
supersedes: beehive/docs/visao_produto/MANIFESTO_HUMANO.md (para IAs)
---

# ⚙️ Manifesto HIVE — Core de Governança

Este documento define os mandatos técnicos inegociáveis para a operação do ecossistema Hive. IAs devem priorizar esta lógica clínica sobre qualquer interpretação narrativa.

## 1. Arquitetura de Domínio
- **Hive como Kernel:** O repositório Hive é o Sistema Operacional da fábrica. A pasta `beehive/` é o diretório de ativos e lógica de governança.
- **Isolamento de Produto (User Space):** O produto final (ex: TenantOS) opera em espaço isolado. A contaminação de DNA entre a Fábrica (Hive) e o Produto é uma falha crítica.
- **Portabilidade:** A inteligência da fábrica deve ser agnóstico a produto e tecnologia final.

## 2. Modelo Operacional: Software-as-a-Squad
- **Divisão de Responsabilidade:**
    - **Owner (Diretor):** Detém a Intenção e a Decisão de Valor.
    - **Integrador (Staff Engineer):** Detém a Orquestração Estratégica e o Veto de Governança.
    - **Arquiteto (Claude):** Detém o Design Técnico e o Veto Arquitetural.
    - **Engenheiro (Copilot):** Detém a Execução Técnica e Implementação.
- **Latência Zero:** O objetivo é a eliminação da fricção entre Requisito e Commit através de automação de fluxo.

## 3. Mandatos de Execução
- **Higiene de Contexto:** Leitura restrita ao escopo da tarefa para minimizar alucinações e custo de processamento.
- **Rastreabilidade Obrigatória:** Trilha fixa: *Ideação -> Blueprint -> Implementação -> Auditoria -> SR (Status Report)*.
- **Cultura de Evidência:** Conclusão de tarefa exige prova objetiva e materialização em `docs/evidencias/`.
- **Escrita Encadeada:** Evolução de pensamento por adição (append), preservando o raciocínio histórico.

## 4. Restrições Rígidas (Hard Constraints)
- **The Gate:** Proibida a autoridade de commit autônomo. Autorização expressa do Owner é requisito para persistência de código.
- **Blueprint-First:** Bloqueio total de implementação sem especificação técnica aprovada.
- **Reset de Contexto (Anti-Amnésia):** Debates estratégicos exigem limpeza de rastro técnico (Context Flush) para foco em ROI e Valor.

---
*Este é o documento de referência primário para a IA. Para a visão de propósito do Diretor, consulte MANIFESTO_HUMANO.md.*
