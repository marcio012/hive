# Materialização: Camada de Soberania do Owner (S.O.S)

---

## 📖 Narrativa de Valor (O "Por Quê")
A soberania resolve o problema da "Caixa Preta". Até agora, se o Hive travasse ou uma IA alucinasse, o Owner ficava refém do sistema. Esta camada entrega as "Chaves do Hardware" para o Márcio, permitindo diagnósticos profundos e intervenções manuais seguras.

### 🚀 O que ela entrega (O Resultado)?
- **Transparência Total:** O Owner sabe exatamente onde cada engrenagem do Hive está.
- **Poder de Resgate:** Capacidade de destravar o sistema (locks) e resetar memórias sem depender da IA.
- **Portabilidade Provada:** Um caminho claro para mover o "Cérebro" para novos projetos.

---

## 📐 Fluxo de Diagnóstico (A Visão de Voo)
*Foco: Como o comando hive:health protege o sistema.*

```mermaid
graph TD
    A[Usuário: npm run hive:health] --> B{Auditoria de Baixo Nível}
    
    subgraph "Camada de Hardware (Filesystem)"
    B --> C[Check: Camadas Vitais]
    B --> D[Check: Permissões bin/]
    B --> E[Check: Locks Órfãos]
    B --> F[Check: config.env]
    end
    
    C -->|Falta Pasta| G[ERRO: Kernel Compromitido]
    D -->|Sem +x| H[AVISO: Sugere chmod]
    E -->|Lock Velho| I[AVISO: Sugere rm]
    F -->|Corrupto| J[ERRO: Kernel Compromitido]
    
    G & H & I & J --> K[Relatório S.O.S]
    K --> L{Veredito Final}
    L -->|Tudo OK| M[KERNEL SAUDÁVEL]
    L -->|Falha| N[CONSULTE SQUAD_SOS_GUIDE.md]
```

---

## ⛓️ Orquestração de Resgate (A Visão de Engrenagem)
*Foco: Como o Owner usa o Guia S.O.S para destravar a fábrica.*

```mermaid
sequenceDiagram
    participant M as Márcio (Owner)
    participant H as Hive OS (Scripts)
    participant G as Guia S.O.S (DNA)
    participant FS as Sistema de Arquivos

    M->>H: Tenta rodar comando
    H-->>M: ERRO: Lock Bloqueado (Agent Busy)
    M->>G: Consulta Seção 1 (Locks)
    G-->>M: Comando: rm .hive-agent/*.lock
    M->>FS: Executa remoção manual
    FS-->>M: Lock removido
    M->>H: Repete comando
    H-->>M: SUCESSO: Sessão Iniciada
```

---

## 🛡️ Auditoria do Tech Lead
- **Status Técnico:** ✅ IMPLEMENTADO
- **Ferramenta:** `beehive/bin/hive-health.sh`
- **Manual:** `beehive/dna/SQUAD_SOS_GUIDE.md`

> "O Owner agora é o mecânico chefe. O Hive deixou de ser uma caixa preta para se tornar um ativo mantível e resiliente."

---
*Materialização gerada sob diretriz DIR-070.*
