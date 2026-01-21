/**
 * Main Application Component
 * Manages application state, routing, and user authentication.
 * @module App
 */

import { useState, useEffect } from 'react'
import './App.css'
import MainMenu from './components/MainMenu'
import Login from './components/Login/Login'
import SensorList from './components/AlarmThresholds/SensorList'
import ThresholdForm from './components/AlarmThresholds/ThresholdForm'
import SuccessMessage from './components/AlarmThresholds/SuccessMessage'
import DataSummary from './components/UserDataAnalysis/DataSummary'
import AnalysisForm from './components/UserDataAnalysis/AnalysisForm'
import AnalysisResults from './components/UserDataAnalysis/AnalysisResults'
import RecommendationsReview from './components/UserDataAnalysis/RecommendationsReview'
import SensorDiagnostics from './components/SensorDiagnostics/SensorDiagnostics'
import ExportPanel from './components/ExportData/ExportPanel'
import ManageFodder from './components/ManageFodder/ManageFodder'
import { apiClient } from './services/apiClient'
import AlertModal from './components/AlertModal/AlertModal'
import AirQuality from './components/AirQuality/AirQuality'

/**
 * Main application component.
 * Manages routing between different views and handles user authentication.
 * @returns {JSX.Element} The application root component
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('menu') // 'menu', 'sensor-list', 'threshold-form', 'success', 'data-summary', 'analysis-form', 'analysis-results', 'recommendations-review'
  const [sensors, setSensors] = useState(null)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [formErrors, setFormErrors] = useState([])
  const [errorType, setErrorType] = useState(null) // 'format' or 'business'
  const [successMessage, setSuccessMessage] = useState('')

  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = (user) => {
    setIsLoggedIn(true)
    setUser(user)
  }

  // Allow opening export panel directly via URL (e.g. /export, ?view=export or #export)
  useEffect(() => {
    try {
      const p = window.location.pathname || ''
      const params = new URLSearchParams(window.location.search)
      const hash = window.location.hash || ''
      if (p.includes('/export') || params.get('view') === 'export' || hash === '#export') {
        setIsLoggedIn(true)
        setCurrentView('export-panel')
      }
    } catch (e) {
      // ignore in non-browser env
    }
  }, [])

  const handleSelectOption = (option) => {
    if (option === 'alarm-thresholds') {
      setCurrentView('sensor-list')
      loadSensors()
    } else if (option === 'user-data-analysis') {
      setCurrentView('data-summary')
      loadUserData()
    } else if (option === 'sensor-diagnostics') {
      setCurrentView('sensor-diagnostics')
    } else if (option === 'export-data') {
      setCurrentView('export-panel')
      // optionally preload data
      loadSensors()
      loadUserData()
    } else if (option === 'manage-fodder') {
      setCurrentView('manage-fodder')
    } else if (option === 'air-quality') {
      setCurrentView('air-quality')
    }
  }

  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Run alerts check only when the user opens the Air Quality view
    if (!isLoggedIn || currentView !== 'air-quality') return

    const checkAlerts = async () => {
      try {
        const alertsToShow = await fetch('/api/alerts').then(r => r.json())
        if (Array.isArray(alertsToShow) && alertsToShow.length > 0) {
          setAlerts(alertsToShow)
        }
      } catch (err) {
        console.error('Błąd sprawdzania alertów:', err)
      }
    }

    checkAlerts()
  }, [isLoggedIn, currentView])

  const loadUserData = async () => {
    // Symulacja ładowania danych użytkowników
    // W przyszłości będzie to prawdziwe API call
    try {
      // Tutaj będzie logika ładowania danych
      console.log('Ładowanie danych użytkowników...')
    } catch (error) {
      console.error('Błąd podczas ładowania danych użytkowników:', error)
    }
  }

  const handleSelectAnalysis = (analysis) => {
    // Obsługa wyboru konkretnej analizy
    console.log('Wybrano analizę:', analysis)
    setCurrentView('analysis-form')
  }

  const [shouldShowRecommendations, setShouldShowRecommendations] = useState(false)

  const handleAnalysisApply = (data) => {
    // Obsługa zastosowania analizy
    console.log('Zastosowano analizę:', data)
    
    // Jeśli użytkownik wybrał opcję tworzenia rekomendacji zbiorczych
    if (data.createCollectiveRecommendation) {
      setShouldShowRecommendations(true)
      // Od razu przejdź do ekranu rekomendacji
      setCurrentView('recommendations-review')
    } else {
      setShouldShowRecommendations(false)
      // Przejście do ekranu wyników analizy
      setCurrentView('analysis-results')
    }
  }

  const handleShowRecommendations = () => {
    // Przejście do ekranu weryfikacji rekomendacji
    setCurrentView('recommendations-review')
  }

  const handleApproveRecommendations = (recommendations) => {
    // Zapisanie zatwierdzonych rekomendacji
    console.log('Zatwierdzono rekomendacje:', recommendations)
    // Tutaj będzie zapis do bazy danych
    // Po zapisaniu wyświetl komunikat o powodzeniu
    setCurrentView('menu') // Tymczasowo wracamy do menu
  }

  const handleCancelRecommendations = () => {
    // Anulowanie tworzenia rekomendacji
    console.log('Anulowano tworzenie rekomendacji')
    // Wyświetl komunikat o anulowaniu
    setCurrentView('analysis-results') // Wracamy do wyników analizy
  }

  const handleExit = () => {
    // Powrót do menu głównego
    setCurrentView('menu')
  }

  const loadSensors = async () => {
    try {
      const data = await apiClient.getAvailableSensors()
      setSensors(data)
    } catch (error) {
      console.error('Błąd podczas ładowania sensorów:', error)
      setSensors([])
    }
  }

  const handleSelectSensor = (sensor) => {
    setSelectedSensor(sensor)
    setFormErrors([])
    setErrorType(null)
    setCurrentView('threshold-form')
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormErrors([])

    // Obsługa zarówno FormData jak i syntetycznego zdarzenia
    let thresholdData
    if (e.target.querySelector) {
      const formData = e.target.querySelector()
      thresholdData = {
        sensorId: selectedSensor.id,
        thresholdValue: formData.get('thresholdValue'),
        condition: formData.get('condition'),
        warningMessage: formData.get('warningMessage')
      }
    } else {
      const formData = new FormData(e.target)
      thresholdData = {
        sensorId: selectedSensor.id,
        thresholdValue: formData.get('thresholdValue'),
        condition: formData.get('condition'),
        warningMessage: formData.get('warningMessage')
      }
    }

    // Submit to backend - validation happens there
    try {
      const result = await apiClient.createAlarmThreshold(thresholdData)
      // Backend returns { ok: true, data: created } on success
      if (result) {
        setSuccessMessage('Progi alarmowe i warunki ostrzegania zostały pomyślnie zapisane w bazie danych.')
        setCurrentView('success')
      }
    } catch (error) {
      // Backend returns { errors: [...], errorType: 'format'|'business' } on validation failure
      if (error.errors && error.errors.length > 0) {
        setFormErrors(error.errors)
        setErrorType(error.errorType || 'format')
      } else {
        setFormErrors(['Wystąpił błąd podczas zapisywania danych.'])
        setErrorType('format')
      }
    }
  }

  const handleBack = () => {
    if (currentView === 'threshold-form') {
      setCurrentView('sensor-list')
      setSelectedSensor(null)
      setFormErrors([])
      setErrorType(null)
    } else if (currentView === 'sensor-list') {
      setCurrentView('menu')
      setSensors([])
    } else if (currentView === 'data-summary') {
      setCurrentView('menu')
    } else if (currentView === 'analysis-form') {
      setCurrentView('data-summary')
    } else if (currentView === 'analysis-results') {
      setCurrentView('analysis-form')
    } else if (currentView === 'recommendations-review') {
      setCurrentView('analysis-results')
    } else if (currentView === 'sensor-diagnostics') {
      setCurrentView('menu')
    } else if (currentView === 'manage-fodder') {
      setCurrentView('menu')
    } else if (currentView === 'export-panel') {
      setCurrentView('menu')
    } else if (currentView === 'air-quality') {
      setCurrentView('menu')
    }
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
    setSelectedSensor(null)
    setFormErrors([])
    setSuccessMessage('')
    setSensors([])
  }

  if (!isLoggedIn) {
    return (
      <div className="App">
        {!showLogin ? (
          <div className="container">
            <h1 className="title">MOO METER</h1>
            <p className="subtitle">by MooLife</p>
            <button className="login-button" onClick={() => setShowLogin(true)}>
              Zaloguj się
            </button>
          </div>
        ) : (
          <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="App">
      {alerts.length > 0 && (
        <AlertModal alert={alerts[0]} onClose={() => setAlerts(prev => prev.slice(1))} />
      )}
      {currentView === 'menu' && (
        <MainMenu onSelectOption={handleSelectOption} />
      )}
      {currentView === 'sensor-list' && (
        <SensorList
          sensors={sensors}
          onSelectSensor={handleSelectSensor}
          onBack={handleBack}
        />
      )}
      {currentView === 'threshold-form' && (
        <ThresholdForm
          selectedSensor={selectedSensor}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          errors={formErrors}
          errorType={errorType}
        />
      )}
      {currentView === 'success' && (
        <SuccessMessage
          message={successMessage}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentView === 'data-summary' && (
        <DataSummary
          onBack={handleBack}
          onSelectAnalysis={handleSelectAnalysis}
        />
      )}
      {currentView === 'analysis-form' && (
        <AnalysisForm
          onBack={handleBack}
          onApply={handleAnalysisApply}
        />
      )}
      {currentView === 'analysis-results' && (
        <AnalysisResults
          onExit={handleExit}
          onBack={handleBack}
          onShowRecommendations={handleShowRecommendations}
        />
      )}
      {currentView === 'recommendations-review' && (
        <RecommendationsReview
          onApprove={handleApproveRecommendations}
          onCancel={handleCancelRecommendations}
          onExit={handleExit}
        />
      )}
      {currentView === 'sensor-diagnostics' && (
        <SensorDiagnostics
          onBack={handleBack}
        />
      )}
      {currentView === 'export-panel' && (
        <ExportPanel onBack={handleBack} />
      )}
      {currentView === 'manage-fodder' && (
        <ManageFodder onBack={handleBack} />
      )}
      {currentView === 'air-quality' && (
        <AirQuality onBack={handleBack} alert={alerts[0]} />
      )}
    </div>
  )
}

export default App

