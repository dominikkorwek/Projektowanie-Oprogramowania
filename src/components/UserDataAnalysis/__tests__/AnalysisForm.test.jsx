import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AnalysisForm from '../AnalysisForm'

vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <div>
      <button onClick={onBack}>Wróć</button>
    </div>
  )
}))

describe('AnalysisForm - Formularz analizy danych', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('powinien wyświetlić nagłówek z przyciskiem Wróć', () => {
    render(<AnalysisForm />)

    expect(screen.getByRole('button', { name: 'Wróć' })).toBeInTheDocument()
  })

  it('powinien wyświetlić sekcję metryk z jednym wierszem domyślnie', () => {
    render(<AnalysisForm />)

    expect(screen.getByText('Dodaj nową metrykę')).toBeInTheDocument()
    const metricSelects = screen.getAllByDisplayValue('')
    expect(metricSelects.length).toBeGreaterThan(0)
  })

  it('powinien wyświetlić sekcję warunków z jednym wierszem domyślnie', () => {
    render(<AnalysisForm />)

    expect(screen.getByText('Dodaj nowy warunek')).toBeInTheDocument()
  })

  it('powinien dodać nową metrykę po kliknięciu "Dodaj nową metrykę"', () => {
    render(<AnalysisForm />)

    const initialDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    const initialCount = initialDeleteButtons.length

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj nową metrykę' }))

    const newDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    expect(newDeleteButtons.length).toBe(initialCount + 1)
  })

  it('powinien dodać nowy warunek po kliknięciu "Dodaj nowy warunek"', () => {
    render(<AnalysisForm />)

    const initialDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    const initialCount = initialDeleteButtons.length

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj nowy warunek' }))

    const newDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    expect(newDeleteButtons.length).toBe(initialCount + 1)
  })

  it('powinien usunąć metrykę po kliknięciu "Usuń"', () => {
    render(<AnalysisForm />)

    const deleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    const initialCount = deleteButtons.length

    fireEvent.click(deleteButtons[0])

    const remainingDeleteButtons = screen.getAllByRole('button', { name: 'Usuń' })
    expect(remainingDeleteButtons.length).toBe(initialCount - 1)
  })

  it('powinien zresetować formularz po kliknięciu "Resetuj"', () => {
    render(<AnalysisForm />)

    const metricSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })

    expect(metricSelect.value).toBe('temperatura')

    fireEvent.click(screen.getByRole('button', { name: 'Resetuj' }))

    const resetSelects = screen.getAllByRole('combobox')
    expect(resetSelects[0].value).toBe('')
  })

  it('powinien wywołać onApply z poprawnymi danymi po kliknięciu "Zastosuj"', () => {
    const onApply = vi.fn()
    render(<AnalysisForm onApply={onApply} />)

    const metricSelect = screen.getAllByRole('combobox')[0]
    const operatorSelect = screen.getAllByRole('combobox')[1]
    const valueInput = screen.getAllByRole('spinbutton')[0]

    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })
    fireEvent.change(operatorSelect, { target: { value: 'greater' } })
    fireEvent.change(valueInput, { target: { value: '25' } })

    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }))

    expect(onApply).toHaveBeenCalledTimes(1)
    const callArg = onApply.mock.calls[0][0]
    expect(callArg.metrics).toBeDefined()
    expect(callArg.conditions).toBeDefined()
    expect(callArg.createCollectiveRecommendation).toBe(false)
  })

  it('powinien filtrować puste metryki i warunki przed wywołaniem onApply', () => {
    const onApply = vi.fn()
    render(<AnalysisForm onApply={onApply} />)

    const metricSelect = screen.getAllByRole('combobox')[0]
    const operatorSelect = screen.getAllByRole('combobox')[1]
    const valueInput = screen.getAllByRole('spinbutton')[0]

    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })
    fireEvent.change(operatorSelect, { target: { value: 'greater' } })
    fireEvent.change(valueInput, { target: { value: '25' } })

    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }))

    const callArg = onApply.mock.calls[0][0]
    expect(callArg.metrics.length).toBe(1)
    expect(callArg.conditions.length).toBe(0)
  })

  it('powinien obsłużyć checkbox rekomendacji zbiorczych', () => {
    const onApply = vi.fn()
    render(<AnalysisForm onApply={onApply} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    const metricSelect = screen.getAllByRole('combobox')[0]
    const operatorSelect = screen.getAllByRole('combobox')[1]
    const valueInput = screen.getAllByRole('spinbutton')[0]

    fireEvent.change(metricSelect, { target: { value: 'temperatura' } })
    fireEvent.change(operatorSelect, { target: { value: 'greater' } })
    fireEvent.change(valueInput, { target: { value: '25' } })

    fireEvent.click(screen.getByRole('button', { name: 'Zastosuj' }))

    const callArg = onApply.mock.calls[0][0]
    expect(callArg.createCollectiveRecommendation).toBe(true)
  })

  it('powinien wywołać onBack po kliknięciu przycisku Wróć', () => {
    const onBack = vi.fn()
    render(<AnalysisForm onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
