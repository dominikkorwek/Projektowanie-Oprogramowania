/* eslint-disable react/prop-types */
import './ErrorModal.css'

function ErrorModal({ isOpen, onClose, errorType, message, title, closeLabel, children, primaryAction, confirmAction, confirmDisabled, headerLabel, centerAction }) {
  if (!isOpen) return null

  const getTitle = () => {
    if (title) return title
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
          <span className="modal-header-text">{headerLabel || 'Komunikat'}</span>
        </div>
        <div className="modal-content">
          {title && <div className="modal-title">{getTitle()}</div>}
          <div className="modal-message">{children ? children : getMessage()}</div>
        </div>
        {centerAction ? (
          <div className="modal-footer center-action">
            {confirmAction && (
              <button className="modal-center-confirm" onClick={confirmAction.onClick} disabled={confirmDisabled}>
                {confirmAction.label}
              </button>
            )}
          </div>
        ) : (
          <div className="modal-footer">
            <div className="modal-left-actions">
              {primaryAction && (
                <button className="modal-primary-button" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </button>
              )}
            </div>
            <div className="modal-right-actions">
              {confirmAction && (
                <button className="modal-confirm-button" onClick={confirmAction.onClick} disabled={confirmDisabled}>
                  {confirmAction.label}
                </button>
              )}
              <button className="modal-back-button" onClick={onClose}>
                {closeLabel || 'Powrót'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorModal

