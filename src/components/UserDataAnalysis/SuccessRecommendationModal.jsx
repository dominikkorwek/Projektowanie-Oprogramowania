import './SuccessRecommendationModal.css'

function SuccessRecommendationModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-text">Komunikat</span>
        </div>
        <div className="modal-content">
          <div className="modal-message">
            Rekomendacja zbiorcza została zapisana
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

export default SuccessRecommendationModal


