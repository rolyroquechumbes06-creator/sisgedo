'use strict';

function normalize(value) {
  return value.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function setupList(documents) {
  const search = byId('search');
  const status = byId('filter-status');
  let result = [];
  const update = () => {
    const query = normalize(search.value);
    result = documents.filter((doc) => (!status.value || doc.status === status.value) &&
      normalize([doc.id, doc.subject, doc.sender, doc.area].join(' ')).includes(query));
    renderRows(result);
    byId('export-csv').disabled = result.length === 0;
    byId('result-count').textContent = result.length + ' de ' + documents.length + ' expedientes';
  };
  search.addEventListener('input', update);
  status.addEventListener('change', update);
  byId('clear').addEventListener('click', () => {
    search.value = '';
    status.value = '';
    update();
    search.focus();
  });
  byId('export-csv').addEventListener('click', () => downloadCsv(result));
  update();
}

function downloadCsv(documents) {
  const headings = ['Expediente', 'Asunto', 'Remitente', 'Área', 'Fecha', 'Estado', 'Prioridad'];
  const rows = documents.map(({ id, subject, sender, area, date, status, priority }) =>
    [id, subject, sender, area, date, status, priority]);
  const csv = [headings, ...rows].map((row) => row.map(csvField).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SISGEDO-expedientes-' + today() + '.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvField(value) {
  const content = String(value ?? '');
  const safe = /^[\s\uFEFF]*[=+@-]/.test(content) ? "'" + content : content;
  return '"' + safe.replaceAll('"', '""') + '"';
}

startScreen(setupList);
