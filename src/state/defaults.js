export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'cat-vivienda',       name: 'Vivienda',        icon: '🏠', color: '#6366f1', type: 'fixed'    },
  { id: 'cat-servicios',      name: 'Servicios',       icon: '💡', color: '#8b5cf6', type: 'fixed'    },
  { id: 'cat-alimentacion',   name: 'Alimentación',    icon: '🛒', color: '#10b981', type: 'variable' },
  { id: 'cat-transporte',     name: 'Transporte',      icon: '🚗', color: '#3b82f6', type: 'variable' },
  { id: 'cat-salud',          name: 'Salud',           icon: '🏥', color: '#ef4444', type: 'variable' },
  { id: 'cat-educacion',      name: 'Educación',       icon: '📚', color: '#f59e0b', type: 'variable' },
  { id: 'cat-entretenimiento',name: 'Entretenimiento', icon: '🎬', color: '#ec4899', type: 'variable' },
  { id: 'cat-ropa',           name: 'Ropa',            icon: '👕', color: '#14b8a6', type: 'variable' },
  { id: 'cat-otros',          name: 'Otros',           icon: '📦', color: '#64748b', type: 'variable' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$',  locale: 'en-US', name: 'Dólar estadounidense' },
  { code: 'EUR', symbol: '€',  locale: 'de-DE', name: 'Euro'                 },
  { code: 'MXN', symbol: '$',  locale: 'es-MX', name: 'Peso mexicano'        },
  { code: 'COP', symbol: '$',  locale: 'es-CO', name: 'Peso colombiano'      },
  { code: 'ARS', symbol: '$',  locale: 'es-AR', name: 'Peso argentino'       },
  { code: 'CLP', symbol: '$',  locale: 'es-CL', name: 'Peso chileno'         },
  { code: 'PEN', symbol: 'S/', locale: 'es-PE', name: 'Sol peruano'          },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Real brasileño'       },
  { code: 'GTQ', symbol: 'Q',  locale: 'es-GT', name: 'Quetzal guatemalteco' },
  { code: 'HNL', symbol: 'L',  locale: 'es-HN', name: 'Lempira hondureño'   },
  { code: 'BOB', symbol: 'Bs', locale: 'es-BO', name: 'Boliviano'            },
  { code: 'PYG', symbol: '₲',  locale: 'es-PY', name: 'Guaraní paraguayo'   },
  { code: 'UYU', symbol: '$',  locale: 'es-UY', name: 'Peso uruguayo'        },
  { code: 'VES', symbol: 'Bs', locale: 'es-VE', name: 'Bolívar venezolano'   },
];

export const CARD_GRADIENTS = [
  { id: 'g1', label: 'Índigo',    value: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 'g2', label: 'Esmeralda', value: 'linear-gradient(135deg,#11998e,#38ef7d)' },
  { id: 'g3', label: 'Coral',     value: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 'g4', label: 'Océano',    value: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { id: 'g5', label: 'Naranja',   value: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  { id: 'g6', label: 'Noche',     value: 'linear-gradient(135deg,#2c3e50,#4ca1af)' },
  { id: 'g7', label: 'Rosa',      value: 'linear-gradient(135deg,#ff758c,#ff7eb3)' },
  { id: 'g8', label: 'Verde',     value: 'linear-gradient(135deg,#56ab2f,#a8e063)' },
];

export const CATEGORY_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#ef4444','#f97316',
  '#f59e0b','#10b981','#14b8a6','#3b82f6','#06b6d4',
  '#84cc16','#64748b','#0ea5e9','#a855f7','#e11d48',
];

export function createInitialState() {
  const now = new Date().toISOString();
  return {
    meta: { version: 1, createdAt: now, lastModified: now },
    profile: {
      name: '',
      onboardingCompleted: false,
      currency: { code: 'USD', symbol: '$', locale: 'en-US' },
      distributionRule: { live: 60, debts: 10, save: 30 },
    },
    incomeSourceTypes: [],
    expenseCategories: DEFAULT_EXPENSE_CATEGORIES.map(c => ({ ...c })),
    incomes:      [],
    expenses:     [],
    creditCards:  [],
    loans:        [],
    businesses:   [],
    savingsGoals: [],
  };
}
