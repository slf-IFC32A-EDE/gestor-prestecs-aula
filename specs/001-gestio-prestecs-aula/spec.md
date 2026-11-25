# Especificació funcional: Gestió de Préstecs d'Equipament d'Aula

**Projecte:** Gestor prestecs aula  
**Branca / Identificador:** `001-gestio-prestecs-aula`  
**Data de creació:** 2026-11-25  
**Estat:** Esborrany validat (llest per a planificació tècnica)

---

## 1. Visió general

L'aplicació **Gestor prestecs aula** permet al professorat i al personal responsable d'aula controlar de manera àgil, clara i sense errors l'inventari d'equipament compartit (portàtils, cables HDMI, plaques Arduino, adaptadors, etc.), els préstecs actius a l'alumnat i l'historial de devolucions.

El sistema garanteix la integritat de les dades mitjançant validacions estrictes abans de desar cap registre i conserva tota la informació de forma persistent al navegador sense dependre de connexió a servidors externs.

---

## 2. Escenaris d'usuari i proves d'acceptació

### Escenari 1: Alta d'equipament a l'inventari (Prioritat: P1)
Com a docent o responsable d'aula, vull donar d'alta nous equips amb un codi identificador únic, nom/descripció i categoria perquè passin a formar part de l'inventari disponible per prestar.

- **Per què aquesta prioritat:** Sense equipament registrat no es poden gestionar préstecs.
- **Prova independent:** Es pot verificar donant d'alta un equip nou i comprovant que apareix al llistat amb estat `Disponible`, així com intentant registrar un codi duplicat i comprovant que el sistema ho impedeix.
- **Escenaris d'acceptació:**
  1. **Donat** que el formulari d'alta d'equip té un codi únic (ex. `PORT-01`), un nom/descripció (ex. `Portàtil Dell Latitude`) i una categoria (ex. `Portàtils`), **quan** l'usuari confirma l'alta, **aleshores** l'equip s'afegeix a l'inventari amb l'estat `Disponible` i es mostra una confirmació visual.
  2. **Donat** que ja existeix un equip amb el codi `PORT-01` (independentment de majúscules, minúscules o espais inicials/finals), **quan** s'intenta registrar un altre equip amb el mateix codi, **aleshores** el sistema rebutja l'operació, no desa res i mostra un missatge d'error explicatiu.
  3. **Donat** que falta algun camp obligatori (codi, nom/descripció o categoria), **quan** s'intenta desar l'equip, **aleshores** el sistema marca l'error de validació i impedeix l'alta.

---

### Escenari 2: Registre de préstec d'un equip disponible (Prioritat: P1)
Com a docent, vull registrar ràpidament el préstec d'un equip disponible a un alumne (indicant nom, grup/curs i data/hora de sortida) perquè quedi constància de qui en té la responsabilitat.

- **Per què aquesta prioritat:** És l'operació principal de l'ús diari a l'aula.
- **Prova independent:** Seleccionar un equip `Disponible`, omplir les dades de l'alumne i verificar que l'equip passa automàticament a `Prestat` i apareix als préstecs actius.
- **Escenaris d'acceptació:**
  1. **Donat** un equip en estat `Disponible`, **quan** el docent registra un préstec amb nom de l'alumne, grup/curs i data/hora de sortida vàlids, **aleshores** es crea un préstec actiu i l'estat de l'equip passa automàticament a `Prestat`.
  2. **Donat** un equip que ja es troba en estat `Prestat`, **quan** es consulta el selector o formulari de préstecs, **aleshores** l'equip no es pot tornar a prestar fins que sigui retornat.
  3. **Donat** que el nom de l'alumne, el grup/curs o la data/hora de sortida estan buits o tenen format invàlid, **quan** s'intenta confirmar el préstec, **aleshores** es mostra un error de validació clar i no s'altera l'estat de l'equip.

---

### Escenari 3: Devolució d'equipament prestat (Prioritat: P1)
Com a docent, vull marcar un préstec actiu com a retornat registrant la data i hora de devolució perquè l'equip torni a estar disponible i el moviment quedi desat a l'historial.

- **Per què aquesta prioritat:** Tanca el cicle de vida del préstec i allibera el recurs per a altres alumnes.
- **Prova independent:** Marcar com a retornat un préstec actiu i verificar que l'equip torna a `Disponible` i el registre passa a l'historial de retornats.
- **Escenaris d'acceptació:**
  1. **Donat** un préstec actiu sobre l'equip `PORT-01`, **quan** el docent registra la devolució amb una data i hora vàlides (iguals o posteriors a la sortida), **aleshores** el préstec passa a estat `Retornat`, es desa a l'historial i l'equip `PORT-01` torna automàticament a `Disponible`.
  2. **Donat** que la data/hora de devolució introduïda és anterior a la data/hora de sortida del préstec, **quan** s'intenta confirmar la devolució, **aleshores** el sistema bloqueja l'acció i mostra un missatge d'error coherent.

---

### Escenari 4: Consulta, estat en temps real i filtratge (Prioritat: P2)
Com a docent, vull veure d'un cop d'ull quins equips estan disponibles, quins estan prestats (i quin alumne/grup els té) i consultar l'historial de préstecs retornats.

- **Per què aquesta prioritat:** Facilita la supervisió ràpida al principi, durant i al final de la sessió d'aula.
- **Prova independent:** Amb diversos equips en diferents estats i préstecs retornats, aplicar els filtres de vista i comprovar que cada vista mostra exactament els registres corresponents.
- **Escenaris d'acceptació:**
  1. **Donat** un conjunt d'equips registrats, **quan** el docent consulta el panell principal, **aleshores** pot distingir clarament els equips `Disponibles` dels `Prestats` i filtrar per estat, categoria o cerca per codi/nom/alumne.
  2. **Donat** un equip en estat `Prestat`, **quan** es visualitza a la llista de préstecs actius o a l'inventari, **aleshores** es mostra el nom de l'alumne, el grup/curs i la data/hora de sortida.
  3. **Donat** que s'han completat devolucions, **quan** l'usuari accedeix a la vista d'historial, **aleshores** es llisten els préstecs retornats ordenats cronològicament amb equip, alumne, grup/curs, sortida i devolució.

---

### Escenari 5: Eliminació segura d'equips de l'inventari (Prioritat: P2)
Com a docent, vull poder eliminar un equip de l'inventari quan es doni de baixa material, sempre que no tingui un préstec actiu pendent de retorn.

- **Per què aquesta prioritat:** Evita perdre la traçabilitat d'equips que encara estan en mans d'un alumne.
- **Prova independent:** Intentar eliminar un equip prestat (ha de fallar) i eliminar un equip disponible (ha de permetre-ho prèvia confirmació).
- **Escenaris d'acceptació:**
  1. **Donat** un equip en estat `Prestat` (amb un préstec actiu sense retornar), **quan** l'usuari intenta eliminar-lo de l'inventari, **aleshores** el sistema bloqueja l'eliminació i informa que primer cal registrar-ne la devolució.
  2. **Donat** un equip en estat `Disponible`, **quan** l'usuari sol·licita eliminar-lo i ho confirma, **aleshores** l'equip s'elimina de l'inventari actiu sense trencar la visualització dels registres històrics ja retornats.

---

## 3. Casos límit i regles de negoci crítiques

- **Unicitat estricta del codi d'equip:** El codi identificador (ex. `PORT-01`) s'ha de normalitzar (eliminant espais als extrems i comparant sense distinció de majúscules/minúscules) per impedir duplicats com `port-01` i `PORT-01`.
- **Bloqueig de doble préstec:** Un equip en estat `Prestat` no pot tenir mai més d'un préstec actiu simultàniament.
- **Protecció contra esborrat amb préstec actiu:** Cap equip amb préstec en curs (`Actiu`) pot ser eliminat de l'inventari.
- **Coherència cronològica:** La data i hora de devolució d'un préstec no pot ser mai anterior a la data i hora de sortida.
- **Estat buit i dades persistents:** Si no hi ha equips o préstecs registrats, la interfície ha de mostrar missatges informatius clars (estat buit) en lloc de taules trencades o errors. Tots els canvis han de quedar desats immediatament al navegador.

---

## 4. Requisits funcionals

- **RF-01:** El sistema HA de permetre donar d'alta equips indicant codi identificador únic, nom/descripció i categoria (com a mínim: Portàtils, Cables HDMI, Plaques Arduino, Adaptadors i Altres), assignant l'estat inicial `Disponible`.
- **RF-02:** El sistema HA de validar que el codi identificador no estigui buit ni duplicat abans de crear cap equip.
- **RF-03:** El sistema HA de permetre registrar un préstec associat a un equip `Disponible` recollint: nom de l'alumne, grup/curs i data/hora de sortida.
- **RF-04:** En confirmar un préstec vàlid, el sistema HA de canviar automàticament l'estat de l'equip a `Prestat`.
- **RF-05:** El sistema HA d'impedir iniciar un préstec sobre un equip que ja estigui en estat `Prestat`.
- **RF-06:** El sistema HA de permetre registrar la devolució d'un préstec actiu indicant la data i hora de devolució (proposant per defecte la data/hora actual i validant que sigui $\ge$ a la de sortida).
- **RF-07:** En confirmar una devolució vàlida, el sistema HA de marcar el préstec com a `Retornat`, incorporar-lo a l'historial i retornar l'equip a l'estat `Disponible`.
- **RF-08:** El sistema HA d'oferir vistes i filtres per consultar: (a) inventari complet amb filtre per estat (`Tots`, `Disponible`, `Prestat`) i categoria, (b) préstecs actius amb detall d'alumne i grup/curs, i (c) historial de préstecs retornats.
- **RF-09:** El sistema HA d'impedir eliminar de l'inventari qualsevol equip que tingui un préstec actiu sense retornar, mostrant un missatge d'error clar.
- **RF-10:** Totes les operacions de creació, préstec, devolució i eliminació HAN de validar les dades d'entrada i mostrar retroacció visual accessible (missatges d'error o confirmació).

---

## 5. Entitats de dades

### Equip (`Equipament`)
- **`codi`**: Cadena de text única i obligatòria (identificador visible, ex. `PORT-01`).
- **`nom`**: Cadena de text obligatòria amb el nom o descripció curta de l'equip.
- **`categoria`**: Cadena de text obligatòria que classifica l'equip (ex. `Portàtils`, `Cables HDMI`, `Plaques Arduino`, `Adaptadors`, `Altres`).
- **`estat`**: Valor controlat (`Disponible` | `Prestat`).

### Préstec (`Prestec`)
- **`id`**: Identificador únic intern del registre de préstec.
- **`codiEquip`**: Referència al `codi` de l'equip prestat.
- **`nomAlumne`**: Cadena de text obligatòria amb el nom i cognoms de l'alumne.
- **`grupCurs`**: Cadena de text obligatòria amb el grup o curs de l'alumne (ex. `1r DAW`, `2n SMX`).
- **`dataHoraSortida`**: Marca temporal ISO (`YYYY-MM-DDTHH:mm`) obligatòria.
- **`dataHoraDevolucio`**: Marca temporal ISO (`YYYY-MM-DDTHH:mm`) nul·la mentre el préstec és actiu i obligatòria quan es retorna.
- **`estatPrestec`**: Valor controlat (`Actiu` | `Retornat`).

---

## 6. Supòsits i restriccions de governança

- **Restriccions arquitectòniques (Constitució v1.0.0):** L'aplicació s'ha de construir exclusivament amb HTML5 semàntic, CSS3 modern sense frameworks externs i JavaScript Vanilla (ES6+), amb persistència al 100 % en `localStorage` i sense cap llibreria de tercers.
- **Traçabilitat històrica en eliminar equips disponibles:** Si s'elimina un equip `Disponible` que havia estat prestat en el passat, l'historial de préstecs retornats conserva la referència original (`codiEquip` i descripció en el moment del préstec o etiqueta informativa) per no perdre el registre històric d'aula.
- **Ús monousuari per navegador:** S'assumeix que la gestió es fa des del navegador del docent o equip d'aula sense autenticació externa.

---

## 7. Criteris d'èxit

- **CE-01 (Agilitat operativa):** Un docent pot registrar l'alta d'un equip o formalitzar un nou préstec en menys de 30 segons.
- **CE-02 (Integritat garantida):** El 100 % dels intents de crear codis duplicats, prestar equips ja prestats o eliminar equips amb préstecs actius són bloquejats abans de modificar les dades i mostren un missatge comprensible.
- **CE-03 (Visibilitat immediata):** El docent pot identificar en menys de 10 segons quins equips estan disponibles, quins estan prestats i quin alumne/grup té cada equip.
- **CE-04 (Persistència fiable):** El 100 % de l'inventari, els préstecs actius i l'historial de devolucions es conserven intactes després de tancar o recarregar el navegador.