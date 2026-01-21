import { list } from '../storage/repository.js';

/**
 * Calculates mean value for a specific sensor type within a date range.
 * 
 * @param {string} sensorType - The type of sensor (e.g., 'pm2_5', 'temperature')
 * @param {Date} rangeStart - Start of the date range
 * @returns {Promise<number|null>} Mean value or null if no data
 */
export async function calculateMeanForSensorType(sensorType, rangeStart) {
  const [sensors, measurements] = await Promise.all([
    list('sensors'),
    list('measurements')
  ]);

  const relevantSensorIds = sensors
    .filter(s => s.type === sensorType)
    .map(s => String(s.id));

  const vals = measurements
    .filter(m => relevantSensorIds.includes(String(m.sensorId)))
    .filter(m => new Date(m.timestamp) >= rangeStart)
    .map(m => parseFloat(m.value))
    .filter(v => Number.isFinite(v));

  if (vals.length === 0) return null;
  
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/**
 * Gets statistics for all sensor types within a date range.
 * 
 * @param {Date} rangeStart - Start of the date range
 * @returns {Promise<Object>} Object with sensor type keys and mean values
 */
export async function getAirQualityStats(rangeStart) {
  const sensors = await list('sensors');
  const sensorTypes = [...new Set(sensors.map(s => s.type))];
  
  const stats = {};
  for (const type of sensorTypes) {
    stats[type] = await calculateMeanForSensorType(type, rangeStart);
  }
  
  return stats;
}

