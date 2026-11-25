import {
  carregarEquips,
  guardarEquips,
  carregarPrestecs,
  guardarPrestecs,
} from './storage.js';

const CATEGORIES_PREDEFINIDES = [
  'Portàtil',
  'Cable HDMI',
  'Placa Arduino',
  'Adaptador',
];

let estatFiltre = 'Tots';
let textCerca = '';

export function normalitzarCodi(codi) {
  return String(codi ?? '').trim().toUpperCase();
}

export function obtenirDataHoraLocalActual() {
  const ara = new Date();
  const any = ara.getFullYear();
  const mes = String(ara.getMonth() + 1).padStart(2, '0');
  const dia = String(ara.getDate()).padStart(2, '0');
  const hores = String(ara.getHours()).padStart(2, '0');
  const minuts = String(ara.getMinutes()).padStart(2, '0');
  return `${any}-${mes}-${dia}T${hores}:${minuts}`;
}

function parseDataHoraLocal(valor) {
  if (typeof valor !== 'string' || !valor.trim()) {
    return Number.NaN;
  }
  const timestamp = Date.parse(valor);
  return Number.isNaN(timestamp) ? Number.NaN : timestamp;
}

function escaparText(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function validarNouEquip(dadesEquip, equipsExistents) {
  const errors = [];
  const codi = normalitzarCodi(dadesEquip?.codi);
  const nom = String(dadesEquip?.nom ?? '').trim();
  const categoria = String(dadesEquip?.categoria ?? '').trim();

  if (!codi) {
    errors.push('Cal indicar un codi identificador per a l\'equip.');
  }
  if (!nom) {
    errors.push('Cal indicar el nom o la descripció de l\'equip.');
  }
  if (!categoria) {
    errors.push('Cal seleccionar o introduir una categoria per a l\'equip.');
  }

  if (codi && equipsExistents.some((eq) => normalitzarCodi(eq.codi) === codi)) {
    errors.push(`Ja existeix un equip registrat amb el codi "${codi}".`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    equipNormalitzat: {
      codi,
      nom,
      categoria,
      estat: 'Disponible',
    },
  };
}

export function afegirEquip(dadesEquip) {
  const equips = carregarEquips();
  const validacio = validarNouEquip(dadesEquip, equips);

  if (!validacio.valid) {
    return {
      ok: false,
      message: validacio.errors.join(' '),
    };
  }

  const equipsActualitzats = [...equips, validacio.equipNormalitzat];
  guardarEquips(equipsActualitzats);

  return {
    ok: true,
    message: `Equip "${validacio.equipNormalitzat.codi}" afegit com a Disponible.`,
    equip: validacio.equipNormalitzat,
  };
}

export function validarNouPrestec(dadesPrestec, equips, prestecs) {
  const errors = [];
  const codiEquip = normalitzarCodi(dadesPrestec?.codiEquip);
  const nomAlumne = String(dadesPrestec?.nomAlumne ?? '').trim();
  const grupCurs = String(dadesPrestec?.grupCurs ?? '').trim();
  const dataHoraSortida = String(dadesPrestec?.dataHoraSortida ?? '').trim();

  const equip = equips.find((eq) => normalitzarCodi(eq.codi) === codiEquip);
  if (!equip) {
    errors.push('Cal seleccionar un equip vàlid de l\'inventari.');
  } else if (equip.estat === 'Prestat') {
    errors.push(`L'equip "${equip.codi}" ja es troba en estat Prestat.`);
  }

  if (
    codiEquip &&
    prestecs.some(
      (pr) => normalitzarCodi(pr.codiEquip) === codiEquip && pr.estatPrestec === 'Actiu'
    )
  ) {
    errors.push(`L'equip "${codiEquip}" ja té un préstec actiu sense retornar.`);
  }

  if (!nomAlumne) {
    errors.push('Cal indicar el nom de l\'alumne.');
  }
  if (!grupCurs) {
    errors.push('Cal indicar el grup o curs de l\'alumne.');
  }
  if (Number.isNaN(parseDataHoraLocal(dataHoraSortida))) {
    errors.push('Cal indicar una data i hora de sortida vàlides.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const idSuffix = Math.random().toString(36).slice(2, 6);
  return {
    valid: true,
    errors: [],
    prestec: {
      id: `pr-${Date.now()}-${idSuffix}`,
      codiEquip: equip.codi,
      nomEquipSnapshot: equip.nom,
      categoriaEquipSnapshot: equip.categoria,
      nomAlumne,
      grupCurs,
      dataHoraSortida,
      dataHoraDevolucio: null,
      estatPrestec: 'Actiu',
    },
  };
}

export function registrarPrestec(dadesPrestec) {
  const equips = carregarEquips();
  const prestecs = carregarPrestecs();
  const validacio = validarNouPrestec(dadesPrestec, equips, prestecs);

  if (!validacio.valid) {
    return {
      ok: false,
      message: validacio.errors.join(' '),
    };
  }

  const prestecNou = validacio.prestec;
  const equipsActualitzats = equips.map((eq) =>
    normalitzarCodi(eq.codi) === normalitzarCodi(prestecNou.codiEquip)
      ? { ...eq, estat: 'Prestat' }
      : eq
  );
  const prestecsActualitzats = [prestecNou, ...prestecs];

  guardarEquips(equipsActualitzats);
  guardarPrestecs(prestecsActualitzats);

  return {
    ok: true,
    message: `Préstec registrat per a "${prestecNou.nomAlumne}" (${prestecNou.codiEquip}).`,
    prestec: prestecNou,
  };
}

export function validarDevolucio(idPrestec, dataHoraDevolucio, prestecs) {
  const errors = [];
  const prestec = prestecs.find((pr) => pr.id === idPrestec);

  if (!prestec) {
    errors.push('No s\'ha trobat el préstec indicat.');
    return { valid: false, errors };
  }

  if (prestec.estatPrestec !== 'Actiu') {
    errors.push('Aquest préstec ja consta com a retornat.');
  }

  const tsDevolucio = parseDataHoraLocal(dataHoraDevolucio);
  const tsSortida = parseDataHoraLocal(prestec.dataHoraSortida);

  if (Number.isNaN(tsDevolucio)) {
    errors.push('Cal indicar una data i hora de devolució vàlides.');
  } else if (!Number.isNaN(tsSortida) && tsDevolucio < tsSortida) {
    errors.push('La data i hora de devolució no poden ser anteriors a la data i hora de sortida.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function retornarPrestec(idPrestec, dataHoraDevolucio) {
  const equips = carregarEquips();
  const prestecs = carregarPrestecs();
  const validacio = validarDevolucio(idPrestec, dataHoraDevolucio, prestecs);

  if (!validacio.valid) {
    return {
      ok: false,
      message: validacio.errors.join(' '),
    };
  }

  const prestecObjectiu = prestecs.find((pr) => pr.id === idPrestec);
  const prestecsActualitzats = prestecs.map((pr) =>
    pr.id === idPrestec
      ? {
          ...pr,
          dataHoraDevolucio: String(dataHoraDevolucio).trim(),
          estatPrestec: 'Retornat',
        }
      : pr
  );

  const equipsActualitzats = equips.map((eq) =>
    normalitzarCodi(eq.codi) === normalitzarCodi(prestecObjectiu.codiEquip)
      ? { ...eq, estat: 'Disponible' }
      : eq
  );

  guardarPrestecs(prestecsActualitzats);
  guardarEquips(equipsActualitzats);

  return {
    ok: true,
    message: `Devolució registrada per a l'equip "${prestecObjectiu.codiEquip}". Ara està Disponible.`,
  };
}

export function eliminarEquip(codiEquip) {
  const codiNormalitzat = normalitzarCodi(codiEquip);
  const equips = carregarEquips();
  const prestecs = carregarPrestecs();

  const equip = equips.find((eq) => normalitzarCodi(eq.codi) === codiNormalitzat);
  if (!equip) {
    return {
      ok: false,
      message: `No s'ha trobat l'equip "${codiNormalitzat}" a l'inventari.`,
    };
  }

  const tePrestecActiu = prestecs.some(
    (pr) => normalitzarCodi(pr.codiEquip) === codiNormalitzat && pr.estatPrestec === 'Actiu'
  );

  if (tePrestecActiu || equip.estat === 'Prestat') {
    return {
      ok: false,
      message: `No es pot eliminar l'equip "${equip.codi}" perquè té un préstec actiu sense retornar.`,
    };
  }

  const equipsRestants = equips.filter((eq) => normalitzarCodi(eq.codi) !== codiNormalitzat);
  guardarEquips(equipsRestants);

  return {
    ok: true,
    message: `Equip "${equip.codi}" eliminat de l'inventari. L'historial de préstecs retornats s'ha conservat.`,
  };
}

function mostrarAvis(missatge, tipus = 'success') {
  const banner = document.getElementById('feedback-banner');
  if (!banner) return;
  banner.textContent = missatge;
  banner.className = `feedback-banner ${tipus === 'error' ? 'is-error' : 'is-success'}`;
  banner.hidden = false;
}

function actualitzarResum(equips) {
  const totalEl = document.getElementById('stat-total');
  const dispEl = document.getElementById('stat-disponibles');
  const prestEl = document.getElementById('stat-prestats');

  const disponibles = equips.filter((eq) => eq.estat === 'Disponible').length;
  const prestats = equips.filter((eq) => eq.estat === 'Prestat').length;

  if (totalEl) totalEl.textContent = String(equips.length);
  if (dispEl) dispEl.textContent = String(disponibles);
  if (prestEl) prestEl.textContent = String(prestats);
}

function actualitzarSelectorDisponibles(equips) {
  const selectEl = document.getElementById('prestec-equip');
  if (!selectEl) return;

  const valorPrevi = selectEl.value;
  const disponibles = equips.filter((eq) => eq.estat === 'Disponible');

  selectEl.innerHTML = '<option value="">-- Selecciona un equip disponible --</option>';
  disponibles.forEach((eq) => {
    const option = document.createElement('option');
    option.value = eq.codi;
    option.textContent = `${eq.codi} — ${eq.nom} (${eq.categoria})`;
    selectEl.appendChild(option);
  });

  if (disponibles.some((eq) => eq.codi === valorPrevi)) {
    selectEl.value = valorPrevi;
  }
}

function renderitzarInventari(equips, prestecs) {
  const contenidor = document.getElementById('inventari-contenidor');
  if (!contenidor) return;

  const consulta = textCerca.trim().toLowerCase();
  const equipsFiltrats = equips.filter((eq) => {
    const coincideixEstat = estatFiltre === 'Tots' || eq.estat === estatFiltre;
    const coincideixText =
      !consulta ||
      eq.codi.toLowerCase().includes(consulta) ||
      eq.nom.toLowerCase().includes(consulta) ||
      eq.categoria.toLowerCase().includes(consulta);
    return coincideixEstat && coincideixText;
  });

  if (equipsFiltrats.length === 0) {
    contenidor.innerHTML =
      '<p class="empty-state">No hi ha equips que coincideixin amb el filtre actual.</p>';
    return;
  }

  const araLocal = obtenirDataHoraLocalActual();
  const filesHtml = equipsFiltrats
    .map((eq) => {
      const prestecActiu = prestecs.find(
        (pr) => normalitzarCodi(pr.codiEquip) === normalitzarCodi(eq.codi) && pr.estatPrestec === 'Actiu'
      );
      const badgeClass = eq.estat === 'Disponible' ? 'badge-disponible' : 'badge-prestat';

      const infoPrestec = prestecActiu
        ? `<div class="loan-detail">
             <strong>${escaparText(prestecActiu.nomAlumne)}</strong> (${escaparText(prestecActiu.grupCurs)})
             <small>Sortida: ${escaparText(prestecActiu.dataHoraSortida)}</small>
           </div>`
        : '<span>—</span>';

      const accionsHtml = prestecActiu
        ? `<form class="return-form-inline" data-prestec-id="${escaparText(prestecActiu.id)}">
             <label for="devolucio-${escaparText(prestecActiu.id)}" class="sr-only">Data i hora de devolució</label>
             <input
               id="devolucio-${escaparText(prestecActiu.id)}"
               name="dataHoraDevolucio"
               type="datetime-local"
               value="${escaparText(araLocal)}"
               required
             />
             <button type="submit" class="btn btn-secondary">Retornar</button>
           </form>`
        : `<div class="actions-cell">
             <button type="button" class="btn btn-danger" data-eliminar-codi="${escaparText(eq.codi)}">
               Eliminar
             </button>
           </div>`;

      return `
        <tr>
          <td><strong>${escaparText(eq.codi)}</strong></td>
          <td>${escaparText(eq.nom)}</td>
          <td>${escaparText(eq.categoria)}</td>
          <td><span class="badge ${badgeClass}">${escaparText(eq.estat)}</span></td>
          <td>${infoPrestec}</td>
          <td>${accionsHtml}</td>
        </tr>
      `;
    })
    .join('');

  contenidor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Codi</th>
          <th>Descripció</th>
          <th>Categoria</th>
          <th>Estat</th>
          <th>Préstec actiu</th>
          <th>Accions</th>
        </tr>
      </thead>
      <tbody>${filesHtml}</tbody>
    </table>
  `;
}

function renderitzarHistorial(prestecs) {
  const contenidor = document.getElementById('historial-contenidor');
  if (!contenidor) return;

  const retornats = prestecs.filter((pr) => pr.estatPrestec === 'Retornat');
  if (retornats.length === 0) {
    contenidor.innerHTML =
      '<p class="empty-state">Encara no hi ha préstecs retornats a l\'historial.</p>';
    return;
  }

  const filesHtml = retornats
    .map(
      (pr) => `
        <tr>
          <td><strong>${escaparText(pr.codiEquip)}</strong> — ${escaparText(pr.nomEquipSnapshot)}</td>
          <td>${escaparText(pr.categoriaEquipSnapshot)}</td>
          <td>${escaparText(pr.nomAlumne)}</td>
          <td>${escaparText(pr.grupCurs)}</td>
          <td>${escaparText(pr.dataHoraSortida)}</td>
          <td>${escaparText(pr.dataHoraDevolucio ?? '')}</td>
        </tr>
      `
    )
    .join('');

  contenidor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Equip</th>
          <th>Categoria</th>
          <th>Alumne</th>
          <th>Grup / curs</th>
          <th>Sortida</th>
          <th>Devolució</th>
        </tr>
      </thead>
      <tbody>${filesHtml}</tbody>
    </table>
  `;
}

export function renderitzarTot() {
  const equips = carregarEquips();
  const prestecs = carregarPrestecs();

  actualitzarResum(equips);
  actualitzarSelectorDisponibles(equips);
  renderitzarInventari(equips, prestecs);
  renderitzarHistorial(prestecs);
}

function configurarEsdeveniments() {
  const formAlta = document.getElementById('form-alta-equip');
  const selectCategoria = document.getElementById('equip-categoria');
  const customWrap = document.getElementById('categoria-personalitzada-wrap');
  const inputCategoriaCustom = document.getElementById('equip-categoria-custom');

  selectCategoria?.addEventListener('change', () => {
    const esPersonalitzada = selectCategoria.value === '__CUSTOM__';
    if (customWrap) {
      customWrap.hidden = !esPersonalitzada;
    }
    if (esPersonalitzada) {
      inputCategoriaCustom?.focus();
    }
  });

  formAlta?.addEventListener('submit', (event) => {
    event.preventDefault();
    const codiInput = document.getElementById('equip-codi');
    const nomInput = document.getElementById('equip-nom');

    const categoriaTriada =
      selectCategoria?.value === '__CUSTOM__'
        ? inputCategoriaCustom?.value ?? ''
        : selectCategoria?.value ?? '';

    const resultat = afegirEquip({
      codi: codiInput?.value ?? '',
      nom: nomInput?.value ?? '',
      categoria: categoriaTriada,
    });

    if (!resultat.ok) {
      mostrarAvis(resultat.message, 'error');
      return;
    }

    formAlta.reset();
    if (customWrap) customWrap.hidden = true;
    renderitzarTot();
    mostrarAvis(resultat.message, 'success');
  });

  const formPrestec = document.getElementById('form-prestec');
  const inputSortida = document.getElementById('prestec-sortida');
  if (inputSortida && !inputSortida.value) {
    inputSortida.value = obtenirDataHoraLocalActual();
  }

  formPrestec?.addEventListener('submit', (event) => {
    event.preventDefault();
    const equipSelect = document.getElementById('prestec-equip');
    const alumneInput = document.getElementById('prestec-alumne');
    const grupInput = document.getElementById('prestec-grup');
    const sortidaInput = document.getElementById('prestec-sortida');

    const resultat = registrarPrestec({
      codiEquip: equipSelect?.value ?? '',
      nomAlumne: alumneInput?.value ?? '',
      grupCurs: grupInput?.value ?? '',
      dataHoraSortida: sortidaInput?.value ?? '',
    });

    if (!resultat.ok) {
      mostrarAvis(resultat.message, 'error');
      return;
    }

    formPrestec.reset();
    if (sortidaInput) {
      sortidaInput.value = obtenirDataHoraLocalActual();
    }
    renderitzarTot();
    mostrarAvis(resultat.message, 'success');
  });

  document.querySelectorAll('.filter-btn').forEach((boto) => {
    boto.addEventListener('click', () => {
      estatFiltre = boto.getAttribute('data-estat-filter') || 'Tots';
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
      boto.classList.add('is-active');
      renderitzarTot();
    });
  });

  const inputCerca = document.getElementById('cerca-inventari');
  inputCerca?.addEventListener('input', () => {
    textCerca = inputCerca.value;
    renderitzarTot();
  });

  const inventariContenidor = document.getElementById('inventari-contenidor');
  inventariContenidor?.addEventListener('submit', (event) => {
    const formDevolucio = event.target.closest('.return-form-inline');
    if (!formDevolucio) return;
    event.preventDefault();

    const idPrestec = formDevolucio.getAttribute('data-prestec-id') || '';
    const inputDevolucio = formDevolucio.querySelector('input[name="dataHoraDevolucio"]');
    const resultat = retornarPrestec(idPrestec, inputDevolucio?.value ?? '');

    if (!resultat.ok) {
      mostrarAvis(resultat.message, 'error');
      return;
    }

    renderitzarTot();
    mostrarAvis(resultat.message, 'success');
  });

  inventariContenidor?.addEventListener('click', (event) => {
    const botoEliminar = event.target.closest('[data-eliminar-codi]');
    if (!botoEliminar) return;

    const codiEquip = botoEliminar.getAttribute('data-eliminar-codi') || '';
    const resultat = eliminarEquip(codiEquip);

    if (!resultat.ok) {
      mostrarAvis(resultat.message, 'error');
      return;
    }

    renderitzarTot();
    mostrarAvis(resultat.message, 'success');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  configurarEsdeveniments();
  renderitzarTot();
});

export { CATEGORIES_PREDEFINIDES };