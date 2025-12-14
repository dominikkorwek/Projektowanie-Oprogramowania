/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './ThresholdForm.css'
import ErrorModal from './ErrorModal'

function ThresholdForm({ selectedSensor, onSubmit, onBack, errors, errorType }) {
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [thresholds, setThresholds] = useState([
    { id: 1, metric: '', operator: '', value: '', message: '' },
    { id: 2, metric: '', operator: '', value: '', message: '' },
    { id: 3, metric: '', operator: '', value: '', message: '' }
  ])

  useEffect(() => {
    if (errors && errors.length > 0) {
      setShowErrorModal(true)
    }
  }, [errors])

  const handleAddThreshold = () => {
    const newId = Math.max(...thresholds.map(t => t.id), 0) + 1
    setThresholds([...thresholds, { id: newId, metric: '', operator: '', value: '', message: '' }])
  }

  const handleDeleteThreshold = (id) => {
    setThresholds(thresholds.filter(t => t.id !== id))
  }

  const handleThresholdChange = (id, field, value) => {
    setThresholds(thresholds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

  const handleReset = () => {
    setThresholds([
      { id: 1, metric: '', operator: '', value: '', message: '' },
      { id: 2, metric: '', operator: '', value: '', message: '' },
      { id: 3, metric: '', operator: '', value: '', message: '' }
    ])
  }

  const handleApply = (e) => {
    e.preventDefault()
    
    // Filtruj tylko wypełnione progi
    const filledThresholds = thresholds.filter(t => 
      t.metric && t.operator && t.value && t.message
    )
    
    if (filledThresholds.length === 0) {
      return
    }

    // Przekształć dane do formatu oczekiwanego przez onSubmit
    // Używamy pierwszego wypełnionego progu (można później rozszerzyć o obsługę wielu)
    const firstThreshold = filledThresholds[0]
    
    // Stwórz syntetyczne zdarzenie formularza
    const syntheticEvent = {
      preventDefault: () => {},
      target: {
        querySelector: () => ({
          get: (name) => {
            if (name === 'thresholdValue') return firstThreshold.value
            if (name === 'condition') return firstThreshold.operator
            if (name === 'warningMessage') return firstThreshold.message
            return null
          }
        })
      }
    }
    
    if (onSubmit) {
      onSubmit(syntheticEvent)
    }
  }

  return (
    <div className="threshold-form">
      <div className="header">
        <div className="header-title">MooMeter</div>
        <button className="header-back-button" onClick={onBack}>
          Wróć
        </button>
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={errorType || 'format'}
        message={errors && errors.length > 0 ? errors[0] : ''}
      />

      <div className="content">
        <div className="thresholds-list">
          {thresholds.map((threshold) => (
            <div key={threshold.id} className="threshold-row">
              <select
                className="threshold-field threshold-select"
                value={threshold.metric}
                onChange={(e) => handleThresholdChange(threshold.id, 'metric', e.target.value)}
              >
                <option value="">Metryka</option>
                <option value="temperatura">Temperatura</option>
                <option value="cisnienie">Ciśnienie</option>
                <option value="stezenie_metanu">Stężenie metanu</option>
              </select>
              <select
                className="threshold-field threshold-select"
                value={threshold.operator}
                onChange={(e) => handleThresholdChange(threshold.id, 'operator', e.target.value)}
              >
                <option value="">Operator</option>
                <option value="greater">Większe niż</option>
                <option value="less">Mniejsze niż</option>
                <option value="equal">Równe</option>
                <option value="greater_equal">Większe lub równe</option>
                <option value="less_equal">Mniejsze lub równe</option>
              </select>
              <input
                type="number"
                className="threshold-field"
                placeholder="Wartość"
                value={threshold.value}
                onChange={(e) => handleThresholdChange(threshold.id, 'value', e.target.value)}
                step="any"
              />
              <input
                type="text"
                className="threshold-field"
                placeholder="Komunikat"
                value={threshold.message}
                onChange={(e) => handleThresholdChange(threshold.id, 'message', e.target.value)}
              />
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteThreshold(threshold.id)}
              >
                Usuń
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-threshold-button"
          onClick={handleAddThreshold}
        >
          Dodaj nowy próg alarmowy
        </button>

        <div className="action-buttons">
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Resetuj
          </button>
          <button
            type="button"
            className="apply-button"
            onClick={handleApply}
          >
            Zastosuj
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThresholdForm

