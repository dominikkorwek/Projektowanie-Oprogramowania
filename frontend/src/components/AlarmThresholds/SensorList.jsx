/**
 * Alarm Thresholds - Sensor List Module
 * Displays list of sensors for alarm threshold configuration.
 * @module SensorList
 */

/* eslint-disable react/prop-types */
import './SensorList.css'
import Header from '../Header/Header'

/**
 * Sensor list component for selecting data types and sensors.
 * 
 * Displays an interface for choosing sensors or data types to configure alarm thresholds.
 * The component consists of two columns:
 * - Left side: List of available data types
 * - Right side: List of available sensors
 * 
 * Each item has a "Wybierz" (Select) button that invokes the onSelectSensor callback
 * with the selected item when clicked.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.sensors - Object containing dataTypes and sensors arrays
 * @param {Array} props.sensors.dataTypes - Array of data type objects with id, name, and type
 * @param {Array} props.sensors.sensors - Array of sensor objects with id, name, and type
 * @param {Function} props.onSelectSensor - Callback function invoked when a sensor or data type is selected, receives the selected item as parameter
 * @param {Function} props.onBack - Callback function invoked when the "Back" button is clicked
 * @returns {JSX.Element} Rendered sensor list component
 */
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

