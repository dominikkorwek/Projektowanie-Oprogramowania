import './AlertModal.css'

export default function AlertModal({ alert, onClose }) {
  if (!alert) return null

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <div className="alert-pill">Alert</div>
        <div className="alert-title">Uwaga!</div>
        <div className="alert-subtitle">{alert.message}</div>
        <div className="alert-details">
          <p>Kiedy: {alert.startTime} - teraz</p>
          <p>Gdzie: {alert.location}</p>
          <p>Średnie stężenie: {alert.value} {alert.unit || ''}</p>
        </div>
        <div className="alert-actions">
          <button className="alert-close" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </div>
  )
}
