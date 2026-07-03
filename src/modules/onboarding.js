import { getState, setState } from '../state/store.js';
import { CURRENCIES } from '../state/defaults.js';

const STEPS = [
  { id: 'welcome',      title: '¡Bienvenido!',              subtitle: 'En unos pasos configuramos tu perfil.' },
  { id: 'currency',     title: '¿Cuál es tu moneda?',       subtitle: 'Puedes cambiarla después en Ajustes.' },
  { id: 'distribution', title: 'Tu regla de distribución',  subtitle: 'Define cómo repartir tus ingresos. Los tres valores deben sumar 100 %.' },
];

let _currentStep = 0;
let _onComplete = null;
let _overlay = null;

export function showOnboarding(onComplete) {
  if (getState().profile.onboardingCompleted) { onComplete?.(); return; }
  _onComplete = onComplete;
  _currentStep = 0;
  _renderOverlay();
}

function _renderOverlay() {
  if (_overlay) _overlay.remove();

  _overlay = document.createElement('div');
  _overlay.className = 'onboarding-overlay';
  _overlay.innerHTML = `
    <div class="onboarding-card">
      <div class="onboarding-step-indicator">
        ${STEPS.map((_, i) => `<div class="step-dot${i === _currentStep ? ' active' : ''}"></div>`).join('')}
      </div>
      <div>
        <h2 class="onboarding-title">${STEPS[_currentStep].title}</h2>
        <p class="onboarding-subtitle">${STEPS[_currentStep].subtitle}</p>
      </div>
      <div class="onboarding-body" id="onboarding-body"></div>
      <div class="onboarding-footer">
        <button class="btn btn-ghost" id="ob-skip">Saltar</button>
        <div style="display:flex;gap:var(--sp-2);">
          ${_currentStep > 0 ? '<button class="btn btn-outline" id="ob-back">Atrás</button>' : ''}
          <button class="btn btn-primary" id="ob-next">
            ${_currentStep === STEPS.length - 1 ? 'Empezar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  `;

  _buildStep(_overlay.querySelector('#onboarding-body'));

  _overlay.querySelector('#ob-skip').addEventListener('click', _finish);
  _overlay.querySelector('#ob-next').addEventListener('click', _nextStep);
  _overlay.querySelector('#ob-back')?.addEventListener('click', _prevStep);

  document.body.appendChild(_overlay);
}

function _buildStep(body) {
  const state = getState();
  const step  = STEPS[_currentStep].id;

  if (step === 'welcome') {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="ob-name">Tu nombre <span style="color:var(--text-muted);font-weight:400;">(opcional)</span></label>
        <input class="field-input" type="text" id="ob-name" placeholder="Ej: María García"
               value="${_esc(state.profile.name)}" autocomplete="name" />
      </div>
    `;
    body.querySelector('#ob-name').focus();
  }

  if (step === 'currency') {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="ob-currency">Moneda</label>
        <select class="field-input field-select" id="ob-currency">
          ${CURRENCIES.map(c => `
            <option value="${c.code}" ${c.code === state.profile.currency.code ? 'selected' : ''}>
              ${c.symbol} — ${c.name} (${c.code})
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  if (step === 'distribution') {
    const { live, debts, save } = state.profile.distributionRule;
    body.innerHTML = `
      <div class="dist-inputs">
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-live" min="0" max="100" value="${live}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-debts" min="0" max="100" value="${debts}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="ob-save" min="0" max="100" value="${save}">
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div class="dist-bar-wrap">
        <div class="dist-bar" id="ob-dist-bar">
          <div class="dist-segment" id="ob-bar-live"  style="width:${live}%;background:var(--clr-primary)">${live > 8 ? live+'%' : ''}</div>
          <div class="dist-segment" id="ob-bar-debts" style="width:${debts}%;background:var(--clr-warning)">${debts > 8 ? debts+'%' : ''}</div>
          <div class="dist-segment" id="ob-bar-save"  style="width:${save}%;background:var(--clr-success)">${save > 8 ? save+'%' : ''}</div>
        </div>
        <p class="dist-sum ok" id="ob-dist-sum">Total: ${live+debts+save}%</p>
      </div>
    `;

    ['ob-live','ob-debts','ob-save'].forEach(id => {
      body.querySelector(`#${id}`).addEventListener('input', _updateObBar);
    });
  }
}

function _updateObBar() {
  const live  = Number(document.getElementById('ob-live')?.value  || 0);
  const debts = Number(document.getElementById('ob-debts')?.value || 0);
  const save  = Number(document.getElementById('ob-save')?.value  || 0);
  const total = live + debts + save;

  const set = (id, val, pct) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.width = pct + '%';
    el.textContent = pct > 8 ? pct + '%' : '';
  };
  set('ob-bar-live',  live,  live);
  set('ob-bar-debts', debts, debts);
  set('ob-bar-save',  save,  save);

  const sumEl = document.getElementById('ob-dist-sum');
  if (sumEl) {
    sumEl.textContent = `Total: ${total}%`;
    sumEl.className = `dist-sum ${total === 100 ? 'ok' : 'err'}`;
  }
}

function _saveCurrentStep() {
  const step = STEPS[_currentStep].id;
  if (step === 'welcome') {
    const name = document.getElementById('ob-name')?.value.trim() || '';
    setState(s => { s.profile.name = name; });
    document.getElementById('header-meta').textContent = name ? name : '';
  }
  if (step === 'currency') {
    const code = document.getElementById('ob-currency')?.value;
    const found = CURRENCIES.find(c => c.code === code);
    if (found) setState(s => { s.profile.currency = { code: found.code, symbol: found.symbol, locale: found.locale }; });
  }
  if (step === 'distribution') {
    const live  = Number(document.getElementById('ob-live')?.value  || 0);
    const debts = Number(document.getElementById('ob-debts')?.value || 0);
    const save  = Number(document.getElementById('ob-save')?.value  || 0);
    if (live + debts + save !== 100) {
      document.getElementById('ob-dist-sum').textContent = 'Los porcentajes deben sumar 100%';
      document.getElementById('ob-dist-sum').className = 'dist-sum err';
      return false;
    }
    setState(s => { s.profile.distributionRule = { live, debts, save }; });
  }
  return true;
}

function _nextStep() {
  if (!_saveCurrentStep()) return;
  if (_currentStep < STEPS.length - 1) {
    _currentStep++;
    _renderOverlay();
  } else {
    _finish();
  }
}

function _prevStep() {
  if (_currentStep > 0) { _currentStep--; _renderOverlay(); }
}

function _finish() {
  setState(s => { s.profile.onboardingCompleted = true; });
  _overlay?.remove();
  _overlay = null;
  _onComplete?.();
}

function _esc(str = '') {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
