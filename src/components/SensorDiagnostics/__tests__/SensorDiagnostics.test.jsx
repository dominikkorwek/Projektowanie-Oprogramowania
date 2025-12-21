import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SensorDiagnostics from '../SensorDiagnostics'
import { sensorService } from '../../../services/sensorService'

vi.mock('../../../services/sensorService', () => ({
  sensorService: {
    getAvailableSensors: vi.fn()
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

  beforeEach(() => {
    sensorService.getAvailableSensors.mockResolvedValue(mockSensorsData)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('powinien wyświetlić nagłówek i tytuł sekcji', () => {
    render(<SensorDiagnostics />)

    expect(screen.getByText('MooMeter')).toBeInTheDocument()
    expect(screen.getByText('Diagnostyka czujników')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Uruchom' })).toBeInTheDocument()
  })

  it('powinien załadować i wyświetlić listę czujników', async () => {
    render(<SensorDiagnostics />)

    await waitFor(() => {
      expect(screen.getByText('Temperatura')).toBeInTheDocument()
    })
    expect(screen.getByText('Wilgotność')).toBeInTheDocument()
    expect(screen.getByText('Ciśnienie')).toBeInTheDocument()
  })

  it('powinien wyświetlić początkową historię testów', () => {
    render(<SensorDiagnostics />)

    expect(screen.getByText('20.12.2024')).toBeInTheDocument()
    expect(screen.getByText('19.12.2024')).toBeInTheDocument()
  })

  it('powinien zmienić tekst przycisku podczas diagnostyki', async () => {
    vi.useFakeTimers()
    render(<SensorDiagnostics />)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    expect(screen.getByRole('button', { name: 'Trwa diagnozowanie' })).toBeDisabled()
    
    vi.useRealTimers()
  })

  it('powinien dodać wpis do historii podczas diagnostyki', async () => {
    vi.useFakeTimers()
    render(<SensorDiagnostics />)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    expect(screen.getByText('Diagnozowanie...')).toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('powinien zakończyć diagnostykę i przywrócić przycisk "Uruchom"', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.6)
    render(<SensorDiagnostics />)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Uruchom' }))
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })

    expect(screen.getByRole('button', { name: 'Uruchom' })).not.toBeDisabled()
    
    vi.useRealTimers()
  })

  it('powinien wywołać onBack po kliknięciu przycisku "Wróć"', () => {
    const onBack = vi.fn()
    render(<SensorDiagnostics onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
