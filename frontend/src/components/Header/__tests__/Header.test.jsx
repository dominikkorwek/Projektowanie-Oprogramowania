import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Header from '../Header'

describe('Header - Mechanizm synchronizacji', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('powinien wyświetlić tytuł "MooMeter" i początkowy status synchronizacji', () => {
    render(<Header />)

    expect(screen.getByText('MooMeter')).toBeInTheDocument()
    expect(screen.getByText('Synchronizacja rozpoczęta')).toBeInTheDocument()
  })

  it('powinien przejść przez stany synchronizacji: started → sending → loading → success', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6) // success
    render(<Header />)

    // Stan początkowy
    expect(screen.getByText('Synchronizacja rozpoczęta')).toBeInTheDocument()

    // Po 1s - przesyłanie
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('Przesyłanie danych')).toBeInTheDocument()

    // Po 2.5s - loading (tylko spinner)
    act(() => vi.advanceTimersByTime(1500))
    expect(screen.queryByText('Przesyłanie danych')).not.toBeInTheDocument()

    // Po 3.5s - success
    act(() => vi.advanceTimersByTime(1000))
    const syncButton = screen.getByRole('button', { name: '↻' })
    expect(syncButton).toHaveClass('sync-success')
  })

  it('powinien wyświetlić błąd synchronizacji gdy random < 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4) // error
    render(<Header />)

    act(() => vi.advanceTimersByTime(3500))

    expect(screen.getByText('Błąd synchronizacji')).toBeInTheDocument()
  })

  it('powinien pozwolić na restart synchronizacji po jej zakończeniu', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6)
    render(<Header />)

    // Zakończ synchronizację
    act(() => vi.advanceTimersByTime(3500))

    // Kliknij restart
    fireEvent.click(screen.getByRole('button', { name: '↻' }))

    // Powinien wrócić do stanu początkowego
    expect(screen.getByText('Synchronizacja rozpoczęta')).toBeInTheDocument()
  })

  it('przycisk synchronizacji powinien być nieaktywny podczas trwania synchronizacji', () => {
    render(<Header />)

    const syncButton = screen.getByRole('button', { name: /synchronizacja rozpoczęta/i })
    expect(syncButton).toBeDisabled()
  })

  it('powinien wyświetlić i obsłużyć przycisk "Wróć"', () => {
    const onBack = vi.fn()
    render(<Header onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('powinien wyświetlić i obsłużyć przycisk "Wyjdź"', () => {
    const onExit = vi.fn()
    render(<Header onExit={onExit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wyjdź' }))
    expect(onExit).toHaveBeenCalledTimes(1)
  })
})
