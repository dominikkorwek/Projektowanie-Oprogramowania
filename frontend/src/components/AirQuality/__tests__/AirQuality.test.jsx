import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AirQuality from '../AirQuality'

describe('AirQuality - Jakość Powietrza', () => {
  const mockSensors = [
    { id: '1', name: 'Salon', type: 'pm2_5' },
    { id: '2', name: 'Kuchnia', type: 'co2' }
  ]
  const mockMeasurements = [
    { sensorId: '1', value: '15', timestamp: new Date().toISOString() },
    { sensorId: '2', value: '450', timestamp: new Date().toISOString() }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn((url) => {
      if (url.includes('sensors')) return Promise.resolve({ json: () => Promise.resolve(mockSensors) })
      if (url.includes('measurements')) return Promise.resolve({ json: () => Promise.resolve(mockMeasurements) })
    })
  })

  it('powinien wyświetlić stałe elementy (AQI i tytuł)', async () => {
    render(<AirQuality onBack={vi.fn()} />)
    
    expect(screen.getByText('MooMeter')).toBeInTheDocument()
    expect(screen.getByText('AQI 45')).toBeInTheDocument() // Wartość zdefiniowana w kodzie
  })

  it('powinien załadować i wyświetlić nazwy czujników', async () => {
    render(<AirQuality onBack={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('Salon')).toBeInTheDocument()
      expect(screen.getByText('Kuchnia')).toBeInTheDocument()
    })
  })

  it('powinien wyświetlić baner alertu jeśli przekazano go w propsach', () => {
    const alert = { message: 'Wysokie stężenie CO2', startTime: '12:00' }
    render(<AirQuality onBack={vi.fn()} alert={alert} />)
    
    expect(screen.getByText(/Wysokie stężenie CO2/i)).toBeInTheDocument()
  })

  it('powinien wywołać onBack po kliknięciu przycisku Wróć', () => {
    const onBack = vi.fn()
    render(<AirQuality onBack={onBack} />)
    
    fireEvent.click(screen.getByText('Wróć'))
    expect(onBack).toHaveBeenCalled()
  })
})