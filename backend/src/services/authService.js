import crypto from 'node:crypto';
import { list } from '../storage/repository.js';

function sha256Hex(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}

export async function login({ login, password }) {
  const l = String(login || '').trim();
  if (!l) return { ok: false, status: 400, message: 'Niepoprawne dane: login nie może być pusty' };

  const users = await list('users', { login: l });
  if (!users || users.length === 0) return { ok: false, status: 401, message: 'Niepoprawny login lub hasło' };

  const user = users[0];
  const hash = sha256Hex(password || '');
  if (hash !== user.passwordHash) return { ok: false, status: 401, message: 'Niepoprawny login lub hasło' };

  return { ok: true, data: { id: user.id, login: user.login } };
}

