/* eslint-disable react/prop-types */
import './DataSummary.css'
import Header from '../Header/Header'

function DataSummary({ onBack, onSelectAnalysis }) {
  // Przykładowe dane podsumowania - w przyszłości będą z API
  const summaries = [
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' },
    { label: 'Podsumowanie:', value: 'wartosc' }
  ]

  // Przykładowe opcje analizy - w przyszłości będą z API
  const analysisOptions = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: 'Analiza'
  }))

  return (
    <div className="data-summary">
      <Header onBack={onBack} />

      <div className="content-wrapper">
        <div className="main-content">
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

        <div className="separator">
          <div className="separator-line"></div>
          <div className="separator-dot"></div>
        </div>

        <div className="sidebar">
          <div className="analysis-options">
            {analysisOptions.map((option) => (
              <button
                key={option.id}
                className="analysis-button"
                onClick={() => onSelectAnalysis && onSelectAnalysis(option)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSummary



