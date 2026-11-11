'use strict';

const demo = [
  ['00128', 'Solicitud de constancia de estudios', 'María Quispe', 'Secretaría Académica', '2026-11-09', 'En proceso', 'Solicitud'],
  ['00127', 'Requerimiento de materiales', 'Área de Computación', 'Administración', '2026-11-08', 'Derivado', 'Oficio'],
  ['00126', 'Informe de actividades académicas', 'Coordinación Académica', 'Dirección General', '2026-11-08', 'Atendido', 'Informe'],
  ['00125', 'Solicitud de prácticas preprofesionales', 'José Ramos', 'Unidad de Bienestar', '2026-11-07', 'En proceso', 'Solicitud'],
  ['00124', 'Actualización de datos institucionales', 'Oficina de Informática', 'Dirección General', '2026-11-06', 'Pendiente', 'Memorando']
].map(([sequence, subject, sender, area, date, status, type]) => ({
  id: 'EXP-2026-' + sequence, subject, sender, area, date, status, type,
  priority: 'Normal', notes: '',
  history: [
    { date, status: 'Pendiente', area: 'Mesa de partes', notes: 'Documento registrado' },
    ...(status === 'Pendiente' ? [] : [{ date, status, area, notes: 'Actualización de demostración' }])
  ]
}));

const states = new Map([['Pendiente', 'gray'], ['En proceso', 'orange'], ['Derivado', 'blue'], ['Atendido', 'green']]);
const areas = ['Dirección General', 'Secretaría Académica', 'Administración', 'Área de Computación', 'Mesa de partes', 'Unidad de Bienestar'];
const docsKey = 'sisgedo-argentina-documentos-v1';
const roleKey = 'sisgedo-argentina-perfil';
const byId = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const detailUrl = (id) => '06_detalle.html?id=' + encodeURIComponent(id);
const trackUrl = (id) => '05_seguimiento.html?id=' + encodeURIComponent(id);

function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => entities[char]);
}

function today() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
}

function dateLabel(date) {
  return date.split('-').reverse().join('/');
}

function loadDocuments() {
  try {
    const saved = localStorage.getItem(docsKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error('Formato de datos desconocido');
      return parsed;
    }
    return demo;
  } catch {
    const warning = byId('storage-warning');
    if (warning) {
      warning.textContent = 'No se pudieron leer los datos del navegador. Se muestran los expedientes de demostración.';
      warning.hidden = false;
    }
    return demo;
  }
}

function saveDocuments(documents, feedback) {
  try {
    localStorage.setItem(docsKey, JSON.stringify(documents));
    return true;
  } catch {
    showFeedback(feedback, 'No se pudo guardar. Habilita el almacenamiento del navegador y vuelve a intentarlo.');
    return false;
  }
}

function showFeedback(element, text) {
  element.textContent = text;
  element.hidden = false;
}

function profile(value) {
  try {
    if (value === '') sessionStorage.removeItem(roleKey);
    else if (value) sessionStorage.setItem(roleKey, value);
    return sessionStorage.getItem(roleKey);
  } catch {
    return null;
  }
}

function badge(status) {
  return '<span class="tag ' + (states.get(status) ?? 'gray') + '">' + escapeHtml(status) + '</span>';
}

function renderRows(documents) {
  byId('rows').innerHTML = documents.map((doc) => '<tr>' +
    '<td><a class="docid" href="' + detailUrl(doc.id) + '">' + escapeHtml(doc.id) + '</a></td>' +
    '<td>' + escapeHtml(doc.subject) + '</td><td>' + escapeHtml(doc.sender) + '</td>' +
    '<td>' + escapeHtml(doc.area) + '</td><td>' + escapeHtml(dateLabel(doc.date)) + '</td>' +
    '<td>' + badge(doc.status) + '</td><td><a href="' + detailUrl(doc.id) + '" aria-label="Ver ' + escapeHtml(doc.id) + '">Ver →</a></td></tr>'
  ).join('') || '<tr><td colspan="7">No se encontraron expedientes.</td></tr>';
}

function facts(fields) {
  return '<dl class="facts">' + fields.map(([label, value, full]) =>
    '<div' + (full ? ' class="full"' : '') + '><dt>' + label + '</dt><dd>' + escapeHtml(value) + '</dd></div>').join('') + '</dl>';
}

function panel(title, content, action = '') {
  return '<section class="panel"><div class="panel-head"><h2>' + escapeHtml(title) + '</h2>' + action + '</div><div class="panel-body">' + content + '</div></section>';
}

function timeline(doc) {
  return panel('Historial del trámite', '<ol class="timeline">' + doc.history.toReversed().map((move) =>
    '<li><strong>' + escapeHtml(move.status) + '</strong><p><time datetime="' + escapeHtml(move.date) + '">' +
    escapeHtml(dateLabel(move.date)) + '</time> · ' + escapeHtml(move.area) + '</p>' +
    (move.notes ? '<p>' + escapeHtml(move.notes) + '</p>' : '') + '</li>').join('') + '</ol>');
}

function findDoc(documents, id) {
  return documents.find((doc) => doc.id === id.trim().toUpperCase());
}

function startScreen(render) {
  const role = profile();
  if (!role && location.protocol !== 'file:') {
    location.replace('01_login.html');
    return;
  }
  const currentRole = role || 'Administrador';
  byId('role').textContent = currentRole;
  byId('avatar').textContent = currentRole === 'Administrador' ? 'AD' : 'MP';
  byId('logout').addEventListener('click', () => profile(''));
  render(loadDocuments());
}

addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload();
});
