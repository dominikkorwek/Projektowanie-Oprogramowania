import './MainMenu.css'

function MainMenu({ onSelectOption }) {
  return (
    <div className="main-menu">
      <div className="container">
        <h1 className="title">MOO METER</h1>
        <p className="subtitle">by MooLife</p>
        <div className="menu">
          <button 
            className="menu-button"
            onClick={() => onSelectOption('alarm-thresholds')}
          >
            Ustal progi alarmowe i warunki ostrzegania
          </button>
          <button 
            className="menu-button"
            onClick={() => onSelectOption('user-data-analysis')}
          >
            Analizuj dane użytkowników
          </button>
          <button className="menu-button">Placeholder 3</button>
          <button className="menu-button">Placeholder 4</button>
        </div>
      </div>
    </div>
  )
}

export default MainMenu

