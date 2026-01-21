import path from 'node:path';

/**
 * Resolves the path to the JSON database file.
 *
 * Default: <repo-root>/db.json (when backend runs from backend/).
 * Can be overridden via DB_PATH env var.
 */
export function resolveDbPath() {
  if (process.env.DB_PATH && process.env.DB_PATH.trim()) {
    return path.resolve(process.env.DB_PATH.trim());
  }
  // backend/ -> repo root
  return path.resolve(process.cwd(), '..', 'db.json');
}

