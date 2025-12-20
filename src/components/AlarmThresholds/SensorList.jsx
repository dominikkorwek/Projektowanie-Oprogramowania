/* eslint-disable react/prop-types */
import './SensorList.css'
import Header from '../Header/Header'

function SensorList({ sensors, onSelectSensor, onBack }) {
  const dataTypes = sensors?.dataTypes || []
  const sensorList = sensors?.sensors || []

  return (
    <div className="sensor-list">
      <Header onBack={onBack} />
      
      <div className="content">
        <div className="column">
          <div className="column-items">
            {dataTypes.length === 0 ? (
              <p className="loading">Ładowanie danych...</p>
            ) : (
              dataTypes.map((item) => (
                <div key={item.id} className="selection-row">
                  <div className="selection-field">
                    <span className="selection-label">Typ danych</span>
                  </div>
                  <button
                    className="select-button"
                    onClick={() => onSelectSensor(item)}
                  >
                    Wybierz
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="column">
          <div className="column-items">
            {sensorList.length === 0 ? (
              <p className="loading">Ładowanie danych...</p>
            ) : (
              sensorList.map((item) => (
                <div key={item.id} className="selection-row">
                  <div className="selection-field">
                    <span className="selection-label">Sensor</span>
                  </div>
                  <button
                    className="select-button"
                    onClick={() => onSelectSensor(item)}
                  >
                    Wybierz
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensorList

