/* eslint-disable react/prop-types */
import './SuccessMessage.css'

function SuccessMessage({ message, onBackToMenu }) {
  return (
    <div className="success-modal-overlay">
      <div className="success-modal-dialog">
        <div className="success-modal-header">
          <span className="success-modal-header-text">Komunikat</span>
        </div>
        <div className="success-modal-content">
          <div className="success-modal-message">
            Progi oraz warunki zostały prawidłowo zapisane.
          </div>
        </div>
        <div className="success-modal-footer">
          <button className="success-modal-button" onClick={onBackToMenu}>
            Dalej
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessMessage

