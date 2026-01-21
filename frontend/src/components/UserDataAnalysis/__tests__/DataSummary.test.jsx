import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DataSummary from '../DataSummary'
import { db } from '../../../database/dbClient'

vi.mock('../../../database/dbClient', () => ({
  db: {
    fetchMultiple: vi.fn()
  }
}))

vi.mock('../../Header/Header', () => ({
  default: ({ onBack }) => (
    <div>
      <button onClick={onBack}>Wróć</button>
    </div>
  )
}))

describe('DataSummary - Analizuj dane użytkowników', () => {
  const mockData = {
    userDataSummaries: [
      { id: 1, label: 'Liczba użytkowników', value: '150' },
      { id: 2, label: 'Aktywni użytkownicy', value: '120' }
    ],
    analysisTypes: [
      { id: 1, name: 'Analiza 1' },
      { id: 2, name: 'Analiza 2' }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    db.fetchMultiple.mockResolvedValue(mockData)
  })

  it('powinien wyświetlić nagłówek z przyciskiem Wróć', () => {
    render(<DataSummary />)

    expect(screen.getByRole('button', { name: 'Wróć' })).toBeInTheDocument()
  })

  it('powinien wyświetlić komunikat ładowania podczas pobierania danych', () => {
    db.fetchMultiple.mockImplementation(() => new Promise(() => {}))
    render(<DataSummary />)

    expect(screen.getByText('Ładowanie danych...')).toBeInTheDocument()
  })

  it('powinien załadować i wyświetlić podsumowania danych', async () => {
    render(<DataSummary />)

    await waitFor(() => {
      expect(screen.getByText('Liczba użytkowników:')).toBeInTheDocument()
    })
    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('Aktywni użytkownicy:')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
  })

  it('powinien wyświetlić wykresy', async () => {
    render(<DataSummary />)

    await waitFor(() => {
      expect(screen.getByText('Wykres')).toBeInTheDocument()
    })
    expect(screen.getByText('Wykres 2')).toBeInTheDocument()
  })

  it('powinien wyświetlić opcje analizy', async () => {
    render(<DataSummary />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Analiza 1' })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Analiza 2' })).toBeInTheDocument()
  })

  it('powinien wywołać onSelectAnalysis po kliknięciu opcji analizy', async () => {
    const onSelectAnalysis = vi.fn()
    render(<DataSummary onSelectAnalysis={onSelectAnalysis} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Analiza 1' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Analiza 1' }))
    expect(onSelectAnalysis).toHaveBeenCalledTimes(1)
    expect(onSelectAnalysis).toHaveBeenCalledWith(mockData.analysisTypes[0])
  })

  it('powinien wywołać onBack po kliknięciu przycisku Wróć', () => {
    const onBack = vi.fn()
    render(<DataSummary onBack={onBack} />)

    fireEvent.click(screen.getByRole('button', { name: 'Wróć' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('powinien obsłużyć błąd podczas ładowania danych', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    db.fetchMultiple.mockRejectedValue(new Error('Błąd sieci'))

    render(<DataSummary />)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })
})
