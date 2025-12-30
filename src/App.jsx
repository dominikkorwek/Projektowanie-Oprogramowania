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
import { sensorService } from './services/sensorService'
import AlertModal from './components/AlertModal/AlertModal'
import AirQuality from './components/AirQuality/AirQuality'

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

  const handleSelectOption = (option) => {
    if (option === 'alarm-thresholds') {
      setCurrentView('sensor-list')
      loadSensors()
    } else if (option === 'user-data-analysis') {
      setCurrentView('data-summary')
      loadUserData()
    } else if (option === 'sensor-diagnostics') {
      setCurrentView('sensor-diagnostics')
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
        const [measurements, thresholds, sensorsList] = await Promise.all([
          fetch('http://localhost:3001/measurements').then(r => r.json()),
          fetch('http://localhost:3001/alarmThresholds').then(r => r.json()),
          fetch('http://localhost:3001/sensors').then(r => r.json())
        ])

        const exceeded = measurements.filter(m => {
          const t = thresholds.find(th => String(th.sensorId) === String(m.sensorId))
          if (!t) return false
          const val = parseFloat(m.value)
          const thVal = parseFloat(t.thresholdValue)
          if (!Number.isFinite(val) || !Number.isFinite(thVal)) return false
          return (t.condition === 'greater' && val > thVal) || (t.condition === 'less' && val < thVal)
        })

        if (exceeded.length === 0) return

        // Build array of alerts, one per sensor
        const alertsToShow = []
        const bySensor = {}
        for (const e of exceeded) {
          const id = String(e.sensorId)
          bySensor[id] = bySensor[id] || []
          bySensor[id].push(e)
        }

        for (const sid of Object.keys(bySensor)) {
          const group = bySensor[sid]
          const sensor = sensorsList.find(s => String(s.id) === String(sid))
          const values = group.map(g => parseFloat(g.value)).filter(v => Number.isFinite(v))
          const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null
          const startTs = new Date(Math.min(...group.map(g => new Date(g.timestamp).getTime())))
          const startTime = startTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          const firstThreshold = thresholds.find(th => String(th.sensorId) === String(sid))
          alertsToShow.push({
            message: firstThreshold?.warningMessage || 'Przekroczono wartość progową',
            location: sensor ? sensor.name : `Czujnik ${sid}`,
            value: avg,
            unit: sensor?.type === 'co2' ? 'ppm' : sensor?.type === 'pm2_5' || sensor?.type === 'pm10' ? 'µg/m³' : '',
            startTime
          })
        }

        setAlerts(alertsToShow)
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
      const data = await sensorService.getAvailableSensors()
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
        thresholdValue: formData.get('thresholdValue'),
        condition: formData.get('condition'),
        warningMessage: formData.get('warningMessage')
      }
    } else {
      const formData = new FormData(e.target)
      thresholdData = {
        thresholdValue: formData.get('thresholdValue'),
        condition: formData.get('condition'),
        warningMessage: formData.get('warningMessage')
      }
    }

    // Walidacja formatowania
    const formatValidation = sensorService.validateFormat(thresholdData)
    if (!formatValidation.isValid) {
      setFormErrors(formatValidation.errors)
      setErrorType('format')
      return
    }

    // Walidacja biznesowa
    const businessValidation = sensorService.validateBusiness(thresholdData, selectedSensor)
    if (!businessValidation.isValid) {
      setFormErrors(businessValidation.errors)
      setErrorType('business')
      return
    }

    // Zapisz dane
    try {
      const result = await sensorService.saveAlarmThresholds(selectedSensor.id, thresholdData)
      if (result.success) {
        setSuccessMessage(result.message)
        setCurrentView('success')
      }
    } catch (error) {
      setFormErrors(['Wystąpił błąd podczas zapisywania danych.'])
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
      {currentView === 'air-quality' && (
        <AirQuality onBack={handleBack} alert={alerts[0]} />
      )}
    </div>
  )
}

export default App

