
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let route;
  try {
    route = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const file = path.resolve(__dirname, '.' + (route === '/' ? '/index.html' : route));
  const type = types[path.extname(file)];
  if (!file.startsWith(__dirname + path.sep) || !type) {
    response.writeHead(404).end();
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  });
});

const port = 8765;
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? 'El puerto 8765 ya está en uso.' : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log('SISGEDO disponible en http://127.0.0.1:' + port + '/'));

