import './ErrorModal.css'

function ErrorModal({ isOpen, onClose, errorType, message }) {
  if (!isOpen) return null

  const getTitle = () => {
    if (errorType === 'format') {
      return 'Błąd Formatowania'
    } else if (errorType === 'business') {
      return 'Błąd Biznesowy'
    }
    return 'Błąd'
  }

  const getMessage = () => {
    if (errorType === 'format' || errorType === 'business') {
      return 'Sprawdź wpisane dane'
    }
    return message || 'Wystąpił błąd'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-header-text">Komunikat</span>
        </div>
        <div className="modal-content">
          <div className="modal-title">{getTitle()}</div>
          <div className="modal-message">{getMessage()}</div>
        </div>
        <div className="modal-footer">
          <button className="modal-back-button" onClick={onClose}>
            Powrót
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal

