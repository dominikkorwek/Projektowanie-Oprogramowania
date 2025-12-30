import './AlertModal.css'

export default function AlertModal({ alert, onClose }) {
  if (!alert) return null

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <div className="alert-header">Uwaga!</div>
        <div className="alert-body">
          <p>{alert.message}</p>
          <p>Gdzie: {alert.location}</p>
          <p>Wartość: {alert.value}</p>
        </div>
        <div className="alert-actions">
          <button className="alert-close" onClick={onClose}>Zamknij</button>
        </div>
      </div>
    </div>
  )
}
