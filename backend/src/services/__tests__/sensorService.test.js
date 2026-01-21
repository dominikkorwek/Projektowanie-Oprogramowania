import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAvailableSensors, getSensorById, getDataTypes, getSensors } from '../sensorService.js';
import * as repository from '../../storage/repository.js';

// Mock the repository module
vi.mock('../../storage/repository.js');

describe('sensorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailableSensors', () => {
    it('should fetch and combine dataTypes and sensors', async () => {
      const mockDataTypes = [
        { id: '1', name: 'Temperature', unit: '°C' },
        { id: '2', name: 'Humidity', unit: '%' }
      ];
      const mockSensors = [
        { id: '1', name: 'Sensor A', type: 'temperature' },
        { id: '2', name: 'Sensor B', type: 'humidity' }
      ];

      vi.mocked(repository.list)
        .mockResolvedValueOnce(mockDataTypes)
        .mockResolvedValueOnce(mockSensors);

      const result = await getAvailableSensors();

      expect(repository.list).toHaveBeenCalledTimes(2);
      expect(repository.list).toHaveBeenCalledWith('dataTypes');
      expect(repository.list).toHaveBeenCalledWith('sensors');
      expect(result).toEqual({
        dataTypes: mockDataTypes,
        sensors: mockSensors
      });
    });

    it('should handle empty results', async () => {
      vi.mocked(repository.list)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await getAvailableSensors();

      expect(result).toEqual({
        dataTypes: [],
        sensors: []
      });
    });
  });

  describe('getSensorById', () => {
    it('should return sensor when found', async () => {
      const mockSensor = { id: '1', name: 'Sensor A', type: 'temperature' };
      vi.mocked(repository.getById).mockResolvedValue(mockSensor);

      const result = await getSensorById('1');

      expect(repository.getById).toHaveBeenCalledWith('sensors', '1');
      expect(result).toEqual(mockSensor);
    });

    it('should return null when sensor not found', async () => {
      vi.mocked(repository.getById).mockResolvedValue(null);

      const result = await getSensorById('999');

      expect(repository.getById).toHaveBeenCalledWith('sensors', '999');
      expect(result).toBeNull();
    });
  });

  describe('getDataTypes', () => {
    it('should return all data types', async () => {
      const mockDataTypes = [
        { id: '1', name: 'Temperature', unit: '°C' },
        { id: '2', name: 'Humidity', unit: '%' },
        { id: '3', name: 'Pressure', unit: 'hPa' }
      ];
      vi.mocked(repository.list).mockResolvedValue(mockDataTypes);

      const result = await getDataTypes();

      expect(repository.list).toHaveBeenCalledWith('dataTypes');
      expect(result).toEqual(mockDataTypes);
    });

    it('should return empty array when no data types exist', async () => {
      vi.mocked(repository.list).mockResolvedValue([]);

      const result = await getDataTypes();

      expect(result).toEqual([]);
    });
  });

  describe('getSensors', () => {
    it('should return all sensors', async () => {
      const mockSensors = [
        { id: '1', name: 'Sensor A', type: 'temperature' },
        { id: '2', name: 'Sensor B', type: 'humidity' },
        { id: '3', name: 'Sensor C', type: 'pressure' }
      ];
      vi.mocked(repository.list).mockResolvedValue(mockSensors);

      const result = await getSensors();

      expect(repository.list).toHaveBeenCalledWith('sensors');
      expect(result).toEqual(mockSensors);
    });

    it('should return empty array when no sensors exist', async () => {
      vi.mocked(repository.list).mockResolvedValue([]);

      const result = await getSensors();

      expect(result).toEqual([]);
    });
  });
});

