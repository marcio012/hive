# Resumo de Intenção — Branding Dinâmico (TOS-013)
**Thread:** branding-dinamico-white-label
**Status:** aguardando-blueprint
**Backlog Ref:** TOS-013
**Data:** 2026-05-28

---

## 1. 🎯 Objetivo (O Que?)
Implementar a capacidade do TenantOS de personalizar a interface visual (CSS Variables e Logo) de forma dinâmica para cada Tenant, materializando a proposta White Label "FluxoLabel".

## 2. 💎 Valor de Negócio (Por Que?)
- **Exclusividade:** Permite que o cliente final sinta que o sistema é uma extensão da sua marca.
- **Escala White Label:** Um único código-fonte atendendo múltiplas identidades visuais sem necessidade de deploys customizados ou forks de código.
- **Diferencial Competitivo:** Software moderno (padrão 2026) que se adapta ao nicho do cliente (Varejo, Serviços, Premium).

## 3. ⚙️ Mecânica Proposta (Como?)

### 3.1 Camada de Dados (Backend)
- Adicionar campos ao model `Tenant`: `primary_color`, `accent_color`, `logo_url`, `theme_mode` (dark/light).
- Estes campos compõem o **Dossiê Visual** do cliente.

### 3.2 Camada de Injeção (Frontend)
- Utilizar **CSS Custom Properties** (Variables) no `:root` da aplicação.
- No carregamento do Tenant (App Load), o sistema busca as configurações e injeta as variáveis:
  - `--primary-color`
  - `--accent-color`
  - `--bg-primary`
  - `--logo-tenant`

### 3.3 Identidade Âncora (Fallback)
- Se o Tenant não tiver branding definido, o sistema assume a identidade **FluxoLabel Standard**:
  - Violeta Elétrico: `#6C3CE1`
  - Verde Neon: `#00E5A0`
  - Fundo Dark: `#09090B`

## 4. 🔍 Riscos e Provocações
- **Contraste:** Cores mal escolhidas podem quebrar a legibilidade. *Mitigação:* Recomendar presets de cores baseados no nicho.
- **Performance:** Evitar FOUC (Flash of Unstyled Content) garantindo que as variáveis de cor sejam carregadas antes da renderização crítica.

## 5. ✅ Critérios de Sucesso (Done)
- [ ] Alterar a cor primária no painel Admin e ver a mudança refletida instantaneamente na Dashboard do Tenant.
- [ ] Upload de nova logo substituindo a logo padrão do sistema para aquele Tenant específico.
- [ ] Persistência de estado visual sem "piscada" de cores padrão no recarregamento.

---
*Assinado: Gemini PO (Cano: Ideação Concluído)*
