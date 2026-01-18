import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ThresholdForm from '../ThresholdForm'

vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <div>
      <button onClick={onBack}>Wróć</button>
    </div>
  )
}))

vi.mock('../ErrorModal', () => ({
  default: ({ isOpen, onClose, errorType, message }) => {
    if (!isOpen) return null
    return (
      <div data-testid="error-modal">
        <div>{errorType}</div>
        <div>{message}</div>
        <button onClick={onClose}>Zamknij</button>
      </div>
    )
  }
}))

describe('ThresholdForm - Formularz progów alarmowych', () => {
  const mockSensor = {
    id: 1,
    name: 'Temperatura',
    type: 'temperature'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('powinien wyświetlić nagłówek z przyciskiem Wróć', () => {
    render(<ThresholdForm selectedSensor={mockSensor} />)

    expect(screen.getByRole('button', { name: 'Wróć' })).toBeInTheDocument()
  })

  it('powinien wyświetlić 3 wiersze progów domyślnie', () => {
    render(<ThresholdForm selectedSensor={mockSensor} />)

    const metricSelects = screen.getAllByDisplayValue('')
    expect(metricSelects.length).toBeGreaterThanOrEqual(3)
  })

  it('powinien dodać nowy wiersz progu po kliknięciu "Dodaj nowy próg alarmowy"', () => {
    render(<ThresholdForm selectedSensor={mockSensor} />)

    const initialDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    const initialCount = initialDeleteButtons.length

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj nowy próg alarmowy' }))

    const newDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    expect(newDeleteButtons.length).toBe(initialCount + 1)
  })

  it('powinien usunąć wiersz progu po kliknięciu "Usuń"', () => {
    render(<ThresholdForm selectedSensor={mockSensor} />)

    const deleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    const initialCount = deleteButtons.length

    fireEvent.click(deleteButtons[0])

    const remainingDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    expect(remainingDeleteButtons.length).toBe(initialCount - 1)
  })

  it('powinien zresetować formularz po kliknięciu "Resetuj"', () => {
    render(<ThresholdForm selectedSensor={mockSensor} />)

    const metricSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })

    expect(metricSelect.value).toBe('temperatura')

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj' }))

    const resetSelects = screen.getAllByRole('combobox')
    expect(resetSelects[0].value).toBe('')
  })

  it('powinien wywołać onSubmit z poprawnymi danymi po kliknięciu "Zastosuj"', () => {
    const onSubmit = vi.fn()
    render(<ThresholdForm selectedSensor={mockSensor} onSubmit={onSubmit} />)

    const metricSelect = screen.getAllByRole('combobox')[0]
    const operatorSelect = screen.getAllByRole('combobox')[1]
    const valueInput = screen.getAllByRole('spinbutton')[0]
    const messageInput = screen.getAllByRole('textbox')[0]

    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })
    fireEvent.change(operatorSelect, { target: { value: 'greater' } })
    fireEvent.change(valueInput, { target: { value: '25' } })
    fireEvent.change(messageInput, { target: { value: 'Temperatura przekroczona' } })

    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const callArg = onSubmit.mock.calls[0][0]
    expect(callArg.preventDefault).toBeDefined()
  })

  it('powinien wyświetlić ErrorModal gdy są błędy', async () => {
    const errors = ['Wartość progowa musi być liczbą.']
    render(<ThresholdForm selectedSensor={mockSensor} errors={errors} errorType="format" />)

    await waitFor(() => {
      expect(screen.getByTestId('error-modal')).toBeInTheDocument()
    })
  })

  it('powinien wywołać onBack po kliknięciu przycisku Wróć', () => {
    const onBack = vi.fn()
    render(<ThresholdForm selectedSensor={mockSensor} onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('nie powinien wywołać onSubmit gdy żaden próg nie jest wypełniony', () => {
    const onSubmit = vi.fn()
    render(<ThresholdForm selectedSensor={mockSensor} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
