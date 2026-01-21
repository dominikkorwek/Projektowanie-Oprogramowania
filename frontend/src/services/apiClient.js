const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Reusable HTTP request helper.
 * Handles all HTTP communication with the backend API.
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/sensors', '/alarmThresholds')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} Response data or boolean for DELETE requests
 * @throws {Error} If the request fails
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  // Handle DELETE which may not return JSON
  if (options.method === 'DELETE') {
    return response.ok;
  }
  
  if (!response.ok) {
    // Try to get error details from response
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.errors = errorData.errors || [];
    error.errorType = errorData.errorType;
    throw error;
  }
  
  return response.json();
}

/**
 * API client for communicating with the backend.
 * Provides methods for all API endpoints.
 */
export const apiClient = {
  // Sensors
  getAvailableSensors: () => request('/sensors/available'),
  getSensorById: (id) => request(`/sensors/${id}`),
  getSensors: () => request('/sensors'),
  getDataTypes: () => request('/dataTypes'),
  
  // Alarm Thresholds
  getAlarmThresholds: (params) => request(`/alarmThresholds?${new URLSearchParams(params || {})}`),
  createAlarmThreshold: (data) => request('/alarmThresholds', { method: 'POST', body: JSON.stringify(data) }),
  updateAlarmThreshold: (id, data) => request(`/alarmThresholds/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAlarmThreshold: (id) => request(`/alarmThresholds/${id}`, { method: 'DELETE' }),
  
  // Diagnostic Tests
  getDiagnosticTests: () => request('/diagnosticTests'),
  runDiagnostics: (sensors) => request('/diagnosticTests/run', { method: 'POST', body: JSON.stringify({ sensors }) }),
  
  // Recommendations
  getRecommendations: () => request('/recommendations'),
  createRecommendation: (data) => request('/recommendations', { method: 'POST', body: JSON.stringify(data) }),
  deleteRecommendation: (id) => request(`/recommendations/${id}`, { method: 'DELETE' }),
  
  // User Data Analysis
  getUserDataSummaries: () => request('/userDataSummaries'),
  getAnalysisTypes: () => request('/analysisTypes'),
  
  // Other
  getMeasurements: () => request('/measurements'),
  getAlerts: () => request('/alerts'),
  
  // Air Quality Statistics
  getAirQualityStats: (rangeStart) => {
    const params = rangeStart ? `?rangeStart=${rangeStart.toISOString()}` : '';
    return request(`/airQualityStats${params}`);
  },
};

