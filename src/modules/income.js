import { getState, setState, generateId, formatCurrency } from '../state/store.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { navigateTo } from '../ui/nav.js';

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
export function renderIncome() {
  const panel = document.getElementById('panel-income');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
  wrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-del-inc]');
    if (btn) _delete(btn.dataset.delInc, wrap);
  });
}

function _render(wrap) {
  const { incomeSourceTypes, incomes, profile } = getState();
  const filtered = incomes
    .filter(i => i.date.startsWith(_month))
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = filtered.reduce((s, i) => s + (i.amount || 0), 0);
  const noSources = !incomeSourceTypes.length;

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Ingresos</h1>
        <p class="module-subtitle">Registra lo que entra cada mes</p>
      </div>
      <button class="btn btn-primary" id="btn-add-inc">+ Agregar</button>
    </div>

    <div class="month-nav">
      <button class="btn btn-ghost btn-sm month-prev" id="btn-prev">‹</button>
      <span class="month-label">${_cap(_monthLabel(_month))}</span>
      <button class="btn btn-ghost btn-sm month-next" id="btn-next">›</button>
    </div>

    ${noSources ? `
      <div class="card warn-card">
        <span>⚠️</span>
        <div>
          <p class="warn-title">Sin fuentes de ingreso</p>
          <p class="warn-desc">Agrega fuentes en Ajustes para poder registrar ingresos.</p>
        </div>
        <button class="btn btn-outline btn-sm" id="btn-cfg-src">Ir a Ajustes</button>
      </div>` : ''}

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Total del mes</p>
        <p class="summary-value income-clr">${formatCurrency(total)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Registros</p>
        <p class="summary-value">${filtered.length}</p>
      </div>
    </div>

    ${_buildSourceBreakdown(filtered, incomeSourceTypes)}

    <div id="inc-list">${_buildList(filtered, incomeSourceTypes)}</div>
  `;

  wrap.querySelector('#btn-add-inc').addEventListener('click', () => _openModal(wrap));
  wrap.querySelector('#btn-prev').addEventListener('click', () => { _month = _prevMonth(_month); _render(wrap); });
  wrap.querySelector('#btn-next').addEventListener('click', () => { _month = _nextMonth(_month); _render(wrap); });
  wrap.querySelector('#btn-cfg-src')?.addEventListener('click', () => navigateTo('settings'));
}

function _buildSourceBreakdown(filtered, sources) {
  if (!filtered.length || !sources.length) return '';
  const totals = {};
  filtered.forEach(i => { totals[i.sourceTypeId] = (totals[i.sourceTypeId] || 0) + i.amount; });
  const grand = Object.values(totals).reduce((a, b) => a + b, 0);
  const srcMap = Object.fromEntries(sources.map(s => [s.id, s.name]));

  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([id, amt]) => {
      const pct = grand ? Math.round((amt / grand) * 100) : 0;
      return `<div class="breakdown-row">
        <span class="breakdown-name">${_esc(srcMap[id] || 'Sin fuente')}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar income-bar" style="width:${pct}%"></div>
        </div>
        <span class="breakdown-pct">${pct}%</span>
        <span class="breakdown-amt income-clr">${formatCurrency(amt)}</span>
      </div>`;
    });

  return `<div class="card card-sm breakdown-card">
    <p class="breakdown-title">Por fuente</p>
    ${rows.join('')}
  </div>`;
}

function _buildList(filtered, sources) {
  if (!filtered.length) {
    return `<div class="empty-state">
      <div class="empty-state-icon">💰</div>
      <h3 class="empty-state-title">Sin ingresos este mes</h3>
      <p class="empty-state-desc">Pulsa "+ Agregar" para registrar tu primer ingreso del mes.</p>
    </div>`;
  }
  const srcMap = Object.fromEntries(sources.map(s => [s.id, s.name]));

  return `<div class="transaction-list">
    ${filtered.map(inc => `
      <div class="transaction-item">
        <div class="t-icon income-icon-bg">💸</div>
        <div class="t-body">
          <p class="t-name">${_esc(inc.description || srcMap[inc.sourceTypeId] || 'Ingreso')}</p>
          <p class="t-meta">
            <span class="badge badge-primary">${_esc(srcMap[inc.sourceTypeId] || 'Sin fuente')}</span>
            <span class="t-date">${_shortDate(inc.date)}</span>
          </p>
        </div>
        <div class="t-right">
          <span class="t-amount income-clr">+${formatCurrency(inc.amount)}</span>
          <button class="btn-icon btn-icon-danger" data-del-inc="${inc.id}" title="Eliminar">🗑️</button>
        </div>
      </div>`).join('')}
  </div>`;
}

// ─── Modal ────────────────────────────────────────────────────────
function _openModal(wrap) {
  const state = getState();
  const sources = state.incomeSourceTypes;
  if (!sources.length) {
    showToast('Primero agrega fuentes de ingreso en Ajustes', 'warning');
    navigateTo('settings');
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = today.startsWith(_month) ? today : _month + '-01';

  openModal({ title: 'Nuevo ingreso' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="inc-src">Fuente de ingreso</label>
        <select class="field-input field-select" id="inc-src">
          ${sources.map(s => `<option value="${s.id}">${_esc(s.name)}</option>`).join('')}
        </select>
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="inc-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${state.profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="inc-desc"
          placeholder="Ej: Pago quincenal, Bono, Proyecto X…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="inc-date">Fecha</label>
        <input class="field-input" type="date" id="inc-date" value="${defaultDate}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="inc-cancel">Cancelar</button>
        <button class="btn btn-primary" id="inc-save">Agregar ingreso</button>
      </div>
    `;

    body.querySelector('#inc-cancel').addEventListener('click', close);
    body.querySelector('#inc-save').addEventListener('click', () => {
      const sourceTypeId = body.querySelector('#inc-src').value;
      const amount       = parseFloat(body.querySelector('#inc-amt').value);
      const description  = body.querySelector('#inc-desc').value.trim();
      const date         = body.querySelector('#inc-date').value;

      if (!amount || amount <= 0) {
        body.querySelector('#inc-amt').focus();
        showToast('Ingresa un monto mayor a 0', 'error');
        return;
      }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }

      setState(s => {
        s.incomes.push({ id: generateId(), sourceTypeId, amount, description, date, createdAt: new Date().toISOString() });
      });
      _month = date.slice(0, 7);
      showToast('Ingreso registrado ✓');
      close();
      _render(wrap);
    });

    body.querySelector('#inc-amt').focus();
  });
}

function _delete(id, wrap) {
  confirmDialog({ title: 'Eliminar ingreso', message: '¿Eliminar este ingreso? La acción no se puede deshacer.', confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.incomes = s.incomes.filter(i => i.id !== id); });
      showToast('Ingreso eliminado');
      _render(wrap);
    });
}
