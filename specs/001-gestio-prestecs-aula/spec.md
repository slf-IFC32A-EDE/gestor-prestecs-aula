# Especificació funcional: Gestió de Préstecs d'Equipament d'Aula

- **Nom curt de la característica:** `gestio-prestecs-aula`
- **Directori:** `specs/001-gestio-prestecs-aula/spec.md`
- **Estat:** Clarificat i llest per a planificació tècnica (`/speckit.plan`)

## 1. Resum i objectiu

Permetre que el professorat o responsable d'aula gestioni l'inventari d'equipament compartit (portàtils, cables HDMI, plaques Arduino, adaptadors i altres categories personalitzables), registri préstecs a l'alumnat, tramiti devolucions i consulti l'estat de l'equipament i l'historial de préstecs de manera clara, fiable i sense errors.

## Clarifications

### Session 2026-11-25
- Q: Si s'elimina de l'inventari un equip disponible que té préstecs anteriors ja retornats, s'ha de conservar el seu historial de préstecs retornats o esborrar-lo també? → A: Eliminar l'equip de l'inventari actiu però conservar l'historial de préstecs ja retornats.
- Q: Les categories d'equipament han de ser una llista tancada (Portàtil, Cable HDMI, Placa Arduino, Adaptador) o permetre categories lliures o personalitzables? → A: Categories predefinides amb opció d'introduir una categoria personalitzada.
- Q: Es necessita poder editar les dades d'un equip (nom/descripció o categoria) o d'un préstec actiu un cop creat, o només donar d'alta, prestar, retornar i eliminar? → A: Només alta, préstec, devolució i baixa (sense edició posterior).
- Q: En registrar un préstec o una devolució, s'ha d'acceptar una data/hora de sortida o devolució passada (p. ex., anotar un préstec que ha començat o s'ha retornat abans de l'hora actual del sistema)? → A: Permetre dates/hores passades (només exigir devolució igual o posterior a sortida).

## 2. Escenaris d'usuari i proves d'acceptació

### Escenari 1: Alta d'equipament a l'inventari (Prioritat: Alta)
Com a docent o responsable d'aula, vull donar d'alta nous equips amb un codi únic, descripció i categoria (predefinida o personalitzada) perquè apareguin disponibles per a préstec.

- **Criteris d'acceptació:**
  - En introduir un codi identificador únic (p. ex., `PORT-01`, `HDMI-03`), nom/descripció i categoria (seleccionant-ne una de predefinida —Portàtil, Cable HDMI, Placa Arduino, Adaptador— o escrivint-ne una de personalitzada), l'equip es desa amb estat inicial **Disponible**.
  - Si s'intenta registrar un equip amb un codi identificador ja existent (comparant sense distinció de majúscules/minúscules i sense espais inicials o finals), el sistema bloqueja l'alta i mostra un missatge d'error clar.
  - Si falten camps obligatoris (codi, nom/descripció o categoria), no es crea el registre i s'indica quin camp cal completar.

### Escenari 2: Registre de préstec a l'alumnat (Prioritat: Alta)
Com a docent, vull registrar ràpidament quin alumne s'enduu un equip disponible i quan surt per saber qui en té la responsabilitat durant la classe.

- **Criteris d'acceptació:**
  - Seleccionant un equip en estat **Disponible** i indicant el nom de l'alumne, el grup/curs i la data i hora de sortida (proposant l'hora actual per defecte i permetent introduir dates/hores passades), es crea un préstec actiu.
  - En confirmar el préstec, l'estat de l'equip canvia automàticament a **Prestat**.
  - Si un equip ja està **Prestat**, el sistema no permet iniciar un nou préstec sobre aquest mateix equip.

### Escenari 3: Devolució d'equipament (Prioritat: Alta)
Com a docent, vull registrar la devolució d'un equip prestat i anotar-ne la data i hora per tornar-lo a deixar disponible i conservar el registre a l'historial.

- **Criteris d'acceptació:**
  - En marcar un préstec actiu com a retornat i indicar la data i hora de devolució (igual o posterior a la data/hora de sortida, admetent moments passats respecte a l'hora actual), el préstec passa a l'historial de retornats.
  - L'equip associat passa automàticament a l'estat **Disponible** i torna a poder ser prestat.
  - Si la data/hora de devolució introduïda és anterior a la data/hora de sortida del préstec, el sistema rebutja la devolució i mostra un missatge d'error explicatiu.

### Escenari 4: Consulta de disponibilitat, préstecs actius i historial (Prioritat: Mitjana)
Com a docent, vull consultar d'un cop d'ull quins equips estan disponibles, quins estan prestats (amb el nom de l'alumne i el grup) i revisar l'historial de préstecs retornats.

- **Criteris d'acceptació:**
  - Es pot visualitzar l'estat actual de tot l'inventari i filtrar o diferenciar clarament els equips **Disponibles** dels **Prestats** (mostrant qui té cada equip prestat i des de quina data/hora).
  - Es pot accedir a la llista de préstecs retornats amb dades d'equip (codi i descripció), alumne, grup, sortida i devolució, incloent els registres d'equips que hagin estat donats de baixa posteriorment.

### Escenari 5: Baixa d'equips de l'inventari (Prioritat: Mitjana)
Com a docent, vull eliminar de l'inventari un equip que ja no s'utilitza, sempre que no estigui actualment prestat, conservant l'historial de préstecs ja retornats.

- **Criteris d'acceptació:**
  - Si l'equip està **Disponible**, es pot eliminar de l'inventari actiu; els seus préstecs històrics ja retornats es mantenen visibles a l'historial.
  - Si l'equip té un préstec actiu sense retornar, el sistema **prohibeix** eliminar-lo i informa que cal registrar prèviament la devolució.

## 3. Requisits funcionals

- **RF-01 (Inventari — Alta):** El sistema ha de permetre crear fitxes d'equipament amb codi identificador únic, nom/descripció i categoria (predefinida —Portàtil, Cable HDMI, Placa Arduino, Adaptador— o personalitzada), assignant per defecte l'estat `Disponible`.
- **RF-02 (Inventari — Unicitat de codi):** El sistema ha de rebutjar qualsevol alta que generi un codi identificador duplicat (normalitzat sense espais sobrants ni diferència entre majúscules i minúscules).
- **RF-03 (Inventari — Baixa protegida i preservació d'historial):** El sistema ha d'impedir eliminar un equip de l'inventari mentre consti amb un préstec actiu sense retornar. Quan s'elimina un equip `Disponible`, el sistema l'ha de retirar de l'inventari actiu però conservant els seus registres de préstecs ja retornats.
- **RF-04 (Abast sense edició posterior):** L'aplicació limita les operacions de cicle de vida a l'alta, el préstec, la devolució i la baixa d'equips disponibles; no s'inclou l'edició posterior de fitxes d'equip ni de préstecs actius.
- **RF-05 (Préstecs — Creació):** El sistema ha de permetre registrar préstecs associats a un equip `Disponible`, recollint nom de l'alumne, grup/curs i data/hora de sortida (acceptant dates/hores passades o actuals), i actualitzant l'estat de l'equip a `Prestat`.
- **RF-06 (Préstecs — Bloqueig de doble préstec):** El sistema ha d'impedir prestar un equip que ja es trobi en estat `Prestat`.
- **RF-07 (Devolucions i validació temporal):** El sistema ha de permetre tancar un préstec actiu registrant la data i hora de devolució (acceptant dates/hores passades sempre que siguin iguals o posteriors a la data/hora de sortida), movent el registre a l'historial de retornats i retornant l'equip a `Disponible`.
- **RF-08 (Visualització i filtratge):** El sistema ha de mostrar l'estat de l'inventari (`Disponible` / `Prestat`), el detall de l'alumne, grup i sortida en els préstecs actius, i una vista de l'historial de préstecs retornats amb informació autònoma de l'equip.
- **RF-09 (Validació i retroacció):** Totes les accions d'alta, préstec, devolució i baixa han de validar les dades abans d'aplicar canvis i mostrar missatges clars d'èxit o d'error, així com estats buits informatius quan no hi hagi equips, préstecs actius o historial.

## 4. Entitats clau

- **Equip (`Equipament`):**
  - `codi` (identificador únic normalitzat, obligatori)
  - `nom` / `descripcio` (obligatori)
  - `categoria` (string no buit: predefinida o personalitzada, obligatori)
  - `estat` (`Disponible` | `Prestat`)
- **Préstec (`Prestec`):**
  - `id` (identificador intern del préstec)
  - `codiEquip` (referència al codi de l'equip)
  - `nomEquipSnapshot` (nom/descripció de l'equip en el moment del préstec per mantenir l'historial llegible si l'equip es dona de baixa)
  - `categoriaEquipSnapshot` (categoria de l'equip en el moment del préstec)
  - `nomAlumne` (obligatori)
  - `grupCurs` (obligatori)
  - `dataHoraSortida` (obligatori; admet valors passats o actuals)
  - `dataHoraDevolucio` (opcional fins que es retorna; obligatori en retornar i `>= dataHoraSortida`)
  - `estatPrestec` (`Actiu` | `Retornat`)

## 5. Supòsits i restriccions

- **Persistència local i sense dependències externes:** D'acord amb la constitució de **Gestor prestecs aula**, totes les dades es conserven al navegador mitjançant `localStorage`, amb HTML5 semàntic, CSS3 modern i JavaScript Vanilla (