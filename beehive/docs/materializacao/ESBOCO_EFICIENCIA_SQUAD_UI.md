# ESBOCO: Eficiência do Squad — Hive UI
**ID:** HIVE-014
**Papel:** Projetista (Gemini)
**Data:** 2026-05-29
**Status:** aguardando-validacao-arquiteto

---

## 1. Visão Geral
Este documento materializa a **Seção 03 (Eficiência)** do Mapa da Fábrica e a nova tela de **Telemetria**, conforme os prompts v2. O objetivo é fornecer visibilidade de custo e performance em tempo real, utilizando o sistema visual dark premium do Hive OS.

---

## 2. Seção 03 — Eficiência do Squad (Mapa da Fábrica)

Esta seção será inserida no `MapaFabrica.tsx`, abaixo do grid de Inboxes.

### 2.1 Estrutura Visual (HTML/CSS)

```html
<!-- Seção 03 Eficiência -->
<div class="section-label">
  <span class="n">03</span>
  Eficiência do Squad
  <span class="line"></span>
</div>

<div class="grid-3">
  <!-- Exemplo: Card Claude -->
  <div class="eff-card eff-normal">
    <div class="eff-header">
      <div class="av av-claude">C</div>
      <div class="eff-info">
        <div class="eff-name">Claude</div>
        <div class="eff-role">Arquiteto</div>
      </div>
    </div>
    
    <div class="eff-body">
      <div class="eff-row">
        <div class="eff-col">
          <div class="eff-lab">Custo sessão</div>
          <div class="eff-val mono gold">R$ 4,20</div>
        </div>
      </div>
      
      <div class="eff-budget">
        <div class="eff-bar">
          <div class="eff-bar-fill" style="width: 42%;"></div>
        </div>
        <div class="eff-budget-pct mono">42% do budget semanal</div>
      </div>
      
      <div class="eff-stats">
        <div class="eff-stat-item">
          <span class="val">3</span>
          <span class="lab">WOs</span>
        </div>
        <div class="eff-sep">·</div>
        <div class="eff-stat-item">
          <span class="val green">92%</span>
          <span class="lab">aprovação</span>
        </div>
      </div>

      <div class="eff-meta mono">
        8 inits · 15 rodadas/init
        <div class="last">último init há 12min</div>
      </div>
    </div>
  </div>

  <!-- Adicionar cards para Copilot e Gemini com as mesmas classes -->
</div>
```

### 2.2 Estilos Adicionais (`hive.css`)

```css
.eff-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eff-card.eff-alert { border-color: var(--orange); box-shadow: 0 0 15px var(--orange-tint); }
.eff-card.eff-critical { border-color: var(--red); box-shadow: 0 0 15px var(--red-tint); }

.eff-header { display: flex; align-items: center; gap: 12px; }
.eff-header .av { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
.eff-name { font-size: 16px; font-weight: 700; }
.eff-role { font-size: 11px; color: var(--t3); text-transform: uppercase; letter-spacing: 0.05em; }

.eff-body { display: flex; flex-direction: column; gap: 14px; }
.eff-lab { font-size: 11px; color: var(--t2); margin-bottom: 4px; }
.eff-val.mono { font-family: var(--mono); font-size: 22px; }
.eff-val.gold { color: var(--gold); }

.eff-bar { height: 6px; background: var(--surface-2); border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.eff-bar-fill { height: 100%; background: var(--gold); border-radius: 3px; }
.eff-budget-pct { font-size: 11px; color: var(--t3); }

.eff-stats { display: flex; align-items: baseline; gap: 8px; border-top: 1px solid var(--border); padding-top: 12px; }
.eff-stat-item { display: flex; align-items: baseline; gap: 4px; }
.eff-stat-item .val { font-size: 16px; font-weight: 700; }
.eff-stat-item .val.green { color: var(--green); }
.eff-stat-item .lab { font-size: 11px; color: var(--t3); }
.eff-sep { color: var(--t3); }

.eff-meta { font-size: 11px; color: var(--t2); line-height: 1.6; }
.eff-meta .last { color: var(--t3); }
```

---

## 3. Tela /telemetria (Nova Tela)

### 3.1 BLOCO 2 — Janela de Uso (Destaque)

```html
<div class="telemetry-usage-card">
  <div class="usage-head">
    <div class="usage-title">JANELA SEMANAL</div>
    <div class="usage-reset mono">Reinicia em 3d</div>
  </div>
  
  <div class="usage-main">
    <div class="usage-label">Tokens utilizados esta semana</div>
    <div class="usage-progress-bar">
      <div class="fill" style="width: 68%;"></div>
    </div>
    <div class="usage-numbers mono">
      <span class="current">2.847.320</span> / <span class="total">4.200.000 tokens</span>
      <span class="pct">68%</span>
    </div>
  </div>

  <div class="usage-footer">
    <div class="cost-summary">
      <div class="total-cost gold">R$ 47,20</div>
      <div class="budget-label">Budget: R$ 70,00</div>
    </div>
    <div class="usage-breakdown">
      <div class="break-item"><i class="dot gray"></i> Input: 1.923.140 tk (R$ 28,80)</div>
      <div class="break-item"><i class="dot white"></i> Output: 834.180 tk (R$ 12,50)</div>
      <div class="break-item"><i class="dot gold"></i> Cache: 90.000 tk (R$ 5,90)</div>
    </div>
  </div>
</div>
```

### 3.2 BLOCO 6 — Inits & Interações (Tabelas Densas)

```html
<div class="section-label">Inits & Interações — rastreamento de sessão por agente</div>

<div class="grid-3">
  <!-- Card por Agente -->
  <div class="init-agent-panel">
    <div class="panel-ph">
      <div class="av av-claude">C</div>
      <h3>Claude — Arquiteto</h3>
      <div class="ph-badge gold">8 inits esta semana</div>
    </div>
    
    <div class="init-table-container">
      <table class="init-table mono">
        <thead>
          <tr>
            <th>#</th>
            <th>Início</th>
            <th>Rodadas</th>
            <th>Peso</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          <tr class="init-row active">
            <td>08</td>
            <td>14:05 <span class="dot green pulse"></span></td>
            <td>31 <span class="spin">↻</span></td>
            <td>●●●●●</td>
            <td class="gold">R$ 6,40</td>
          </tr>
          <!-- Outras linhas... -->
        </tbody>
      </table>
    </div>
    
    <div class="panel-foot mono">
      <div class="avg">Média: 15 rodadas/init · R$ 3,93/init</div>
      <div class="total">Total: 8 inits · 120 rodadas · R$ 31,40</div>
    </div>
  </div>
</div>
```

### 3.3 Estilos da Telemetria

```css
.telemetry-usage-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
  margin-bottom: 28px;
}

.usage-head { display: flex; justify-content: space-between; margin-bottom: 20px; }
.usage-title { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; color: var(--t2); }
.usage-reset { font-size: 11px; color: var(--t3); }

.usage-progress-bar { height: 12px; background: var(--surface-3); border-radius: 6px; overflow: hidden; margin: 12px 0; }
.usage-progress-bar .fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--orange)); border-radius: 6px; }

.init-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.init-table th { text-align: left; color: var(--t3); padding: 8px 4px; border-bottom: 1px solid var(--border); }
.init-table td { padding: 10px 4px; color: var(--t1); border-bottom: 1px solid rgba(255,255,255,0.03); }
.init-row.active { background: rgba(0,255,159,0.05); }
```

---

## 4. Próximos Passos
1. **Claude (Arquiteto)** valida este esboço visual.
2. Se aprovado, Claude transforma em **Blueprint Técnico** e libera a **WO-027** para o Copilot.
3. Copilot implementa o parser de `custos.log` no backend e os componentes React no frontend.

---
**Estado atual:**    esboço concluído — materializado em `beehive/docs/materializacao/ESBOCO_EFICIENCIA_SQUAD_UI.md`
**Próximo passo:**   Claude valida o esboço e transforma em Blueprint técnico
**Ação esperada:**   Márcio, favor pedir ao Claude para revisar este esboço e liberar a WO-027.
