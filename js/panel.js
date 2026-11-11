'use strict';

function renderDashboard(documents) {
  const counts = [
    documents.length,
    documents.filter((doc) => ['En proceso', 'Derivado'].includes(doc.status)).length,
    documents.filter((doc) => doc.status === 'Atendido').length,
    documents.filter((doc) => doc.status === 'Pendiente').length
  ];
  counts.forEach((count, index) => { byId('metric-' + index).textContent = count; });
  renderRows(documents.slice(0, 5));
  const breakdown = byId('status-breakdown');
  breakdown.innerHTML = Array.from(states, ([label, tone]) => {
    const count = documents.filter((doc) => doc.status === label).length;
    return '<div class="distribution-row"><div>' + badge(label) + '<strong>' + count +
      '</strong></div><progress class="' + tone + '" value="' + count + '" max="' + Math.max(documents.length, 1) +
      '" aria-label="' + escapeHtml(label) + '"></progress></div>';
  }).join('');
  const recent = documents.flatMap((doc) => doc.history.toReversed().map((movement) => ({ doc, movement })))
    .sort((a, b) => b.movement.date.localeCompare(a.movement.date)).slice(0, 3);
  byId('activity').innerHTML = recent.map(({ doc, movement }) => '<div class="activity-item"><span class="dot" aria-hidden="true"></span><div>' +
    '<b>' + escapeHtml(movement.status) + '</b><p><a href="' + detailUrl(doc.id) + '">' + escapeHtml(doc.id) + '</a> · ' + escapeHtml(doc.subject) +
    '</p><time datetime="' + escapeHtml(movement.date) + '">' + escapeHtml(dateLabel(movement.date)) + ' · ' + escapeHtml(movement.area) +
    '</time></div></div>').join('');
}

startScreen(renderDashboard);
