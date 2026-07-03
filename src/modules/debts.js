import { getState, setState, generateId, formatCurrency } from '../state/store.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { CARD_GRADIENTS } from '../state/defaults.js';

let _subTab = 'cards'; // 'cards' | 'loans'

// ─── Entry ────────────────────────────────────────────────────────
export function renderDebts() {
  const panel = document.getElementById('panel-debts');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
  wrap.addEventListener('click', e => {
    // Credit cards
    const viewBtn     = e.target.closest('[data-view-cc]');
    const editCCBtn   = e.target.closest('[data-edit-cc]');
    const delCCBtn    = e.target.closest('[data-del-cc]');
    // Loans
    const payBtn      = e.target.closest('[data-pay-loan]');
    const editLoanBtn = e.target.closest('[data-edit-loan]');
    const delLoanBtn  = e.target.closest('[data-del-loan]');
    const delPmt      = e.target.closest('[data-del-lp]');

    if (viewBtn)      _openMovementsModal(viewBtn.dataset.viewCc, wrap);
    if (editCCBtn)    _openCardModal(editCCBtn.dataset.editCc, wrap);
    if (delCCBtn)     _deleteCard(delCCBtn.dataset.delCc, wrap);
    if (payBtn)       _openLoanPaymentModal(payBtn.dataset.payLoan, wrap);
    if (editLoanBtn)  _openLoanModal(editLoanBtn.dataset.editLoan, wrap);
    if (delLoanBtn)   _deleteLoan(delLoanBtn.dataset.delLoan, wrap);
    if (delPmt) {
      const [lId, pId] = delPmt.dataset.delLp.split('|');
      _deleteLoanPayment(lId, pId, wrap);
    }
  });
}

function _render(wrap) {
  const { creditCards, loans } = getState();
  const totalDebt     = creditCards.reduce((s, c) => s + _calcCard(c).used, 0)
                      + loans.reduce((s, l) => s + _calcLoan(l).remaining, 0);
  const totalMonthly  = creditCards.reduce((s, c) => s + _calcCard(c).minPayment, 0)
                      + loans.reduce((s, l) => s + (l.monthlyPayment || 0), 0);

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Deudas</h1>
        <p class="module-subtitle">Tarjetas de crédito y préstamos</p>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-stat">
        <p class="summary-label">Deuda total</p>
        <p class="summary-value expense-clr">${formatCurrency(totalDebt)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Pago mensual est.</p>
        <p class="summary-value">${formatCurrency(totalMonthly)}</p>
      </div>
      <div class="summary-stat">
        <p class="summary-label">Tarjetas / Préstamos</p>
        <p class="summary-value">${creditCards.length} / ${loans.length}</p>
      </div>
    </div>

    <div class="debt-sub-tabs">
      <button class="debt-sub-tab ${_subTab==='cards'?'active':''}" data-sub="cards">💳 Tarjetas</button>
      <button class="debt-sub-tab ${_subTab==='loans'?'active':''}" data-sub="loans">📋 Préstamos</button>
    </div>

    <div id="debt-content">
      ${_subTab === 'cards' ? _htmlCardsTab(creditCards) : _htmlLoansTab(loans)}
    </div>
  `;

  wrap.querySelectorAll('.debt-sub-tab').forEach(btn =>
    btn.addEventListener('click', () => { _subTab = btn.dataset.sub; _render(wrap); })
  );

  wrap.querySelector('#btn-add-cc')?.addEventListener('click', () => _openCardModal(null, wrap));
  wrap.querySelector('#btn-add-loan')?.addEventListener('click', () => _openLoanModal(null, wrap));
}

// ═══════════════════════════════════════════════════════════════════
// CREDIT CARDS
// ═══════════════════════════════════════════════════════════════════

function _calcCard(card) {
  const mvs      = card.movements || [];
  const charged  = mvs.filter(m => m.type === 'charge').reduce((s, m) => s + m.amount, 0);
  const paid     = mvs.filter(m => m.type === 'payment').reduce((s, m) => s + m.amount, 0);
  const used     = Math.max(0, charged - paid);
  const available= Math.max(0, (card.limit || 0) - used);
  const pct      = card.limit ? Math.min(100, Math.round((used / card.limit) * 100)) : 0;
  const minPayment = card.minimumPaymentPct
    ? used * (card.minimumPaymentPct / 100)
    : (card.minimumPaymentFixed || 0);
  return { charged, paid, used, available, pct, minPayment };
}

function _gradientValue(id) {
  return CARD_GRADIENTS.find(g => g.id === id)?.value ?? CARD_GRADIENTS[0].value;
}

function _htmlCardsTab(creditCards) {
  if (!creditCards.length) {
    return `<div class="empty-state">
      <div class="empty-state-icon">💳</div>
      <h3 class="empty-state-title">Sin tarjetas</h3>
      <p class="empty-state-desc">Agrega tu primera tarjeta de crédito para controlar límites, saldos y fechas de pago.</p>
      <button class="btn btn-primary" id="btn-add-cc">+ Agregar tarjeta</button>
    </div>`;
  }
  return `
    <div class="cc-toolbar">
      <button class="btn btn-primary btn-sm" id="btn-add-cc">+ Agregar tarjeta</button>
    </div>
    <div class="cc-grid">
      ${creditCards.map(c => _htmlCardItem(c)).join('')}
    </div>`;
}

function _htmlCardItem(card) {
  const { used, available, pct, minPayment } = _calcCard(card);
  const barCls = pct >= 80 ? 'danger' : pct >= 60 ? 'warning' : '';
  const gradient = _gradientValue(card.gradient);

  return `
    <div class="cc-item" data-cc-id="${card.id}">
      <!-- Visual card -->
      <div class="cc-visual" style="background:${gradient}">
        <div class="cc-visual-top">
          <span class="cc-visual-name">${_esc(card.name)}</span>
          <span class="cc-visual-chip">◉</span>
        </div>
        <div class="cc-visual-number">•••• •••• •••• ${_esc(card.lastFour || '????')}</div>
        <div class="cc-visual-bottom">
          <div>
            <p class="cc-visual-lbl">Disponible</p>
            <p class="cc-visual-val">${formatCurrency(available)}</p>
          </div>
          <div style="text-align:right">
            <p class="cc-visual-lbl">Límite</p>
            <p class="cc-visual-val">${formatCurrency(card.limit || 0)}</p>
          </div>
        </div>
      </div>

      <!-- Usage bar -->
      <div class="cc-usage-wrap">
        <div class="cc-usage-track">
          <div class="cc-usage-fill ${barCls}" style="width:${pct}%"></div>
        </div>
        <span class="cc-usage-label">${pct}% usado · ${formatCurrency(used)} de ${formatCurrency(card.limit || 0)}</span>
      </div>

      <!-- Stats strip -->
      <div class="cc-stats-strip">
        <div class="cc-stat">
          <p class="cc-stat-lbl">Pago mínimo</p>
          <p class="cc-stat-val">${formatCurrency(minPayment)}</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Tasa anual</p>
          <p class="cc-stat-val">${card.interestRate || 0}%</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Corte</p>
          <p class="cc-stat-val">Día ${card.cutoffDay || '—'}</p>
        </div>
        <div class="cc-stat">
          <p class="cc-stat-lbl">Pago</p>
          <p class="cc-stat-val">Día ${card.paymentDueDay || '—'}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="cc-actions">
        <button class="btn btn-outline btn-sm" data-view-cc="${card.id}">📋 Movimientos</button>
        <button class="btn-icon" data-edit-cc="${card.id}" title="Editar tarjeta">✏️</button>
        <button class="btn-icon btn-icon-danger" data-del-cc="${card.id}" title="Eliminar tarjeta">🗑️</button>
      </div>
    </div>`;
}


// ─── Add / Edit card modal ────────────────────────────────────────
function _openCardModal(id, wrap) {
  const existing = id ? getState().creditCards.find(c => c.id === id) : null;
  const isEdit   = !!existing;
  let selGradient = existing?.gradient ?? 'g1';

  openModal({ title: isEdit ? 'Editar tarjeta' : 'Nueva tarjeta de crédito', size: 'lg' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="cc-name">Nombre de la tarjeta</label>
        <input class="field-input" type="text" id="cc-name" placeholder="Ej: Visa Oro, Mastercard Platinum…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-last4">Últimos 4 dígitos</label>
          <input class="field-input" type="text" id="cc-last4" maxlength="4"
            placeholder="1234" value="${_esc(existing?.lastFour || '')}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-limit">Límite de crédito</label>
          <input class="field-input" type="number" id="cc-limit" min="0" step="0.01"
            placeholder="0.00" value="${existing?.limit ?? ''}" />
        </div>
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-rate">Tasa anual (%)</label>
          <input class="field-input" type="number" id="cc-rate" min="0" step="0.1"
            placeholder="0" value="${existing?.interestRate ?? ''}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-minpct">Pago mínimo (%)</label>
          <input class="field-input" type="number" id="cc-minpct" min="0" max="100" step="0.5"
            placeholder="5" value="${existing?.minimumPaymentPct ?? ''}" />
        </div>
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="cc-cutoff">Día de corte</label>
          <input class="field-input" type="number" id="cc-cutoff" min="1" max="31"
            placeholder="15" value="${existing?.cutoffDay ?? ''}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="cc-due">Día de pago</label>
          <input class="field-input" type="number" id="cc-due" min="1" max="31"
            placeholder="5" value="${existing?.paymentDueDay ?? ''}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Color de la tarjeta</label>
        <div class="gradient-grid" id="gradient-grid">
          ${CARD_GRADIENTS.map(g => `
            <button class="gradient-swatch${g.id === selGradient ? ' selected' : ''}"
              style="background:${g.value}" data-gid="${g.id}" title="${g.label}" type="button"></button>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="cc-cancel">Cancelar</button>
        <button class="btn btn-primary" id="cc-save">${isEdit ? 'Guardar cambios' : 'Agregar tarjeta'}</button>
      </div>
    `;

    body.querySelector('#gradient-grid').addEventListener('click', e => {
      const sw = e.target.closest('.gradient-swatch');
      if (!sw) return;
      selGradient = sw.dataset.gid;
      body.querySelectorAll('.gradient-swatch').forEach(s => s.classList.toggle('selected', s === sw));
    });

    body.querySelector('#cc-cancel').addEventListener('click', close);
    body.querySelector('#cc-save').addEventListener('click', () => {
      const name          = body.querySelector('#cc-name').value.trim();
      const lastFour      = body.querySelector('#cc-last4').value.trim();
      const limit         = parseFloat(body.querySelector('#cc-limit').value) || 0;
      const interestRate  = parseFloat(body.querySelector('#cc-rate').value) || 0;
      const minPct        = parseFloat(body.querySelector('#cc-minpct').value) || 0;
      const cutoffDay     = parseInt(body.querySelector('#cc-cutoff').value) || 0;
      const paymentDueDay = parseInt(body.querySelector('#cc-due').value) || 0;

      if (!name) { body.querySelector('#cc-name').focus(); showToast('Ingresa el nombre', 'error'); return; }

      const data = { name, lastFour, limit, interestRate, minimumPaymentPct: minPct,
                     minimumPaymentFixed: 0, cutoffDay, paymentDueDay, gradient: selGradient };

      if (isEdit) {
        setState(s => { const c = s.creditCards.find(c => c.id === id); if (c) Object.assign(c, data); });
        showToast('Tarjeta actualizada');
      } else {
        setState(s => { s.creditCards.push({ id: generateId(), ...data, movements: [] }); });
        showToast('Tarjeta agregada');
      }
      close(); _render(wrap);
    });

    body.querySelector('#cc-name').focus();
  });
}

// ─── Movements modal ──────────────────────────────────────────────
function _openMovementsModal(cardId, wrap) {
  const card = getState().creditCards.find(c => c.id === cardId);
  if (!card) return;
  const gradient = _gradientValue(card.gradient);

  openModal({ title: card.name, size: 'lg' }, (body, close) => {
    function renderBody() {
      const c = getState().creditCards.find(c => c.id === cardId);
      if (!c) { close(); return; }
      const { used, available, pct, minPayment } = _calcCard(c);
      const barCls = pct >= 80 ? 'danger' : pct >= 60 ? 'warning' : '';
      const mvs = [...(c.movements || [])].sort((a, b) => b.date.localeCompare(a.date));

      body.innerHTML = `
        <div class="cc-modal-mini" style="background:${gradient}">
          <span class="cc-modal-mini-name">${_esc(c.name)}</span>
          <span class="cc-modal-mini-num">•••• ${_esc(c.lastFour || '????')}</span>
        </div>
        <div class="cc-modal-stats">
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Límite</p>
            <p class="cc-stat-val">${formatCurrency(c.limit || 0)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Usado</p>
            <p class="cc-stat-val expense-clr">${formatCurrency(used)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Disponible</p>
            <p class="cc-stat-val income-clr">${formatCurrency(available)}</p>
          </div>
          <div class="cc-modal-stat">
            <p class="cc-stat-lbl">Pago mínimo</p>
            <p class="cc-stat-val">${formatCurrency(minPayment)}</p>
          </div>
        </div>
        <div class="cc-usage-wrap" style="margin:0">
          <div class="cc-usage-track">
            <div class="cc-usage-fill ${barCls}" style="width:${pct}%"></div>
          </div>
          <span class="cc-usage-label">${pct}% usado</span>
        </div>
        <div class="mov-actions-row">
          <button class="btn btn-sm" style="flex:1;background:var(--clr-danger-light);color:var(--clr-danger);border:1.5px solid var(--clr-danger)" id="mov-charge">+ Cargo</button>
          <button class="btn btn-primary btn-sm" style="flex:1" id="mov-payment">+ Pago</button>
        </div>
        <div class="movements-list">
          ${mvs.length ? mvs.map(m => `
            <div class="movement-row">
              <span class="mov-dot ${m.type === 'charge' ? 'charge' : 'payment'}"></span>
              <div class="mov-body">
                <span class="mov-desc">${_esc(m.description || (m.type === 'charge' ? 'Cargo' : 'Pago'))}</span>
                <span class="mov-date">${_shortDate(m.date)}</span>
              </div>
              <span class="mov-amt ${m.type === 'charge' ? 'expense-clr' : 'income-clr'}">
                ${m.type === 'charge' ? '−' : '+'}${formatCurrency(m.amount)}
              </span>
              <button class="btn-icon btn-icon-danger" data-del-mov="${cardId}|${m.id}" title="Eliminar">✕</button>
            </div>`).join('')
          : '<p class="mov-empty">Sin movimientos registrados aún.</p>'}
        </div>
      `;
    }

    body.addEventListener('click', e => {
      if (e.target.closest('#mov-charge'))  _openMovementModal(cardId, 'charge',  renderBody);
      if (e.target.closest('#mov-payment')) _openMovementModal(cardId, 'payment', renderBody);
      const delBtn = e.target.closest('[data-del-mov]');
      if (delBtn) {
        const [cId, mId] = delBtn.dataset.delMov.split('|');
        _deleteMovement(cId, mId, renderBody, wrap);
      }
    });

    renderBody();
  });
}

function _openMovementModal(cardId, type, onSaved) {
  const today = new Date().toISOString().slice(0, 10);
  openModal({ title: type === 'charge' ? 'Nuevo cargo' : 'Registrar pago', size: 'sm' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="mov-amt">Monto</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="mov-amt" min="0.01" step="0.01" placeholder="0.00" />
          <span class="input-suffix">${getState().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="mov-desc">Descripción
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="mov-desc"
          placeholder="${type === 'charge' ? 'Ej: Supermercado, Netflix…' : 'Ej: Pago mensual…'}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="mov-date">Fecha</label>
        <input class="field-input" type="date" id="mov-date" value="${today}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="mov-cancel">Cancelar</button>
        <button class="btn ${type === 'charge' ? 'btn-danger' : 'btn-primary'}" id="mov-save">
          ${type === 'charge' ? 'Agregar cargo' : 'Registrar pago'}
        </button>
      </div>
    `;
    body.querySelector('#mov-cancel').addEventListener('click', close);
    body.querySelector('#mov-save').addEventListener('click', () => {
      const amount      = parseFloat(body.querySelector('#mov-amt').value);
      const description = body.querySelector('#mov-desc').value.trim();
      const date        = body.querySelector('#mov-date').value;
      if (!amount || amount <= 0) { body.querySelector('#mov-amt').focus(); showToast('Ingresa un monto válido', 'error'); return; }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }
      setState(s => {
        const c = s.creditCards.find(c => c.id === cardId);
        if (c) c.movements.push({ id: generateId(), type, amount, description, date });
      });
      showToast(type === 'charge' ? 'Cargo registrado' : 'Pago registrado ✓');
      close();
      onSaved?.();
    });
    body.querySelector('#mov-amt').focus();
  });
}

function _deleteMovement(cardId, movId, onDeleted, wrap) {
  confirmDialog({ title: 'Eliminar movimiento', message: '¿Eliminar este movimiento?', confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => {
        const c = s.creditCards.find(c => c.id === cardId);
        if (c) c.movements = c.movements.filter(m => m.id !== movId);
      });
      showToast('Movimiento eliminado');
      onDeleted?.();
      if (wrap) _render(wrap);
    });
}

function _deleteCard(id, wrap) {
  const card = getState().creditCards.find(c => c.id === id);
  if (!card) return;
  confirmDialog({ title: 'Eliminar tarjeta', message: `¿Eliminar "<strong>${_esc(card.name)}</strong>" y todos sus movimientos?`, confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.creditCards = s.creditCards.filter(c => c.id !== id); });
      showToast('Tarjeta eliminada');
      _render(wrap);
    });
}

// ═══════════════════════════════════════════════════════════════════
// LOANS
// ═══════════════════════════════════════════════════════════════════

function _calcLoan(loan) {
  const paid      = (loan.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
  const remaining = Math.max(0, (loan.originalAmount || 0) - paid);
  const pct       = loan.originalAmount ? Math.min(100, Math.round((paid / loan.originalAmount) * 100)) : 0;
  return { paid, remaining, pct };
}

function _htmlLoansTab(loans) {
  if (!loans.length) {
    return `<div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <h3 class="empty-state-title">Sin préstamos</h3>
      <p class="empty-state-desc">Agrega un préstamo para rastrear cuánto has pagado y cuánto falta.</p>
      <button class="btn btn-primary" id="btn-add-loan">+ Agregar préstamo</button>
    </div>`;
  }
  return `
    <div class="cc-toolbar">
      <button class="btn btn-primary btn-sm" id="btn-add-loan">+ Agregar préstamo</button>
    </div>
    <div class="loans-list">
      ${loans.map(l => _htmlLoanItem(l)).join('')}
    </div>`;
}

function _htmlLoanItem(loan) {
  const { paid, remaining, pct } = _calcLoan(loan);
  const barCls = pct >= 100 ? 'complete' : pct >= 60 ? 'good' : '';
  const payments = [...(loan.payments || [])].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="loan-card card">
      <div class="loan-header">
        <div class="loan-title-wrap">
          <h3 class="loan-name">${_esc(loan.name)}</h3>
          <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-1)">
            ${loan.interestRate ? `<span class="badge badge-warning">${loan.interestRate}% anual</span>` : ''}
            ${pct >= 100 ? '<span class="badge badge-success">✓ Saldado</span>' : ''}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary btn-sm" data-pay-loan="${loan.id}">+ Pago</button>
          <button class="btn-icon" data-edit-loan="${loan.id}" title="Editar">✏️</button>
          <button class="btn-icon btn-icon-danger" data-del-loan="${loan.id}" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div class="loan-progress-wrap">
        <div class="loan-bar-track">
          <div class="loan-bar-fill ${barCls}" style="width:${pct}%"></div>
        </div>
        <span class="loan-bar-pct">${pct}% pagado</span>
      </div>

      <div class="loan-stats-strip">
        <div class="loan-stat">
          <p class="cc-stat-lbl">Deuda original</p>
          <p class="cc-stat-val">${formatCurrency(loan.originalAmount || 0)}</p>
        </div>
        <div class="loan-stat">
          <p class="cc-stat-lbl">Pagado</p>
          <p class="cc-stat-val income-clr">${formatCurrency(paid)}</p>
        </div>
        <div class="loan-stat">
          <p class="cc-stat-lbl">Pendiente</p>
          <p class="cc-stat-val expense-clr">${formatCurrency(remaining)}</p>
        </div>
        ${loan.monthlyPayment ? `
        <div class="loan-stat">
          <p class="cc-stat-lbl">Cuota mensual</p>
          <p class="cc-stat-val">${formatCurrency(loan.monthlyPayment)}</p>
        </div>` : ''}
      </div>

      ${payments.length ? `
        <details class="loan-history">
          <summary class="loan-history-summary">Historial de pagos (${payments.length})</summary>
          <div class="loan-payments-list">
            ${payments.map(p => `
              <div class="loan-payment-row">
                <span class="loan-pay-dot"></span>
                <span class="loan-pay-note">${_esc(p.note || 'Pago')}</span>
                <span class="loan-pay-date">${_shortDate(p.date)}</span>
                <span class="income-clr loan-pay-amt">+${formatCurrency(p.amount)}</span>
                <button class="btn-icon btn-icon-danger" data-del-lp="${loan.id}|${p.id}" title="Eliminar">✕</button>
              </div>`).join('')}
          </div>
        </details>` : ''}
    </div>`;
}


function _openLoanModal(id, wrap) {
  const existing = id ? getState().loans.find(l => l.id === id) : null;
  const isEdit   = !!existing;

  openModal({ title: isEdit ? 'Editar préstamo' : 'Nuevo préstamo' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="ln-name">Nombre</label>
        <input class="field-input" type="text" id="ln-name"
          placeholder="Ej: Préstamo personal, Crédito auto…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="ln-orig">Monto original</label>
          <input class="field-input" type="number" id="ln-orig" min="0" step="0.01"
            placeholder="0.00" value="${existing?.originalAmount ?? ''}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="ln-monthly">Cuota mensual</label>
          <input class="field-input" type="number" id="ln-monthly" min="0" step="0.01"
            placeholder="0.00" value="${existing?.monthlyPayment ?? ''}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="ln-rate">Tasa de interés anual (%) <span style="color:var(--text-muted);font-weight:400">(opcional)</span></label>
        <input class="field-input" type="number" id="ln-rate" min="0" step="0.1"
          placeholder="0" value="${existing?.interestRate ?? ''}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="ln-cancel">Cancelar</button>
        <button class="btn btn-primary" id="ln-save">${isEdit ? 'Guardar cambios' : 'Agregar préstamo'}</button>
      </div>
    `;
    body.querySelector('#ln-cancel').addEventListener('click', close);
    body.querySelector('#ln-save').addEventListener('click', () => {
      const name          = body.querySelector('#ln-name').value.trim();
      const originalAmount= parseFloat(body.querySelector('#ln-orig').value) || 0;
      const monthlyPayment= parseFloat(body.querySelector('#ln-monthly').value) || 0;
      const interestRate  = parseFloat(body.querySelector('#ln-rate').value) || 0;
      if (!name) { body.querySelector('#ln-name').focus(); showToast('Ingresa el nombre', 'error'); return; }
      if (!originalAmount) { showToast('Ingresa el monto del préstamo', 'error'); return; }
      const data = { name, originalAmount, monthlyPayment, interestRate };
      if (isEdit) {
        setState(s => { const l = s.loans.find(l => l.id === id); if (l) Object.assign(l, data); });
        showToast('Préstamo actualizado');
      } else {
        setState(s => { s.loans.push({ id: generateId(), ...data, payments: [] }); });
        showToast('Préstamo agregado');
      }
      close(); _render(wrap);
    });
    body.querySelector('#ln-name').focus();
  });
}

function _openLoanPaymentModal(loanId, wrap) {
  const loan  = getState().loans.find(l => l.id === loanId);
  if (!loan) return;
  const { remaining } = _calcLoan(loan);
  const today = new Date().toISOString().slice(0, 10);

  openModal({ title: `Pago — ${loan.name}`, size: 'sm' }, (body, close) => {
    body.innerHTML = `
      <p style="font-size:.875rem;color:var(--text-secondary);margin-bottom:var(--sp-2);">
        Pendiente: <strong>${formatCurrency(remaining)}</strong>
        ${loan.monthlyPayment ? `· Cuota: <strong>${formatCurrency(loan.monthlyPayment)}</strong>` : ''}
      </p>
      <div class="field-group">
        <label class="field-label" for="lp-amt">Monto del pago</label>
        <input class="field-input" type="number" id="lp-amt" min="0.01" step="0.01"
          placeholder="${loan.monthlyPayment || '0.00'}"
          value="${loan.monthlyPayment || ''}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="lp-note">Nota <span style="color:var(--text-muted);font-weight:400">(opcional)</span></label>
        <input class="field-input" type="text" id="lp-note" placeholder="Ej: Cuota de junio…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="lp-date">Fecha</label>
        <input class="field-input" type="date" id="lp-date" value="${today}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="lp-cancel">Cancelar</button>
        <button class="btn btn-primary" id="lp-save">Registrar pago</button>
      </div>
    `;
    body.querySelector('#lp-cancel').addEventListener('click', close);
    body.querySelector('#lp-save').addEventListener('click', () => {
      const amount = parseFloat(body.querySelector('#lp-amt').value);
      const note   = body.querySelector('#lp-note').value.trim();
      const date   = body.querySelector('#lp-date').value;
      if (!amount || amount <= 0) { body.querySelector('#lp-amt').focus(); showToast('Ingresa un monto válido', 'error'); return; }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }
      setState(s => {
        const l = s.loans.find(l => l.id === loanId);
        if (l) l.payments.push({ id: generateId(), amount, note, date });
      });
      showToast('Pago registrado ✓');
      close(); _render(wrap);
    });
    body.querySelector('#lp-amt').focus();
  });
}

function _deleteLoan(id, wrap) {
  const loan = getState().loans.find(l => l.id === id);
  if (!loan) return;
  confirmDialog({ title: 'Eliminar préstamo', message: `¿Eliminar "<strong>${_esc(loan.name)}</strong>" y todo su historial de pagos?`, confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.loans = s.loans.filter(l => l.id !== id); });
      showToast('Préstamo eliminado');
      _render(wrap);
    });
}

function _deleteLoanPayment(loanId, payId, wrap) {
  confirmDialog({ title: 'Eliminar pago', message: '¿Eliminar este pago del historial?', confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => {
        const l = s.loans.find(l => l.id === loanId);
        if (l) l.payments = l.payments.filter(p => p.id !== payId);
      });
      showToast('Pago eliminado');
      _render(wrap);
    });
}

// ─── Util ─────────────────────────────────────────────────────────
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
