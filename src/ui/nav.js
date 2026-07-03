const TABS = [
  { id: 'summary',  label: 'Resumen',   icon: '📊' },
  { id: 'income',   label: 'Ingresos',  icon: '💰' },
  { id: 'expenses', label: 'Gastos',    icon: '💸' },
  { id: 'debts',    label: 'Deudas',    icon: '💳' },
  { id: 'business', label: 'Negocios',  icon: '🏢' },
  { id: 'savings',  label: 'Ahorro',    icon: '🎯' },
  { id: 'settings', label: 'Ajustes',   icon: '⚙️' },
];

let _current = 'summary';
let _onChange = null;

export function initNav(onChange) {
  _onChange = onChange;

  const nav = document.getElementById('main-nav');
  const inner = document.createElement('div');
  inner.className = 'nav-inner';

  TABS.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'nav-tab' + (tab.id === _current ? ' active' : '');
    btn.dataset.tab = tab.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(tab.id === _current));
    btn.innerHTML = `
      <span class="nav-tab-icon" aria-hidden="true">${tab.icon}</span>
      <span>${tab.label}</span>
    `;
    inner.appendChild(btn);
  });

  nav.appendChild(inner);

  nav.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (btn) navigateTo(btn.dataset.tab);
  });
}

export function navigateTo(tabId) {
  _current = tabId;

  document.querySelectorAll('.nav-tab').forEach(btn => {
    const active = btn.dataset.tab === tabId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === tabId);
  });

  _onChange?.(tabId);
}

export function currentTab() { return _current; }
