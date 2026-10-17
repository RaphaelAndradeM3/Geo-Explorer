import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track, TracksDatabase } from '../types/index.js';

let cachedDatabase: TracksDatabase | null = null;

export function getDatabasePath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);

  // In source mode (src/data/loader.ts) vs dist mode (dist/data/loader.js)
  const candidatePaths = [
    path.join(currentDir, 'trails.json'),
    path.join(currentDir, '..', 'data', 'trails.json'),
    path.join(currentDir, '..', '..', 'src', 'data', 'trails.json'),
    path.join(process.cwd(), 'src', 'data', 'trails.json'),
    path.join(process.cwd(), 'dist', 'data', 'trails.json')
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Base de dados de trilhas não encontrada. Tentados caminhos: ${candidatePaths.join(', ')}`);
}

export function loadDatabase(): TracksDatabase {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  const dbPath = getDatabasePath();
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  cachedDatabase = JSON.parse(rawData) as TracksDatabase;
  return cachedDatabase;
}

export function getTracks(): Track[] {
  return loadDatabase().tracks;
}
