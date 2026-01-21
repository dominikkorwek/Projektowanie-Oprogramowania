import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDiagnostics, getDiagnosticTests } from '../diagnosticService.js';
import * as repository from '../../storage/repository.js';

vi.mock('../../storage/repository.js');

describe('diagnosticService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('runDiagnostics', () => {
    it('should create a diagnosing entry and update with results', async () => {
      const mockSensors = [
        { id: '1', name: 'Temperature Sensor' },
        { id: '2', name: 'Humidity Sensor' }
      ];

      const mockDiagnosingEntry = {
        id: '1',
        date: expect.any(String),
        errorType: 'Diagnozowanie...',
        status: 'diagnosing'
      };

      const mockUpdatedEntry = {
        id: '1',
        date: expect.any(String),
        errorType: expect.any(String),
        status: expect.stringMatching(/^(ok|error)$/),
        sensorResults: expect.any(Array)
      };

      vi.mocked(repository.create).mockResolvedValue(mockDiagnosingEntry);
      vi.mocked(repository.patch).mockResolvedValue(mockUpdatedEntry);

      const result = await runDiagnostics(mockSensors);

      expect(repository.create).toHaveBeenCalledWith('diagnosticTests', {
        date: expect.any(String),
        errorType: 'Diagnozowanie...',
        status: 'diagnosing'
      });

      expect(repository.patch).toHaveBeenCalledWith(
        'diagnosticTests',
        '1',
        expect.objectContaining({
          date: expect.any(String),
          errorType: expect.any(String),
          status: expect.stringMatching(/^(ok|error)$/),
          sensorResults: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              status: expect.stringMatching(/^(ok|error)$/)
            })
          ])
        })
      );

      expect(result).toEqual(mockUpdatedEntry);
    });

    it('should ensure at least one error when not all green', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.4); // Force not all green

      const mockSensors = [
        { id: '1', name: 'Sensor 1' },
        { id: '2', name: 'Sensor 2' }
      ];

      vi.mocked(repository.create).mockResolvedValue({ id: '1' });
      vi.mocked(repository.patch).mockImplementation(async (table, id, data) => ({
        id,
        ...data
      }));

      await runDiagnostics(mockSensors);

      const patchCall = vi.mocked(repository.patch).mock.calls[0];
      const updatedData = patchCall[2];

      // Should have at least one error
      const hasError = updatedData.sensorResults.some(s => s.status === 'error');
      expect(hasError).toBe(true);
    });

    it('should mark all sensors as ok when all green', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.6) // allGreen = true
        .mockReturnValue(0); // All subsequent calls

      const mockSensors = [
        { id: '1', name: 'Sensor 1' },
        { id: '2', name: 'Sensor 2' }
      ];

      vi.mocked(repository.create).mockResolvedValue({ id: '1' });
      vi.mocked(repository.patch).mockImplementation(async (table, id, data) => ({
        id,
        ...data
      }));

      const result = await runDiagnostics(mockSensors);

      const patchCall = vi.mocked(repository.patch).mock.calls[0];
      const updatedData = patchCall[2];

      expect(updatedData.sensorResults.every(s => s.status === 'ok')).toBe(true);
      expect(updatedData.status).toBe('ok');
      expect(updatedData.errorType).toBe('Brak błędów');
    });
  });

  describe('getDiagnosticTests', () => {
    it('should return diagnostic tests sorted by date descending', async () => {
      const mockTests = [
        { id: '1', date: '2024-01-01T10:00:00.000Z', status: 'ok' },
        { id: '2', date: '2024-01-03T10:00:00.000Z', status: 'error' },
        { id: '3', date: '2024-01-02T10:00:00.000Z', status: 'ok' }
      ];

      vi.mocked(repository.list).mockResolvedValue(mockTests);

      const result = await getDiagnosticTests();

      expect(repository.list).toHaveBeenCalledWith('diagnosticTests');
      expect(result).toEqual([
        { id: '2', date: '2024-01-03T10:00:00.000Z', status: 'error' },
        { id: '3', date: '2024-01-02T10:00:00.000Z', status: 'ok' },
        { id: '1', date: '2024-01-01T10:00:00.000Z', status: 'ok' }
      ]);
    });

    it('should return empty array when no tests exist', async () => {
      vi.mocked(repository.list).mockResolvedValue([]);

      const result = await getDiagnosticTests();

      expect(result).toEqual([]);
    });
  });
});

