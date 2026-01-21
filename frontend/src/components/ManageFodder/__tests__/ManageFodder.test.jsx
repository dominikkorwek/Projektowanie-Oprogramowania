import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ManageFodder from '../ManageFodder'

// Mock Header – nie interesuje nas jego logika
vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <button onClick={onBack}>Wróć</button>
  )
}))

// Mock ErrorModal – upraszczamy do renderowania treści
vi.mock('../../AlarmThresholds/ErrorModal', () => ({
  default: ({ isOpen, children, confirmAction }) =>
    isOpen ? (
      <div>
        {children}
        {confirmAction && (
          <button onClick={confirmAction.onClick}>
            {confirmAction.label}
          </button>
        )}
      </div>
    ) : null
}))

describe('ManageFodder – logika biznesowa', () => {

  it('powinien otworzyć szczegóły krowy po kliknięciu "Zmień"', () => {
    render(<ManageFodder onBack={vi.fn()} />)

    // Kliknij "Zmień" dla pierwszej krowy
    fireEvent.click(screen.getAllByText('Zmień')[0])

    // Sprawdź czy jesteśmy w widoku szczegółów
    expect(screen.getByText(/ID KROWY 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Aktualna pasza/i)).toBeInTheDocument()
  })

  it('powinien wyświetlić komunikat "Brak zmian" gdy wybrano tę samą paszę', () => {
    render(<ManageFodder onBack={vi.fn()} />)

    // Otwórz szczegóły krowy
    fireEvent.click(screen.getAllByText('Zmień')[0])

    // Wybierz tę samą paszę co aktualna
    fireEvent.click(screen.getAllByText('Wybierz')[0])

    // Akceptuj
    fireEvent.click(screen.getByText('Akceptuj'))

    // Modal "Brak zmian"
    expect(
      screen.getByText(/Brak zmian, proszę wybrać inną paszę/i)
    ).toBeInTheDocument()
  })

  it('powinien zmienić paszę krowy po zaakceptowaniu innej paszy', () => {
    render(<ManageFodder onBack={vi.fn()} />)

    // Otwórz szczegóły krowy
    fireEvent.click(screen.getAllByText('Zmień')[0])

    // Wybierz inną paszę (druga na liście)
    fireEvent.click(screen.getAllByText('Wybierz')[1])

    // Akceptuj
    fireEvent.click(screen.getByText('Akceptuj'))

    // Modal zapisu
    expect(
      screen.getByText(/Zmiany zostały zapisane/i)
    ).toBeInTheDocument()

    // Zamknij modal
    fireEvent.click(screen.getByText('Dalej'))

    // Sprawdź czy nowa pasza jest widoczna na liście krów
    expect(screen.getAllByText('PASZA2').length).toBeGreaterThan(0)
  })

})
