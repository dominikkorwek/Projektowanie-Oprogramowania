import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../Login'

describe('Login - Komponent logowania', () => {
  const mockOnLogin = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mockowanie globalnego fetch
    global.fetch = vi.fn()
  })

  it('powinien wyrenderować formularz logowania', () => {
    render(<Login onLogin={mockOnLogin} onCancel={mockOnCancel} />)
    
    expect(screen.getByPlaceholderText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zaloguj/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /anuluj/i })).toBeInTheDocument()
  })

  it('powinien wyświetlić błąd przy pustym loginie', async () => {
    render(<Login onLogin={mockOnLogin} />)
    
    fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }))
    
    expect(await screen.findByText(/login nie może być pusty/i)).toBeInTheDocument()
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  it('powinien pomyślnie zalogować użytkownika przy poprawnych danych', async () => {
    const mockUser = {
      id: '1',
      login: 'admin'
    }
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser)
    })

    render(<Login onLogin={mockOnLogin} />)
    
    fireEvent.change(screen.getByLabelText('login'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('haslo'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }))

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST'
    }))
  })

  it('powinien wyświetlić błąd przy niepoprawnym haśle', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Niepoprawny login lub hasło' })
    })

    render(<Login onLogin={mockOnLogin} />)
    
    fireEvent.change(screen.getByLabelText('login'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('haslo'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }))

    expect(await screen.findByText(/niepoprawny login lub hasło/i)).toBeInTheDocument()
  })

  it('powinien wywołać onCancel po kliknięciu przycisku anuluj', () => {
    render(<Login onLogin={mockOnLogin} onCancel={mockOnCancel} />)
    
    fireEvent.click(screen.getByRole('button', { name: /anuluj/i }))
    expect(mockOnCancel).toHaveBeenCalled()
  })
})