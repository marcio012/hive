---
nicho: distribuicao
versao: 0.1.0
status: rascunho
atualizado_em: 2026-05-17
---

# Blueprint: Distribuicao

## Objetivo de negocio
Dar visibilidade de estoque, pedidos e entrega para operacao de distribuicao leve por tenant.

## Modulos ativados
- [x] Cadastro de clientes
- [x] Cadastro de produtos
- [x] Pedidos de distribuicao
- [x] Controle de estoque
- [x] Dashboard logistico

## Campos customizados
| Entidade | Campo | Tipo | Obrigatorio |
|---|---|---|---|
| PedidoDistribuicao | janela_entrega | texto | sim |
| PedidoDistribuicao | rota_prioritaria | texto | nao |
| Produto | unidade_logistica | texto | sim |

## Regras de negocio
| Gatilho | Condicao | Acao |
|---|---|---|
| Pedido aprovado | estoque_disponivel < quantidade | bloquear expedicao |
| Pedido em separacao | janela_entrega proxima | elevar prioridade |
| Entrega concluida | atraso > 0 | registrar evento de qualidade |

## IA integrada
| Capacidade | Caso de uso |
|---|---|
| Preenchimento assistido | sugerir classificacao de prioridade do pedido |
| Resumo diario | consolidar expedicoes, atrasos e rupturas |
| Proxima acao | sugerir replanejamento de rota por risco |

## Criterio de aceite
- [x] Escopo logistico minimo documentado.
- [x] Regras iniciais de estoque e entrega definidas.
- [x] Casos de uso de IA definidos para piloto.

## Metrica de adocao por tenant
- Indicador: percentual de pedidos priorizados com suporte de IA.
- Meta minima: 20% em ate 30 dias.
