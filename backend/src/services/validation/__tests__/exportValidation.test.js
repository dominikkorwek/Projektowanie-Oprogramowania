import { describe, it, expect } from 'vitest';
import { validateExportParams } from '../exportValidation.js';

describe('exportValidation', () => {
  describe('validateExportParams', () => {
    it('should validate correct export parameters', () => {
      const params = {
        measurements: ['temperature', 'humidity'],
        sensors: ['1', '2'],
        from: '2024-01-01',
        to: '2024-01-31',
        format: 'pdf'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject empty measurements array', () => {
      const params = {
        measurements: [],
        sensors: ['1', '2'],
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proszę wybrać co najmniej jedną mierzoną wielkość');
    });

    it('should reject missing measurements', () => {
      const params = {
        sensors: ['1', '2'],
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proszę wybrać co najmniej jedną mierzoną wielkość');
    });

    it('should reject empty sensors array', () => {
      const params = {
        measurements: ['temperature'],
        sensors: [],
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proszę wybrać co najmniej jeden czujnik');
    });

    it('should reject missing sensors', () => {
      const params = {
        measurements: ['temperature'],
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proszę wybrać co najmniej jeden czujnik');
    });

    it('should reject missing date range', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1']
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proszę podać zakres dat');
    });

    it('should reject invalid date format', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: 'invalid-date',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nieprawidłowy format daty');
    });

    it('should reject from date after to date', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: '2024-01-31',
        to: '2024-01-01'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data "Od" nie może być późniejsza niż "Do"');
    });

    it('should reject invalid export format', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: '2024-01-01',
        to: '2024-01-31',
        format: 'invalid'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nieprawidłowy format eksportu');
    });

    it('should accept csv format', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: '2024-01-01',
        to: '2024-01-31',
        format: 'csv'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept PDF format (case insensitive)', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: '2024-01-01',
        to: '2024-01-31',
        format: 'PDF'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept missing format (defaults to pdf)', () => {
      const params = {
        measurements: ['temperature'],
        sensors: ['1'],
        from: '2024-01-01',
        to: '2024-01-31'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accumulate multiple errors', () => {
      const params = {
        measurements: [],
        sensors: [],
        from: 'invalid',
        to: 'invalid',
        format: 'invalid'
      };

      const result = validateExportParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

