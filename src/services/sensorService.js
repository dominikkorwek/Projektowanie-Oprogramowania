import { db } from '../database/dbClient.js';

export const sensorService = {
  /**
   * Pobierz dostępne typy danych i sensory
   * @returns {Promise<{dataTypes: Array, sensors: Array}>}
   */
  async getAvailableSensors() {
    const data = await db.fetchMultiple(['dataTypes', 'sensors']);
    
    return {
      dataTypes: data.dataTypes,
      sensors: data.sensors
    };
  },

  /**
   * Pobierz pojedynczy sensor po ID
   * @param {number|string} id - ID sensora
   * @returns {Promise<Object>}
   */
  async getSensorById(id) {
    return db.sensors.findById(id);
  },

  /**
   * Pobierz wszystkie typy danych
   * @returns {Promise<Array>}
   */
  async getDataTypes() {
    return db.dataTypes.findAll();
  },

  /**
   * Pobierz wszystkie sensory
   * @returns {Promise<Array>}
   */
  async getSensors() {
    return db.sensors.findAll();
  },

  /**
   * Zapisz progi alarmowe i warunki
   * @param {number|string} sensorId - ID sensora
   * @param {object} thresholdData - Dane progów alarmowych
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async saveAlarmThresholds(sensorId, thresholdData) {
    await db.alarmThresholds.create({
      sensorId,
      ...thresholdData,
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Progi alarmowe i warunki ostrzegania zostały pomyślnie zapisane w bazie danych.'
    };
  },

  /**
   * Pobierz progi alarmowe dla sensora
   * @param {number|string} sensorId - ID sensora
   * @returns {Promise<Array>}
   */
  async getAlarmThresholds(sensorId) {
    return db.alarmThresholds.findBy('sensorId', sensorId);
  },

  /**
   * Pobierz wszystkie progi alarmowe
   * @returns {Promise<Array>}
   */
  async getAllAlarmThresholds() {
    return db.alarmThresholds.findAll();
  },

  /**
   * Aktualizuj próg alarmowy
   * @param {number|string} id - ID progu
   * @param {object} thresholdData - Nowe dane progu
   * @returns {Promise<Object>}
   */
  async updateAlarmThreshold(id, thresholdData) {
    return db.alarmThresholds.patch(id, {
      ...thresholdData,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Usuń próg alarmowy
   * @param {number|string} id - ID progu
   * @returns {Promise<boolean>}
   */
  async deleteAlarmThreshold(id) {
    return db.alarmThresholds.delete(id);
  },

  /**
   * Walidacja danych (formatowanie)
   * @param {object} data - Dane do walidacji
   * @returns {{isValid: boolean, errors: Array}}
   */
  validateFormat(data) {
    const errors = [];
    
    if (!data.thresholdValue || isNaN(parseFloat(data.thresholdValue))) {
      errors.push('Wartość progowa musi być liczbą.');
    }
    
    if (!data.condition) {
      errors.push('Warunek musi być wybrany.');
    }
    
    if (!data.warningMessage || data.warningMessage.trim().length === 0) {
      errors.push('Komunikat ostrzegawczy nie może być pusty.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Walidacja biznesowa
   * @param {object} data - Dane do walidacji
   * @param {object} sensor - Obiekt sensora
   * @returns {{isValid: boolean, errors: Array}}
   */
  validateBusiness(data, sensor) {
    const errors = [];
    const thresholdValue = parseFloat(data.thresholdValue);
    
    // Reguły biznesowe dla różnych typów sensorów
    if (sensor.type === 'temperature' && (thresholdValue < -50 || thresholdValue > 100)) {
      errors.push('Temperatura musi być w zakresie -50°C do 100°C.');
    }
    
    if (sensor.type === 'humidity' && (thresholdValue < 0 || thresholdValue > 100)) {
      errors.push('Wilgotność musi być w zakresie 0% do 100%.');
    }
    
    if (sensor.type === 'pressure' && (thresholdValue < 0 || thresholdValue > 2000)) {
      errors.push('Ciśnienie musi być w zakresie 0 do 2000 hPa.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
