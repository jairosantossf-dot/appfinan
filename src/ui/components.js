/* Shared UI utilities: modal, toast, confirm, empty state */

// ─── Modal ────────────────────────────────────────────────────────
export function openModal({ title, size = '', onClose } = {}, buildBody) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = `modal${size ? ' modal-' + size : ''}`;

  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `<h3 class="modal-title">${title}</h3>`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-icon modal-close-btn';
  closeBtn.setAttribute('aria-label', 'Cerrar');
  closeBtn.textContent = '✕';
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';

  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  let _closed = false;
  const close = () => {
    if (_closed) return;
    _closed = true;
    overlay.classList.add('closing');
    document.removeEventListener('keydown', _onEsc);
    setTimeout(() => { overlay.remove(); onClose?.(); }, 200);
  };
  function _onEsc(e) { if (e.key === 'Escape') close(); }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', _onEsc);

  requestAnimationFrame(() => overlay.classList.add('open'));

  // buildBody receives the body element and a close reference
  buildBody?.(body, close);

  return { overlay, modal, body, close };
}

// ─── Confirm dialog ───────────────────────────────────────────────
export function confirmDialog({ title, message, confirmLabel = 'Confirmar', danger = false } = {}) {
  return new Promise(resolve => {
    const { close } = openModal({ title, size: 'sm', onClose: () => resolve(false) }, (body, closeFn) => {
      body.innerHTML = `
        <p style="color:var(--text-secondary);line-height:1.6;">${message}</p>
        <div class="modal-footer" style="border:none;padding:0;margin-top:var(--sp-2);">
          <button class="btn btn-ghost" id="cdCancel">Cancelar</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="cdOk">${confirmLabel}</button>
        </div>
      `;
      body.querySelector('#cdCancel').addEventListener('click', () => { closeFn(); resolve(false); });
      body.querySelector('#cdOk').addEventListener('click',     () => { closeFn(); resolve(true);  });
    });
  });
}

// ─── Toast ────────────────────────────────────────────────────────
let _toastContainer = null;
function getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.createElement('div');
    _toastContainer.className = 'toast-container';
    document.body.appendChild(_toastContainer);
  }
  return _toastContainer;
}

const TOAST_ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

export function showToast(message, type = 'success', duration = 3000) {
  const container = getToastContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] ?? '•'}</span>
    <span>${message}</span>
  `;
  container.appendChild(el);
  requestAnimationFrame(() => { requestAnimationFrame(() => el.classList.add('show')); });
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, duration);
}

// ─── Empty state ──────────────────────────────────────────────────
export function emptyState({ icon, title, desc, actionLabel, onAction } = {}) {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <div class="empty-state-icon">${icon}</div>
    <h3 class="empty-state-title">${title}</h3>
    ${desc ? `<p class="empty-state-desc">${desc}</p>` : ''}
    ${actionLabel ? `<button class="btn btn-primary">${actionLabel}</button>` : ''}
  `;
  if (actionLabel && onAction) {
    div.querySelector('.btn').addEventListener('click', onAction);
  }
  return div;
}
