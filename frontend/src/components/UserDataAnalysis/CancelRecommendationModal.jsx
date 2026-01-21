/* eslint-disable react/prop-types */
import './CancelRecommendationModal.css'

function CancelRecommendationModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-text">Komunikat</span>
        </div>
        <div className="modal-content">
          <div className="modal-message">
            <div className="message-line">Rekomendacja zbiorcza</div>
            <div className="message-line">została anulowana</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-continue-button" onClick={onContinue || onClose}>
            Dalej
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelRecommendationModal



