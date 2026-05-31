# Skill: tldraw (Mestre de Diagramas)

Esta skill permite que o Claude crie, leia e atualize diagramas visuais diretamente no formato `.tldr`.

## 🎯 Objetivo
Transformar conceitos arquiteturais, fluxos de decisão e mapeamentos de estado em artefatos visuais editáveis, garantindo que o Diretor (Márcio) possa visualizar a evolução do Hive sem precisar ler apenas texto ou código.

## 📂 Diretrizes de Armazenamento
- Todos os diagramas devem ser salvos em: `beehive/assets/diagrams/`
- Nomenclatura: `NOME_DO_DIAGRAMA.tldr` (Sempre em MAIÚSCULAS para manter o padrão do projeto).

## 🛠️ Como usar (Protocolo para o Claude)
1. **Identificar Necessidade:** Sempre que uma explicação textual de arquitetura ou fluxo for complexa, sugira criar um diagrama.
2. **Consultar Existentes:** Antes de criar, verifique se já existe um diagrama relacionado na pasta de assets.
3. **Criar/Atualizar:** Utilize as ferramentas do servidor `tldraw` para manipular o arquivo.
4. **Notificar:** Ao finalizar, informe ao Diretor o nome do arquivo gerado e sugira que ele abra no VS Code (extensão tldraw) ou arraste para tldraw.com.

## 🎨 Padrão Visual
- **Fluxos:** Use retângulos para estados e setas para transições.
- **Cores:** 
  - Azul: Processos/Ações
  - Verde: Sucesso/Finalizado
  - Vermelho: Erros/Bloqueios
  - Amarelo: Decisões/Atenção

---
*Assinado: Integrador (Gemini)*
