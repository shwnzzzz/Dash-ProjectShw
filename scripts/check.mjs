import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const downloads=path.join(root,'downloads');
const manifest=JSON.parse(await fs.readFile(path.join(downloads,'android.json'),'utf8'));
assert.match(manifest.version,/^\d+\.\d+\.\d+$/);
assert.match(manifest.filename,/^[a-z0-9._-]+\.apk$/i);
assert.ok(manifest.parts.length>0&&manifest.parts.length<=32);
const used=new Set();const hash=createHash('sha256');let total=0;
for(const part of manifest.parts){
 assert.match(part.url,/^\.\/dash-[0-9.]+-android-\d+\.part$/);
 assert.ok(!used.has(part.url),'Parte duplicada');used.add(part.url);
 const bytes=await fs.readFile(path.join(downloads,part.url));
 assert.equal(bytes.length,part.size);assert.ok(part.size>0&&part.size<=4*1024*1024,'Parte acima de 4 MiB');
 if(total===0)assert.equal(bytes.readUInt16LE(0),0x4b50,'Cabeçalho de APK inválido');
 total+=bytes.length;hash.update(bytes);
}
assert.equal(total,manifest.size);assert.equal(hash.digest('hex'),manifest.sha256);
assert.equal((await fs.readFile(path.join(downloads,'SHA256SUMS.txt'),'utf8')).trim(),manifest.sha256+'  '+manifest.filename);
await fs.access(path.join(root,'.nojekyll'));
for(const name of ['index.html','baixar.html']){
 const html=await fs.readFile(path.join(root,name),'utf8');assert.ok(html.includes('Versão '+manifest.version));
 for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  const ref=match[1];if(ref.startsWith('#')||/^[a-z]+:/i.test(ref))continue;
  const target=path.resolve(root,ref.split(/[?#]/)[0]);assert.ok(target.startsWith(root+path.sep),'Caminho fora do site');await fs.access(target);
 }
}
let files=0;let largest=0;
async function walk(directory){for(const entry of await fs.readdir(directory,{withFileTypes:true})){if(entry.name==='.git'||entry.name==='node_modules')continue;const file=path.join(directory,entry.name);if(entry.isDirectory())await walk(file);else{assert.ok(!entry.isSymbolicLink(),'Link simbólico fora do pacote');const stat=await fs.stat(file);assert.ok(stat.size<25*1024*1024,'Arquivo acima de 25 MiB: '+entry.name);largest=Math.max(largest,stat.size);files++;}}}
await walk(root);
console.log(`Site válido: ${files} arquivos; maior arquivo ${(largest/1024/1024).toFixed(2)} MiB; APK ${manifest.version} em ${manifest.parts.length} partes; SHA-256 conferido.`);
