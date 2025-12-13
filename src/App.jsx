import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
      <div className="App">
        <div className="container">
          <h1 className="title">MOO METER</h1>
          <p className="subtitle">by MooLife</p>
          <button className="login-button" onClick={handleLogin}>
            Zaloguj się
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">MOO METER</h1>
        <p className="subtitle">by MooLife</p>
        <div className="menu">
          <button className="menu-button">Placeholder 1</button>
          <button className="menu-button">Placeholder 2</button>
          <button className="menu-button">Placeholder 3</button>
          <button className="menu-button">Placeholder 4</button>
        </div>
      </div>
    </div>
  )
}

export default App

