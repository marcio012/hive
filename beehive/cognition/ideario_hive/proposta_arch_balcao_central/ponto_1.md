A Proposta:
  Criar um documento central (ARCH_BALCAO_CENTRAL.md) que decreta o fim da comunicação "peer-to-peer" (Agente A envia para Agente B).
  Tudo passa a ser um modelo de "Publish-Subscribe" (Publicar e Assinar).

  Os conceitos base propostos:
   * O Balcão (Broker): O único lugar onde o trabalho existe.
   * A Ordem de Serviço (Task): Um pacote autossuficiente que contém:
       * Issuer (Quem pediu): ex: Diretor, Integrador, Arquiteto.
       * Target Role (Papel Necessário): ex: Arquiteto, Dev, QA.
       * Payload (O que fazer): O contexto e o objetivo.
       * Status: Pendente, Em Execução, Aguardando Validação, Concluído.
   * A Regra de Ouro: Nenhum agente joga trabalho no colo de outro. O agente termina sua parte, muda o status da Task para "Aguardando Validação" e a devolve para o Balcão.