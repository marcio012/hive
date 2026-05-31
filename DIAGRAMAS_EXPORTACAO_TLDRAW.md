# Arquivo Consolidado: Fluxos de Agentes Hive (Exportação para tldraw/Mermaid)

Este documento contém todos os diagramas Mermaid gerados para o mapeamento profundo dos fluxos de inicialização dos agentes. Você pode copiar os blocos de código `mermaid` e colar diretamente no **tldraw** (se ele suportar integração nativa com Mermaid) ou usar o [Mermaid Live Editor](https://mermaid.live/) para gerar imagens/SVGs para colar no seu canvas do tldraw.

---

## 1. Fluxo: `gemini:po`

```mermaid
sequenceDiagram
    participant U as Márcio (User)
    participant P as proxy.sh (.agile-squad/)
    participant R as run.sh (framework/)
    participant H as hive.sh (beehive/bin/)
    participant S as hive-session-start.sh
    participant FS as File System (.hive-agent/)

    Note over U, FS: --- INICIALIZAÇÃO DE INFRA (BRIDGE) ---
    U->>P: bash .agile-squad/proxy.sh gemini:po
    P->>R: Executa run.sh gemini:po
    
    rect rgb(240, 240, 240)
        Note right of R: Soberania de Infra
        R->>R: Resolve HIVE_HOME (hive-paths.sh)
        R->>R: Valida Node v24 (ensure_node24)
    end

    Note over R, H: --- ROTEAMENTO DE COMANDO ---
    R->>H: npm run hive -- session-start gemini --role po
    H->>S: bash hive-session-start.sh gemini --role po

    Note over S, FS: --- CONSTRUÇÃO DE CONTEXTO (KERNEL) ---
    S->>FS: ensure_bridge_dir (Cria .hive-agent/ se não existir)
    
    rect rgb(255, 240, 240)
        Note right of S: Trava de Segurança
        S->>S: assert_gemini_role_boundary (Evita troca de cartucho sem fechar)
    end

    S->>FS: Grava gemini-session.lock (role=po)
    S->>FS: Grava session-state.env (Estado Global)
    
    S-->>U: Retorna STDOUT: "Hive operacional. Pronto para orquestrar."
```

---

## 2. Fluxo: `gemini:po:auditoria`

```mermaid
sequenceDiagram
    participant U as Márcio (User)
    participant P as proxy.sh (.agile-squad/)
    participant R as run.sh (framework/)
    participant H as hive.sh (beehive/bin/)
    participant S as hive-session-start.sh
    participant FS as File System (.hive-agent/)

    Note over U, FS: --- INICIALIZAÇÃO DE INFRA (BRIDGE) ---
    U->>P: bash .agile-squad/proxy.sh gemini:po:auditoria
    P->>R: Executa run.sh gemini:po:auditoria
    
    rect rgb(240, 240, 240)
        Note right of R: Soberania de Infra
        R->>R: Resolve HIVE_HOME
        R->>R: Valida Node v24
    end

    Note over R, H: --- ROTEAMENTO (COM MODO) ---
    R->>H: npm run hive -- session-start gemini --role po --mode auditoria
    H->>S: bash hive-session-start.sh gemini --role po --mode auditoria

    Note over S, FS: --- CONSTRUÇÃO DE CONTEXTO ---
    S->>FS: ensure_bridge_dir
    
    rect rgb(255, 240, 240)
        Note right of S: Trava de Segurança
        S->>S: assert_gemini_role_boundary (role=po, mode=auditoria)
    end

    Note right of S: Diferencial: Injeção de Auditoria
    S->>FS: Grava gemini-session.lock (role=po, mode=auditoria)
    S->>FS: Grava session-state.env (ACTIVE_MODE="auditoria")
    
    S-->>U: Retorna STDOUT: "Hive operacional. Modo Auditoria Ativo."
```

---

## 3. Fluxo: `gemini:projetista`

```mermaid
sequenceDiagram
    participant U as Márcio (User)
    participant P as proxy.sh (.agile-squad/)
    participant R as run.sh (framework/)
    participant H as hive.sh (beehive/bin/)
    participant S as hive-session-start.sh
    participant FS as File System (.hive-agent/)

    Note over U, FS: --- INICIALIZAÇÃO DE INFRA (BRIDGE) ---
    U->>P: bash .agile-squad/proxy.sh gemini:projetista
    P->>R: Executa run.sh gemini:projetista
    
    rect rgb(240, 240, 240)
        Note right of R: Soberania de Infra
        R->>R: Resolve HIVE_HOME
        R->>R: Valida Node v24
    end

    Note over R, H: --- ROTEAMENTO (CARTUCHO DESIGN) ---
    R->>H: npm run hive -- session-start gemini --role projetista
    H->>S: bash hive-session-start.sh gemini --role projetista

    Note over S, FS: --- CONSTRUÇÃO DE CONTEXTO ---
    S->>FS: ensure_bridge_dir
    
    rect rgb(255, 240, 240)
        Note right of S: Trava de Segurança
        S->>S: assert_gemini_role_boundary (role=projetista)
    end

    Note right of S: Injeção de Cartucho: Projetista
    S->>FS: Grava gemini-session.lock (role=projetista)
    S->>FS: Grava session-state.env (ACTIVE_ROLE="projetista")
    
    S-->>U: Retorna STDOUT: "Driver Projetista carregado. Pronto para modelar."
```

---

## 4. Fluxo: `gemini:coordenador`

```mermaid
sequenceDiagram
    participant U as Márcio (User)
    participant P as proxy.sh (.agile-squad/)
    participant R as run.sh (framework/)
    participant H as hive.sh (beehive/bin/)
    participant S as hive-session-start.sh
    participant FS as File System (.hive-agent/)

    Note over U, FS: --- INICIALIZAÇÃO DE INFRA (BRIDGE) ---
    U->>P: bash .agile-squad/proxy.sh gemini:coordenador
    P->>R: Executa run.sh gemini:coordenador
    
    rect rgb(240, 240, 240)
        Note right of R: Soberania de Infra
        R->>R: Resolve HIVE_HOME
        R->>R: Valida Node v24
    end

    Note over R, H: --- ROTEAMENTO (CARTUCHO FLUXO) ---
    R->>H: npm run hive -- session-start gemini --role coordenador
    H->>S: bash hive-session-start.sh gemini --role coordenador

    Note over S, FS: --- CONSTRUÇÃO DE CONTEXTO ---
    S->>FS: ensure_bridge_dir
    
    rect rgb(255, 240, 240)
        Note right of S: Trava de Segurança
        S->>S: assert_gemini_role_boundary (role=coordenador)
    end

    Note right of S: Injeção de Cartucho: Coordenador
    S->>FS: Grava gemini-session.lock (role=coordenador)
    S->>FS: Grava session-state.env (ACTIVE_ROLE="coordenador")
    
    S-->>U: Retorna STDOUT: "Guardião do Fluxo Ativo. Orquestrando squad."
```

---

## 5. Fluxo: `gemini:raw`

```mermaid
sequenceDiagram
    participant U as Márcio (User)
    participant P as proxy.sh (.agile-squad/)
    participant R as run.sh (framework/)
    participant H as hive.sh (beehive/bin/)
    participant S as hive-session-start.sh
    participant FS as File System (.hive-agent/)

    Note over U, FS: --- INICIALIZAÇÃO DE INFRA (BRIDGE) ---
    U->>P: bash .agile-squad/proxy.sh gemini:raw
    P->>R: Executa run.sh gemini:raw
    
    rect rgb(240, 240, 240)
        Note right of R: Soberania de Infra
        R->>R: Resolve HIVE_HOME
        R->>R: Valida Node v24
    end

    Note over R, H: --- ROTEAMENTO (MODO NEUTRO) ---
    Note right of R: Alvo: Modo Staff Engineer / Advisory
    R->>H: npm run hive -- session-start gemini --mode neutral
    H->>S: bash hive-session-start.sh gemini --mode neutral

    Note over S, FS: --- CONSTRUÇÃO DE CONTEXTO ---
    S->>FS: ensure_bridge_dir
    
    rect rgb(255, 240, 240)
        Note right of S: Trava de Segurança
        S->>S: assert_gemini_role_boundary (role=lead, mode=neutral)
    end

    Note right of S: Injeção: Modo Neutro (Staff Engineer)
    S->>FS: Grava gemini-session.lock (mode=neutral)
    S->>FS: Grava session-state.env (ACTIVE_MODE="neutral")
    
    S-->>U: Retorna STDOUT: "Modo Staff Engineer (Neutral) Ativo. Sem permissão de escrita."
```
