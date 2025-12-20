/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import './Header.css'

// Sync states: 'started', 'sending', 'loading', 'success', 'error'
function Header({ onBack, onExit, backLabel = 'Wróć', exitLabel = 'Wyjdź' }) {
  const [syncState, setSyncState] = useState('started')
  const [syncKey, setSyncKey] = useState(0)

  const startSync = useCallback(() => {
    setSyncState('started')
    setSyncKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    // Mock synchronization flow
    const timers = []

    // State 1: "Synchronizacja rozpoczęta" -> after 1s go to "Przesyłanie danych"
    timers.push(setTimeout(() => {
      setSyncState('sending')
    }, 1000))

    // State 2: "Przesyłanie danych" -> after 1.5s go to loading spinner only
    timers.push(setTimeout(() => {
      setSyncState('loading')
    }, 2500))

    // State 3: Loading -> after 1s resolve to success or error (50/50)
    timers.push(setTimeout(() => {
      const isSuccess = Math.random() >= 0.5
      setSyncState(isSuccess ? 'success' : 'error')
    }, 3500))

    return () => timers.forEach(t => clearTimeout(t))
  }, [syncKey])

  const getSyncStatusContent = () => {
    switch (syncState) {
      case 'started':
        return (
          <>
            <span className="sync-icon spinning">↻</span>
            <span>Synchronizacja rozpoczęta</span>
          </>
        )
      case 'sending':
        return (
          <>
            <span className="sync-icon spinning">↻</span>
            <span>Przesyłanie danych</span>
          </>
        )
      case 'loading':
        return (
          <span className="sync-icon spinning">↻</span>
        )
      case 'success':
        return (
          <span className="sync-icon">↻</span>
        )
      case 'error':
        return (
          <>
            <span className="sync-icon">↻</span>
            <span>Błąd synchronizacji</span>
          </>
        )
      default:
        return null
    }
  }

  const isClickable = syncState === 'success' || syncState === 'error'

  return (
    <div className="header">
      <div className="header-left">
        <div className="header-title">MooMeter</div>
        <button 
          className={`sync-status sync-${syncState} ${isClickable ? 'clickable' : ''}`}
          onClick={isClickable ? startSync : undefined}
          disabled={!isClickable}
        >
          {getSyncStatusContent()}
        </button>
      </div>
      {onBack && (
        <button className="header-back-button" onClick={onBack}>
          {backLabel}
        </button>
      )}
      {onExit && (
        <button className="header-exit-button" onClick={onExit}>
          {exitLabel}
        </button>
      )}
    </div>
  )
}

export default Header
