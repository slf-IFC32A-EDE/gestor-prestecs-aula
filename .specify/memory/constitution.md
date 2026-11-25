<!--
Sync Impact Report:
- Version change: [NEW] -> 1.0.0
- Modified principles: N/A (initial constitution ratified for Gestor prestecs aula)
- Added sections: Principis fonamentals (5 principis), Governança
- Removed sections: None
- Follow-up TODOs: None
-->

# Constitució de Gestor prestecs aula

## Principis fonamentals

### I. Stack tecnològic estricte
El projecte HA d'utilitzar exclusivament HTML5 semàntic, CSS3 modern (sense frameworks externs) i JavaScript Vanilla (ES6+). Es PROHÍBEIX introduir preprocessadors o frameworks d'interfície o d'estils que alterin l'arquitectura base sense una esmena formal a aquesta constitució.

### II. Persistència local al navegador
Tota la persistència de dades HA de produir-se al 100 % al navegador mitjançant `localStorage`. El projecte NO pot dependre de cap backend, servidor d'aplicacions ni base de dades externa per funcionar o conservar l'estat de l'usuari.

### III. Qualitat, modularitat i separació de responsabilitats
El codi HA de mantenir una separació estricta entre estructura (`HTML`), presentació (`CSS`) i lògica i dades (`JavaScript`). Els mòduls han de ser petits i reutilitzables, i tots els noms de variables, constants i funcions HAN de ser descriptius i coherents amb el domini del projecte.

### IV. Experiència d'usuari i validació prèvia
La interfície HA de ser neta, accessible, responsiva en diferents mides de pantalla i proporcionar validació clara d'errors abans de desar o processar qualsevol dada. L'usuari HA de rebre missatges d'error comprensibles quan una entrada no sigui vàlida, evitant desar dades corruptes o incompletes.

### V. Restricció estricta d'abast i dependències
Queda PROHIBIDA la instal·lació o incorporació de llibreries o paquets de tercers (inclosos, a tall d'exemple, React, Bootstrap o jQuery). Qualsevol excepció requereix revisar i esmenar explícitament aquesta constitució abans d'afegir dependències.

## Governança

Aquesta constitució governa les decisions tècniques i de qualitat de **Gestor prestecs aula** i preval sobre pràctiques informals o drecers de desenvolupament.

- **Procediment d'esmena:** Qualsevol canvi en els principis o en l'abast requereix documentar la proposta, justificar-ne l'impacte i actualitzar aquest fitxer juntament amb `LAST_AMENDED_DATE` i `CONSTITUTION_VERSION`.
- **Política de versionat:** El número de versió segueix l'esquema `MAJOR.MINOR.PATCH`:
  - `MAJOR`: Eliminació o redefinició incompatible d'un principi o regla de governança.
  - `MINOR`: Addició d'un nou principi o ampliació substancial de les directrius existents.
  - `PATCH`: Aclariments de redacció, correccions ortogràfiques o ajustos no semàntics.
- **Revisió de compliment:** Cada canvi o entrega s'HA de revisar contra els principis I a V per assegurar que no s'afegeixen dependències prohibides, es manté la separació HTML/CSS/JS, es valida abans de desar a `localStorage` i es respecta la responsivitat i l'accessibilitat.

**Versió**: 1.0.0 | **Ratificació**: 2026-11-25 | **Darrera modificació**: 2026-11-25