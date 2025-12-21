/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './DataSummary.css'
import Header from '../Header/Header'
import { db } from '../../database/dbClient'

function DataSummary({ onBack, onSelectAnalysis }) {
  const [summaries, setSummaries] = useState([])
  const [analysisOptions, setAnalysisOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await db.fetchMultiple(['userDataSummaries', 'analysisTypes'])
        setSummaries(data.userDataSummaries)
        setAnalysisOptions(data.analysisTypes)
        setIsLoading(false)
      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error)
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="data-summary">
        <Header onBack={onBack} />
        <div className="loading-message">Ładowanie danych...</div>
      </div>
    )
  }

  return (
    <div className="data-summary">
      <Header onBack={onBack} />

      <div className="content-wrapper">
        <div className="main-content">
          <div className="summaries-section">
            {summaries.map((summary) => (
              <div key={summary.id} className="summary-item">
                <span className="summary-label">{summary.label}:</span>
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
