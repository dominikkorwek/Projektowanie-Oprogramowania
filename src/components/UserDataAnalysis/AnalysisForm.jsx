import { useState } from 'react'
import './AnalysisForm.css'

function AnalysisForm({ onBack, onSubmit, onApply }) {
  const [metrics, setMetrics] = useState([
    { id: 1, metric: '', operator: '', value: '' }
  ])

  const [conditions, setConditions] = useState([
    { id: 1, attribute: '', operator: '', value: '' }
  ])

  const [createCollectiveRecommendation, setCreateCollectiveRecommendation] = useState(false)

  const handleAddMetric = () => {
    const newId = Math.max(...metrics.map(m => m.id), 0) + 1
    setMetrics([...metrics, { id: newId, metric: '', operator: '', value: '' }])
  }

  const handleDeleteMetric = (id) => {
    setMetrics(metrics.filter(m => m.id !== id))
  }

  const handleMetricChange = (id, field, value) => {
    setMetrics(metrics.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const handleAddCondition = () => {
    const newId = Math.max(...conditions.map(c => c.id), 0) + 1
    setConditions([...conditions, { id: newId, attribute: '', operator: '', value: '' }])
  }

  const handleDeleteCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  const handleConditionChange = (id, field, value) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const handleReset = () => {
    setMetrics([{ id: 1, metric: '', operator: '', value: '' }])
    setConditions([{ id: 1, attribute: '', operator: '', value: '' }])
    setCreateCollectiveRecommendation(false)
  }

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
      <div className="header">
        <div className="header-title">MooMeter</div>
        <button className="header-back-button" onClick={onBack}>
          Wróć
        </button>
      </div>

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


