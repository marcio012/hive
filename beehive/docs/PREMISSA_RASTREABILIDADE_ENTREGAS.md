# Premissa de Rastreabilidade das Entregas

Objetivo: garantir que cada implementacao tenha trilha clara entre fase, commit, evidencia e validacao.

## Regra obrigatoria
Para toda etapa com implementacao, deve existir:
1. Commit(s) com descricao clara e rastreavel.
2. Evidencia objetiva da implementacao/validacao.
3. Teste unitario quando houver alteracao de logica de negocio.

## Identificacao do executor no commit
- O author do Git deve ser a assinatura principal quando representar corretamente quem desenvolveu a mudanca.
- Quando o committer nao for o executor tecnico da implementacao, o corpo do commit deve explicitar `Dev: <Nome - Papel>`.
- Nao usar `Co-authored-by` para agentes de IA nem forjar autoria apenas para aparentar assinatura.

## Definicao de pronto por entrega
Uma entrega e considerada pronta quando:
- esta vinculada a uma fase do lifecycle e a um item de plano/backlog;
- possui evidencias registradas;
- possui validacao tecnica compativel com o impacto;
- tem justificativa registrada quando teste unitario nao for aplicavel.

## Padrrao minimo de rastreabilidade
- Fase do lifecycle: indicar explicitamente no PR.
- Item do plano/backlog: indicar link ou identificador.
- Issue relacionada: referenciar no PR.
- Commits principais: listar sha(s) no PR.
- Evidencia: anexar em docs/evidencias ou no proprio PR com referencia permanente.

## Teste unitario (quando aplicavel)
Aplicavel quando houver mudanca em:
- regra de negocio;
- comportamento de servico/controlador;
- transformacoes e validacoes de dados.

Nao aplicavel (exemplos):
- alteracao somente de texto/documentacao;
- mudanca visual sem logica;
- ajuste operacional sem codigo de negocio.

Quando nao aplicavel:
- registrar justificativa objetiva no PR.

## Local padrao de evidencia
- Pasta: docs/evidencias/
- Nome sugerido: AAAA-MM-DD-tema-da-entrega.md

## Governanca
- Fonte de verdade do fluxo: docs/PROJECT_LIFECYCLE.md
- Documento base do ciclo: docs/planning/PLANO_EXECUCAO_WHITE_LABEL_MVP.md
- Backlog ativo: docs/planning/BACKLOG_DESENVOLVIMENTO.md
- Enforcement automatico ativo em modo transicao: .github/workflows/pr-rastreabilidade.yml
	- Modo atual: transition (nao bloqueia PR, apenas avisa).
	- Quando o time estabilizar o uso, trocar para strict (bloqueante).
