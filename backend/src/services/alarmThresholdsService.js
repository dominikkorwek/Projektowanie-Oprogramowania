/**
 * @module alarmThresholdsService
 * @description Service for managing alarm thresholds with validation.
 * Handles CRUD operations and enforces both format and business rule validation.
 */

import { create, getById, list, patch, remove } from '../storage/repository.js';
import { validateThresholdBusiness, validateThresholdFormat } from './validation/alarmThresholdValidation.js';

/**
 * Lists all alarm thresholds, optionally filtered by query.
 * @param {Object} [query={}] - Optional query parameters to filter thresholds
 * @returns {Promise<Array<Object>>} Array of alarm threshold objects
 * @example
 * // Get all thresholds
 * const allThresholds = await listAlarmThresholds();
 * 
 * // Get thresholds for specific sensor
 * const sensorThresholds = await listAlarmThresholds({ sensorId: '123' });
 */
export async function listAlarmThresholds(query = {}) {
  return list('alarmThresholds', query);
}

/**
 * Creates a new alarm threshold with validation.
 * Validates both format (data types) and business rules (threshold within sensor limits).
 * @param {Object} payload - Threshold data
 * @param {string|number} payload.sensorId - ID of the sensor
 * @param {string|number} payload.thresholdValue - Threshold value
 * @param {string} payload.condition - Condition operator (e.g., '>', '<', '=')
 * @param {string} payload.warningMessage - Warning message to display
 * @returns {Promise<Object>} Result object with properties: ok (boolean), data (Object), status (number), errors (Array<string>), errorType (string)
 * @example
 * const result = await createAlarmThreshold({
 *   sensorId: '1',
 *   thresholdValue: 25,
 *   condition: '>',
 *   warningMessage: 'Temperature too high'
 * });
 */
export async function createAlarmThreshold(payload) {
  const { sensorId, thresholdValue, condition, warningMessage } = payload || {};
  const sensor = await getById('sensors', sensorId);
  if (!sensor) {
    return { ok: false, status: 400, errors: ['Nie znaleziono sensora.'] };
  }

  const format = validateThresholdFormat({ thresholdValue, condition, warningMessage });
  if (!format.isValid) return { ok: false, status: 400, errors: format.errors, errorType: 'format' };

  const biz = validateThresholdBusiness({ thresholdValue, condition, warningMessage }, sensor);
  if (!biz.isValid) return { ok: false, status: 400, errors: biz.errors, errorType: 'business' };

  const created = await create('alarmThresholds', {
    sensorId: String(sensorId),
    thresholdValue: String(thresholdValue),
    condition: String(condition),
    warningMessage: String(warningMessage),
    createdAt: new Date().toISOString(),
  });
  return { ok: true, data: created };
}

/**
 * Updates an existing alarm threshold with validation.
 * Validates both format and business rules after merging with existing data.
 * @param {string|number} id - Threshold ID to update
 * @param {Object} payload - Partial threshold data to update
 * @returns {Promise<Object>} Result object with properties: ok (boolean), data (Object), status (number), errors (Array<string>), errorType (string)
 * @example
 * const result = await updateAlarmThreshold('123', { thresholdValue: 30 });
 */
export async function updateAlarmThreshold(id, payload) {
  const existing = await getById('alarmThresholds', id);
  if (!existing) return { ok: false, status: 404, errors: ['Nie znaleziono progu alarmowego.'] };

  const next = { ...existing, ...payload };
  const sensor = await getById('sensors', next.sensorId);
  if (!sensor) {
    return { ok: false, status: 400, errors: ['Nie znaleziono sensora.'] };
  }

  const format = validateThresholdFormat(next);
  if (!format.isValid) return { ok: false, status: 400, errors: format.errors, errorType: 'format' };

  const biz = validateThresholdBusiness(next, sensor);
  if (!biz.isValid) return { ok: false, status: 400, errors: biz.errors, errorType: 'business' };

  const updated = await patch('alarmThresholds', id, {
    ...payload,
    updatedAt: new Date().toISOString(),
  });
  return { ok: true, data: updated };
}

/**
 * Deletes an alarm threshold by ID.
 * @param {string|number} id - Threshold ID to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 * @example
 * const deleted = await deleteAlarmThreshold('123');
 */
export async function deleteAlarmThreshold(id) {
  const ok = await remove('alarmThresholds', id);
  return ok;
}

