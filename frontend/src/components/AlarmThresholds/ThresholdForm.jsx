/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './ThresholdForm.css'
import ErrorModal from './ErrorModal'
import Header from '../Header/Header'

/**
 * Threshold form component for configuring alarm thresholds and warning conditions.
 * 
 * Displays an interface for setting up alarm thresholds with multiple configurable rows.
 * Each threshold row consists of:
 * - Metric selector (temperature, pressure, methane concentration)
 * - Operator selector (greater than, less than, equal, etc.)
 * - Value input field
 * - Warning message input field
 * 
 * The component supports adding multiple thresholds, resetting the form, and applying
 * the configured thresholds. Validation errors are displayed in an ErrorModal.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.selectedSensor - The selected sensor object with id, name, and type
 * @param {Function} props.onSubmit - Callback function invoked when the form is submitted, receives a synthetic form event
 * @param {Function} props.onBack - Callback function invoked when the "Back" button is clicked
 * @param {Array<string>} props.errors - Array of error messages to display in the ErrorModal
 * @param {string} props.errorType - Type of error ('format' or 'business') for ErrorModal display
 * @returns {JSX.Element} Rendered threshold form component
 */
function ThresholdForm({ selectedSensor, onSubmit, onBack, errors, errorType }) {
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [thresholds, setThresholds] = useState([
    { id: 1, metric: '', operator: '', value: '', message: '' },
    { id: 2, metric: '', operator: '', value: '', message: '' },
    { id: 3, metric: '', operator: '', value: '', message: '' }
  ])

  /**
   * Effect that displays ErrorModal when validation errors are present.
   * 
   * Monitors the errors prop and automatically opens the ErrorModal if any errors exist.
   * The modal displays error messages based on the errorType prop.
   */
  useEffect(() => {
    if (errors && errors.length > 0) {
      setShowErrorModal(true)
    }
  }, [errors])

  /**
   * Adds a new empty threshold row to the form.
   * 
   * Creates a new threshold entry with a unique ID and empty fields.
   * The new ID is calculated as the maximum existing ID plus 1.
   * 
   * @function
   */
  const handleAddThreshold = () => {
    const newId = Math.max(...thresholds.map(t => t.id), 0) + 1
    setThresholds([...thresholds, { id: newId, metric: '', operator: '', value: '', message: '' }])
  }

  /**
   * Removes a threshold row from the form by its ID.
   * 
   * Filters out the threshold with the specified ID from the thresholds array.
   * 
   * @function
   * @param {number} id - The ID of the threshold row to remove
   */
  const handleDeleteThreshold = (id) => {
    setThresholds(thresholds.filter(t => t.id !== id))
  }

  /**
   * Updates a specific field of a threshold row.
   * 
   * Modifies the threshold with the specified ID by updating the given field with the new value.
   * Other fields of the threshold remain unchanged.
   * 
   * @function
   * @param {number} id - The ID of the threshold row to update
   * @param {string} field - The field name to update ('metric', 'operator', 'value', or 'message')
   * @param {string} value - The new value for the specified field
   */
  const handleThresholdChange = (id, field, value) => {
    setThresholds(thresholds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

  /**
   * Resets the form to its initial state with three empty threshold rows.
   * 
   * Restores the thresholds array to the default three empty rows.
   * 
   * @function
   */
  const handleReset = () => {
    setThresholds([
      { id: 1, metric: '', operator: '', value: '', message: '' },
      { id: 2, metric: '', operator: '', value: '', message: '' },
      { id: 3, metric: '', operator: '', value: '', message: '' }
    ])
  }

  /**
   * Handles form submission by converting threshold data to the expected format.
   * 
   * Filters only filled thresholds (all fields must have values), then creates a synthetic
   * form event that mimics the structure expected by the onSubmit callback. Currently uses
   * only the first filled threshold, but can be extended to support multiple thresholds.
   * 
   * The synthetic event provides access to form data through target.querySelector().get()
   * method, mapping threshold fields to form field names:
   * - value -> 'thresholdValue'
   * - operator -> 'condition'
   * - message -> 'warningMessage'
   * 
   * @function
   * @param {Event} e - Form submission event
   */
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
      <Header onBack={onBack} />

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

