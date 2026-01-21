import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SensorDiagnostics from '../SensorDiagnostics'
import { sensorService } from '../../../services/sensorService'
import { db } from '../../../database/dbClient'

vi.mock('../../../services/sensorService', () => ({
  sensorService: {
    getAvailableSensors: vi.fn()
  }
}))

vi.mock('../../../database/dbClient', () => ({
  db: {
    diagnosticTests: {
      findAll: vi.fn(),
      create: vi.fn(),
      patch: vi.fn()
    }
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
    sensorService.getAvailableSensors.mockResolvedValue(mockSensorsData)
    db.diagnosticTests.findAll.mockResolvedValue(mockTestHistory)
    db.diagnosticTests.create.mockImplementation((data) => 
      Promise.resolve({ ...data, id: 3 })
    )
    db.diagnosticTests.patch.mockImplementation((id, data) => 
      Promise.resolve({ ...data, id })
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
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    vi.useFakeTimers()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    expect(screen.getByRole('button', { name: 'Trwa diagnozowanie' })).toBeDisabled()
    expect(db.diagnosticTests.create).toHaveBeenCalled()
    
    vi.useRealTimers()
  })

  it('powinien dodać wpis do historii podczas diagnostyki', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    vi.useFakeTimers()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    expect(screen.getByText('Diagnozowanie...')).toBeInTheDocument()
    expect(db.diagnosticTests.create).toHaveBeenCalledWith(
      expect.objectContaining({
        errorType: 'Diagnozowanie...',
        status: 'diagnosing'
      })
    )
    
    vi.useRealTimers()
  })

  it('powinien zakończyć diagnostykę i przywrócić przycisk "Uruchom"', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6)
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })

    vi.useFakeTimers()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })

    expect(screen.getByRole('button', { name: 'Uruchom' })).not.toBeDisabled()
    expect(db.diagnosticTests.patch).toHaveBeenCalledWith(
      3,
      expect.objectContaining({
        status: expect.stringMatching(/^(ok|error)$/)
      })
    )
    
    vi.useRealTimers()
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
