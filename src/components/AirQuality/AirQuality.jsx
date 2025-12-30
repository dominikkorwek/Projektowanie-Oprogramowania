import './AirQuality.css'

export default function AirQuality({ onBack }) {
  return (
    <div className="air-container">
      <div className="air-header">
        <button className="back" onClick={onBack}>Wróć</button>
        <div className="title">MooMeter</div>
      </div>

      <div className="air-content">
        <div className="placeholder-card">Jakość powietrza (mock)</div>
        <p className="air-note">Tutaj będzie widok jakości powietrza (wireframe wkrótce).</p>
      </div>
    </div>
  )
}
