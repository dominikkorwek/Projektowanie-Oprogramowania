/**
 * @module jsonDb
 * @description JSON database implementation with atomic writes and mutex locking.
 * Provides safe concurrent access to a JSON file-based database.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { resolveDbPath } from './dbPath.js';
import { Mutex } from './mutex.js';

const mutex = new Mutex();

/**
 * Reads and parses a JSON file.
 * @private
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON object
 * @throws {Error} If file cannot be read or parsed
 */
async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Writes JSON data to a file atomically using a temporary file.
 * This ensures the database is never corrupted even if the process crashes during write.
 * @private
 * @param {string} filePath - Target file path
 * @param {Object} data - Data to write
 * @returns {Promise<void>}
 */
async function writeJsonFileAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `.db.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`);
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(tmpPath, json, 'utf8');
  await fs.rename(tmpPath, filePath);
}

/**
 * JSON database class providing safe read/write operations.
 * Uses mutex locking to prevent race conditions and atomic writes for data integrity.
 * @class
 */
export class JsonDb {
  /**
   * Creates a new JsonDb instance.
   * @param {string} [dbPath] - Path to database file (defaults to resolved path from config)
   */
  constructor(dbPath = resolveDbPath()) {
    this.dbPath = dbPath;
  }

  /**
   * Reads the entire database.
   * @returns {Promise<Object>} Database object
   * @example
   * const db = new JsonDb();
   * const data = await db.read();
   */
  async read() {
    return readJsonFile(this.dbPath);
  }

  /**
   * Updates database under an in-process mutex and writes atomically.
   * The mutator function receives the current database and should return the modified version.
   * @param {function(Object): (Object|Promise<Object>)} mutator - Function that modifies the database
   * @returns {Promise<Object>} Updated database object
   * @example
   * await db.update((data) => {
   *   data.users.push({ id: '1', name: 'John' });
   *   return data;
   * });
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

