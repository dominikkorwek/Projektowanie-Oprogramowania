import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin, onCancel }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!login.trim()) {
      setError('Niepoprawne dane: login nie może być pusty')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        setError(payload?.message || 'Niepoprawny login lub hasło')
        return
      }

      const user = await res.json()
      onLogin(user)
    } catch (err) {
      console.error(err)
      setError('Błąd sieciowy. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            aria-label="login"
          />
          <input
            className="login-input"
            placeholder="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="haslo"
          />

          {error && <div className="login-error">{error}</div>}
          <div className="login-buttons">
            <button className="login-submit" type="submit" disabled={loading}>
              Zaloguj
            </button>
            {onCancel && (
              <button
                type="button"
                className="login-cancel"
                onClick={() => onCancel()}
              >
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
