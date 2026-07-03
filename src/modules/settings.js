import { getState, setState, exportJSON, importJSON, resetAll, generateId } from '../state/store.js';
import { CURRENCIES, CATEGORY_COLORS } from '../state/defaults.js';
import { openModal, showToast, confirmDialog } from '../ui/components.js';
import { updateHeaderMeta } from '../ui/header.js';

const PANEL = () => document.getElementById('panel-settings');

// ─── Main render ──────────────────────────────────────────────────
export function renderSettings() {
  const panel = PANEL();
  panel.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'module-wrap';
  wrap.id = 'settings-wrap';
  panel.appendChild(wrap);

  wrap.innerHTML = `
    <div class="module-header">
      <h1 class="module-title">Ajustes</h1>
      <p class="module-subtitle">Configura tu perfil y preferencias</p>
    </div>
    <div class="settings-sections" id="settings-sections">
      ${_htmlProfile()}
      ${_htmlCurrency()}
      ${_htmlDistribution()}
      ${_htmlSources()}
      ${_htmlCategories()}
      ${_htmlData()}
    </div>
  `;

  _bindAll(wrap);
}

// ─── Section HTML builders ────────────────────────────────────────
function _htmlProfile() {
  const { name } = getState().profile;
  return `
    <section class="card" id="sec-profile">
      <h2 class="settings-section-title">👤 Perfil</h2>
      <div class="settings-fields">
        <div class="field-group">
          <label class="field-label" for="profile-name">Tu nombre <span style="color:var(--text-muted);font-weight:400;">(opcional)</span></label>
          <input class="field-input" type="text" id="profile-name"
            placeholder="Ej: María García" value="${_esc(name)}" autocomplete="name" />
          <p class="field-hint">Aparece en el encabezado de la app.</p>
        </div>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-profile">Guardar</button></div>
    </section>`;
}

function _htmlCurrency() {
  const { code } = getState().profile.currency;
  return `
    <section class="card" id="sec-currency">
      <h2 class="settings-section-title">💱 Moneda</h2>
      <div class="settings-fields">
        <div class="field-group">
          <label class="field-label" for="currency-select">Moneda predeterminada</label>
          <select class="field-input field-select" id="currency-select">
            ${CURRENCIES.map(c => `
              <option value="${c.code}" ${c.code === code ? 'selected' : ''}>
                ${c.symbol} — ${c.name} (${c.code})
              </option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-currency">Guardar</button></div>
    </section>`;
}

function _htmlDistribution() {
  const { live, debts, save } = getState().profile.distributionRule;
  return `
    <section class="card" id="sec-distribution">
      <h2 class="settings-section-title">📐 Regla de distribución</h2>
      <p class="settings-section-desc">
        Define cómo repartir tus ingresos entre necesidades, deudas y ahorro.
        Los tres valores deben sumar exactamente 100 %.
      </p>
      <div class="dist-inputs">
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-live"  min="0" max="100" value="${live}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-debts" min="0" max="100" value="${debts}">
            <span class="input-suffix">%</span>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</label>
          <div class="input-wrap-suffix">
            <input class="field-input" type="number" id="dist-save"  min="0" max="100" value="${save}">
            <span class="input-suffix">%</span>
          </div>
        </div>
      </div>
      <div class="dist-bar-wrap" style="margin-top:var(--sp-4);">
        <div class="dist-bar" id="dist-bar">
          <div class="dist-segment" id="dseg-live"  style="width:${live}%;background:var(--clr-primary)">${live>8?live+'%':''}</div>
          <div class="dist-segment" id="dseg-debts" style="width:${debts}%;background:var(--clr-warning)">${debts>8?debts+'%':''}</div>
          <div class="dist-segment" id="dseg-save"  style="width:${save}%;background:var(--clr-success)">${save>8?save+'%':''}</div>
        </div>
        <div class="dist-legend">
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-primary)"></span>Vivir</span>
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-warning)"></span>Deudas</span>
          <span class="dist-legend-item"><span class="dist-dot" style="background:var(--clr-success)"></span>Ahorrar</span>
        </div>
        <p class="dist-sum ${live+debts+save===100?'ok':'err'}" id="dist-sum">Total: ${live+debts+save}%</p>
      </div>
      <div class="field-actions"><button class="btn btn-primary btn-sm" id="btn-save-dist">Guardar</button></div>
    </section>`;
}

function _htmlSources() {
  return `
    <section class="card" id="sec-sources">
      <div class="settings-section-header">
        <h2 class="settings-section-title" style="margin-bottom:0">💰 Fuentes de ingreso</h2>
        <button class="btn btn-primary btn-sm" id="btn-add-source">+ Agregar</button>
      </div>
      <p class="settings-section-desc">
        Tipos de ingreso que puedes seleccionar al registrar ingresos (Sueldo, Freelance, Renta…).
      </p>
      <div id="sources-list">${_htmlSourcesList()}</div>
    </section>`;
}

function _htmlSourcesList() {
  const list = getState().incomeSourceTypes;
  if (!list.length) {
    return `<p style="font-size:.875rem;color:var(--text-muted);text-align:center;padding:var(--sp-4) 0;">
      Aún no tienes fuentes. Agrega tu primera fuente de ingreso.
    </p>`;
  }
  return `<ul class="items-list">
    ${list.map(src => `
      <li class="item-row" data-src-id="${src.id}">
        <div class="item-info">
          <span class="item-icon">💸</span>
          <span class="item-name">${_esc(src.name)}</span>
        </div>
        <div class="item-actions">
          <button class="btn-icon" title="Editar" data-edit-src="${src.id}">✏️</button>
          <button class="btn-icon btn-icon-danger" title="Eliminar" data-del-src="${src.id}">🗑️</button>
        </div>
      </li>`).join('')}
  </ul>`;
}

function _htmlCategories() {
  return `
    <section class="card" id="sec-cats">
      <div class="settings-section-header">
        <h2 class="settings-section-title" style="margin-bottom:0">🏷️ Categorías de gasto</h2>
        <button class="btn btn-primary btn-sm" id="btn-add-cat">+ Agregar</button>
      </div>
      <p class="settings-section-desc">
        Organiza tus gastos. Las categorías vienen con valores por defecto razonables pero puedes editarlas.
      </p>
      <div id="cats-list">${_htmlCatsList()}</div>
    </section>`;
}

function _htmlCatsList() {
  const cats = getState().expenseCategories;
  if (!cats.length) {
    return `<p style="font-size:.875rem;color:var(--text-muted);text-align:center;padding:var(--sp-4) 0;">
      No hay categorías. Agrega una para empezar.
    </p>`;
  }
  return `<ul class="items-list">
    ${cats.map(cat => `
      <li class="item-row" data-cat-id="${cat.id}">
        <div class="item-info">
          <span class="color-dot" style="background:${cat.color}"></span>
          <span class="item-icon">${cat.icon || '📦'}</span>
          <span class="item-name">${_esc(cat.name)}</span>
          <span class="badge badge-muted" style="margin-left:auto;font-size:.7rem;">${cat.type === 'fixed' ? 'Fijo' : 'Variable'}</span>
        </div>
        <div class="item-actions">
          <button class="btn-icon" title="Editar" data-edit-cat="${cat.id}">✏️</button>
          <button class="btn-icon btn-icon-danger" title="Eliminar" data-del-cat="${cat.id}">🗑️</button>
        </div>
      </li>`).join('')}
  </ul>`;
}

function _htmlData() {
  return `
    <section class="card" id="sec-data">
      <h2 class="settings-section-title">💾 Gestión de datos</h2>
      <div class="data-action-list">
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name">Exportar datos</p>
            <p class="data-action-desc">Descarga un archivo JSON con todos tus registros</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-export">↓ Exportar</button>
        </div>
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name">Importar datos</p>
            <p class="data-action-desc">Restaura desde un archivo JSON exportado anteriormente</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-import">↑ Importar</button>
          <input type="file" id="import-file-input" accept=".json" style="display:none">
        </div>
        <div class="data-action-row">
          <div class="data-action-info">
            <p class="data-action-name" style="color:var(--clr-danger)">Borrar todo</p>
            <p class="data-action-desc">Elimina todos los datos y reinicia la app desde cero</p>
          </div>
          <button class="btn btn-danger-outline btn-sm" id="btn-reset">🗑 Borrar todo</button>
        </div>
      </div>
    </section>`;
}

// ─── Bind all events (event delegation) ──────────────────────────
function _bindAll(wrap) {
  // Profile
  wrap.querySelector('#btn-save-profile')?.addEventListener('click', _saveProfile);

  // Currency
  wrap.querySelector('#btn-save-currency')?.addEventListener('click', _saveCurrency);

  // Distribution
  ['dist-live','dist-debts','dist-save'].forEach(id => {
    wrap.querySelector(`#${id}`)?.addEventListener('input', _liveUpdateDist);
  });
  wrap.querySelector('#btn-save-dist')?.addEventListener('click', _saveDistribution);

  // Income sources
  wrap.querySelector('#btn-add-source')?.addEventListener('click', () => _openSourceModal(null));
  wrap.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-src]');
    const delBtn  = e.target.closest('[data-del-src]');
    if (editBtn) _openSourceModal(editBtn.dataset.editSrc);
    if (delBtn)  _deleteSource(delBtn.dataset.delSrc);
  });

  // Categories
  wrap.querySelector('#btn-add-cat')?.addEventListener('click', () => _openCatModal(null));
  wrap.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-cat]');
    const delBtn  = e.target.closest('[data-del-cat]');
    if (editBtn) _openCatModal(editBtn.dataset.editCat);
    if (delBtn)  _deleteCat(delBtn.dataset.delCat);
  });

  // Data
  wrap.querySelector('#btn-export')?.addEventListener('click', _doExport);
  wrap.querySelector('#btn-import')?.addEventListener('click', () => wrap.querySelector('#import-file-input').click());
  wrap.querySelector('#import-file-input')?.addEventListener('change', _doImport);
  wrap.querySelector('#btn-reset')?.addEventListener('click', _doReset);
}

// ─── Actions ──────────────────────────────────────────────────────
function _saveProfile() {
  const name = document.getElementById('profile-name')?.value.trim() || '';
  setState(s => { s.profile.name = name; });
  updateHeaderMeta();
  showToast('Perfil guardado');
}

function _saveCurrency() {
  const code  = document.getElementById('currency-select')?.value;
  const found = CURRENCIES.find(c => c.code === code);
  if (!found) return;
  setState(s => { s.profile.currency = { code: found.code, symbol: found.symbol, locale: found.locale }; });
  showToast('Moneda actualizada');
}

function _liveUpdateDist() {
  const live  = Number(document.getElementById('dist-live')?.value  || 0);
  const debts = Number(document.getElementById('dist-debts')?.value || 0);
  const save  = Number(document.getElementById('dist-save')?.value  || 0);
  const total = live + debts + save;

  const set = (id, pct) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.width = Math.max(0, pct) + '%';
    el.textContent = pct > 8 ? pct + '%' : '';
  };
  set('dseg-live',  live);
  set('dseg-debts', debts);
  set('dseg-save',  save);

  const sumEl = document.getElementById('dist-sum');
  if (sumEl) {
    sumEl.textContent = `Total: ${total}%`;
    sumEl.className = `dist-sum ${total === 100 ? 'ok' : 'err'}`;
  }
}

function _saveDistribution() {
  const live  = Number(document.getElementById('dist-live')?.value  || 0);
  const debts = Number(document.getElementById('dist-debts')?.value || 0);
  const save  = Number(document.getElementById('dist-save')?.value  || 0);
  if (live + debts + save !== 100) {
    showToast('Los porcentajes deben sumar exactamente 100 %', 'error');
    return;
  }
  setState(s => { s.profile.distributionRule = { live, debts, save }; });
  showToast('Regla de distribución guardada');
}

// ─── Income Source modal ──────────────────────────────────────────
function _openSourceModal(id) {
  const existing = id ? getState().incomeSourceTypes.find(s => s.id === id) : null;
  const isEdit   = !!existing;

  openModal({ title: isEdit ? 'Editar fuente' : 'Nueva fuente de ingreso' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="src-name">Nombre</label>
        <input class="field-input" type="text" id="src-name"
          placeholder="Ej: Sueldo, Freelance, Renta…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="src-cancel">Cancelar</button>
        <button class="btn btn-primary" id="src-save">${isEdit ? 'Guardar cambios' : 'Agregar'}</button>
      </div>
    `;
    const input = body.querySelector('#src-name');
    input.focus();

    body.querySelector('#src-cancel').addEventListener('click', close);
    body.querySelector('#src-save').addEventListener('click', () => {
      const name = input.value.trim();
      if (!name) { input.focus(); return; }
      if (isEdit) {
        setState(s => {
          const idx = s.incomeSourceTypes.findIndex(x => x.id === id);
          if (idx !== -1) s.incomeSourceTypes[idx].name = name;
        });
        showToast('Fuente actualizada');
      } else {
        setState(s => { s.incomeSourceTypes.push({ id: generateId(), name }); });
        showToast('Fuente agregada');
      }
      close();
      _refreshSources();
    });

    input.addEventListener('keydown', e => { if (e.key === 'Enter') body.querySelector('#src-save').click(); });
  });
}

function _deleteSource(id) {
  const src = getState().incomeSourceTypes.find(s => s.id === id);
  if (!src) return;
  confirmDialog({ title: 'Eliminar fuente', message: `¿Eliminar "<strong>${_esc(src.name)}</strong>"?`, confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.incomeSourceTypes = s.incomeSourceTypes.filter(x => x.id !== id); });
      showToast('Fuente eliminada');
      _refreshSources();
    });
}

function _refreshSources() {
  const el = document.getElementById('sources-list');
  if (el) el.innerHTML = _htmlSourcesList();
}

// ─── Category modal ───────────────────────────────────────────────
function _openCatModal(id) {
  const existing = id ? getState().expenseCategories.find(c => c.id === id) : null;
  const isEdit   = !!existing;
  let selectedColor = existing?.color || CATEGORY_COLORS[0];

  openModal({ title: isEdit ? 'Editar categoría' : 'Nueva categoría' }, (body, close) => {
    body.innerHTML = `
      <div class="field-group">
        <label class="field-label" for="cat-name">Nombre</label>
        <input class="field-input" type="text" id="cat-name"
          placeholder="Ej: Vivienda, Salud, Ropa…"
          value="${_esc(existing?.name || '')}" />
      </div>
      <div class="field-group">
        <label class="field-label" for="cat-icon">Ícono (emoji)</label>
        <input class="field-input" type="text" id="cat-icon"
          placeholder="📦" maxlength="4"
          value="${_esc(existing?.icon || '')}" style="font-size:1.3rem;width:80px;" />
      </div>
      <div class="field-group">
        <label class="field-label">Color</label>
        <div class="color-grid" id="cat-color-grid">
          ${CATEGORY_COLORS.map(c => `
            <button class="color-swatch${c === selectedColor ? ' selected' : ''}"
              style="background:${c}" data-color="${c}" title="${c}" type="button"></button>
          `).join('')}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label" for="cat-type">Tipo</label>
        <select class="field-input field-select" id="cat-type">
          <option value="fixed"    ${existing?.type === 'fixed'    ? 'selected' : ''}>Fijo</option>
          <option value="variable" ${(!existing || existing?.type === 'variable') ? 'selected' : ''}>Variable</option>
          <option value="both"     ${existing?.type === 'both'     ? 'selected' : ''}>Ambos</option>
        </select>
      </div>
      <div class="modal-footer" style="border:none;padding:0;">
        <button class="btn btn-ghost" id="cat-cancel">Cancelar</button>
        <button class="btn btn-primary" id="cat-save">${isEdit ? 'Guardar cambios' : 'Agregar'}</button>
      </div>
    `;

    // Color picker
    body.querySelector('#cat-color-grid').addEventListener('click', e => {
      const sw = e.target.closest('.color-swatch');
      if (!sw) return;
      selectedColor = sw.dataset.color;
      body.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s === sw));
    });

    body.querySelector('#cat-cancel').addEventListener('click', close);
    body.querySelector('#cat-save').addEventListener('click', () => {
      const name = body.querySelector('#cat-name').value.trim();
      if (!name) { body.querySelector('#cat-name').focus(); return; }
      const icon = body.querySelector('#cat-icon').value.trim() || '📦';
      const type = body.querySelector('#cat-type').value;
      if (isEdit) {
        setState(s => {
          const cat = s.expenseCategories.find(c => c.id === id);
          if (cat) Object.assign(cat, { name, icon, color: selectedColor, type });
        });
        showToast('Categoría actualizada');
      } else {
        setState(s => { s.expenseCategories.push({ id: generateId(), name, icon, color: selectedColor, type }); });
        showToast('Categoría agregada');
      }
      close();
      _refreshCats();
    });

    body.querySelector('#cat-name').focus();
  });
}

function _deleteCat(id) {
  const cat = getState().expenseCategories.find(c => c.id === id);
  if (!cat) return;
  confirmDialog({ title: 'Eliminar categoría', message: `¿Eliminar "<strong>${_esc(cat.name)}</strong>"?<br><span style="font-size:.85rem;color:var(--text-muted)">Los gastos con esta categoría quedarán sin categoría.</span>`, confirmLabel: 'Eliminar', danger: true })
    .then(ok => {
      if (!ok) return;
      setState(s => { s.expenseCategories = s.expenseCategories.filter(c => c.id !== id); });
      showToast('Categoría eliminada');
      _refreshCats();
    });
}

function _refreshCats() {
  const el = document.getElementById('cats-list');
  if (el) el.innerHTML = _htmlCatsList();
}

// ─── Data management ──────────────────────────────────────────────
function _doExport() {
  const json = exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `finanzas-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Datos exportados correctamente');
}

function _doImport(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async ev => {
    const ok = await confirmDialog({
      title: 'Importar datos',
      message: 'Esto reemplazará <strong>todos</strong> tus datos actuales con el archivo seleccionado. ¿Continuar?',
      confirmLabel: 'Importar',
      danger: true,
    });
    if (!ok) { e.target.value = ''; return; }
    try {
      importJSON(ev.target.result);
      showToast('Datos importados correctamente');
      renderSettings();
      updateHeaderMeta();
    } catch (err) {
      showToast('El archivo no es válido o está dañado.', 'error');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

async function _doReset() {
  const ok = await confirmDialog({
    title: 'Borrar todos los datos',
    message: 'Se eliminarán <strong>todos</strong> tus registros: ingresos, gastos, deudas, negocios y más. Esta acción <strong>no se puede deshacer</strong>.',
    confirmLabel: '🗑 Borrar todo',
    danger: true,
  });
  if (!ok) return;
  resetAll();
  showToast('Datos eliminados. La app fue reiniciada.', 'info');
  renderSettings();
  updateHeaderMeta();
}

// ─── Util ─────────────────────────────────────────────────────────
function _esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
