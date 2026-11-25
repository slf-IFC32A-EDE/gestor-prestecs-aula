# Pla tècnic: Gestió de Préstecs d'Equipament d'Aula

- **Projecte:** Gestor prestecs aula
- **Característica:** `001-gestio-prestecs-aula`
- **Data:** 2026-11-25
- **Especificació base:** `specs/001-gestio-prestecs-aula/spec.md`
- **Constitució:** `.specify/memory/constitution.md` (v1.0.0)

## 1. Context tècnic i verificació de la constitució

- **Stack tecnològic:** HTML5 semàntic, CSS3 modern (variables CSS, Flexbox/Grid, disseny responsiu sense frameworks) i JavaScript Vanilla ES6+ (`<script type="module">`).
- **Persistència:** 100 % al navegador mitjançant `localStorage`. Sense backend, servidor ni base de dades externa.
- **Dependències externes:** Cap (prohibides llibreries o frameworks de tercers com React, Bootstrap o jQuery).
- **Verificació de principis (Constitution Check):**
  - **I. Stack tecnològic estricte:** Compleix — només HTML5, CSS3 i JS ES6+.
  - **II. Persistència local al navegador:** Compleix — tot l'estat es desa i es recupera de `localStorage`.
  - **III. Qualitat, modularitat i separació:** Compleix — separació clara entre `index.html`, `css/styles.css`, `js/storage.js` i `js/app.js`.
  - **IV. Experiència d'usuari i validació prèvia:** Compleix — interfície accessible i responsiva, amb validació prèvia i missatges d'error clars abans de desar.
  - **V. Restricció estricta d'abast:** Compleix — zero llibreries de tercers.

## 2. Estructura de fitxers del projecte

```text
.
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── storage.js
    └── app.js