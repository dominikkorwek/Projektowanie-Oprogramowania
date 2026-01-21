import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveDbPath } from './dbPath.js';
import { Mutex } from './mutex.js';

const mutex = new Mutex();

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJsonFileAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `.db.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`);
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(tmpPath, json, 'utf8');
  await fs.rename(tmpPath, filePath);
}

export class JsonDb {
  constructor(dbPath = resolveDbPath()) {
    this.dbPath = dbPath;
  }

  async read() {
    return readJsonFile(this.dbPath);
  }

  /**
   * Updates database under an in-process mutex and writes atomically.
   * @param {(db: any) => any|Promise<any>} mutator
   */
  async update(mutator) {
    return mutex.runExclusive(async () => {
      const db = await this.read();
      const next = await mutator(db);
      await writeJsonFileAtomic(this.dbPath, next);
      return next;
    });
  }
}

