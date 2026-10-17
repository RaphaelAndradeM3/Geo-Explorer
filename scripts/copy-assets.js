import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('src/data/trails.json');
const destDir = path.resolve('dist/data');
const dest = path.join(destDir, 'trails.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('[build] trails.json copiado com sucesso para dist/data/');
}
