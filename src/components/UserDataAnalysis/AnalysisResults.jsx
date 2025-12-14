/* eslint-disable react/prop-types */
import './AnalysisResults.css'

function AnalysisResults({ onExit, onBack }) {
  // Przykładowe dane podsumowania - w przyszłości będą z API
  const summaries = [
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' }
  ]

  return (
    <div className="analysis-results">
      <div className="header">
        <div className="header-title">MooMeter</div>
        <button className="header-exit-button" onClick={onExit}>
          Wyjdź
        </button>
      </div>

      <div className="content-wrapper">
        {/* Lewa strona - Tabela */}
        <div className="table-section">
          <div className="table-placeholder">Tabela</div>
        </div>

        {/* Prawa strona - Podsumowania i Wykres */}
        <div className="right-panel">
          <div className="summaries-section">
            {summaries.map((summary, index) => (
              <div key={index} className="summary-item">
                <span className="summary-label">{summary.label}</span>
                <span className="summary-value">{summary.value}</span>
              </div>
            ))}
          </div>

          <div className="chart-section">
            <div className="chart-placeholder">Wykres</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults



