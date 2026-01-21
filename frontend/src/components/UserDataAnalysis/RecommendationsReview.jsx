import { useState } from 'react'
import './RecommendationsReview.css'
import CancelRecommendationModal from './CancelRecommendationModal'
import SuccessRecommendationModal from './SuccessRecommendationModal'
import Header from '../Header/Header'
import { apiClient } from '../../services/apiClient'

// eslint-disable-next-line react/prop-types
function RecommendationsReview({ onApprove, onCancel, onExit }) {
  const [recommendations, setRecommendations] = useState({
    goal: '',
    targetGroup: '',
    characteristics: '',
    actionStrategy: '',
    justification: ''
  })
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field, value) => {
    setRecommendations(prev => ({ ...prev, [field]: value }))
  }

  const handleApprove = async () => {
    setIsSaving(true)
    try {
      await apiClient.createRecommendation({
        ...recommendations,
        createdAt: new Date().toISOString()
      })
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleContinueAfterSuccess = () => {
    setShowSuccessModal(false)
    if (onApprove) onApprove(recommendations)
  }

  const handleCancel = () => setShowCancelModal(true)

  const handleContinueAfterCancel = () => {
    setShowCancelModal(false)
    if (onCancel) onCancel()
  }

  return (
    <div className="recommendations-review">
      <Header onExit={onExit} />

      <CancelRecommendationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onContinue={handleContinueAfterCancel}
      />

      <SuccessRecommendationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={handleContinueAfterSuccess}
      />

      <div className="content">
        <div className="form-section">
          <div className="section-title">Cel rekomendacji</div>
          <textarea
            className="section-input"
            value={recommendations.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
            placeholder="Wprowadź cel rekomendacji..."
            rows="4"
          />
        </div>

        <div className="form-section">
          <div className="section-title">Grupa docelowa</div>
          <textarea
            className="section-input"
            value={recommendations.targetGroup}
            onChange={(e) => handleChange('targetGroup', e.target.value)}
            placeholder="Wprowadź grupę docelową..."
            rows="4"
          />
        </div>

        <div className="form-section">
          <div className="section-title">Charakterystyka</div>
          <textarea
            className="section-input"
            value={recommendations.characteristics}
            onChange={(e) => handleChange('characteristics', e.target.value)}
            placeholder="Wprowadź charakterystykę..."
            rows="4"
          />
        </div>

        <div className="form-section">
          <div className="section-title">Strategia działania</div>
          <textarea
            className="section-input"
            value={recommendations.actionStrategy}
            onChange={(e) => handleChange('actionStrategy', e.target.value)}
            placeholder="Wprowadź strategię działania..."
            rows="4"
          />
        </div>

        <div className="form-section">
          <div className="section-title">Uzasadnienie</div>
          <textarea
            className="section-input"
            value={recommendations.justification}
            onChange={(e) => handleChange('justification', e.target.value)}
            placeholder="Wprowadź uzasadnienie..."
            rows="4"
          />
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="approve-button"
            onClick={handleApprove}
            disabled={isSaving}
          >
            {isSaving ? 'Zapisywanie...' : 'Zatwierdź'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsReview
