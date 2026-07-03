import { createInitialState } from './defaults.js';

const STORAGE_KEY = 'finanzas-v1';

let state = null;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? JSON.parse(raw) : createInitialState();
  } catch {
    state = createInitialState();
  }
}

function persist() {
  state.meta.lastModified = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error guardando datos:', e);
  }
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function getState() {
  if (!state) load();
  return state;
}

export function setState(updater) {
  if (!state) load();
  if (typeof updater === 'function') updater(state);
  else Object.assign(state, updater);
  persist();
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function exportJSON() {
  return JSON.stringify(getState(), null, 2);
}

export function importJSON(jsonString) {
  const parsed = JSON.parse(jsonString);
  if (!parsed.meta || !parsed.profile) throw new Error('Archivo no válido: faltan campos requeridos.');
  state = parsed;
  persist();
  notify();
}

export function resetAll() {
  state = createInitialState();
  persist();
  notify();
}

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatCurrency(amount) {
  const { code, locale } = getState().profile.currency;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  } catch {
    return `$${Number(amount ?? 0).toFixed(2)}`;
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(new Date(dateStr + 'T00:00:00'));
  } catch {
    return dateStr;
  }
}

// Init on import
load();
