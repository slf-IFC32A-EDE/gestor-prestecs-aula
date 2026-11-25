const EQUIPS_STORAGE_KEY = 'gestor_prestecs_aula_equips';
const PRESTECS_STORAGE_KEY = 'gestor_prestecs_aula_prestecs';

function llegirArraySegur(clau) {
  try {
    const raw = window.localStorage.getItem(clau);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function desarArraySegur(clau, dades) {
  window.localStorage.setItem(clau, JSON.stringify(dades));
}

export function carregarEquips() {
  return llegirArraySegur(EQUIPS_STORAGE_KEY);
}

export function guardarEquips(equips) {
  desarArraySegur(EQUIPS_STORAGE_KEY, equips);
}

export function carregarPrestecs() {
  return llegirArraySegur(PRESTECS_STORAGE_KEY);
}

export function guardarPrestecs(prestecs) {
  desarArraySegur(PRESTECS_STORAGE_KEY, prestecs);
}