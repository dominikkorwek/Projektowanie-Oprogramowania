/**
 * User Data Analysis - Analysis Form Module
 * Form for configuring user data analysis parameters.
 * @module AnalysisForm
 */

/* eslint-disable react/prop-types */
import { useState } from 'react'
import './AnalysisForm.css'
import Header from '../Header/Header'

/**
 * Analysis form component for configuring data analysis with metrics and conditions.
 * 
 * Displays an interface for setting up data analysis with configurable metrics and conditions.
 * The component consists of three sections:
 * - Metrics section: Dynamic list of metric rows (metric type, operator, value)
 * - Conditions section: Dynamic list of condition rows (attribute, operator, value)
 * - Checkbox option for creating collective recommendations
 * 
 * Each section supports adding multiple rows, deleting rows, and resetting to initial state.
 * The form can apply the configured analysis, which filters empty entries and passes
 * only filled metrics and conditions to the onApply callback.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onBack - Callback function invoked when the "Back" button is clicked
 * @param {Function} props.onSubmit - Optional callback function for form submission (currently not used)
 * @param {Function} props.onApply - Callback function invoked when "Zastosuj" (Apply) button is clicked, receives an object with metrics, conditions, and createCollectiveRecommendation
 * @returns {JSX.Element} Rendered analysis form component
 */
function AnalysisForm({ onBack, onSubmit, onApply }) {
  const [metrics, setMetrics] = useState([
    { id: 1, metric: '', operator: '', value: '' }
  ])

  const [conditions, setConditions] = useState([
    { id: 1, attribute: '', operator: '', value: '' }
  ])

  const [createCollectiveRecommendation, setCreateCollectiveRecommendation] = useState(false)

  /**
   * Adds a new empty metric row to the metrics section.
   * 
   * Creates a new metric entry with a unique ID and empty fields.
   * The new ID is calculated as the maximum existing metric ID plus 1.
   * 
   * @function
   */
  const handleAddMetric = () => {
    const newId = Math.max(...metrics.map(m => m.id), 0) + 1
    setMetrics([...metrics, { id: newId, metric: '', operator: '', value: '' }])
  }

  /**
   * Removes a metric row from the metrics section by its ID.
   * 
   * Filters out the metric with the specified ID from the metrics array.
   * 
   * @function
   * @param {number} id - The ID of the metric row to remove
   */
  const handleDeleteMetric = (id) => {
    setMetrics(metrics.filter(m => m.id !== id))
  }

  /**
   * Updates a specific field of a metric row.
   * 
   * Modifies the metric with the specified ID by updating the given field with the new value.
   * Other fields of the metric remain unchanged.
   * 
   * @function
   * @param {number} id - The ID of the metric row to update
   * @param {string} field - The field name to update ('metric', 'operator', or 'value')
   * @param {string} value - The new value for the specified field
   */
  const handleMetricChange = (id, field, value) => {
    setMetrics(metrics.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  /**
   * Adds a new empty condition row to the conditions section.
   * 
   * Creates a new condition entry with a unique ID and empty fields.
   * The new ID is calculated as the maximum existing condition ID plus 1.
   * 
   * @function
   */
  const handleAddCondition = () => {
    const newId = Math.max(...conditions.map(c => c.id), 0) + 1
    setConditions([...conditions, { id: newId, attribute: '', operator: '', value: '' }])
  }

  /**
   * Removes a condition row from the conditions section by its ID.
   * 
   * Filters out the condition with the specified ID from the conditions array.
   * 
   * @function
   * @param {number} id - The ID of the condition row to remove
   */
  const handleDeleteCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  /**
   * Updates a specific field of a condition row.
   * 
   * Modifies the condition with the specified ID by updating the given field with the new value.
   * Other fields of the condition remain unchanged.
   * 
   * @function
   * @param {number} id - The ID of the condition row to update
   * @param {string} field - The field name to update ('attribute', 'operator', or 'value')
   * @param {string} value - The new value for the specified field
   */
  const handleConditionChange = (id, field, value) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  /**
   * Resets the form to its initial state.
   * 
   * Restores metrics and conditions arrays to single empty rows and resets
   * the createCollectiveRecommendation checkbox to false.
   * 
   * @function
   */
  const handleReset = () => {
    setMetrics([{ id: 1, metric: '', operator: '', value: '' }])
    setConditions([{ id: 1, attribute: '', operator: '', value: '' }])
    setCreateCollectiveRecommendation(false)
  }

  /**
   * Handles form application by filtering filled entries and invoking onApply callback.
   * 
   * Filters metrics and conditions to include only rows where all fields are filled,
   * then invokes the onApply callback with an object containing:
   * - metrics: Array of filled metric objects
   * - conditions: Array of filled condition objects
   * - createCollectiveRecommendation: Boolean indicating if collective recommendations should be created
   * 
   * @function
   */
  const handleApply = () => {
    if (onApply) {
      onApply({
        metrics: metrics.filter(m => m.metric && m.operator && m.value),
        conditions: conditions.filter(c => c.attribute && c.operator && c.value),
        createCollectiveRecommendation
      })
    }
  }

  return (
    <div className="analysis-form">
      <Header onBack={onBack} />

      <div className="content">
        {/* Sekcja Metryki */}
        <div className="section">
          <div className="metrics-list">
            {metrics.map((metric) => (
              <div key={metric.id} className="metric-row">
                <select
                  className="form-field form-select"
                  value={metric.metric}
                  onChange={(e) => handleMetricChange(metric.id, 'metric', e.target.value)}
                >
                  <option value="">Metryka</option>
                  <option value="temperatura">Temperatura</option>
                  <option value="cisnienie">Ciśnienie</option>
                  <option value="stezenie_metanu">Stężenie metanu</option>
                </select>
                <select
                  className="form-field form-select"
                  value={metric.operator}
                  onChange={(e) => handleMetricChange(metric.id, 'operator', e.target.value)}
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
                  className="form-field"
                  placeholder="Wartość"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(metric.id, 'value', e.target.value)}
                  step="any"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteMetric(metric.id)}
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-button"
            onClick={handleAddMetric}
          >
            Dodaj nową metrykę
          </button>
        </div>

        {/* Sekcja Warunki */}
        <div className="section">
          <div className="conditions-list">
            {conditions.map((condition) => (
              <div key={condition.id} className="condition-row">
                <select
                  className="form-field form-select"
                  value={condition.attribute}
                  onChange={(e) => handleConditionChange(condition.id, 'attribute', e.target.value)}
                >
                  <option value="">Atrybut</option>
                  <option value="wiek">Wiek</option>
                  <option value="lokalizacja">Lokalizacja</option>
                  <option value="typ">Typ</option>
                </select>
                <select
                  className="form-field form-select"
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(condition.id, 'operator', e.target.value)}
                >
                  <option value="">Operator</option>
                  <option value="greater">Większe niż</option>
                  <option value="less">Mniejsze niż</option>
                  <option value="equal">Równe</option>
                  <option value="greater_equal">Większe lub równe</option>
                  <option value="less_equal">Mniejsze lub równe</option>
                </select>
                <input
                  type="text"
                  className="form-field"
                  placeholder="Wartość"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteCondition(condition.id)}
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-button"
            onClick={handleAddCondition}
          >
            Dodaj nowy warunek
          </button>
        </div>

        {/* Checkbox dla rekomendacji zbiorczych */}
        <div className="recommendation-section">
          <label className="checkbox-label">
            <span>Stworz rekomendacje zbiorczą</span>
            <input
              type="checkbox"
              checked={createCollectiveRecommendation}
              onChange={(e) => setCreateCollectiveRecommendation(e.target.checked)}
              className="checkbox-input"
            />
          </label>
        </div>

        {/* Przyciski akcji */}
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

export default AnalysisForm



