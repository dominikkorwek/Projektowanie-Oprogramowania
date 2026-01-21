/**
 * @module repository
 * @description Repository pattern implementation for database abstraction.
 * Provides CRUD operations for database tables with automatic ID generation.
 */

import { JsonDb } from './jsonDb.js';

const db = new JsonDb();

/**
 * Normalizes ID to string format for consistent comparison.
 * @private
 * @param {*} v - Value to normalize
 * @returns {string} Normalized ID as string
 */
function normalizeId(v) {
  return String(v);
}

/**
 * Checks if an object matches all key-value pairs in a query.
 * @private
 * @param {Object} obj - Object to check
 * @param {Object} query - Query object with key-value pairs
 * @returns {boolean} True if object matches all query conditions
 */
function matchQuery(obj, query) {
  const keys = Object.keys(query || {});
  if (keys.length === 0) return true;
  return keys.every((k) => String(obj?.[k]) === String(query[k]));
}

/**
 * Ensures a table exists in the database object and is an array.
 * @private
 * @param {Object} dbObj - Database object
 * @param {string} table - Table name
 * @throws {Error} If table exists but is not an array
 */
function ensureTable(dbObj, table) {
  if (!dbObj[table]) dbObj[table] = [];
  if (!Array.isArray(dbObj[table])) throw new Error(`Tabela '${table}' nie jest tablicą`);
}

/**
 * Generates next available ID for a table based on existing records.
 * @private
 * @param {Array<Object>} records - Existing records in the table
 * @returns {string} Next available ID as string
 */
function nextId(records) {
  const maxId = records.reduce((max, r) => {
    const n = Number.parseInt(r?.id, 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return String(maxId + 1);
}

/**
 * Lists all records in a table, optionally filtered by query.
 * @param {string} table - Table name
 * @param {Object} [query={}] - Optional query object to filter records
 * @returns {Promise<Array<Object>>} Array of matching records
 * @example
 * // Get all sensors
 * const sensors = await list('sensors');
 * 
 * // Get sensors with specific type
 * const tempSensors = await list('sensors', { type: 'temperature' });
 */
export async function list(table, query = {}) {
  const dbObj = await db.read();
  const records = Array.isArray(dbObj[table]) ? dbObj[table] : [];
  return records.filter((r) => matchQuery(r, query));
}

/**
 * Gets a single record by ID.
 * @param {string} table - Table name
 * @param {string|number} id - Record ID
 * @returns {Promise<Object|null>} Record object or null if not found
 * @example
 * const sensor = await getById('sensors', '123');
 */
export async function getById(table, id) {
  const dbObj = await db.read();
  const records = Array.isArray(dbObj[table]) ? dbObj[table] : [];
  return records.find((r) => normalizeId(r.id) === normalizeId(id)) || null;
}

/**
 * Creates a new record in a table.
 * Automatically generates an ID if not provided in data.
 * @param {string} table - Table name
 * @param {Object} data - Record data (id will be auto-generated if not provided)
 * @returns {Promise<Object>} Created record with ID
 * @example
 * const newSensor = await create('sensors', { name: 'Temp Sensor', type: 'temperature' });
 */
export async function create(table, data) {
  let created;
  await db.update((dbObj) => {
    ensureTable(dbObj, table);
    const records = dbObj[table];
    const id = data?.id ? String(data.id) : nextId(records);
    created = { ...data, id };
    records.push(created);
    return dbObj;
  });
  return created;
}

/**
 * Updates a record by ID with partial data.
 * Only updates fields provided in partial object.
 * @param {string} table - Table name
 * @param {string|number} id - Record ID to update
 * @param {Object} partial - Partial data to update
 * @returns {Promise<Object|null>} Updated record or null if not found
 * @example
 * const updated = await patch('sensors', '123', { name: 'New Name' });
 */
export async function patch(table, id, partial) {
  let updated = null;
  await db.update((dbObj) => {
    ensureTable(dbObj, table);
    const records = dbObj[table];
    const idx = records.findIndex((r) => normalizeId(r.id) === normalizeId(id));
    if (idx === -1) return dbObj;
    updated = { ...records[idx], ...partial, id: String(records[idx].id) };
    records[idx] = updated;
    return dbObj;
  });
  return updated;
}

/**
 * Removes a record from a table by ID.
 * @param {string} table - Table name
 * @param {string|number} id - Record ID to remove
 * @returns {Promise<boolean>} True if record was removed, false if not found
 * @example
 * const removed = await remove('sensors', '123');
 */
export async function remove(table, id) {
  let removed = false;
  await db.update((dbObj) => {
    ensureTable(dbObj, table);
    const records = dbObj[table];
    const before = records.length;
    dbObj[table] = records.filter((r) => normalizeId(r.id) !== normalizeId(id));
    removed = dbObj[table].length !== before;
    return dbObj;
  });
  return removed;
}

