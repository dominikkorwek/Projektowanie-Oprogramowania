export function validateThresholdFormat(data) {
  const errors = [];
  if (!data?.thresholdValue || Number.isNaN(Number.parseFloat(data.thresholdValue))) {
    errors.push('Wartość progowa musi być liczbą.');
  }
  if (!data?.condition) {
    errors.push('Warunek musi być wybrany.');
  }
  if (!data?.warningMessage || String(data.warningMessage).trim().length === 0) {
    errors.push('Komunikat ostrzegawczy nie może być pusty.');
  }
  return { isValid: errors.length === 0, errors };
}

export function validateThresholdBusiness(data, sensor) {
  const errors = [];
  const thresholdValue = Number.parseFloat(data?.thresholdValue);

  // Zachowujemy zasady z frontu (historycznie były dla temperature/humidity/pressure)
  if (sensor?.type === 'temperature' && (thresholdValue < -50 || thresholdValue > 100)) {
    errors.push('Temperatura musi być w zakresie -50°C do 100°C.');
  }
  if (sensor?.type === 'humidity' && (thresholdValue < 0 || thresholdValue > 100)) {
    errors.push('Wilgotność musi być w zakresie 0% do 100%.');
  }
  if (sensor?.type === 'pressure' && (thresholdValue < 0 || thresholdValue > 2000)) {
    errors.push('Ciśnienie musi być w zakresie 0 do 2000 hPa.');
  }

  return { isValid: errors.length === 0, errors };
}

