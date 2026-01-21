/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import './Header.css'

/**
 * Application header component with data synchronization functionality.
 * 
 * Displays the application title "MooMeter" and a synchronization button that transitions through
 * various states: started, sending, loading, success, and error. Additionally provides
 * optional navigation buttons "Back" and "Exit".
 * 
 * Sync states: 'started', 'sending', 'loading', 'success', 'error'
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} [props.onBack] - Callback function invoked when the "Back" button is clicked
 * @param {Function} [props.onExit] - Callback function invoked when the "Exit" button is clicked
 * @param {string} [props.backLabel='Wróć'] - Label for the back button
 * @param {string} [props.exitLabel='Wyjdź'] - Label for the exit button
 * @returns {JSX.Element} Rendered header component
 */
function Header({ onBack, onExit, backLabel = 'Wróć', exitLabel = 'Wyjdź' }) {
  const [syncState, setSyncState] = useState('started')
  const [syncKey, setSyncKey] = useState(0)

  /**
   * Resets the synchronization state and starts a new synchronization cycle.
   * 
   * Sets the sync state to 'started' and increments the sync key,
   * which triggers the synchronization effect to run again.
   * 
   * @function
   * @returns {void}
   */
  const startSync = useCallback(() => {
    setSyncState('started')
    setSyncKey(prev => prev + 1)
  }, [])

  /**
   * Effect simulating the synchronization flow through different states.
   * 
   * Guides synchronization through the following stages:
   * 1. After 1s: changes state to 'sending' (Sending data)
   * 2. After 2.5s: changes state to 'loading' (Loading spinner)
   * 3. After 3.5s: randomly finishes as 'success' or 'error' (50/50)
   * 
   * The effect re-runs whenever syncKey changes.
   */
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

  /**
   * Returns appropriate JSX content for the sync button depending on the current state.
   * 
   * Maps synchronization state to corresponding UI elements:
   * - 'started': Spinning icon + text "Synchronizacja rozpoczęta"
   * - 'sending': Spinning icon + text "Przesyłanie danych"
   * - 'loading': Only spinning icon
   * - 'success': Only static icon
   * - 'error': Static icon + text "Błąd synchronizacji"
   * 
   * @function
   * @returns {JSX.Element|null} JSX element representing sync state or null for unknown state
   */
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
