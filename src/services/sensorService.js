// Symulacja serwisu do pobierania danych z bazy
// W przyszłości będzie to prawdziwe API call

export const sensorService = {
  // Symulacja opóźnienia sieci
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Pobierz dostępne typy danych i sensory
  async getAvailableSensors() {
    await this.delay(500) // Symulacja opóźnienia
    
    // Przykładowe dane - w przyszłości będą z API
    return {
      dataTypes: [
        { id: 1, name: 'Temperatura', type: 'temperature' },
        { id: 2, name: 'Wilgotność', type: 'humidity' },
        { id: 3, name: 'Ciśnienie', type: 'pressure' },
        { id: 4, name: 'Poziom wody', type: 'water_level' },
        { id: 5, name: 'Prędkość wiatru', type: 'wind_speed' },
        { id: 6, name: 'Kierunek wiatru', type: 'wind_direction' },
        { id: 7, name: 'Natężenie światła', type: 'light_intensity' },
      ],
      sensors: [
        { id: 1, name: 'Sensor 1', type: 'sensor_1' },
        { id: 2, name: 'Sensor 2', type: 'sensor_2' },
        { id: 3, name: 'Sensor 3', type: 'sensor_3' },
        { id: 4, name: 'Sensor 4', type: 'sensor_4' },
        { id: 5, name: 'Sensor 5', type: 'sensor_5' },
        { id: 6, name: 'Sensor 6', type: 'sensor_6' },
        { id: 7, name: 'Sensor 7', type: 'sensor_7' },
      ]
    }
  },

  // Zapisz progi alarmowe i warunki
  async saveAlarmThresholds(sensorId, thresholdData) {
    await this.delay(800) // Symulacja opóźnienia
    
    // Symulacja zapisu - w przyszłości będzie to prawdziwe API call
    console.log('Zapisywanie progów alarmowych:', { sensorId, thresholdData })
    
    return {
      success: true,
      message: 'Progi alarmowe i warunki ostrzegania zostały pomyślnie zapisane w bazie danych.'
    }
  },

  // Walidacja danych (formatowanie)
  validateFormat(data) {
    const errors = []
    
    if (!data.thresholdValue || isNaN(parseFloat(data.thresholdValue))) {
      errors.push('Wartość progowa musi być liczbą.')
    }
    
    if (!data.condition) {
      errors.push('Warunek musi być wybrany.')
    }
    
    if (!data.warningMessage || data.warningMessage.trim().length === 0) {
      errors.push('Komunikat ostrzegawczy nie może być pusty.')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Walidacja biznesowa
  validateBusiness(data, sensor) {
    const errors = []
    const thresholdValue = parseFloat(data.thresholdValue)
    
    // Przykładowe reguły biznesowe
    if (sensor.type === 'temperature' && (thresholdValue < -50 || thresholdValue > 100)) {
      errors.push('Temperatura musi być w zakresie -50°C do 100°C.')
    }
    
    if (sensor.type === 'humidity' && (thresholdValue < 0 || thresholdValue > 100)) {
      errors.push('Wilgotność musi być w zakresie 0% do 100%.')
    }
    
    if (sensor.type === 'pressure' && (thresholdValue < 0 || thresholdValue > 2000)) {
      errors.push('Ciśnienie musi być w zakresie 0 do 2000 hPa.')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

