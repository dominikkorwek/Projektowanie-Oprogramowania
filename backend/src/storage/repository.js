import { JsonDb } from './jsonDb.js';

const db = new JsonDb();

function normalizeId(v) {
  return String(v);
}

function matchQuery(obj, query) {
  const keys = Object.keys(query || {});
  if (keys.length === 0) return true;
  return keys.every((k) => String(obj?.[k]) === String(query[k]));
}

function ensureTable(dbObj, table) {
  if (!dbObj[table]) dbObj[table] = [];
  if (!Array.isArray(dbObj[table])) throw new Error(`Tabela '${table}' nie jest tablicą`);
}

function nextId(records) {
  const maxId = records.reduce((max, r) => {
    const n = Number.parseInt(r?.id, 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return String(maxId + 1);
}

export async function list(table, query = {}) {
  const dbObj = await db.read();
  const records = Array.isArray(dbObj[table]) ? dbObj[table] : [];
  return records.filter((r) => matchQuery(r, query));
}

export async function getById(table, id) {
  const dbObj = await db.read();
  const records = Array.isArray(dbObj[table]) ? dbObj[table] : [];
  return records.find((r) => normalizeId(r.id) === normalizeId(id)) || null;
}

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

