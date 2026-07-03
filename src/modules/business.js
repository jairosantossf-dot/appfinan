import { getState, setState, generateId, formatCurrency } from '../state/store.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { CATEGORY_COLORS } from '../state/defaults.js';

// ─── Helpers ──────────────────────────────────────────────────────
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
function _shortDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short' })
      .format(new Date(dateStr + 'T00:00:00'));
  } catch { return dateStr; }
}
function _esc(s = '') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _calcBiz(biz, monthFilter = null) {
  const mvs = (biz.movements || []).filter(m => !monthFilter || m.date.startsWith(monthFilter));
  const totalIncome  = mvs.filter(m => m.type === 'income').reduce((s, m) => s + (m.amount || 0), 0);
  const totalExpense = mvs.filter(m => m.type === 'expense').reduce((s, m) => s + (m.amount || 0), 0);
  const balance      = totalIncome - totalExpense;
  return { totalIncome, totalExpense, balance, count: mvs.length };
}

// ─── Entry ────────────────────────────────────────────────────────
export function renderBusiness() {
  const panel = document.getElementById('panel-business');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
  wrap.addEventListener('click', e => {
    const viewBtn = e.target.closest('[data-view-biz]');
    const editBtn = e.target.closest('[data-edit-biz]');
    const delBtn  = e.target.closest('[data-del-biz]');
    if (viewBtn) _openMovementsModal(viewBtn.dataset.viewBiz, wrap);
    if (editBtn) _openBizModal(editBtn.dataset.editBiz, wrap);
    if (delBtn)  _deleteBiz(delBtn.dataset.delBiz, wrap);
  });
}

function _render(wrap) {
  const { businesses } = getState();
  const thisMonth = _thisMonth();

  // Global totals across all businesses (all time)
  const globalInc = businesses.reduce((s, b) => s + _calcBiz(b).totalIncome, 0);
  const globalExp = businesses.reduce((s, b) => s + _calcBiz(b).totalExpense, 0);
  const globalBal = globalInc - globalExp;
  const monthBal  = businesses.reduce((s, b) => s + _calcBiz(b, thisMonth).balance, 0);

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Negocios</h1>
        <p class="module-subtitle">Ingresos y gastos por negocio</p>
      </div>
      <button class="btn btn-primary" id="btn-add-biz">+ Nuevo negocio</button>
    </div>

    ${businesses.length ? `
    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Balance total</p>
        <p class="summary-value ${globalBal >= 0 ? 'income-clr' : 'expense-clr'}">
          ${globalBal >= 0 ? '+' : ''}${formatCurrency(globalBal)}
        </p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Ingresos totales</p>
        <p class="summary-value income-clr">${formatCurrency(globalInc)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Gastos totales</p>
        <p class="summary-value expense-clr">${formatCurrency(globalExp)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Balance este mes</p>
        <p class="summary-value ${monthBal >= 0 ? 'income-clr' : 'expense-clr'}">
          ${monthBal >= 0 ? '+' : ''}${formatCurrency(monthBal)}
        </p>
      </div>
    </div>` : ''}

    <div id="biz-grid">
      ${businesses.length
        ? `<div class="biz-grid">${businesses.map(b => _htmlBizCard(b, thisMonth)).join('')}</div>`
        : _htmlEmptyState()}
    </div>
  `;

  wrap.querySelector('#btn-add-biz').addEventListener('click', () => _openBizModal(null, wrap));
}

function _htmlEmptyState() {
  return `<div class="empty-state">
    <div class="empty-state-icon">🏢</div>
    <h3 class="empty-state-title">Sin negocios</h3>
    <p class="empty-state-desc">
      Crea un negocio para registrar sus ingresos y gastos por separado de tus finanzas personales.
    </p>
  </div>`;
}

function _htmlBizCard(biz, thisMonth) {
  const all   = _calcBiz(biz);
  const month = _calcBiz(biz, thisMonth);
  const color = biz.color || '#6366f1';
  const balPositive = all.balance >= 0;

  return `
    <div class="biz-card" style="--biz-clr:${color}">
      <div class="biz-card-head">
        <span class="biz-card-icon">${biz.icon || '🏢'}</span>
        <div class="biz-card-name-wrap">
          <h3 class="biz-card-name">${_esc(biz.name)}</h3>
          <span class="biz-card-count">${all.count} movimiento${all.count !== 1 ? 's' : ''}</span>
        </div>
        <span class="biz-card-balance ${balPositive ? 'income-clr' : 'expense-clr'}">
          ${balPositive ? '+' : ''}${formatCurrency(all.balance)}
        </span>
      </div>

      <div class="biz-alltime-bar">
        <div class="biz-bar-track">
          ${all.totalIncome + all.totalExpense > 0 ? `
            <div class="biz-bar-inc"
              style="width:${Math.round((all.totalIncome / (all.totalIncome + all.totalExpense)) * 100)}%"></div>
          ` : '<div class="biz-bar-empty"></div>'}
        </div>
      </div>

      <div class="biz-totals">
        <div class="biz-total-item">
          <span class="biz-total-lbl">↑ Ingresos</span>
          <span class="biz-total-val income-clr">${formatCurrency(all.totalIncome)}</span>
        </div>
        <div class="biz-total-item">
          <span class="biz-total-lbl">↓ Gastos</span>
          <span class="biz-total-val expense-clr">${formatCurrency(all.totalExpense)}</span>
        </div>
      </div>

      <div class="biz-month-strip">
        <span class="biz-month-lbl">Este mes</span>
        <span class="biz-month-vals">
          <span class="income-clr">+${formatCurrency(month.totalIncome)}</span>
          <span style="color:var(--text-muted)">·</span>
          <span class="expense-clr">-${formatCurrency(month.totalExpense)}</span>
          <span style="color:var(--text-muted)">·</span>
          <strong class="${month.balance >= 0 ? 'income-clr' : 'expense-clr'}">
            ${month.balance >= 0 ? '+' : ''}${formatCurrency(month.balance)}
          </strong>
        </span>
      </div>

      <div class="biz-actions">
        <button class="btn btn-outline btn-sm" style="flex:1" data-view-biz="${biz.id}">
          📋 Ver movimientos
        </button>
        <button class="btn-icon" data-edit-biz="${biz.id}" title="Editar negocio">✏️</button>
        <button class="btn-icon btn-icon-danger" data-del-biz="${biz.id}" title="Eliminar negocio">🗑️</button>
      </div>
    </div>`;
}

// ─── Add / Edit business modal ────────────────────────────────────
function _openBizModal(id, wrap) {
  const existing   = id ? getState().businesses.find(b => b.id === id) : null;
  const isEdit     = !!existing;
  let selColor     = existing?.color ?? CATEGORY_COLORS[0];

  openModal({ title: isEdit ? 'Editar negocio' : 'Nuevo negocio' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="biz-name">Nombre del negocio</label>
        <input class="field-input" type="text" id="biz-name"
          placeholder="Ej: Panadería El Sol, Tienda Online…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="biz-icon">Ícono (emoji)</label>
        <input class="field-input" type="text" id="biz-icon" maxlength="4"
          placeholder="🏢" value="${_esc(existing?.icon || '')}"
          style="font-size:1.4rem;width:72px;text-align:center;" />
      </div>
      <div class="field-group">
        <label class="field-label">Color de acento</label>
        <div class="color-grid" id="biz-color-grid">
          ${CATEGORY_COLORS.map(c => `
            <button class="color-swatch${c === selColor ? ' selected' : ''}"
              style="background:${c}" data-color="${c}" type="button"></button>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="biz-cancel">Cancelar</button>
        <button class="btn btn-primary" id="biz-save">${isEdit ? 'Guardar cambios' : 'Crear negocio'}</button>
      </div>
    `;

    body.querySelector('#biz-color-grid').addEventListener('click', e => {
      const sw = e.target.closest('.color-swatch');
      if (!sw) return;
      selColor = sw.dataset.color;
      body.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s === sw));
    });

    body.querySelector('#biz-cancel').addEventListener('click', close);
    body.querySelector('#biz-save').addEventListener('click', () => {
      const name = body.querySelector('#biz-name').value.trim();
      const icon = body.querySelector('#biz-icon').value.trim() || '🏢';
      if (!name) { body.querySelector('#biz-name').focus(); showToast('Ingresa el nombre del negocio', 'error'); return; }
      if (isEdit) {
        setState(s => { const b = s.businesses.find(b => b.id === id); if (b) Object.assign(b, { name, icon, color: selColor }); });
        showToast('Negocio actualizado');
      } else {
        setState(s => { s.businesses.push({ id: generateId(), name, icon, color: selColor, movements: [] }); });
        showToast('Negocio creado ✓');
      }
      close();
      _render(wrap);
    });

    body.querySelector('#biz-name').focus();
  });
}

// ─── Movements modal ──────────────────────────────────────────────
function _openMovementsModal(bizId, wrap) {
  const biz = getState().businesses.find(b => b.id === bizId);
  if (!biz) return;

  let _month = _thisMonth();

  openModal({ title: `${biz.icon || '🏢'} ${biz.name}`, size: 'lg' }, (body, close) => {

    // Delegation: only registered once
    body.addEventListener('click', e => {
      if (e.target.closest('#biz-prev')) { _month = _prevMonth(_month); renderBody(); return; }
      if (e.target.closest('#biz-next')) { _month = _nextMonth(_month); renderBody(); return; }
      if (e.target.closest('#biz-add-inc')) { _openMovModal(bizId, 'income',  _month, () => { renderBody(); _render(wrap); }); return; }
      if (e.target.closest('#biz-add-exp')) { _openMovModal(bizId, 'expense', _month, () => { renderBody(); _render(wrap); }); return; }

      const delBtn = e.target.closest('[data-del-bm]');
      if (delBtn) {
        const [bId, mId] = delBtn.dataset.delBm.split('|');
        _deleteMovement(bId, mId, () => { renderBody(); _render(wrap); });
      }
    });

    function renderBody() {
      const b = getState().businesses.find(b => b.id === bizId);
      if (!b) { close(); return; }

      const filtered = [...(b.movements || [])]
        .filter(m => m.date.startsWith(_month))
        .sort((a, v) => v.date.localeCompare(a.date));

      const mInc = filtered.filter(m => m.type === 'income').reduce((s, m) => s + m.amount, 0);
      const mExp = filtered.filter(m => m.type === 'expense').reduce((s, m) => s + m.amount, 0);
      const mBal = mInc - mExp;

      const color = b.color || '#6366f1';

      body.innerHTML = `
        <div class="biz-modal-banner" style="background:${color}18;border-left:4px solid ${color};">
          <span style="font-size:2rem">${b.icon || '🏢'}</span>
          <div>
            <p style="font-weight:600">${_esc(b.name)}</p>
            <p style="font-size:.8rem;color:var(--text-muted)">${_calcBiz(b).count} movimientos en total</p>
          </div>
        </div>

        <div class="month-nav" style="justify-content:center;">
          <button class="btn btn-ghost btn-sm" id="biz-prev">‹</button>
          <span class="month-label">${_cap(_monthLabel(_month))}</span>
          <button class="btn btn-ghost btn-sm" id="biz-next">›</button>
        </div>

        <div class="cc-modal-stats">
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Ingresos</p>
            <p class="cc-stat-val income-clr">${formatCurrency(mInc)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Gastos</p>
            <p class="cc-stat-val expense-clr">${formatCurrency(mExp)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Balance</p>
            <p class="cc-stat-val ${mBal >= 0 ? 'income-clr' : 'expense-clr'}">
              ${mBal >= 0 ? '+' : ''}${formatCurrency(mBal)}
            </p>
          </div>
        </div>

        <div class="mov-actions-row">
          <button class="btn btn-sm biz-btn-inc" id="biz-add-inc" style="flex:1;">
            + Ingreso
          </button>
          <button class="btn btn-sm biz-btn-exp" id="biz-add-exp" style="flex:1;">
            + Gasto
          </button>
        </div>

        <div class="movements-list">
          ${filtered.length
            ? filtered.map(m => `
              <div class="movement-row">
                <span class="mov-dot ${m.type === 'income' ? 'payment' : 'charge'}"></span>
                <div class="mov-body" style="flex-direction:column;align-items:flex-start;gap:2px;">
                  <span class="mov-desc">${_esc(m.description || (m.type === 'income' ? 'Ingreso' : 'Gasto'))}</span>
                  <span style="display:flex;gap:var(--sp-2);align-items:center">
                    ${m.category ? `<span class="badge badge-muted" style="font-size:.7rem">${_esc(m.category)}</span>` : ''}
                    <span class="mov-date">${_shortDate(m.date)}</span>
                  </span>
                </div>
                <span class="mov-amt ${m.type === 'income' ? 'income-clr' : 'expense-clr'}">
                  ${m.type === 'income' ? '+' : '−'}${formatCurrency(m.amount)}
                </span>
                <button class="btn-icon btn-icon-danger" data-del-bm="${bizId}|${m.id}" title="Eliminar">✕</button>
              </div>`).join('')
            : '<p class="mov-empty">Sin movimientos este mes.</p>'}
        </div>
      `;
    }

    renderBody();
  });
}

// ─── Add movement to business ─────────────────────────────────────
function _openMovModal(bizId, type, defaultMonth, onSaved) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = today.startsWith(defaultMonth) ? today : defaultMonth + '-01';
  const isIncome = type === 'income';

  openModal({ title: isIncome ? 'Nuevo ingreso del negocio' : 'Nuevo gasto del negocio', size: 'sm' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="bm-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="bm-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${getState().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="bm-desc"
          placeholder="${isIncome ? 'Ej: Ventas del día, Pedido…' : 'Ej: Materiales, Salario, Renta…'}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-cat">Categoría
          <span style="color:var(--text-muted);font-weight:400">(texto libre, opcional)</span>
        </label>
        <input class="field-input" type="text" id="bm-cat"
          placeholder="${isIncome ? 'Ej: Ventas, Servicios…' : 'Ej: Materiales, Operativo…'}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="bm-date">Fecha</label>
        <input class="field-input" type="date" id="bm-date" value="${defaultDate}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="bm-cancel">Cancelar</button>
        <button class="btn ${isIncome ? 'btn-primary' : 'btn-danger'}" id="bm-save">
          ${isIncome ? 'Agregar ingreso' : 'Agregar gasto'}
        </button>
      </div>
    `;

    body.querySelector('#bm-cancel').addEventListener('click', close);
    body.querySelector('#bm-save').addEventListener('click', () => {
      const amount      = parseFloat(body.querySelector('#bm-amt').value);
      const description = body.querySelector('#bm-desc').value.trim();
      const category    = body.querySelector('#bm-cat').value.trim();
      const date        = body.querySelector('#bm-date').value;

      if (!amount || amount <= 0) { body.querySelector('#bm-amt').focus(); showToast('Ingresa un monto válido', 'error'); return; }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }

      setState(s => {
        const b = s.businesses.find(b => b.id === bizId);
        if (b) b.movements.push({ id: generateId(), type, amount, description, category, date, createdAt: new Date().toISOString() });
      });
      showToast(isIncome ? 'Ingreso registrado ✓' : 'Gasto registrado');
      close();
      onSaved?.();
    });

    body.querySelector('#bm-amt').focus();
  });
}

function _deleteMovement(bizId, movId, onDeleted) {
  confirmDialog({ title: 'Eliminar movimiento', message: '¿Eliminar este movimiento del negocio?', confirmLabel: 'Eliminar', danger: true })
    .then(ok => { if (ok) { setState(s => { const b = s.businesses.find(b => b.id === bizId); if (b) b.movements = b.movements.filter(m => m.id !== movId); }); showToast('Movimiento eliminado'); onDeleted?.(); } });
}

function _deleteBiz(id, wrap) {
  const biz = getState().businesses.find(b => b.id === id);
  if (!biz) return;
  confirmDialog({
    title: 'Eliminar negocio',
    message: `¿Eliminar "<strong>${_esc(biz.name)}</strong>" y todos sus movimientos (${(biz.movements || []).length})?`,
    confirmLabel: 'Eliminar',
    danger: true,
  }).then(ok => {
    if (!ok) return;
    setState(s => { s.businesses = s.businesses.filter(b => b.id !== id); });
    showToast('Negocio eliminado');
    _render(wrap);
  });
}
