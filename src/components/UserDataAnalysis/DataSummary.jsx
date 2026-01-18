/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './DataSummary.css'
import Header from '../Header/Header'
import { db } from '../../database/dbClient'

/**
 * Data summary component for displaying user data summaries and analysis options.
 * 
 * Displays an interface for viewing user data summaries and selecting analysis types.
 * The component consists of two sections:
 * - Left side: Summary items with labels and values, and two chart placeholders
 * - Right side: Scrollable list of analysis option buttons
 * 
 * Data is loaded asynchronously from the database on component mount. The left side
 * has a scrollbar when content exceeds the available height, while the right side
 * remains fixed with its own scrollbar if needed.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onBack - Callback function invoked when the "Back" button is clicked
 * @param {Function} props.onSelectAnalysis - Callback function invoked when an analysis option is selected, receives the selected analysis option as parameter
 * @returns {JSX.Element} Rendered data summary component
 */
function DataSummary({ onBack, onSelectAnalysis }) {
  const [summaries, setSummaries] = useState([])
  const [analysisOptions, setAnalysisOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Effect that loads user data summaries and analysis types on component mount.
   * 
   * Fetches userDataSummaries and analysisTypes from the database in parallel.
   * Updates the component state with the loaded data and sets loading to false.
   * Errors during loading are logged to the console.
   */
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

          <div className="chart-section">
            <div className="chart-placeholder">Wykres 2</div>
        </div>
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
