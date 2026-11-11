'use strict';

function nextId(documents, date) {
  const prefix = 'EXP-' + date.slice(0, 4) + '-';
  const max = documents.reduce((highest, doc) => doc.id.startsWith(prefix)
    ? Math.max(highest, Number(doc.id.slice(prefix.length)))
    : highest, 0);
  return prefix + String(max + 1).padStart(5, '0');
}

function setupRegistration() {
  byId('register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = Object.fromEntries([...data].map(([key, value]) => [key, value.trim()]));
    if (!fields.subject || !fields.sender) {
      showFeedback(byId('feedback'), 'Completa el remitente y el asunto del documento.');
      return;
    }
    const documents = loadDocuments();
    const date = today();
    const id = nextId(documents, date);
    const entry = {
      ...fields, id, date, status: 'Pendiente',
      history: [{ date, status: 'Pendiente', area: 'Mesa de partes', notes: 'Documento registrado' }]
    };
    if (saveDocuments([entry, ...documents], byId('feedback'))) {
      location.href = detailUrl(id) + '&nuevo=1';
    }
  });
}

startScreen(setupRegistration);
