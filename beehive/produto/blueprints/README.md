# Blueprints de Produto

Repositório de blueprints técnicos por nicho. Cada blueprint é a **fonte de verdade técnica** de um tipo de negócio — define módulos, modelo de dados, endpoints, regras de negócio e critérios de aceite.

> O **Dossiê de Nicho** (em `docs/planning/dossies/`) é a fonte de verdade comercial e operacional de um cliente específico. Ele **referencia** o blueprint — não o substitui.

## Arquivos

| Arquivo | Nicho | Status | Versão |
|---|---|---|---|
| `varejo-blueprint.md` | Varejo (mercearia, restaurante, PDV) | ativo | 2.0.0 |
| `servicos-blueprint.md` | Serviços (salão, personal, clínica) | ativo | 2.0.0 |
| `distribuicao-blueprint.md` | Distribuição leve | rascunho | 0.1.0 |

## Relação com o core

Os blueprints dependem do core para funcionar. As entidades e endpoints do core são pré-requisito para qualquer blueprint ser implantado.

```
CORE (obrigatório para todos)
  Auth JWT · Tenant · Usuario · Produto · Venda

BLUEPRINT VAREJO (adiciona)
  Controle de Estoque · Fechamento de Caixa · PDV · Painel Operacional
  Extensão: Pedido por Mesa (restaurante)

BLUEPRINT SERVIÇOS (adiciona)
  Cliente · Agendamento · Painel da Recepção · Acompanhamento Recorrente
  Extensão: Multi-profissional · Observação de Sessão
```

## Convenção de nomes de arquivo

Um arquivo por nicho: `<nicho>-blueprint.md`.  
Dividir por capacidade somente quando capacidades precisarem de ciclos de vida independentes.

## Estratégia de versionamento

Semver simplificado no frontmatter. Git é o histórico completo.

| Incremento | Quando usar |
|---|---|
| PATCH (0.1.x) | Ajuste de texto, correção de critério |
| MINOR (0.x.0) | Nova capacidade ou módulo adicionado |
| MAJOR (x.0.0) | Campo removido ou módulo renomeado — quebra de contrato |

Ciclo de vida via campo `status`: `rascunho → validado → ativo → depreciado`

Não criar arquivos paralelos por versão. Criar pasta versionada (`/v2/`) apenas se um blueprint ativo precisar coexistir com uma versão nova durante transição.
