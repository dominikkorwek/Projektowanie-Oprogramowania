import { useState, useEffect } from 'react'
import './App.css'
import MainMenu from './components/MainMenu'
import SensorList from './components/AlarmThresholds/SensorList'
import ThresholdForm from './components/AlarmThresholds/ThresholdForm'
import SuccessMessage from './components/AlarmThresholds/SuccessMessage'
import DataSummary from './components/UserDataAnalysis/DataSummary'
import AnalysisForm from './components/UserDataAnalysis/AnalysisForm'
import AnalysisResults from './components/UserDataAnalysis/AnalysisResults'
import RecommendationsReview from './components/UserDataAnalysis/RecommendationsReview'
import { sensorService } from './services/sensorService'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('menu') // 'menu', 'sensor-list', 'threshold-form', 'success', 'data-summary', 'analysis-form', 'analysis-results', 'recommendations-review'
  const [sensors, setSensors] = useState(null)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [formErrors, setFormErrors] = useState([])
  const [errorType, setErrorType] = useState(null) // 'format' or 'business'
  const [successMessage, setSuccessMessage] = useState('')

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSelectOption = (option) => {
    if (option === 'alarm-thresholds') {
      setCurrentView('sensor-list')
      loadSensors()
    } else if (option === 'user-data-analysis') {
      setCurrentView('data-summary')
      loadUserData()
    }
  }

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
    </div>
  )
}

export default App

