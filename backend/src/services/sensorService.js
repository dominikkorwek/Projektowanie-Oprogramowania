import { list, getById } from '../storage/repository.js';

/**
 * Get available sensors with data types combined.
 * Fetches both dataTypes and sensors in parallel and returns them as a single object.
 * 
 * @returns {Promise<{dataTypes: Array, sensors: Array}>}
 */
export async function getAvailableSensors() {
  const [dataTypes, sensors] = await Promise.all([
    list('dataTypes'),
    list('sensors')
  ]);
  
  return {
    dataTypes,
    sensors
  };
}

/**
 * Get a single sensor by ID.
 * 
 * @param {string|number} id - Sensor ID
 * @returns {Promise<Object|null>}
 */
export async function getSensorById(id) {
  return getById('sensors', id);
}

/**
 * Get all data types.
 * 
 * @returns {Promise<Array>}
 */
export async function getDataTypes() {
  return list('dataTypes');
}

/**
 * Get all sensors.
 * 
 * @returns {Promise<Array>}
 */
export async function getSensors() {
  return list('sensors');
}

