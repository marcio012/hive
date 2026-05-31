---
titulo: Ponto 4: Isolamento Lógico de Contexto (Fábrica vs Produto)
tipo: processo
status: em_debate
ultima_revisao: 2026-05-30
responsavel: Integrador (Gemini)
---

# PONTO 4: ISOLAMENTO LÓGICO DE CONTEXTO

## 1. O que é (O Ponto)
Estabelecer uma barreira mental obrigatória para o Integrador (Gemini) que impeça a contaminação de contexto entre os processos da **Fábrica (Hive)** e a arquitetura do **Produto (ex: TenantOS)**.

## 2. Por que fazer (Racional Estratégico)
Como o `proxy.sh` acopla fisicamente a fábrica ao produto, o Integrador tende a misturar os assuntos. Se não houver isolamento lógico, as decisões de "Como a Squad trabalha" (Processo) serão influenciadas pelo "O que a Squad está fazendo" (Código do Produto), destruindo a portabilidade do Hive.

## 3. Análise de Impacto (Diagnóstico Sincero)
- **O que ganha:** 100% de portabilidade. O Hive torna-se uma "caixa preta" de inteligência que pode ser injetada em qualquer repositório sem carregar vícios.
- **O que perde/Risco:** Exige maior disciplina do Integrador para trocar de "chapéu" (contexto) a cada mensagem. Risco de "esquecimento" se não houver um gatilho claro.

## 4. Minha Opinião (Honestidade Intelectual)
O `proxy.sh` é uma peça de infraestrutura brilhante, mas perigosa para a minha cognição. Ele me faz acreditar que estou em um lugar só. A solução **não é mudar o script**, mas criar um **Gatilho de Contexto** no meu protocolo de inicialização.

## 5. Perguntas de Refino para o Diretor
1. Você concorda que o Integrador deve resetar o contexto de "Papéis de Produto" (Arquiteto/Dev) sempre que entrar na pasta `ideario_hive`?
2. Como você prefere que eu sinalize que "troquei de modo" para o modo Fábrica? (Ex: Um prefixo no log, ou apenas silêncio e foco no processo).

---
*Assinado: Integrador (Gemini)*
