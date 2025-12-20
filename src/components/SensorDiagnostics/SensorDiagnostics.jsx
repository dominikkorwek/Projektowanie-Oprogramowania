/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './SensorDiagnostics.css'
import { sensorService } from '../../services/sensorService'
import Header from '../Header/Header'

function SensorDiagnostics({ onBack }) {
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [testIdCounter, setTestIdCounter] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  
  // Stan początkowy - zostanie załadowany z sensorService
  const [diagnosticResults, setDiagnosticResults] = useState([])

  // Załaduj listę czujników z sensorService
  useEffect(() => {
    const loadSensors = async () => {
      try {
        const data = await sensorService.getAvailableSensors()
        // Generuj początkowe wyniki diagnostyczne z dataTypes
        const initialResults = data.dataTypes.map((dataType, index) => ({
          id: dataType.id,
          name: dataType.name,
          value: 'WARTOŚĆ',
          // Mockowane statusy - niektóre OK, niektóre error (ostatni test miał błędy)
          status: index === 2 || index === 4 ? 'error' : 'ok'
        }))
        setDiagnosticResults(initialResults)
        setIsLoading(false)
      } catch (error) {
        console.error('Błąd podczas ładowania czujników:', error)
        setIsLoading(false)
      }
    }
    loadSensors()
  }, [])

  // Historia wszystkich testów - kumuluje się
  const [testHistory, setTestHistory] = useState([
    { id: 4, date: '20.12.2024', errorType: 'TYP BŁĘDU', status: 'error' },
    { id: 3, date: '19.12.2024', errorType: 'Brak błędów', status: 'ok' },
    { id: 2, date: '18.12.2024', errorType: 'TYP BŁĘDU', status: 'error' },
    { id: 1, date: '17.12.2024', errorType: 'Brak błędów', status: 'ok' },
  ])

  const runDiagnostics = async () => {
    setIsDiagnosing(true)
    const currentDate = new Date().toLocaleDateString('pl-PL')
    const currentTestId = testIdCounter
    
    // Dodaj wpis "Diagnozowanie" na czas trwania testu
    const diagnosingEntry = {
      id: currentTestId,
      date: currentDate,
      errorType: 'Diagnozowanie...',
      status: 'diagnosing'
    }
    setTestHistory(prev => [diagnosingEntry, ...prev])
    setTestIdCounter(prev => prev + 1)
    
    // Symulacja diagnozowania - w przyszłości będzie to prawdziwe API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 50/50 szansa: albo wszystko OK, albo są błędy
    const allGreen = Math.random() > 0.5
    
    let newResults
    let newTestEntry
    
    if (allGreen) {
      // Wszystkie czujniki OK
      newResults = diagnosticResults.map(sensor => ({
        ...sensor,
        status: 'ok'
      }))
      // Dodaj wpis o pomyślnym teście
      newTestEntry = {
        id: currentTestId,
        date: currentDate,
        errorType: 'Brak błędów',
        status: 'ok'
      }
    } else {
      // Niektóre czujniki mają błędy
      newResults = diagnosticResults.map(sensor => ({
        ...sensor,
        status: Math.random() > 0.5 ? 'ok' : 'error'
      }))
      // Upewnij się, że jest przynajmniej jeden błąd
      const hasAnyError = newResults.some(s => s.status === 'error')
      if (!hasAnyError) {
        newResults[0].status = 'error'
      }
      // Dodaj wpis o teście z błędami
      newTestEntry = {
        id: currentTestId,
        date: currentDate,
        errorType: 'TYP BŁĘDU',
        status: 'error'
      }
    }
    
    // Zaktualizuj wpis "Diagnozowanie" na rzeczywisty wynik
    setTestHistory(prev => prev.map(entry => 
      entry.id === currentTestId ? newTestEntry : entry
    ))
    setDiagnosticResults(newResults)
    setIsDiagnosing(false)
  }

  const getStatusClass = (status) => {
    if (status === 'ok') return 'status-ok'
    if (status === 'diagnosing') return 'status-diagnosing'
    return 'status-error'
  }

  const getStatusText = () => {
    return 'STAN'
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
                <span className="history-date">{test.date}</span>
                <span className="history-type">{test.errorType}</span>
                <button className={`status-button ${getStatusClass(test.status)}`}>
                  {getStatusText()}
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
                    {getStatusText()}
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

