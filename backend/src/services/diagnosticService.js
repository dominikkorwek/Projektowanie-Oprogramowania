import { create, patch, list } from '../storage/repository.js';

/**
 * Simulates running diagnostic tests on sensors.
 * Creates a diagnostic test entry, simulates the diagnostic process,
 * and updates the entry with results.
 * 
 * @param {Array} sensors - Array of sensors to diagnose
 * @returns {Promise<Object>} The completed diagnostic test result
 */
export async function runDiagnostics(sensors) {
  const currentDate = new Date().toISOString();
  
  // Create initial "diagnosing" entry
  const diagnosingEntry = await create('diagnosticTests', {
    date: currentDate,
    errorType: 'Diagnozowanie...',
    status: 'diagnosing'
  });
  
  // Simulate diagnostic process (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate diagnostic results
  const allGreen = Math.random() > 0.5;
  const sensorResults = sensors.map(sensor => ({
    id: sensor.id,
    name: sensor.name,
    status: allGreen ? 'ok' : (Math.random() > 0.5 ? 'ok' : 'error')
  }));
  
  // Ensure at least one error if not all green
  if (!allGreen && !sensorResults.some(s => s.status === 'error')) {
    sensorResults[0].status = 'error';
  }
  
  const hasErrors = sensorResults.some(r => r.status === 'error');
  const testResult = {
    date: currentDate,
    errorType: hasErrors ? 'TYP BŁĘDU' : 'Brak błędów',
    status: hasErrors ? 'error' : 'ok',
    sensorResults
  };
  
  // Update the diagnostic test entry
  const updated = await patch('diagnosticTests', diagnosingEntry.id, testResult);
  
  return updated;
}

/**
 * Get all diagnostic tests, sorted by date descending.
 * 
 * @returns {Promise<Array>} Array of diagnostic tests
 */
export async function getDiagnosticTests() {
  const tests = await list('diagnosticTests');
  return tests.sort((a, b) => new Date(b.date) - new Date(a.date));
}

