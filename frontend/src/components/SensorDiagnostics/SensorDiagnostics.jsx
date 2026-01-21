/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './SensorDiagnostics.css'
import { apiClient } from '../../services/apiClient'
import Header from '../Header/Header'

/**
 * Sensor diagnostics component with diagnostic test history.
 * 
 * Displays an interface for running sensor diagnostics and viewing the history of previous tests.
 * The component consists of two sections:
 * - Left side: Diagnostic test history with dates and statuses
 * - Right side: Table of individual sensor statuses
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onBack - Callback function invoked when the "Back" button is clicked
 * @returns {JSX.Element} Rendered sensor diagnostics component
 */
function SensorDiagnostics({ onBack }) {
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticResults, setDiagnosticResults] = useState([])
  const [testHistory, setTestHistory] = useState([])

  /**
   * Effect that loads sensor data and diagnostic test history on component mount.
   * 
   * Fetches available sensors and diagnostic test history in parallel, then initializes
   * the diagnostic results with mock data (some sensors have 'error' status for demonstration).
   * The test history is sorted in descending order by date.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sensorsData, history] = await Promise.all([
          apiClient.getAvailableSensors(),
          apiClient.getDiagnosticTests()
        ])

        setTestHistory(history.sort((a, b) => new Date(b.date) - new Date(a.date)))

        const initialResults = sensorsData.dataTypes.map((dataType, index) => ({
          id: dataType.id,
          name: dataType.name,
          value: 'WARTOŚĆ',
          status: index === 2 || index === 4 ? 'error' : 'ok'
        }))
        setDiagnosticResults(initialResults)
        setIsLoading(false)
      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error)
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  /**
   * Formats a date string to a localized date-time format.
   * 
   * Converts an ISO date string to a human-readable format using the browser's locale settings.
   * If parsing fails, returns the original string.
   * 
   * @function
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string in locale format (YYYY-MM-DD HH:MM) or original string if parsing fails
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  /**
   * Runs diagnostic tests on all sensors.
   * 
   * Creates a new diagnostic test entry with 'diagnosing' status, simulates a 2-second
   * diagnostic process, then randomly determines sensor statuses. Updates the test history
   * with the final result (either 'error' with error type or 'ok' with no errors).
   * 
   * The diagnostic process:
   * 1. Creates a 'diagnosing' entry in the database and history
   * 2. Waits 2 seconds to simulate diagnostics
   * 3. Randomly assigns 'ok' or 'error' status to each sensor
   * 4. Updates the database entry and history with final results
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const runDiagnostics = async () => {
    setIsDiagnosing(true)
    
    try {
      // Send sensors to backend for diagnostics
      const sensorsToTest = diagnosticResults.map(sensor => ({
        id: sensor.id,
        name: sensor.name
      }))
      
      // Backend handles the entire diagnostic process
      const result = await apiClient.runDiagnostics(sensorsToTest)
      
      // Update test history with the result
      setTestHistory(prev => {
        const filtered = prev.filter(e => e.id !== result.id)
        return [result, ...filtered]
      })
      
      // Update sensor results if backend returned them
      if (result.sensorResults) {
        const newResults = diagnosticResults.map(sensor => {
          const backendResult = result.sensorResults.find(r => r.id === sensor.id)
          return backendResult ? { ...sensor, status: backendResult.status } : sensor
        })
        setDiagnosticResults(newResults)
      }
    } catch (error) {
      console.error('Błąd podczas diagnostyki:', error)
    } finally {
      setIsDiagnosing(false)
    }
  }

  /**
   * Returns the appropriate CSS class name based on the diagnostic status.
   * 
   * Maps status values to CSS class names for visual representation:
   * - 'ok' -> 'status-ok'
   * - 'diagnosing' -> 'status-diagnosing'
   * - any other value -> 'status-error'
   * 
   * @function
   * @param {string} status - Status value ('ok', 'diagnosing', 'error', etc.)
   * @returns {string} CSS class name corresponding to the status
   */
  const getStatusClass = (status) => {
    if (status === 'ok') return 'status-ok'
    if (status === 'diagnosing') return 'status-diagnosing'
    return 'status-error'
  }

  return (
    <div className="sensor-diagnostics">
      <Header onBack={onBack} />

      <div className="content-wrapper">
        {/* Lewa strona - Diagnostyka */}
        <div className="diagnostics-section">
          <div className="section-header">
            <div className="section-title">Diagnostyka czujników</div>
            <button
              className={`run-button ${isDiagnosing ? 'diagnosing' : ''}`}
              onClick={runDiagnostics}
              disabled={isDiagnosing}
            >
              {isDiagnosing ? 'Trwa diagnozowanie' : 'Uruchom'}
            </button>
          </div>

          <div className="test-history">
            {testHistory.map((test) => (
              <div key={test.id} className="history-row">
                <span className="history-date">{formatDate(test.date)}</span>
                <span className="history-type">{test.errorType}</span>
                <button className={`status-button ${getStatusClass(test.status)}`}>
                  STAN
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Prawa strona - Status czujników */}
        <div className="sensors-section">
          <div className="sensors-table">
            {isLoading ? (
              <div className="loading-message">Ładowanie czujników...</div>
            ) : (
              diagnosticResults.map((sensor) => (
                <div key={sensor.id} className="sensor-row">
                  <span className="sensor-name">{sensor.name}</span>
                  <span className="sensor-value">
                    {isDiagnosing ? <span className="loading-spinner"></span> : sensor.value}
                  </span>
                  <button className={`status-button ${isDiagnosing ? 'status-diagnosing' : getStatusClass(sensor.status)}`}>
                    STAN
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensorDiagnostics
