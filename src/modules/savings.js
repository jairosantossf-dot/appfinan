import { getState, setState, generateId, formatCurrency } from '../state/store.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { CATEGORY_COLORS } from '../state/defaults.js';

// ─── Helpers ──────────────────────────────────────────────────────
function _thisMonth() {
  const d = new Date();
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

function _goalCurrent(goal) {
  return (goal.contributions || []).reduce((s, c) => s + (c.amount || 0), 0);
}
function _goalThisMonth(goal, month) {
  return (goal.contributions || [])
    .filter(c => c.date.startsWith(month))
    .reduce((s, c) => s + (c.amount || 0), 0);
}

// ─── Entry ────────────────────────────────────────────────────────
export function renderSavings() {
  const panel = document.getElementById('panel-savings');
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  panel.appendChild(wrap);
  _render(wrap);
  wrap.addEventListener('click', e => {
    const aportBtn = e.target.closest('[data-aport]');
    const editBtn  = e.target.closest('[data-edit-goal]');
    const delBtn   = e.target.closest('[data-del-goal]');
    const delC     = e.target.closest('[data-del-contrib]');
    if (aportBtn) _openContribModal(aportBtn.dataset.aport, wrap);
    if (editBtn)  _openGoalModal(editBtn.dataset.editGoal, wrap);
    if (delBtn)   _deleteGoal(delBtn.dataset.delGoal, wrap);
    if (delC) {
      const [gId, cId] = delC.dataset.delContrib.split('|');
      _deleteContrib(gId, cId, wrap);
    }
  });
}

function _render(wrap) {
  const state = getState();
  const { savingsGoals, incomes, profile } = state;
  const month = _thisMonth();

  // Global goal calculations
  const monthIncome = incomes.filter(i => i.date.startsWith(month)).reduce((s, i) => s + i.amount, 0);
  const saveTarget  = monthIncome * (profile.distributionRule.save / 100);
  const savedTotal  = savingsGoals.reduce((s, g) => s + _goalThisMonth(g, month), 0);
  const savePct     = saveTarget > 0 ? Math.min(100, Math.round((savedTotal / saveTarget) * 100)) : 0;
  const hasIncome   = monthIncome > 0;

  wrap.innerHTML = `
    <div class="mod-top-row">
      <div>
        <h1 class="module-title">Ahorro</h1>
        <p class="module-subtitle">Metas y progreso de ahorro</p>
      </div>
      <button class="btn btn-primary" id="btn-add-goal">+ Nueva meta</button>
    </div>

    <!-- Global goal strip -->
    <div class="card sav-global-card">
      <div class="sav-global-header">
        <div>
          <p class="sav-global-title">Meta global del mes</p>
          <p class="sav-global-sub">
            ${_cap(_monthLabel(month))} · ${profile.distributionRule.save}% de tus ingresos
          </p>
        </div>
        <div class="sav-global-amounts">
          <span class="sav-global-saved">${formatCurrency(savedTotal)}</span>
          <span class="sav-global-sep"> / </span>
          <span class="sav-global-target">${hasIncome ? formatCurrency(saveTarget) : '—'}</span>
        </div>
      </div>
      ${hasIncome ? `
        <div class="sav-global-bar-wrap">
          <div class="sav-bar-track">
            <div class="sav-bar-fill ${savePct >= 100 ? 'complete' : savePct >= 60 ? 'good' : ''}"
              style="width:${savePct}%"></div>
          </div>
          <span class="sav-bar-pct">${savePct}%</span>
        </div>
        <p class="sav-global-status ${savePct >= 100 ? 'status-ok' : savePct >= 60 ? 'status-warn' : 'status-low'}">
          ${savePct >= 100
            ? '✓ ¡Meta de ahorro del mes cumplida!'
            : savePct > 0
              ? `Faltan ${formatCurrency(Math.max(0, saveTarget - savedTotal))} para la meta del mes`
              : `Aún no has aportado a tus metas este mes`}
        </p>
      ` : `
        <p class="sav-global-status status-low">
          Registra ingresos del mes para calcular tu meta de ahorro.
        </p>
      `}
    </div>

    <!-- Goals grid -->
    <div id="goals-grid">
      ${savingsGoals.length
        ? `<div class="goals-grid">${savingsGoals.map(g => _htmlGoalCard(g, month)).join('')}</div>`
        : `<div class="empty-state">
            <div class="empty-state-icon">🎯</div>
            <h3 class="empty-state-title">Sin metas de ahorro</h3>
            <p class="empty-state-desc">Crea tu primera meta (fondo de emergencia, vacaciones, equipo…) y registra tus aportes.</p>
          </div>`}
    </div>
  `;

  wrap.querySelector('#btn-add-goal').addEventListener('click', () => _openGoalModal(null, wrap));
}

function _htmlGoalCard(goal, month) {
  const current = _goalCurrent(goal);
  const target  = goal.targetAmount || 0;
  const pct     = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const color   = goal.color || '#6366f1';
  const done    = pct >= 100;
  const monthAmt = _goalThisMonth(goal, month);
  const contribs = [...(goal.contributions || [])].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="goal-card" style="--goal-clr:${color}">
      <div class="goal-card-head">
        <span class="goal-icon">${goal.icon || '🎯'}</span>
        <div class="goal-title-wrap">
          <h3 class="goal-name">${_esc(goal.name)}</h3>
          ${done ? '<span class="badge badge-success">✓ Completada</span>' : ''}
        </div>
        <div class="item-actions">
          <button class="btn-icon" data-edit-goal="${goal.id}" title="Editar">✏️</button>
          <button class="btn-icon btn-icon-danger" data-del-goal="${goal.id}" title="Eliminar">🗑️</button>
        </div>
      </div>

      <div class="goal-amounts">
        <span class="goal-current" style="color:${color}">${formatCurrency(current)}</span>
        <span class="goal-sep">de</span>
        <span class="goal-target">${formatCurrency(target)}</span>
      </div>

      <div class="sav-global-bar-wrap">
        <div class="sav-bar-track">
          <div class="sav-bar-fill ${done ? 'complete' : pct >= 60 ? 'good' : ''}"
            style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="sav-bar-pct">${pct}%</span>
      </div>

      ${monthAmt > 0 ? `
        <p class="goal-month-note">
          Aportado este mes: <strong class="income-clr">${formatCurrency(monthAmt)}</strong>
        </p>` : ''}

      <button class="btn btn-primary btn-sm" style="width:100%;background:${color};border:none" data-aport="${goal.id}">
        + Aportar
      </button>

      ${contribs.length ? `
        <details class="goal-history">
          <summary class="loan-history-summary">Historial (${contribs.length})</summary>
          <div class="loan-payments-list" style="margin-top:var(--sp-3)">
            ${contribs.map(c => `
              <div class="loan-payment-row">
                <span class="loan-pay-dot" style="background:${color}"></span>
                <span class="loan-pay-note">${_esc(c.note || 'Aporte')}</span>
                <span class="loan-pay-date">${_shortDate(c.date)}</span>
                <span class="income-clr loan-pay-amt">+${formatCurrency(c.amount)}</span>
                <button class="btn-icon btn-icon-danger" data-del-contrib="${goal.id}|${c.id}" title="Eliminar">✕</button>
              </div>`).join('')}
          </div>
        </details>` : ''}
    </div>`;
}

// ─── Goal modal ───────────────────────────────────────────────────
function _openGoalModal(id, wrap) {
  const existing = id ? getState().savingsGoals.find(g => g.id === id) : null;
  const isEdit   = !!existing;
  let selColor   = existing?.color ?? CATEGORY_COLORS[5];

  openModal({ title: isEdit ? 'Editar meta' : 'Nueva meta de ahorro' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="goal-name">Nombre de la meta</label>
        <input class="field-input" type="text" id="goal-name"
          placeholder="Ej: Fondo de emergencia, Vacaciones, MacBook…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="cc-form-row">
        <div class="field-group">
          <label class="field-label" for="goal-icon">Ícono (emoji)</label>
          <input class="field-input" type="text" id="goal-icon" maxlength="4"
            placeholder="🎯" value="${_esc(existing?.icon || '')}"
            style="font-size:1.3rem;width:72px;text-align:center;" />
        </div>
        <div class="field-group">
          <label class="field-label" for="goal-target">Monto objetivo</label>
          <input class="field-input" type="number" id="goal-target" min="0.01" step="0.01"
            placeholder="0.00" value="${existing?.targetAmount ?? ''}" />
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Color</label>
        <div class="color-grid" id="goal-color-grid">
          ${CATEGORY_COLORS.map(c => `
            <button class="color-swatch${c === selColor ? ' selected' : ''}"
              style="background:${c}" data-color="${c}" type="button"></button>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="goal-cancel">Cancelar</button>
        <button class="btn btn-primary" id="goal-save">${isEdit ? 'Guardar cambios' : 'Crear meta'}</button>
      </div>
    `;

    body.querySelector('#goal-color-grid').addEventListener('click', e => {
      const sw = e.target.closest('.color-swatch');
      if (!sw) return;
      selColor = sw.dataset.color;
      body.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s === sw));
    });

    body.querySelector('#goal-cancel').addEventListener('click', close);
    body.querySelector('#goal-save').addEventListener('click', () => {
      const name   = body.querySelector('#goal-name').value.trim();
      const icon   = body.querySelector('#goal-icon').value.trim() || '🎯';
      const target = parseFloat(body.querySelector('#goal-target').value);
      if (!name)   { body.querySelector('#goal-name').focus();   showToast('Ingresa el nombre de la meta', 'error'); return; }
      if (!target || target <= 0) { body.querySelector('#goal-target').focus(); showToast('Ingresa un monto objetivo', 'error'); return; }
      if (isEdit) {
        setState(s => { const g = s.savingsGoals.find(g => g.id === id); if (g) Object.assign(g, { name, icon, targetAmount: target, color: selColor }); });
        showToast('Meta actualizada');
      } else {
        setState(s => { s.savingsGoals.push({ id: generateId(), name, icon, targetAmount: target, color: selColor, contributions: [] }); });
        showToast('Meta creada ✓');
      }
      close(); _render(wrap);
    });
    body.querySelector('#goal-name').focus();
  });
}

// ─── Contribution modal ───────────────────────────────────────────
function _openContribModal(goalId, wrap) {
  const goal  = getState().savingsGoals.find(g => g.id === goalId);
  if (!goal) return;
  const current = _goalCurrent(goal);
  const remaining = Math.max(0, goal.targetAmount - current);
  const today = new Date().toISOString().slice(0, 10);

  openModal({ title: `Aportar — ${goal.icon || ''} ${goal.name}`, size: 'sm' }, (body, close) => {
    body.innerHTML = `
      <p style="font-size:.875rem;color:var(--text-secondary);margin-bottom:var(--sp-2);">
        Progreso: <strong>${formatCurrency(current)}</strong> de <strong>${formatCurrency(goal.targetAmount)}</strong>
        ${remaining > 0 ? `· Faltan <strong>${formatCurrency(remaining)}</strong>` : ' · ¡Meta alcanzada!'}
      </p>
      <div class="field-group">
        <label class="field-label" for="contrib-amt">Monto del aporte</label>
        <div class="input-wrap-suffix">
          <input class="field-input" type="number" id="contrib-amt" min="0.01" step="0.01"
            placeholder="0.00" />
          <span class="input-suffix">${getState().profile.currency.code}</span>
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="contrib-note">Nota
          <span style="color:var(--text-muted);font-weight:400">(opcional)</span>
        </label>
        <input class="field-input" type="text" id="contrib-note" placeholder="Ej: Ahorro de junio…" />
      </div>
      <div class="field-group">
        <label class="field-label" for="contrib-date">Fecha</label>
        <input class="field-input" type="date" id="contrib-date" value="${today}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="contrib-cancel">Cancelar</button>
        <button class="btn btn-primary" id="contrib-save" style="background:${goal.color}">Aportar</button>
      </div>
    `;
    body.querySelector('#contrib-cancel').addEventListener('click', close);
    body.querySelector('#contrib-save').addEventListener('click', () => {
      const amount = parseFloat(body.querySelector('#contrib-amt').value);
      const note   = body.querySelector('#contrib-note').value.trim();
      const date   = body.querySelector('#contrib-date').value;
      if (!amount || amount <= 0) { body.querySelector('#contrib-amt').focus(); showToast('Ingresa un monto válido', 'error'); return; }
      if (!date) { showToast('Selecciona una fecha', 'error'); return; }
      setState(s => {
        const g = s.savingsGoals.find(g => g.id === goalId);
        if (g) g.contributions.push({ id: generateId(), amount, note, date });
      });
      showToast('Aporte registrado ✓');
      close(); _render(wrap);
    });
    body.querySelector('#contrib-amt').focus();
  });
}

function _deleteContrib(goalId, contribId, wrap) {
  confirmDialog({ title: 'Eliminar aporte', message: '¿Eliminar este aporte del historial?', confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { const g = s.savingsGoals.find(g => g.id === goalId); if (g) g.contributions = g.contributions.filter(c => c.id !== contribId); });
      showToast('Aporte eliminado'); _render(wrap);
    });
}

function _deleteGoal(id, wrap) {
  const goal = getState().savingsGoals.find(g => g.id === id);
  if (!goal) return;
  confirmDialog({
    title: 'Eliminar meta',
    message: `¿Eliminar "<strong>${_esc(goal.name)}</strong>" y todos sus aportes (${(goal.contributions || []).length})?`,
    confirmLabel: 'Eliminar', danger: true,
  }).then(ok => {
    if (!ok) return;
    setState(s => { s.savingsGoals = s.savingsGoals.filter(g => g.id !== id); });
    showToast('Meta eliminada'); _render(wrap);
  });
}
