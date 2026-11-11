'use strict';

function optionList(values, current) {
  return [...values].map((value) => '<option' + (value === current ? ' selected' : '') + '>' + escapeHtml(value) + '</option>').join('');
}

function setupDetail(documents) {
  const id = params.get('id');
  if (!id) return;
  const doc = findDoc(documents, id);
  if (!doc) {
    byId('detail').innerHTML = '<p class="notice">No se encontró el expediente solicitado. Puedes buscarlo en la lista de documentos.</p>';
    return;
  }
  const message = params.has('nuevo') ? 'Documento registrado correctamente.' : '';
  byId('detail').innerHTML =
    '<p class="notice" id="detail-notice" role="status"' + (message ? '' : ' hidden') + '>' + message + '</p>' +
    panel(doc.id, facts([
      ['Asunto', doc.subject, true], ['Remitente', doc.sender], ['Tipo de documento', doc.type], ['Área responsable', doc.area],
      ['Fecha de registro', dateLabel(doc.date)], ['Prioridad', doc.priority], ['Observaciones', doc.notes || 'Sin observaciones', true]
    ]) + '<div class="form-actions"><a class="btn secondary" href="' + trackUrl(doc.id) + '">Consultar seguimiento →</a></div>', badge(doc.status)) +
    timeline(doc) +
    panel('Actualizar trámite',
      '<form id="update-form"><div class="formgrid">' +
      '<label class="field"><span>Estado</span><select name="status">' + optionList(states.keys(), doc.status) + '</select></label>' +
      '<label class="field"><span>Área responsable</span><select name="area">' + optionList(areas, doc.area) + '</select></label>' +
      '<label class="field full"><span>Nota del movimiento</span><textarea name="notes" maxlength="600" rows="3"></textarea></label>' +
      '</div><p id="update-feedback" class="error" role="alert" hidden></p><div class="form-actions"><button class="btn" type="submit">Guardar movimiento</button></div></form>');

  byId('update-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const current = loadDocuments();
    const latest = findDoc(current, doc.id);
    const data = new FormData(event.currentTarget);
    const status = data.get('status');
    const area = data.get('area');
    const notes = data.get('notes').trim();
    const feedback = byId('update-feedback');
    if (!latest || !states.has(status) || !areas.includes(area)) return;
    if (status === latest.status && area === latest.area && !notes) {
      showFeedback(feedback, 'Cambia el estado o área, o añade una nota al movimiento.');
      return;
    }
    const updated = { ...latest, status, area, history: [...latest.history, { date: today(), status, area, notes }] };
    const next = current.map((item) => item.id === doc.id ? updated : item);
    if (saveDocuments(next, feedback)) {
      setupDetail(next);
      showFeedback(byId('detail-notice'), 'Movimiento guardado correctamente.');
      byId('detail-notice').setAttribute('tabindex', '-1');
      byId('detail-notice').focus();
    }
  });
}

startScreen(setupDetail);
