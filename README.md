# App Finanzas

Personal finance tracker — local-first, no backend, no login required.

Built with Vite + Vanilla JS. All data lives in your browser's `localStorage`.

---

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Build & deploy

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

The `dist/` folder is a fully static site — deploy it anywhere.

### GitHub Pages

1. Push `dist/` to a `gh-pages` branch, **or**
2. Use the [gh-pages](https://www.npmjs.com/package/gh-pages) package:

```bash
npx gh-pages -d dist
```

Make sure `vite.config.js` has `base: './'` (already set).

### Vercel / Netlify

Import the repository and set:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |

No environment variables needed.

---

## Project structure

```
src/
├── main.js                  # Entry point — tab routing
├── state/
│   ├── defaults.js          # Initial state shape, currencies, default categories
│   └── store.js             # localStorage persistence, formatCurrency/formatDate helpers
├── ui/
│   ├── nav.js               # Bottom/top tab navigation
│   ├── header.js            # Header meta (user name, currency)
│   ├── components.js        # Modal, toast, confirmDialog, emptyState
│   └── chart.js             # Canvas donut chart
├── modules/
│   ├── onboarding.js        # First-run wizard (name, currency, distribution rule)
│   ├── summary.js           # Resumen — donut chart + rule comparison + alerts
│   ├── income.js            # Ingresos — by month, by source
│   ├── expenses.js          # Gastos — by month, by category, fixed/variable filter
│   ├── debts.js             # Deudas — credit cards + loans
│   ├── business.js          # Negocios — per-business income/expense tracking
│   ├── savings.js           # Ahorro — savings goals with contribution history
│   └── settings.js          # Ajustes — profile, currency, rule, categories, data
└── styles/
    ├── variables.css        # Design tokens (light + dark mode)
    ├── base.css             # Reset, app shell, header, nav
    ├── components.css       # Buttons, cards, modals, toasts, form fields
    └── modules.css          # Module-specific styles
```

---

## Data management

All data is stored under the key `finanzas-v1` in `localStorage`.

**Export**: go to Ajustes → Datos → Exportar JSON. Downloads a `.json` backup file.

**Import**: go to Ajustes → Datos → Importar JSON. Select a previously exported file. This **replaces** all current data.

**Reset**: Ajustes → Datos → Reiniciar. Requires two confirmations. Clears everything and runs the onboarding wizard again.

> Tip: export a backup before importing or resetting.

---

## Customisation

Everything is configured at runtime through the app — no code changes needed:

- **Name & currency** — Ajustes → Perfil
- **Distribution rule** (e.g. 50/30/20) — Ajustes → Regla de distribución
- **Income sources** — Ajustes → Fuentes de ingreso
- **Expense categories** (with emoji + color) — Ajustes → Categorías de gasto
