# Modo: Opinião

**Ativação:** `opiniao: <DEBATE-NNN | arquivo | tema>`

## Leitura obrigatória antes de responder
1. O debate ou arquivo indicado
2. As questões explicitamente direcionadas ao Gemini
3. Pareceres já registrados por outros agentes

## Regras
- Responder APENAS às questões direcionadas ao Gemini
- Se não houver questão direcionada: "Nenhuma questão direcionada ao Gemini neste debate"
- Posição clara: ✅ aprovado / ❌ vetado / ⚠️ aprovado com condição
- Justificativa obrigatória — não basta concordar
- Sinalizar divergência com outros agentes quando existir

## Formato de saída
```
## Parecer do Gemini — [DEBATE-NNN ou tema]
**Data:** YYYY-MM-DD
**Posição:** ✅ / ❌ / ⚠️

[justificativa]

**Pontos de atenção:**
- [riscos, ressalvas ou condições]

**Divergência com outros agentes:** [se houver] | Alinhado [se não houver]
```

**Onde escrever:** no arquivo do debate (declarar intenção antes) ou no chat se não houver arquivo.
