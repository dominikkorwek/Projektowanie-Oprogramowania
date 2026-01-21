import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SensorDiagnostics from '../SensorDiagnostics'
import { apiClient } from '../../../services/apiClient'

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    getAvailableSensors: vi.fn(),
    getDiagnosticTests: vi.fn(),
    runDiagnostics: vi.fn()
  }
}))

describe('SensorDiagnostics - Diagnostyka czujników', () => {
  const mockSensorsData = {
    dataTypes: [
      { id: 1, name: 'Temperatura', type: 'temperature' },
      { id: 2, name: 'Wilgotność', type: 'humidity' },
      { id: 3, name: 'Ciśnienie', type: 'pressure' }
    ],
    sensors: []
  }

  const mockTestHistory = [
    { 
      id: 1, 
      date: '2024-12-20T10:00:00.000Z', 
      errorType: 'Brak błędów', 
      status: 'ok' 
    },
    { 
      id: 2, 
      date: '2024-12-19T14:30:00.000Z', 
      errorType: 'TYP BŁĘDU', 
      status: 'error' 
    }
  ]

  beforeEach(() => {
    apiClient.getAvailableSensors.mockResolvedValue(mockSensorsData)
    apiClient.getDiagnosticTests.mockResolvedValue(mockTestHistory)
    apiClient.runDiagnostics.mockImplementation((sensors) => 
      Promise.resolve({
        id: 3,
        date: new Date().toISOString(),
        errorType: 'TYP BŁĘDU',
        status: 'error',
        sensorResults: sensors.map(s => ({ ...s, status: 'error' }))
      })
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('powinien wyświetlić nagłówek i tytuł sekcji', async () => {
    render(<SensorDiagnostics />)

    expect(screen.getByText('MooMeter')).toBeInTheDocument()
    expect(screen.getByText('Diagnostyka czujników')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Uruchom' })).toBeInTheDocument()
    })
  })

  it('powinien załadować i wyświetlić listę czujników', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })
    expect(screen.getByText('Wilgotność')).toBeInTheDocument()
    expect(screen.getByText('Ciśnienie')).toBeInTheDocument()
  })

  it('powinien wyświetlić początkową historię testów', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Brak błędów')).toBeInTheDocument()
    })
    expect(screen.getByText('TYP BŁĘDU')).toBeInTheDocument()
  })

  it('powinien zmienić tekst przycisku podczas diagnostyki', async () => {
    apiClient.runDiagnostics.mockImplementation(() => new Promise(() => {}))
    
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    expect(screen.getByRole('button', { name: 'Trwa diagnozowanie' })).toBeDisabled()
    expect(apiClient.runDiagnostics).toHaveBeenCalled()
  })

  it('powinien uruchomić diagnostykę przez backend', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    await waitFor(() => {
      expect(apiClient.runDiagnostics).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String)
          })
        ])
      )
    })
  })

  it('powinien zakończyć diagnostykę i przywrócić przycisk "Uruchom"', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Uruchom' })).not.toBeDisabled()
    })

    expect(apiClient.runDiagnostics).toHaveBeenCalled()
  })

  it('powinien wywołać onBack po kliknięciu przycisku "Wróć"', async () => {
    const onBack = vi.fn()
    render(<SensorDiagnostics onBack={onBack} />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
