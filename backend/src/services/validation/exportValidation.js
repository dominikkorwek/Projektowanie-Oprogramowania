/**
 * @module exportValidation
 * @description Validation logic for export parameters.
 */

/**
 * Validates export parameters including measurements, sensors, dates, and format.
 * 
 * @param {Object} params - Export parameters
 * @param {Array<string>} [params.measurements] - Selected measurement types
 * @param {Array<string>} [params.sensors] - Selected sensor IDs
 * @param {string} [params.from] - Start date in ISO format
 * @param {string} [params.to] - End date in ISO format
 * @param {string} [params.format] - Export format ('pdf' or 'csv')
 * @returns {{isValid: boolean, errors: Array<string>}} Validation result with error messages
 * @example
 * const result = validateExportParams({
 *   measurements: ['temperature'],
 *   sensors: ['1', '2'],
 *   from: '2024-01-01',
 *   to: '2024-01-31',
 *   format: 'pdf'
 * });
 */
export function validateExportParams(params) {
  const errors = [];

  // Check if measurements and sensors are selected
  if (!params.measurements || params.measurements.length === 0) {
    errors.push('Proszę wybrać co najmniej jedną mierzoną wielkość');
  }

  if (!params.sensors || params.sensors.length === 0) {
    errors.push('Proszę wybrać co najmniej jeden czujnik');
  }

  // Validate date range
  if (!params.from || !params.to) {
    errors.push('Proszę podać zakres dat');
  } else {
    const fromDate = new Date(params.from);
    const toDate = new Date(params.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      errors.push('Nieprawidłowy format daty');
    } else if (fromDate > toDate) {
      errors.push('Data "Od" nie może być późniejsza niż "Do"');
    }
  }

  // Validate format
  if (params.format && !['pdf', 'csv'].includes(params.format.toLowerCase())) {
    errors.push('Nieprawidłowy format eksportu');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
