import { create, getById, list, patch, remove } from '../storage/repository.js';
import { validateThresholdBusiness, validateThresholdFormat } from './validation/alarmThresholdValidation.js';

export async function listAlarmThresholds(query = {}) {
  return list('alarmThresholds', query);
}

export async function createAlarmThreshold(payload) {
  const { sensorId, thresholdValue, condition, warningMessage } = payload || {};
  const sensor = await getById('sensors', sensorId);
  if (!sensor) {
    return { ok: false, status: 400, errors: ['Nie znaleziono sensora.'] };
  }

  const format = validateThresholdFormat({ thresholdValue, condition, warningMessage });
  if (!format.isValid) return { ok: false, status: 400, errors: format.errors };

  const biz = validateThresholdBusiness({ thresholdValue, condition, warningMessage }, sensor);
  if (!biz.isValid) return { ok: false, status: 400, errors: biz.errors };

  const created = await create('alarmThresholds', {
    sensorId: String(sensorId),
    thresholdValue: String(thresholdValue),
    condition: String(condition),
    warningMessage: String(warningMessage),
    createdAt: new Date().toISOString(),
  });
  return { ok: true, data: created };
}

export async function updateAlarmThreshold(id, payload) {
  const existing = await getById('alarmThresholds', id);
  if (!existing) return { ok: false, status: 404, errors: ['Nie znaleziono progu alarmowego.'] };

  const next = { ...existing, ...payload };
  const sensor = await getById('sensors', next.sensorId);
  if (!sensor) {
    return { ok: false, status: 400, errors: ['Nie znaleziono sensora.'] };
  }

  const format = validateThresholdFormat(next);
  if (!format.isValid) return { ok: false, status: 400, errors: format.errors };

  const biz = validateThresholdBusiness(next, sensor);
  if (!biz.isValid) return { ok: false, status: 400, errors: biz.errors };

  const updated = await patch('alarmThresholds', id, {
    ...payload,
    updatedAt: new Date().toISOString(),
  });
  return { ok: true, data: updated };
}

export async function deleteAlarmThreshold(id) {
  const ok = await remove('alarmThresholds', id);
  return ok;
}

