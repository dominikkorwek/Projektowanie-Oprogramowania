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

describe('ExportPanel – UI and validation display', () => {

  it('powinien wyświetlić błąd gdy nie wybrano wymaganych danych (basic UX check)', () => {
    render(<ExportPanel onBack={vi.fn()} />)

    fireEvent.click(screen.getByText('Eksportuj'))

    expect(
      screen.getByText(/Niepoprawne parametry/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Proszę wprowadzić wszystkie wymagane dane/i)
    ).toBeInTheDocument()
  })

  it('powinien wyświetlić błędy walidacji z backendu', async () => {
    // Mock fetch to simulate backend validation error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: ['Data "Od" nie może być późniejsza niż "Do"']
      })
    })

    render(<ExportPanel onBack={vi.fn()} />)

    // wybór parametrów
    fireEvent.click(screen.getByLabelText('Wielkość A'))
    fireEvent.click(screen.getByLabelText('Czujnik 1'))

    fireEvent.click(screen.getByText('Eksportuj'))

    // modal wyboru ścieżki
    fireEvent.change(screen.getByPlaceholderText(/C:\\Users/i), {
      target: { value: 'C:\\Test' }
    })

    fireEvent.click(screen.getByText('Dalej'))

    // Wait for backend validation error to display
    await screen.findByText(/Data "Od" nie może być późniejsza niż "Do"/i)
    
    expect(
      screen.getByText(/Niepoprawne parametry/i)
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
