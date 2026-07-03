import { getState } from '../state/store.js';

function _esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function updateHeaderMeta() {
  const { profile } = getState();
  const el = document.getElementById('header-meta');
  if (!el) return;
  el.innerHTML = profile.name
    ? `<span class="header-user">${_esc(profile.name)}</span>`
    : '';
}
