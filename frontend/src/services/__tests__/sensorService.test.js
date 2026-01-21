import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sensorService } from '../sensorService'

describe('sensorService', () => {
  describe('validateFormat', () => {
    it('powinien zwrócić isValid: true gdy wszystkie dane są poprawne', () => {
      // Arrange
      const validData = {
        thresholdValue: '25.5',
        condition: 'greater',
        warningMessage: 'Temperatura przekroczyła próg'
      }

      // Act
      const result = sensorService.validateFormat(validData)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zwrócić błąd gdy wartość progowa jest pusta', () => {
      // Arrange
      const invalidData = {
        thresholdValue: '',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Wartość progowa musi być liczbą.')
    })

    it('powinien zwrócić błąd gdy wartość progowa nie jest liczbą', () => {
      // Arrange
      const invalidData = {
        thresholdValue: 'nie-liczba',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Wartość progowa musi być liczbą.')
    })

    it('powinien zwrócić błąd gdy warunek nie jest wybrany', () => {
      // Arrange
      const invalidData = {
        thresholdValue: '25',
        condition: '',
        warningMessage: 'Komunikat'
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Warunek musi być wybrany.')
    })

    it('powinien zwrócić błąd gdy komunikat ostrzegawczy jest pusty', () => {
      // Arrange
      const invalidData = {
        thresholdValue: '25',
        condition: 'greater',
        warningMessage: ''
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Komunikat ostrzegawczy nie może być pusty.')
    })

    it('powinien zwrócić błąd gdy komunikat ostrzegawczy zawiera tylko białe znaki', () => {
      // Arrange
      const invalidData = {
        thresholdValue: '25',
        condition: 'greater',
        warningMessage: '   '
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Komunikat ostrzegawczy nie może być pusty.')
    })

    it('powinien zwrócić wszystkie błędy gdy wiele pól jest niepoprawnych', () => {
      // Arrange
      const invalidData = {
        thresholdValue: '',
        condition: '',
        warningMessage: ''
      }

      // Act
      const result = sensorService.validateFormat(invalidData)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors).toContain('Wartość progowa musi być liczbą.')
      expect(result.errors).toContain('Warunek musi być wybrany.')
      expect(result.errors).toContain('Komunikat ostrzegawczy nie może być pusty.')
    })

    it('powinien zaakceptować ujemną wartość liczbową', () => {
      // Arrange
      const validData = {
        thresholdValue: '-10',
        condition: 'less',
        warningMessage: 'Temperatura spadła poniżej progu'
      }

      // Act
      const result = sensorService.validateFormat(validData)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zaakceptować wartość dziesiętną', () => {
      // Arrange
      const validData = {
        thresholdValue: '25.75',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }

      // Act
      const result = sensorService.validateFormat(validData)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateBusiness', () => {
    it('powinien zwrócić isValid: true gdy temperatura jest w poprawnym zakresie', () => {
      // Arrange
      const data = {
        thresholdValue: '25',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zwrócić błąd gdy temperatura jest poniżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '-51',
        condition: 'less',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Temperatura musi być w zakresie -50°C do 100°C.')
    })

    it('powinien zwrócić błąd gdy temperatura jest powyżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '101',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Temperatura musi być w zakresie -50°C do 100°C.')
    })

    it('powinien zaakceptować temperaturę na granicy zakresu (dolna)', () => {
      // Arrange
      const data = {
        thresholdValue: '-50',
        condition: 'equal',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zaakceptować temperaturę na granicy zakresu (górna)', () => {
      // Arrange
      const data = {
        thresholdValue: '100',
        condition: 'equal',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zwrócić błąd gdy wilgotność jest poniżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '-1',
        condition: 'less',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 2, name: 'Wilgotność', type: 'humidity' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Wilgotność musi być w zakresie 0% do 100%.')
    })

    it('powinien zwrócić błąd gdy wilgotność jest powyżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '101',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 2, name: 'Wilgotność', type: 'humidity' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Wilgotność musi być w zakresie 0% do 100%.')
    })

    it('powinien zaakceptować wilgotność w poprawnym zakresie', () => {
      // Arrange
      const data = {
        thresholdValue: '50',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 2, name: 'Wilgotność', type: 'humidity' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zwrócić błąd gdy ciśnienie jest poniżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '-1',
        condition: 'less',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 3, name: 'Ciśnienie', type: 'pressure' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Ciśnienie musi być w zakresie 0 do 2000 hPa.')
    })

    it('powinien zwrócić błąd gdy ciśnienie jest powyżej zakresu', () => {
      // Arrange
      const data = {
        thresholdValue: '2001',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 3, name: 'Ciśnienie', type: 'pressure' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Ciśnienie musi być w zakresie 0 do 2000 hPa.')
    })

    it('powinien zaakceptować ciśnienie w poprawnym zakresie', () => {
      // Arrange
      const data = {
        thresholdValue: '1013',
        condition: 'equal',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 3, name: 'Ciśnienie', type: 'pressure' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zwrócić isValid: true dla nieznanego typu sensora (brak reguł biznesowych)', () => {
      // Arrange
      const data = {
        thresholdValue: '999',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 4, name: 'Nieznany sensor', type: 'unknown' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('powinien zaakceptować wartość dziesiętną dla temperatury', () => {
      // Arrange
      const data = {
        thresholdValue: '25.5',
        condition: 'greater',
        warningMessage: 'Komunikat'
      }
      const sensor = { id: 1, name: 'Temperatura', type: 'temperature' }

      // Act
      const result = sensorService.validateBusiness(data, sensor)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})

