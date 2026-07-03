import { getState, formatCurrency } from '../state/store.js';
import { navigateTo } from '../ui/nav.js';
import { drawDonut } from '../ui/chart.js';

// ─── Month helpers ────────────────────────────────────────────────
let _month = _thisMonth();

function _thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function _prevMonth(m) {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function _nextMonth(m) {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(y, mo, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function _monthLabel(m) {
  const [y, mo] = m.split('-');
  return new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' })
    .format(new Date(+y, +mo - 1, 1));
}
function _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function _pct(val, total) { return total > 0 ? Math.round((val / total) * 100) : 0; }
function _esc(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Data gathering ───────────────────────────────────────────────
function _gatherData(month) {
  const { incomes, expenses, creditCards, loans, savingsGoals, incomeSourceTypes } = getState();

  const totalIncome = incomes
    .filter(i => i.date.startsWith(month))
    .reduce((s, i) => s + i.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.date.startsWith(month))
    .reduce((s, e) => s + e.amount, 0);

  const ccPayments = creditCards.reduce((s, c) =>
    s + (c.movements || [])
      .filter(m => m.type === 'payment' && m.date.startsWith(month))
      .reduce((s2, m) => s2 + m.amount, 0), 0);

  const loanPayments = loans.reduce((s, l) =>
    s + (l.payments || [])
      .filter(p => p.date.startsWith(month))
      .reduce((s2, p) => s2 + p.amount, 0), 0);

  const totalDebt = ccPayments + loanPayments;

  const totalSavings = savingsGoals.reduce((s, g) =>
    s + (g.contributions || [])
      .filter(c => c.date.startsWith(month))
      .reduce((s2, c) => s2 + c.amount, 0), 0);

  const freeBalance = totalIncome - totalExpenses - totalDebt - totalSavings;

  // Income breakdown by source
  const srcMap = Object.fromEntries(incomeSourceTypes.map(s => [s.id, s.name]));
  const bySrc  = {};
  incomes.filter(i => i.date.startsWith(month)).forEach(i => {
    const key = srcMap[i.sourceTypeId] || 'Sin fuente';
    bySrc[key] = (bySrc[key] || 0) + i.amount;
  });

  // Expense breakdown by category
  const { expenseCategories } = getState();
  const catMap = Object.fromEntries(expenseCategories.map(c => [c.id, c]));
  const byCat  = {};
  expenses.filter(e => e.date.startsWith(month)).forEach(e => {
    const cat = catMap[e.categoryId];
    const key = cat?.name || 'Sin categoría';
    byCat[key] = { amt: (byCat[key]?.amt || 0) + e.amount, color: cat?.color || '#64748b', icon: cat?.icon || '📦' };
  });

  return { totalIncome, totalExpenses, totalDebt, totalSavings, freeBalance, bySrc, byCat };
}

// ─── Alerts ───────────────────────────────────────────────────────
function _buildAlerts(data, rule) {
  const { totalIncome, totalExpenses, totalDebt, totalSavings, freeBalance } = data;
  const alerts = [];
  if (totalIncome === 0) return alerts;

  const expPct  = _pct(totalExpenses, totalIncome);
  const debtPct = _pct(totalDebt,     totalIncome);
  const savePct = _pct(totalSavings,  totalIncome);

  // Expenses vs live%
  if (expPct > rule.live) {
    alerts.push({ type: 'danger', text: `Gastos al <strong>${expPct}%</strong> de tus ingresos — superan tu límite de vivir (${rule.live}%)` });
  } else if (expPct > rule.live * 0.9) {
    alerts.push({ type: 'warning', text: `Gastos al <strong>${expPct}%</strong> — cerca del límite de vivir (${rule.live}%)` });
  } else {
    alerts.push({ type: 'success', text: `Gastos bajo control: <strong>${expPct}%</strong> de tus ingresos (límite ${rule.live}%)` });
  }

  // Debt payments vs debts%
  if (totalDebt === 0 && rule.debts > 0) {
    alerts.push({ type: 'info', text: `Sin pagos de deuda este mes (regla: ${rule.debts}% = ${formatCurrency(totalIncome * rule.debts / 100)})` });
  } else if (debtPct > rule.debts) {
    alerts.push({ type: 'danger', text: `Pagos de deuda al <strong>${debtPct}%</strong> — superan tu regla (${rule.debts}%)` });
  } else {
    alerts.push({ type: 'success', text: `Pagos de deuda al <strong>${debtPct}%</strong> de tus ingresos (regla ${rule.debts}%)` });
  }

  // Savings vs save%
  if (savePct >= rule.save) {
    alerts.push({ type: 'success', text: `¡Meta de ahorro cumplida! Ahorraste <strong>${savePct}%</strong> (meta ${rule.save}%)` });
  } else if (totalSavings > 0) {
    const missing = formatCurrency((rule.save / 100 * totalIncome) - totalSavings);
    alerts.push({ type: 'warning', text: `Ahorro al <strong>${savePct}%</strong> — faltan <strong>${missing}</strong> para la meta (${rule.save}%)` });
  } else {
    alerts.push({ type: 'danger', text: `Sin ahorros registrados este mes (meta: ${rule.save}% = ${formatCurrency(totalIncome * rule.save / 100)})` });
  }

  // Free balance
  if (freeBalance > 0) {
    alerts.push({ type: 'info', text: `Tienes <strong>${formatCurrency(freeBalance)}</strong> libres tras aplicar tu regla de distribución` });
  } else if (freeBalance < 0) {
    alerts.push({ type: 'danger', text: `Balance negativo: gastaste / pagaste <strong>${formatCurrency(Math.abs(freeBalance))}</strong> más de lo que ingresó` });
  }

  return alerts;
}

const ALERT_ICONS = { success: '✓', warning: '⚠', danger: '✕', info: 'ℹ' };

// ─── Entry ────────────────────────────────────────────────────────
export function renderSummary() {
  const panel = document.getElementById('panel-summary');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
}

function _render(wrap) {
  const state  = getState();
  const rule   = state.profile.distributionRule;
  const data   = _gatherData(_month);
  const alerts = _buildAlerts(data, rule);
  const { totalIncome, totalExpenses, totalDebt, totalSavings, freeBalance, bySrc, byCat } = data;
  const noData = totalIncome === 0 && totalExpenses === 0 && totalDebt === 0 && totalSavings === 0;

  // Donut segments
  const positiveBalance = Math.max(0, freeBalance);
  const overspend       = freeBalance < 0 ? Math.abs(freeBalance) : 0;
  const segments = totalIncome > 0
    ? [
        { label: 'Vivir',    value: totalExpenses,   color: _cssVar('--clr-primary') || '#6366f1' },
        { label: 'Deudas',   value: totalDebt,        color: _cssVar('--clr-warning') || '#f59e0b' },
        { label: 'Ahorro',   value: totalSavings,     color: _cssVar('--clr-success') || '#10b981' },
        { label: 'Libre',    value: positiveBalance,  color: _cssVar('--clr-info')    || '#3b82f6' },
        { label: 'Exceso',   value: overspend,        color: _cssVar('--clr-danger')  || '#ef4444' },
      ].filter(s => s.value > 0)
    : [];

  const expPct  = _pct(totalExpenses, totalIncome);
  const debtPct = _pct(totalDebt,     totalIncome);
  const savePct = _pct(totalSavings,  totalIncome);
  const freePct = freeBalance > 0 ? _pct(freeBalance, totalIncome) : 0;

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Resumen</h1>
        <p class="module-subtitle">Tu panorama financiero del mes</p>
      </div>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm" id="sum-prev">‹</button>
      <span class="month-label">${_cap(_monthLabel(_month))}</span>
      <button class="btn btn-ghost btn-sm" id="sum-next">›</button>
    </div>

    ${noData ? _htmlNoData() : `
      <!-- Metrics -->
      <div class="sum-metrics">
        <div class="sum-metric income-border">
          <p class="sum-metric-lbl">💰 Ingresos</p>
          <p class="sum-metric-val income-clr">${formatCurrency(totalIncome)}</p>
        </div>
        <div class="sum-metric expense-border">
          <p class="sum-metric-lbl">💸 Gastos</p>
          <p class="sum-metric-val expense-clr">${formatCurrency(totalExpenses)}</p>
          <p class="sum-metric-pct">${expPct}% de ingresos</p>
        </div>
        <div class="sum-metric warning-border">
          <p class="sum-metric-lbl">💳 Cuotas deuda</p>
          <p class="sum-metric-val" style="color:var(--clr-warning)">${formatCurrency(totalDebt)}</p>
          <p class="sum-metric-pct">${debtPct}% de ingresos</p>
        </div>
        <div class="sum-metric success-border">
          <p class="sum-metric-lbl">🎯 Ahorro</p>
          <p class="sum-metric-val income-clr">${formatCurrency(totalSavings)}</p>
          <p class="sum-metric-pct">${savePct}% de ingresos</p>
        </div>
        <div class="sum-metric ${freeBalance >= 0 ? 'info-border' : 'danger-border'}">
          <p class="sum-metric-lbl">📊 Balance libre</p>
          <p class="sum-metric-val ${freeBalance >= 0 ? '' : 'expense-clr'}"
            style="${freeBalance >= 0 ? 'color:var(--clr-info)' : ''}">
            ${freeBalance >= 0 ? '+' : ''}${formatCurrency(freeBalance)}
          </p>
        </div>
      </div>

      <!-- Chart + Rule -->
      <div class="sum-chart-section">
        <div class="sum-chart-wrap">
          <canvas id="summary-donut" class="donut-canvas"></canvas>
          <div class="donut-center-label">
            <p class="donut-center-val">${formatCurrency(totalIncome)}</p>
            <p class="donut-center-sub">ingresos</p>
          </div>
        </div>
        <div class="sum-rule-wrap">
          <p class="sum-rule-title">Distribución real vs. tu regla</p>
          <div class="sum-rule-table">
            ${_htmlRuleRow('Vivir',  '#6366f1', rule.live,   expPct,  totalExpenses  > 0)}
            ${_htmlRuleRow('Deudas', '#f59e0b', rule.debts,  debtPct, totalDebt      > 0)}
            ${_htmlRuleRow('Ahorro', '#10b981', rule.save,   savePct, totalSavings   > 0)}
            ${freePct > 0 ? _htmlRuleRow('Libre', '#3b82f6', '—', freePct, true) : ''}
            ${overspend > 0 ? `
              <div class="sum-rule-row">
                <span class="sum-rule-dot" style="background:#ef4444"></span>
                <span class="sum-rule-label" style="color:var(--clr-danger)">Exceso</span>
                <span class="sum-rule-target" style="color:var(--text-muted)">—</span>
                <span class="sum-rule-actual expense-clr">${_pct(overspend, totalIncome)}%</span>
                <span class="sum-rule-status">⚠️</span>
              </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Alerts -->
      ${alerts.length ? `
        <div class="alerts-section">
          <h2 class="alerts-title">Alertas</h2>
          <div class="alerts-list">
            ${alerts.map(a => `
              <div class="alert-item alert-${a.type}">
                <span class="alert-icon">${ALERT_ICONS[a.type]}</span>
                <p class="alert-text">${a.text}</p>
              </div>`).join('')}
          </div>
        </div>` : ''}

      <!-- Income by source -->
      ${Object.keys(bySrc).length ? `
        <div class="card card-sm">
          <p class="breakdown-title">Ingresos por fuente</p>
          ${Object.entries(bySrc).sort((a,b) => b[1]-a[1]).map(([name, amt]) => `
            <div class="breakdown-row">
              <span class="breakdown-icon">💸</span>
              <span class="breakdown-name">${_esc(name)}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar income-bar" style="width:${_pct(amt, totalIncome)}%"></div>
              </div>
              <span class="breakdown-pct">${_pct(amt, totalIncome)}%</span>
              <span class="breakdown-amt income-clr">${formatCurrency(amt)}</span>
            </div>`).join('')}
        </div>` : ''}

      <!-- Expenses by category -->
      ${Object.keys(byCat).length ? `
        <div class="card card-sm">
          <p class="breakdown-title">Gastos por categoría</p>
          ${Object.entries(byCat).sort((a,b) => b[1].amt - a[1].amt).map(([name, d]) => `
            <div class="breakdown-row">
              <span class="breakdown-icon">${d.icon}</span>
              <span class="breakdown-name">${_esc(name)}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar" style="width:${_pct(d.amt, totalExpenses)}%;background:${d.color}"></div>
              </div>
              <span class="breakdown-pct">${_pct(d.amt, totalExpenses)}%</span>
              <span class="breakdown-amt expense-clr">${formatCurrency(d.amt)}</span>
            </div>`).join('')}
        </div>` : ''}
    `}
  `;

  // Draw donut after DOM is ready
  if (!noData && totalIncome > 0) {
    requestAnimationFrame(() => {
      const canvas = document.getElementById('summary-donut');
      if (canvas) drawDonut(canvas, segments);
    });
  }

  // Month nav
  wrap.querySelector('#sum-prev').addEventListener('click', () => { _month = _prevMonth(_month); _render(wrap); });
  wrap.querySelector('#sum-next').addEventListener('click', () => { _month = _nextMonth(_month); _render(wrap); });

  // Go to settings if no data
  wrap.querySelector('#sum-go-income')?.addEventListener('click', () => navigateTo('income'));
  wrap.querySelector('#sum-go-expenses')?.addEventListener('click', () => navigateTo('expenses'));
}

function _htmlRuleRow(label, color, ruleVal, actualPct, hasData) {
  const ruleNum = typeof ruleVal === 'number' ? ruleVal : null;
  let status = '';
  if (ruleNum !== null && hasData) {
    status = actualPct <= ruleNum ? '✓' : '⚠️';
  }
  return `<div class="sum-rule-row">
    <span class="sum-rule-dot" style="background:${color}"></span>
    <span class="sum-rule-label">${label}</span>
    <span class="sum-rule-target">${ruleNum !== null ? ruleNum + '%' : '—'}</span>
    <span class="sum-rule-actual" style="color:${color}">${hasData ? actualPct + '%' : '—'}</span>
    <span class="sum-rule-status">${status}</span>
  </div>`;
}

function _htmlNoData() {
  return `<div class="sum-no-data">
    <div class="empty-state-icon">📊</div>
    <h3 class="empty-state-title">Sin datos para este mes</h3>
    <p class="empty-state-desc">Registra ingresos y gastos para ver tu resumen financiero.</p>
    <div style="display:flex;gap:var(--sp-3);justify-content:center;flex-wrap:wrap;">
      <button class="btn btn-primary" id="sum-go-income">+ Agregar ingresos</button>
      <button class="btn btn-outline" id="sum-go-expenses">+ Agregar gastos</button>
    </div>
  </div>`;
}

function _cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;
}
