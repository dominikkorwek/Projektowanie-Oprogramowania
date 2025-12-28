import React, { useState } from 'react';
import './ExportPanel.css';
import Header from '../Header/Header'
import ErrorModal from '../AlarmThresholds/ErrorModal'

export default function ExportPanel({ onExport, onBack }) {
  const [measurements] = useState([
    'Wielkość A',
    'Wielkość B',
    'Wielkość C',
  ]);
  const [selectedMeasurements, setSelectedMeasurements] = useState(new Set());
  const [sensors] = useState([
    'Czujnik 1', 'Czujnik 2', 'Czujnik 3', 'Czujnik 4'
  ]);
  const [selectedSensors, setSelectedSensors] = useState(new Set());
  const [format, setFormat] = useState('pdf');
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  function toggleSet(setState, value) {
    setState(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }

  const [isErrorOpen, setIsErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorTitle, setErrorTitle] = useState('')

  function validateParameters() {
    // require at least one measurement and one sensor selected
    if (selectedMeasurements.size === 0 || selectedSensors.size === 0) {
      setErrorTitle('Niepoprawne parametry')
      setErrorMessage('Proszę wprowadzić poprawne dane')
      setIsErrorOpen(true)
      return false
    }
    // require date range from <= to
    const fromDate = new Date(from)
    const toDate = new Date(to)
    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate) {
      setErrorTitle('Niepoprawne parametry')
      setErrorMessage('Data „Od" nie może być późniejsza niż „Do"')
      setIsErrorOpen(true)
      return false
    }
    return true
  }

  async function handleExport() {
    if (!validateParameters()) return

    const payload = {
      measurements: Array.from(selectedMeasurements),
      sensors: Array.from(selectedSensors),
      format,
      from,
      to,
    };

    if (onExport) {
      onExport(payload);
      return;
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format === 'pdf' ? 'pdf' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Eksport nie powiódł się — sprawdź konsolę.');
    }
  }

  return (
    <div className="export-panel">
      <Header onBack={onBack} />
      <div className="content">
        <div className="export-columns">
          <div className="export-column left-col">
            <h3>Mierzone wielkości:</h3>
            <div className="list">
              {measurements.map(m => (
                <label key={m} className="list-item">
                  <input
                    type="checkbox"
                    checked={selectedMeasurements.has(m)}
                    onChange={() => toggleSet(setSelectedMeasurements, m)}
                  />
                  <span className="label-text">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="export-column middle-col">
            <h3>Lista czujników:</h3>
            <div className="list sensors-list">
              {sensors.map(s => (
                <label key={s} className="list-item">
                  <input
                    type="checkbox"
                    checked={selectedSensors.has(s)}
                    onChange={() => toggleSet(setSelectedSensors, s)}
                  />
                  <span className="label-text">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="export-controls">
          <div className="format-block control">
            <label className="format-item">
              <input type="radio" name="format" value="pdf" checked={format==='pdf'} onChange={()=>setFormat('pdf')} /> Plik PDF
            </label>
            <label className="format-item">
              <input type="radio" name="format" value="csv" checked={format==='csv'} onChange={()=>setFormat('csv')} /> Plik CSV
            </label>
          </div>

          <div className="date-block control">
            <label>Od: <input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
            <label>Do: <input type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
          </div>

          <div className="export-action control">
            <button className="btn-export main" onClick={handleExport}>Eksportuj</button>
          </div>
        </div>
      </div>

      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title={errorTitle}
        message={errorMessage}
        closeLabel="Dalej"
      />


    </div>
  )
}