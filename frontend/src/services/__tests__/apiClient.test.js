import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make GET request to correct endpoint', async () => {
      const mockData = [{ id: '1', name: 'Test' }];
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const result = await apiClient.getSensors();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/sensors',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle getAvailableSensors', async () => {
      const mockData = { dataTypes: [], sensors: [] };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const result = await apiClient.getAvailableSensors();

      expect(global.fetch).toHaveBeenCalledWith('/api/sensors/available', expect.any(Object));
      expect(result).toEqual(mockData);
    });
  });

  describe('POST requests', () => {
    it('should make POST request with correct data', async () => {
      const postData = { name: 'New Item', value: 123 };
      const mockResponse = { id: '1', ...postData };
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiClient.createAlarmThreshold(postData);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alarmThresholds',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(postData)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('should make PATCH request with correct data', async () => {
      const patchData = { name: 'Updated Item' };
      const mockResponse = { id: '1', ...patchData };
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiClient.updateAlarmThreshold('1', patchData);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alarmThresholds/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request and return boolean', async () => {
      global.fetch.mockResolvedValue({
        ok: true
      });

      const result = await apiClient.deleteAlarmThreshold('1');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alarmThresholds/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toBe(true);
    });

    it('should return false when DELETE fails', async () => {
      global.fetch.mockResolvedValue({
        ok: false
      });

      const result = await apiClient.deleteAlarmThreshold('1');

      expect(result).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should throw error when response is not ok', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({})
      });

      await expect(apiClient.getSensors()).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should include error details from response', async () => {
      const errorDetails = { errors: ['Validation failed', 'Missing required field'] };
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorDetails
      });

      try {
        await apiClient.createAlarmThreshold({});
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.errors).toEqual(errorDetails.errors);
      }
    });

    it('should include errorType from backend validation', async () => {
      const errorDetails = { 
        errors: ['Wartość progu musi być liczbą'], 
        errorType: 'format' 
      };
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorDetails
      });

      try {
        await apiClient.createAlarmThreshold({});
      } catch (error) {
        expect(error.errors).toEqual(errorDetails.errors);
        expect(error.errorType).toBe('format');
      }
    });
  });

  describe('Query parameters', () => {
    it('should handle query parameters correctly', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      await apiClient.getAlarmThresholds({ sensorId: '1', status: 'active' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alarmThresholds?sensorId=1&status=active',
        expect.any(Object)
      );
    });

    it('should handle empty query parameters', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      await apiClient.getAlarmThresholds();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/alarmThresholds?',
        expect.any(Object)
      );
    });
  });

  describe('Air Quality Stats', () => {
    it('should fetch air quality stats with rangeStart parameter', async () => {
      const mockStats = { temperature: 22, humidity: 65 };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockStats
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const result = await apiClient.getAirQualityStats(rangeStart);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/airQualityStats?rangeStart=2024-01-01T00:00:00.000Z',
        expect.any(Object)
      );
      expect(result).toEqual(mockStats);
    });

    it('should fetch air quality stats without parameters', async () => {
      const mockStats = { temperature: 22, humidity: 65 };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockStats
      });

      const result = await apiClient.getAirQualityStats();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/airQualityStats',
        expect.any(Object)
      );
      expect(result).toEqual(mockStats);
    });
  });

  describe('Diagnostic Tests', () => {
    it('should run diagnostics with sensor data', async () => {
      const mockSensors = [{ id: '1', name: 'Temp Sensor' }];
      const mockResult = { id: '1', status: 'ok', sensorResults: [] };
      
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResult
      });

      const result = await apiClient.runDiagnostics(mockSensors);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/diagnosticTests/run',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ sensors: mockSensors })
        })
      );
      expect(result).toEqual(mockResult);
    });
  });
});
