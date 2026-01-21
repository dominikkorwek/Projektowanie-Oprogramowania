import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ExportPanel from '../ExportPanel'

// Mock Header – nie testujemy nawigacji
vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <button onClick={onBack}>Wróć</button>
  )
}))

// Mock ErrorModal – renderuje tylko treść
vi.mock('../../AlarmThresholds/ErrorModal', () => ({
  default: ({ isOpen, title, message, children, confirmAction, closeLabel }) =>
    isOpen ? (
      <div>
        {title && <div>{title}</div>}
        {message && <div>{message}</div>}
        {children}
        {confirmAction && (
          <button onClick={confirmAction.onClick}>
            {confirmAction.label}
          </button>
        )}
        {closeLabel && <button>{closeLabel}</button>}
      </div>
    ) : null
}))

describe('ExportPanel – logika biznesowa', () => {

  it('powinien wyświetlić błąd gdy nie wybrano wielkości i czujników', () => {
    render(<ExportPanel onBack={vi.fn()} />)

    fireEvent.click(screen.getByText('Eksportuj'))

    expect(
      screen.getByText(/Niepoprawne parametry/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Proszę wprowadzić poprawne dane/i)
    ).toBeInTheDocument()
  })

  it('powinien wyświetlić błąd gdy data "Od" jest późniejsza niż "Do"', () => {
    render(<ExportPanel onBack={vi.fn()} />)

    // zaznacz wielkość
    fireEvent.click(screen.getByLabelText('Wielkość A'))
    // zaznacz czujnik
    fireEvent.click(screen.getByLabelText('Czujnik 1'))

    // ustaw niepoprawne daty
    fireEvent.change(screen.getByLabelText(/Od/i), {
      target: { value: '2025-12-31' }
    })
    fireEvent.change(screen.getByLabelText(/Do/i), {
      target: { value: '2025-01-01' }
    })

    fireEvent.click(screen.getByText('Eksportuj'))

    expect(
      screen.getByText(/Data "Od" nie może być późniejsza niż "Do"/i)
    ).toBeInTheDocument()
  })

  it('powinien wykonać poprawny eksport przy prawidłowych danych', async () => {
    const onExport = vi.fn()

    render(<ExportPanel onBack={vi.fn()} onExport={onExport} />)

    // wybór parametrów
    fireEvent.click(screen.getByLabelText('Wielkość A'))
    fireEvent.click(screen.getByLabelText('Czujnik 1'))

    fireEvent.click(screen.getByText('Eksportuj'))

    // modal wyboru ścieżki
    fireEvent.change(screen.getByPlaceholderText(/C:\\Users/i), {
      target: { value: 'C:\\Test' }
    })

    fireEvent.click(screen.getByText('Dalej'))

    // sprawdź czy wywołano eksport
    expect(onExport).toHaveBeenCalledTimes(1)

    // modal sukcesu
    expect(
      screen.getByText(/Pobieranie raportu powiodło się/i)
    ).toBeInTheDocument()
  })

})
