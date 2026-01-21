import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateMeanForSensorType, getAirQualityStats } from '../airQualityService.js';
import * as repository from '../../storage/repository.js';

vi.mock('../../storage/repository.js');

describe('airQualityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateMeanForSensorType', () => {
    it('should calculate mean value for a sensor type', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor 1' },
        { id: '2', type: 'temperature', name: 'Temp Sensor 2' },
        { id: '3', type: 'humidity', name: 'Humidity Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '20', timestamp: '2024-01-02T10:00:00Z' },
        { id: '2', sensorId: '1', value: '22', timestamp: '2024-01-02T11:00:00Z' },
        { id: '3', sensorId: '2', value: '24', timestamp: '2024-01-02T10:00:00Z' },
        { id: '4', sensorId: '3', value: '60', timestamp: '2024-01-02T10:00:00Z' }
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const mean = await calculateMeanForSensorType('temperature', rangeStart);

      // Mean of 20, 22, 24 = 22
      expect(mean).toBe(22);
    });

    it('should return null when no measurements exist for sensor type', async () => {
      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve([
          { id: '1', type: 'temperature', name: 'Temp Sensor' }
        ]);
        if (table === 'measurements') return Promise.resolve([]);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const mean = await calculateMeanForSensorType('temperature', rangeStart);

      expect(mean).toBeNull();
    });

    it('should filter measurements by date range', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '10', timestamp: '2023-12-31T10:00:00Z' }, // Before range
        { id: '2', sensorId: '1', value: '20', timestamp: '2024-01-02T10:00:00Z' }, // In range
        { id: '3', sensorId: '1', value: '30', timestamp: '2024-01-03T10:00:00Z' }  // In range
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const mean = await calculateMeanForSensorType('temperature', rangeStart);

      // Mean of 20, 30 = 25 (first measurement is filtered out)
      expect(mean).toBe(25);
    });

    it('should handle non-finite values', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '20', timestamp: '2024-01-02T10:00:00Z' },
        { id: '2', sensorId: '1', value: 'invalid', timestamp: '2024-01-02T11:00:00Z' },
        { id: '3', sensorId: '1', value: '30', timestamp: '2024-01-03T10:00:00Z' }
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const mean = await calculateMeanForSensorType('temperature', rangeStart);

      // Mean of 20, 30 = 25 (invalid value filtered out)
      expect(mean).toBe(25);
    });

    it('should round the mean value', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '10', timestamp: '2024-01-02T10:00:00Z' },
        { id: '2', sensorId: '1', value: '11', timestamp: '2024-01-02T11:00:00Z' },
        { id: '3', sensorId: '1', value: '12', timestamp: '2024-01-03T10:00:00Z' }
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const mean = await calculateMeanForSensorType('temperature', rangeStart);

      // Mean of 10, 11, 12 = 11
      expect(mean).toBe(11);
    });
  });

  describe('getAirQualityStats', () => {
    it('should return stats for all sensor types', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor' },
        { id: '2', type: 'humidity', name: 'Humidity Sensor' },
        { id: '3', type: 'co2', name: 'CO2 Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '20', timestamp: '2024-01-02T10:00:00Z' },
        { id: '2', sensorId: '2', value: '60', timestamp: '2024-01-02T10:00:00Z' },
        { id: '3', sensorId: '3', value: '400', timestamp: '2024-01-02T10:00:00Z' }
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const stats = await getAirQualityStats(rangeStart);

      expect(stats).toEqual({
        temperature: 20,
        humidity: 60,
        co2: 400
      });
    });

    it('should handle sensor types with no data', async () => {
      const mockSensors = [
        { id: '1', type: 'temperature', name: 'Temp Sensor' },
        { id: '2', type: 'humidity', name: 'Humidity Sensor' }
      ];

      const mockMeasurements = [
        { id: '1', sensorId: '1', value: '20', timestamp: '2024-01-02T10:00:00Z' }
        // No humidity measurements
      ];

      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve(mockSensors);
        if (table === 'measurements') return Promise.resolve(mockMeasurements);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const stats = await getAirQualityStats(rangeStart);

      expect(stats).toEqual({
        temperature: 20,
        humidity: null
      });
    });

    it('should handle empty sensor list', async () => {
      vi.mocked(repository.list).mockImplementation((table) => {
        if (table === 'sensors') return Promise.resolve([]);
        if (table === 'measurements') return Promise.resolve([]);
        return Promise.resolve([]);
      });

      const rangeStart = new Date('2024-01-01T00:00:00Z');
      const stats = await getAirQualityStats(rangeStart);

      expect(stats).toEqual({});
    });
  });
});

