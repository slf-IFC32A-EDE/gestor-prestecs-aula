# Tasques d'implementació: Gestió de Préstecs d'Equipament d'Aula

- **Projecte:** Gestor prestecs aula
- **Característica:** `001-gestio-prestecs-aula`
- **Data:** 2026-11-25
- **Estat:** Completat (`18/18` tasques marcades com a `[X]`)

## Fase 1: Estructura HTML i estils base
- [X] T001 [P] Crear l'esquelet HTML5 semàntic amb capçalera, resum d'estat, regió d'avisos (`aria-live`), formularis i contenidors de taules/llistes a `index.html`
- [X] T002 [P] Definir variables CSS, tipografia, espaiats, estats visuals (`Disponible`, `Prestat`) i disseny responsiu a `css/styles.css`
- [X] T003 Enllaçar `css/styles.css` i el mòdul ES6 `js/app.js` dins de `index.html` i verificar l'estructura de carpetes (`css/`, `js/`)

## Fase 2: Capa de persistència localStorage i regles de negoci
- [X] T004 [P] Implementar `carregarEquips`, `guardarEquips`, `carregarPrestecs` i `guardarPrestecs` amb control segur d'errors JSON sobre `localStorage` a `js/storage.js`
- [X] T005 [P] [US1] Implementar `normalitzarCodi` i `validarNouEquip` (codi únic normalitzat, camps obligatoris i estat inicial `Disponible`) a `js/app.js`
- [X] T006 [US1] Implementar `afegirEquip` per validar i persistir equips nous a `js/app.js` i `js/storage.js`
- [X] T007 [US2] Implementar `validarNouPrestec` i `registrarPrestec` (equip `Disponible`, dades d'alumne/grup/sortida incloent dates passades, *snapshots* de l'equip i canvi d'estat a `Prestat`) a `js/app.js`
- [X] T008 [US3] Implementar `validarDevolucio` i `retornarPrestec` (data/hora de devolució igual o posterior a sortida, pas a `Retornat` i retorn de l'equip a `Disponible`) a `js/app.js`
- [X] T009 [US5] Implementar `eliminarEquip` bloquejant la baixa si hi ha préstec `Actiu` i conservant els préstecs `Retornat` en esborrar l'equip a `js/app.js`

## Fase 3: Connexió amb el DOM, formularis i renderitzat
- [X] T010 [US1] Connectar el formulari d'alta d'equipament i el selector de categoria (predefinides + personalitzada) amb `afegirEquip` a `js/app.js` i `index.html`
- [X] T011 [US2] Connectar el formulari de registre de préstec (amb hora actual per defecte i suport per a dates passades) amb `registrarPrestec` i actualitzar el selector d'equips disponibles a `js/app.js`
- [X] T012 [US4] Implementar el renderitzat de l'inventari, préstecs actius (amb alumne, grup i sortida) i historial de préstecs retornats (amb *snapshots*) a `js/app.js` i `index.html`
- [X] T013 [US3] Connectar l'acció de devolució de cada préstec actiu (amb selector de data/hora de devolució) amb `retornarPrestec` i refrescar vistes a `js/app.js`
- [X] T014 [US5] Connectar l'acció d'eliminar equip de l'inventari amb `eliminarEquip` i mostrar avís clar si té préstec actiu a `js/app.js`

## Fase 4: Validacions, filtres i dades de prova
- [X] T015 [P] [US4] Afegir controls de filtre per estat (`Tots`, `Disponibles`, `Prestats`) i cerca per codi/nom/categoria a `index.html` i `js/app.js`
- [X] T016 [P] Implementar missatges clars d'error i d'èxit a la regió `aria-live` i estats buits informatius quan no hi ha registres a `js/app.js` i `css/styles.css`
- [X] T017 Revisar etiquetes `<label>`, focus visible per teclat i adaptació visual a mòbil/escriptori a `index.html` i `css/styles.css`
- [X] T018 Executar el protocol de proves manuals de `plan.md` (amb dades de prova d'aula: portàtils, HDMI, Arduino, adaptadors) i verificar integritat a `localStorage`