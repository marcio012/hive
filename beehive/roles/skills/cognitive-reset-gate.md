---
titulo: Cognitive Reset Gate
tipo: skill
status: ativo
ultima_revisao: 2026-05-31
responsavel: Staff Engineer (Gemini)
---

# 🧠 Cognitive Reset Gate

## 1. Descrição
O `cognitive-reset-gate` é um protocolo de **amnésia induzida e foco direcional**. Ele garante o isolamento lógico entre domínios operacionais (ex: Fábrica/Hive vs Produto/TenantOS) durante a execução de uma Task via Balcão Central.

## 2. Gatilho (Trigger)
Esta skill deve ser invocada automaticamente **sempre que um agente (Copilot, Claude ou Gemini) assumir (claim) uma nova Task** de um domínio diferente da Task anterior, ou no início de uma nova sessão.

## 3. Protocolo de Amnésia (Flush)
Ao ativar o Cognitive Reset, o agente deve:
1.  **Descartar Buffer:** Ignorar todo o contexto de código lido na sessão anterior que não pertença ao novo domínio.
2.  **Reset de Abstração:** Não aplicar arquiteturas, padrões de design ou bibliotecas do domínio anterior no domínio atual (ex: Não tentar usar NestJS no frontend, ou scripts bash dentro do ORM do produto).

## 4. Protocolo de Foco (Load)
Após o Flush, o agente carrega apenas o "Task Pack" mínimo vital:
1.  **DNA:** O `manifesto.md` e as `diretrizes.md` (Memória Longa).
2.  **Contrato:** O Blueprint ou WO específica da Task atual.
3.  **Código-Alvo:** Apenas os arquivos diretamente mencionados na WO ou necessários para sua compilação imediata.

## 5. Sintoma de Falha
Se durante uma operação o agente perceber que está referenciando arquivos de caminhos como `/apps/hive-ui/` enquanto resolve uma Task de `/tenantOS/`, ele deve parar e executar um `Self-Flush` imediatamente.

---
*Uso Exclusivo: Arquitetos e Engenheiros do Squad Hive.*
