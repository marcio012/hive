# Proposta: Template mínimo de Blueprint + Estratégia de Versionamento
# Issue #10 — aprovado pelo usuário em 2026-05-17
# Status: aguardando implementação pelo Copilot

---

## Convenção de nome de arquivo
Um arquivo por nicho: `<nicho>-blueprint.md`
Dividir por capacidade somente quando capacidades precisarem de ciclos de vida independentes.

## Template mínimo

```markdown
---
nicho: <nicho>
versao: 0.1.0
status: rascunho
atualizado_em: YYYY-MM-DD
---

# Blueprint: <Nicho>

## Objetivo de negócio
[Uma frase: quem usa, para quê, qual valor entrega ao tenant]

## Módulos ativados
- [ ] módulo

## Campos customizados
| Entidade | Campo | Tipo | Obrigatório |
|---|---|---|---|

## Regras de negócio
| Gatilho | Condição | Ação |
|---|---|---|

## IA integrada
| Capacidade | Caso de uso |
|---|---|

## Critério de aceite
- [ ] ...

## Métrica de adoção por tenant
- Indicador:
- Meta mínima:
```

## Estratégia de versionamento

Semver simplificado no frontmatter. Git é o histórico completo.

| Incremento | Quando usar |
|---|---|
| PATCH (0.1.x) | Ajuste de texto, correção de critério |
| MINOR (0.x.0) | Nova capacidade ou módulo adicionado |
| MAJOR (x.0.0) | Campo removido ou módulo renomeado — quebra de contrato |

Ciclo de vida via campo `status`: rascunho → validado → ativo → depreciado

Não criar arquivos paralelos por versão. Criar pasta versionada (`/v2/`) apenas
se um blueprint ativo precisar coexistir com uma versão nova durante transição.

## Arquivos a criar (Copilot)
- `ai/produto/blueprints/varejo-blueprint.md`
- `ai/produto/blueprints/servicos-blueprint.md`
- `ai/produto/blueprints/distribuicao-blueprint.md`
- Atualizar `ai/produto/blueprints/README.md` com nova convenção de nome
