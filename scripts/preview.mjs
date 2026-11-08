import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.ttf': 'font/ttf', '.part': 'application/octet-stream' };
http.createServer((request, response) => {
    try {
        let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); if (pathname.endsWith('/')) pathname += 'index.html';
        let file = path.resolve(root, '.' + pathname); if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
        if (!fs.existsSync(file) && !path.extname(file) && fs.existsSync(file + '.html')) file += '.html';
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end('Arquivo não encontrado.'); return; }
        response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(file).pipe(response);
    } catch { response.writeHead(400).end('Endereço inválido.'); }
}).listen(8080, '127.0.0.1', () => console.log('Prévia do site: http://127.0.0.1:8080'));
