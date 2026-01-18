import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SensorList from '../SensorList'

vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <div>
      <button onClick={onBack}>Wróć</button>
    </div>
  )
}))

describe('SensorList - Ustal progi alarmowe', () => {
  const mockSensors = {
    dataTypes: [
      { id: 1, name: 'Temperatura', type: 'temperature' },
      { id: 2, name: 'Wilgotność', type: 'humidity' }
    ],
    sensors: [
      { id: 1, name: 'Sensor 1', type: 'temperature' },
      { id: 2, name: 'Sensor 2', type: 'humidity' }
    ]
  }

  it('powinien wyświetlić nagłówek z przyciskiem Wróć', () => {
    render(<SensorList sensors={mockSensors} />)

    expect(screen.getByRole('button', { name: 'Wróć' })).toBeInTheDocument()
  })

  it('powinien wyświetlić listę typów danych', () => {
    render(<SensorList sensors={mockSensors} />)

    const typeLabels = screen.getAllByText('Typ danych')
    expect(typeLabels.length).toBeGreaterThan(0)
    const selectButtons = screen.getAllByRole('button', { name: 'Wybierz' })
    expect(selectButtons.length).toBeGreaterThan(0)
  })

  it('powinien wyświetlić listę sensorów', () => {
    render(<SensorList sensors={mockSensors} />)

    const sensorLabels = screen.getAllByText('Sensor')
    expect(sensorLabels.length).toBeGreaterThan(0)
  })

  it('powinien wyświetlić komunikat ładowania gdy brak danych', () => {
    render(<SensorList sensors={{ dataTypes: [], sensors: [] }} />)

    expect(screen.getAllByText('Ładowanie danych...').length).toBeGreaterThan(0)
  })

  it('powinien wywołać onSelectSensor po kliknięciu przycisku Wybierz dla typu danych', () => {
    const onSelectSensor = vi.fn()
    render(<SensorList sensors={mockSensors} onSelectSensor={onSelectSensor} />)

    const selectButtons = screen.getAllByRole('button', { name: 'Wybierz' })
    fireEvent.click(selectButtons[0])

    expect(onSelectSensor).toHaveBeenCalledTimes(1)
    expect(onSelectSensor).toHaveBeenCalledWith(mockSensors.dataTypes[0])
  })

  it('powinien wywołać onBack po kliknięciu przycisku Wróć', () => {
    const onBack = vi.fn()
    render(<SensorList sensors={mockSensors} onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
