'use strict';

function setupTracking(documents) {
  const code = byId('code');
  const render = () => {
    const doc = findDoc(documents, code.value);
    byId('track-result').innerHTML = doc
      ? panel(doc.id, facts([['Asunto', doc.subject], ['Área responsable', doc.area], ['Fecha de registro', dateLabel(doc.date)]]) +
        '<div class="form-actions"><a class="btn secondary" href="' + detailUrl(doc.id) + '">Ver ficha completa →</a></div>', badge(doc.status)) + timeline(doc)
      : '<p class="notice">No se encontró el expediente. Revisa el código e intenta de nuevo.</p>';
  };
  byId('track-form').addEventListener('submit', (event) => { event.preventDefault(); render(); });
  if (params.get('id')) { code.value = params.get('id'); render(); }
}

startScreen(setupTracking);
