import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [input, version] = process.argv.slice(2);
if (!input || !/^\d+\.\d+\.\d+$/.test(version || '')) { console.error('Uso: node scripts/update-apk.mjs "caminho/aplicativo.apk" 2.8.2'); process.exit(1); }
if (path.extname(input).toLowerCase() !== '.apk') throw new Error('Escolha um arquivo .apk.');
const bytes = await fs.readFile(path.resolve(input));
if (!bytes.length || bytes.length > 100 * 1024 * 1024 || bytes.readUInt16LE(0) !== 0x4b50) throw new Error('APK inválido ou acima de 100 MiB.');
const directory = path.join(root, 'downloads'); await fs.mkdir(directory, { recursive: true });
const parts = []; const size = 4 * 1024 * 1024;
for (let offset = 0, index = 1; offset < bytes.length; offset += size, index++) {
    const chunk = bytes.subarray(offset, offset + size); const name = `dash-${version}-android-${String(index).padStart(2, '0')}.part`;
    await fs.writeFile(path.join(directory, name), chunk); parts.push({ url: './' + name, size: chunk.length });
}
const keep = new Set(parts.map(part => path.basename(part.url)));
for (const name of await fs.readdir(directory)) if (/^dash-[0-9.]+-android-\d+\.part$/.test(name) && !keep.has(name)) await fs.unlink(path.join(directory, name));
const filename = `DASH-${version}-Android.apk`; const sha256 = createHash('sha256').update(bytes).digest('hex');
await fs.writeFile(path.join(directory, 'android.json'), JSON.stringify({ version, filename, size: bytes.length, sha256, parts }, null, 2) + '\n');
await fs.writeFile(path.join(directory, 'SHA256SUMS.txt'), sha256 + '  ' + filename + '\n');
for (const name of ['index.html', 'baixar.html']) {
    const file = path.join(root, name); try { const html = await fs.readFile(file, 'utf8'); await fs.writeFile(file, html.replace(/Versão \d+\.\d+\.\d+/g, 'Versão ' + version).replace(/data-apk-size>\d+ MB/g, 'data-apk-size>' + Math.ceil(bytes.length / 1000000) + ' MB')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log(`APK ${version} preparado em ${parts.length} partes de até 4 MiB. Rode npm run check antes de enviar ao GitHub.`);
