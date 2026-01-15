/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './SensorDiagnostics.css'
import { sensorService } from '../../services/sensorService'
import { db } from '../../database/dbClient'
import Header from '../Header/Header'

function SensorDiagnostics({ onBack }) {
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticResults, setDiagnosticResults] = useState([])
  const [testHistory, setTestHistory] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sensorsData, history] = await Promise.all([
          sensorService.getAvailableSensors(),
          db.diagnosticTests.findAll()
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

  const runDiagnostics = async () => {
    setIsDiagnosing(true)
    const currentDate = new Date().toISOString()

    const diagnosingEntry = await db.diagnosticTests.create({
      date: currentDate,
      errorType: 'Diagnozowanie...',
      status: 'diagnosing'
    })
    setTestHistory(prev => [diagnosingEntry, ...prev])

    await new Promise(resolve => setTimeout(resolve, 2000))

    const allGreen = Math.random() > 0.5
    const newResults = diagnosticResults.map(sensor => ({
      ...sensor,
      status: allGreen ? 'ok' : (Math.random() > 0.5 ? 'ok' : 'error')
    }))

    if (!allGreen && !newResults.some(s => s.status === 'error')) {
      newResults[0].status = 'error'
    }

    const hasErrors = newResults.some(r => r.status === 'error')
    const testResult = {
      date: currentDate,
      errorType: hasErrors ? 'TYP BŁĘDU' : 'Brak błędów',
      status: hasErrors ? 'error' : 'ok'
    }

    await db.diagnosticTests.patch(diagnosingEntry.id, testResult)
    setTestHistory(prev => prev.map(e => e.id === diagnosingEntry.id ? { ...e, ...testResult } : e))
    setDiagnosticResults(newResults)
    setIsDiagnosing(false)
  }

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
