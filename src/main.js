import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/modules.css';

import { initNav, navigateTo } from './ui/nav.js';
import { updateHeaderMeta }  from './ui/header.js';
import { showOnboarding }    from './modules/onboarding.js';
import { renderSummary }     from './modules/summary.js';
import { renderIncome }      from './modules/income.js';
import { renderExpenses }    from './modules/expenses.js';
import { renderDebts }       from './modules/debts.js';
import { renderBusiness }    from './modules/business.js';
import { renderSavings }     from './modules/savings.js';
import { renderSettings }    from './modules/settings.js';

// These tabs aggregate data from other tabs — always re-render so numbers stay fresh.
const ALWAYS_REFRESH = new Set(['summary', 'savings', 'settings']);
const _rendered = new Set();

function renderTab(tabId) {
  switch (tabId) {
    case 'summary':  renderSummary();  break;
    case 'income':   renderIncome();   break;
    case 'expenses': renderExpenses(); break;
    case 'debts':    renderDebts();    break;
    case 'business': renderBusiness(); break;
    case 'savings':  renderSavings();  break;
    case 'settings': renderSettings(); break;
  }
}

function onTabChange(tabId) {
  if (ALWAYS_REFRESH.has(tabId) || !_rendered.has(tabId)) {
    renderTab(tabId);
    _rendered.add(tabId);
  }
}

function init() {
  initNav(onTabChange);

  renderTab('summary');
  _rendered.add('summary');

  updateHeaderMeta();

  showOnboarding(() => {
    updateHeaderMeta();
    navigateTo('settings');
  });
}

init();
