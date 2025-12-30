import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin, onCancel }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function sha256Hex(message) {
    const enc = new TextEncoder()
    const data = enc.encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!login.trim()) {
      setError('Niepoprawne dane: login nie może być pusty')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/users?login=${encodeURIComponent(login)}`)
      const users = await res.json()
      if (!users || users.length === 0) {
        setError('Niepoprawny login lub hasło')
        setLoading(false)
        return
      }
      const user = users[0]
      const hash = await sha256Hex(password)
      if (hash === user.passwordHash) {
        onLogin(user)
      } else {
        setError('Niepoprawny login lub hasło')
      }
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
