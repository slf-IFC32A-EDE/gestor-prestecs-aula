# Tasques d'implementació: Gestió de Préstecs d'Equipament d'Aula

- **Projecte:** Gestor prestecs aula
- **Característica:** `001-gestio-prestecs-aula`
- **Data:** 2026-11-25
- **Fonts:** `specs/001-gestio-prestecs-aula/plan.md`, `specs/001-gestio-prestecs-aula/spec.md`, `.specify/memory/constitution.md`

---

## Fase 1: Estructura HTML i estils base

**Objectiu:** Bastir l'esquelet semàntic en HTML5 i la fulla d'estils moderna en CSS3 (sense frameworks de tercers) per a **Gestor prestecs aula**.
**Criteri de prova independent:** Obrint `index.html` al navegador es visualitza l'estructura general, la capçalera, la regió d'avisos, les àrees de formularis i llistats i el disseny responsiu sense errors de càrrega.

- [ ] T001 [P] Crear l'esquelet HTML5 semàntic amb capçalera, resum d'estat, regió d'avisos (`aria-live`), formularis i contenidors de taules/llistes a `index.html`
- [ ] T002 [P] Definir variables CSS, tipografia, espaiats, estats visuals (`Disponible`, `Prestat`) i disseny responsiu a `css/styles.css`
- [ ] T003 Enllaçar `css/styles.css` i el mòdul ES6 `js/app.js` dins de `index.html` i verificar l'estructura de carpetes (`css/`, `js/`)

---

## Fase 2: Capa de persistència localStorage i regles de negoci

**Objectiu:** Implementar la persistència 100 % local a `localStorage` i les funcions pures de validació i transició d'estat de `Equip` i `Prestec`.
**Criteri de prova independent:** Es poden provar des de consola o mòdul les funcions d'alta, préstec, devolució i baixa protegida amb persistència a `localStorage` i rebuig de dades no vàlides.

- [ ] T004 [P] Implementar `carregarEquips`, `guardarEquips`, `carregarPrestecs` i `guardarPrestecs` amb control segur d'errors JSON sobre `localStorage` a `js/storage.js`
- [ ] T005 [P] [US1] Implementar `normalitzarCodi` i `validarNouEquip` (codi únic normalitzat, camps obligatoris i estat inicial `Disponible`) a `js/app.js`
- [ ] T006 [US1] Implementar `afegirEquip` per validar i persistir equips nous a `js/app.js` i `js/storage.js`
- [ ] T007 [US2] Implementar `validarNouPrestec` i `registrarPrestec` (equip `Disponible`, dades d'alumne/grup/sortida incloent dates passades, *snapshots* de l'equip i canvi d'estat a `Prestat`) a `js/app.js`
- [ ] T008 [US3] Implementar `validarDevolucio` i `retornarPrestec` (data/hora de devolució igual o posterior a sortida, pas a `Retornat` i retorn de l'equip a `Disponible`) a `js/app.js`
- [ ] T009 [US5] Implementar `eliminarEquip` bloquejant la baixa si hi ha préstec `Actiu` i conservant els préstecs `Retornat` en esborrar l'equip a `js/app.js`

---

## Fase 3: Connexió amb el DOM, formularis i renderitzat

**Objectiu:** Connectar els formularis d'alta, préstec, devolució i baixa amb les vistes d'inventari, préstecs actius i historial retornat al DOM.
**Criteri de prova independent:** L'usuari pot donar d'alta un equip, prestar-lo a un alumne, retornar-lo i donar-lo de baixa des de la interfície, veient els canvis reflectits i conservats en recarregar (`F5`).

- [ ] T010 [US1] Connectar el formulari d'alta d'equipament i el selector de categoria (predefinides + personalitzada) amb `afegirEquip` a `js/app.js` i `index.html`
- [ ] T011 [US2] Connectar el formulari de registre de préstec (amb hora actual per defecte i suport per a dates passades) amb `registrarPrestec` i actualitzar el selector d'equips disponibles a `js/app.js`
- [ ] T012 [US4] Implementar el renderitzat de l'inventari, préstecs actius (amb alumne, grup i sortida) i historial de préstecs retornats (amb *snapshots*) a `js/app.js` i `index.html`
- [ ] T013 [US3] Connectar l'acció de devolució de cada préstec actiu (amb selector de data/hora de devolució) amb `retornarPrestec` i refrescar vistes a `js/app.js`
- [ ] T014 [US5] Connectar l'acció d'eliminar equip de l'inventari amb `eliminarEquip` i mostrar avís clar si té préstec actiu a `js/app.js`

---

## Fase 4: Validacions, filtres i dades de prova

**Objectiu:** Completar el filtratge ràpid, la retroacció visual d'errors/estats buits, l'accessibilitat i el joc de proves manuals.
**Criteri de prova independent:** Tots els escenaris de `plan.md` i `spec.md` (codi duplicat, doble préstec, devolució anterior a sortida, baixa protegida, filtres i recàrrega) es compleixen sense errors.

- [ ] T015 [P] [US4] Afegir controls de filtre per estat (`Tots`, `Disponibles`, `Prestats`) i cerca per codi/nom/categoria a `index.html` i `js/app.js`
- [ ] T016 [P] Implementar missatges clars d'error i d'èxit a la regió `aria-live` i estats buits informatius quan no hi ha registres a `js/app.js` i `css/styles.css`
- [ ] T017 Revisar etiquetes `<label>`, focus visible per teclat i adaptació visual a mòbil/escriptori a `index.html` i `css/styles.css`
- [ ] T018 Executar el protocol de proves manuals de `plan.md` (amb dades de prova d'aula: portàtils, HDMI, Arduino, adaptadors) i verificar integritat a `localStorage`

---

## Dependències entre històries d'usuari

- **Fase 1** → Prerequisit general d'interfície i càrrega de mòduls.
- **Fase 2 (`T004`–`T009`)** → Base de dades i lògica; `T004` i `T005` precedeixen `T006`, i `T006` precedeix `T007` i `T008`.
- **US1 (`T005`, `T006`, `T010`)** → Necessària per disposar d'equips abans de provar **US2** (préstecs) i **US5** (baixes).
- **US2 (`T007`, `T011`)** → Prerequisit de **US3** (devolució) i de la prova de bloqueig de baixa per préstec actiu en **US5**.
- **US3 (`T008`, `T013`)** → Necessària per alliberar equips prestats i alimentar l'historial retornat de **US4** i **US5**.
- **US4 (`T012`, `T015`)** i **US5 (`T009`, `T014`)** → Poden avançar en paral·lel un cop hi hagi dades d'equips i préstecs.

## Oportunitats d'execució en paral·lel

- **Inici de Fase 1:** `T001` (`index.html`) i `T002` (`css/styles.css`) es poden treballar en paral·lel.
- **Inici de Fase 2:** `T004` (`js/storage.js`) i les funcions d'alta/validació de `T005` (`js/app.js`) es poden preparar en paral·lel abans d'integrar l'escriptura completa.
- **Fase 4:** `T015` (filtres) i `T016` (retroacció d'errors i estats buits) es poden abordar en paral·lel.

## Estratègia d'implementació (MVP incremental)

1. **MVP mínim (Fases 1–2 + US1–US3):** Estructura base, `localStorage`, alta d'equips, registre de préstecs i devolucions amb validacions bàsiques.
2. **Gestió completa d'aula (US4–US5):** Consulta i filtratge d'estat/historial i baixa protegida conservant l'historial retornat.
3. **Refinament i validació (Fase 4):** Filtres avançats, missatges i accessibilitat polits, i verificació completa amb dades de prova.