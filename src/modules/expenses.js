import { getState, setState, generateId, formatCurrency } from '../state/store.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { navigateTo } from '../ui/nav.js';

let _month  = _thisMonth();
let _filter = 'all'; // 'all' | 'fixed' | 'variable'

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
function _shortDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short' })
      .format(new Date(dateStr + 'T00:00:00'));
  } catch { return dateStr; }
}
function _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function _esc(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Entry ────────────────────────────────────────────────────────
export function renderExpenses() {
  const panel = document.getElementById('panel-expenses');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-del-exp]');
    if (btn) _delete(btn.dataset.delExp, wrap);
  });
}

function _render(wrap) {
  const { expenseCategories, expenses } = getState();
  const byMonth = expenses
    .filter(e => e.date.startsWith(_month))
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = _filter === 'all' ? byMonth
    : byMonth.filter(e => e.type === _filter);

  const totalAll      = byMonth.reduce((s, e) => s + (e.amount || 0), 0);
  const totalFixed    = byMonth.filter(e => e.type === 'fixed').reduce((s, e) => s + e.amount, 0);
  const totalVariable = byMonth.filter(e => e.type === 'variable').reduce((s, e) => s + e.amount, 0);

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Gastos</h1>
        <p class="module-subtitle">Controla en qué se va tu dinero cada mes</p>
      </div>
      <button class="btn btn-primary" id="btn-add-exp">+ Agregar</button>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm" id="btn-prev">‹</button>
      <span class="month-label">${_cap(_monthLabel(_month))}</span>
      <button class="btn btn-ghost btn-sm" id="btn-next">›</button>
    </div>

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Total</p>
        <p class="summary-value expense-clr">${formatCurrency(totalAll)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Fijos</p>
        <p class="summary-value">${formatCurrency(totalFixed)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Variables</p>
        <p class="summary-value">${formatCurrency(totalVariable)}</p>
      </div>
    </div>

    ${_buildCategoryBreakdown(byMonth, expenseCategories)}

    <div class="type-tabs" role="tablist">
      <button class="type-tab ${_filter==='all'?'active':''}" data-filter="all">Todos</button>
      <button class="type-tab ${_filter==='fixed'?'active':''}" data-filter="fixed">Fijos</button>
      <button class="type-tab ${_filter==='variable'?'active':''}" data-filter="variable">Variables</button>
    </div>

    <div id="exp-list">${_buildList(filtered, expenseCategories)}</div>
  `;

  wrap.querySelector('#btn-add-exp').addEventListener('click', () => _openModal(wrap));
  wrap.querySelector('#btn-prev').addEventListener('click', () => { _month = _prevMonth(_month); _render(wrap); });
  wrap.querySelector('#btn-next').addEventListener('click', () => { _month = _nextMonth(_month); _render(wrap); });

  wrap.querySelectorAll('.type-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _filter = btn.dataset.filter;
      _render(wrap);
    });
  });
}

function _buildCategoryBreakdown(items, categories) {
  if (!items.length) return '';
  const totals = {};
  items.forEach(e => { totals[e.categoryId] = (totals[e.categoryId] || 0) + e.amount; });
  const grand  = Object.values(totals).reduce((a, b) => a + b, 0);
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, amt]) => {
      const cat = catMap[id] || { name: 'Sin categoría', icon: '📦', color: '#64748b' };
      const pct = grand ? Math.round((amt / grand) * 100) : 0;
      return `<div class="breakdown-row">
        <span class="breakdown-icon">${cat.icon}</span>
        <span class="breakdown-name">${_esc(cat.name)}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${pct}%;background:${cat.color}"></div>
        </div>
        <span class="breakdown-pct">${pct}%</span>
        <span class="breakdown-amt expense-clr">${formatCurrency(amt)}</span>
      </div>`;
    });

  return `<div class="card card-sm breakdown-card">
    <p class="breakdown-title">Por categoría</p>
    ${rows.join('')}
  </div>`;
}

function _buildList(filtered, categories) {
  if (!filtered.length) {
    const msgs = {
      all:      'Sin gastos este mes. Pulsa "+ Agregar" para empezar.',
      fixed:    'No hay gastos fijos registrados este mes.',
      variable: 'No hay gastos variables registrados este mes.',
    };
    return `<div class="empty-state">
      <div class="empty-state-icon">💸</div>
      <h3 class="empty-state-title">Sin gastos</h3>
      <p class="empty-state-desc">${msgs[_filter]}</p>
    </div>`;
  }
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return `<div class="transaction-list">
    ${filtered.map(exp => {
      const cat = catMap[exp.categoryId] || { name: 'Sin categoría', icon: '📦', color: '#64748b' };
      const typeLabel = exp.type === 'fixed' ? 'Fijo' : 'Variable';
      const typeBadge = exp.type === 'fixed' ? 'badge-info' : 'badge-muted';
      return `<div class="transaction-item">
        <div class="t-icon" style="background:${cat.color}20;color:${cat.color};">${cat.icon}</div>
        <div class="t-body">
          <p class="t-name">${_esc(exp.description || cat.name)}</p>
          <p class="t-meta">
            <span class="badge ${typeBadge}">${typeLabel}</span>
            <span class="badge badge-muted">${_esc(cat.name)}</span>
            <span class="t-date">${_shortDate(exp.date)}</span>
          </p>
        </div>
        <div class="t-right">
          <span class="t-amount expense-clr">-${formatCurrency(exp.amount)}</span>
          <button class="btn-icon btn-icon-danger" data-del-exp="${exp.id}" title="Eliminar">🗑️</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

// ─── Modal ────────────────────────────────────────────────────────
function _openModal(wrap) {
  const state = getState();
  const { expenseCategories } = state;
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = today.startsWith(_month) ? today : _month + '-01';

  openModal({ title: 'Nuevo gasto' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label">Tipo de gasto</label>
        <div class="type-toggle" id="exp-type-toggle">
          <button class="type-toggle-btn active" data-type="variable">Variable</button>
          <button class="type-toggle-btn" data-type="fixed">Fijo</button>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-cat">Categoría</label>
        <select class="field-input field-select" id="exp-cat">
          ${expenseCategories.map(c => `<option value="${c.id}">${c.icon} ${_esc(c.name)}</option>`).join('')}
        </select>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="exp-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${state.profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="exp-desc"
          placeholder="Ej: Renta, Supermercado, Netflix…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="exp-date">Fecha</label>
        <input class="field-input" type="date" id="exp-date" value="${defaultDate}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="exp-cancel">Cancelar</button>
        <button class="btn btn-primary" id="exp-save">Agregar gasto</button>
      </div>
    `;

    // Type toggle
    let selectedType = 'variable';
    body.querySelector('#exp-type-toggle').addEventListener('click', e => {
      const btn = e.target.closest('.type-toggle-btn');
      if (!btn) return;
      selectedType = btn.dataset.type;
      body.querySelectorAll('.type-toggle-btn').forEach(b => b.classList.toggle('active', b === btn));
    });

    body.querySelector('#exp-cancel').addEventListener('click', close);
    body.querySelector('#exp-save').addEventListener('click', () => {
      const categoryId  = body.querySelector('#exp-cat').value;
      const amount      = parseFloat(body.querySelector('#exp-amt').value);
      const description = body.querySelector('#exp-desc').value.trim();
      const date        = body.querySelector('#exp-date').value;

      if (!amount || amount <= 0) {
        body.querySelector('#exp-amt').focus();
        showToast('Ingresa un monto mayor a 0', 'error');
        return;
      }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }

      setState(s => {
        s.expenses.push({ id: generateId(), categoryId, amount, description, date, type: selectedType, createdAt: new Date().toISOString() });
      });
      _month = date.slice(0, 7);
      showToast('Gasto registrado ✓');
      close();
      _render(wrap);
    });

    body.querySelector('#exp-amt').focus();
  });
}

function _delete(id, wrap) {
  confirmDialog({ title: 'Eliminar gasto', message: '¿Eliminar este gasto? La acción no se puede deshacer.', confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.expenses = s.expenses.filter(e => e.id !== id); });
      showToast('Gasto eliminado');
      _render(wrap);
    });
}
