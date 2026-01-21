import './AirQuality.css'
import { useEffect, useState, useMemo } from 'react'

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AirQuality({ onBack, alert }) {
  const [sensors, setSensors] = useState([])
  const [measurements, setMeasurements] = useState([])
  const [selectedSensorId, setSelectedSensorId] = useState(null)
  const [rangeDays, setRangeDays] = useState(1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [s, m] = await Promise.all([
          fetch('/api/sensors').then(r => r.json()),
          fetch('/api/measurements').then(r => r.json())
        ])
        if (!mounted) return
        setSensors(s)
        // keep only last 30 days (but we'll display 24h by default)
        setMeasurements(m.map(x => ({ ...x, timestamp: new Date(x.timestamp).toISOString() })))
        if (s && s.length > 0 && !selectedSensorId) setSelectedSensorId(String(s[0].id))
      } catch (err) {
        console.error('Błąd ładowania danych powietrza', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  const now = useMemo(() => new Date(), [])
  const rangeStart = useMemo(() => new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000), [now, rangeDays])

  const selectedMeasurements = useMemo(() => {
    if (!selectedSensorId) return []
    return measurements
      .filter(m => String(m.sensorId) === String(selectedSensorId))
      .filter(m => new Date(m.timestamp) >= rangeStart)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [measurements, selectedSensorId, rangeStart])

  // SVG sizing and chart layout
  const width = 480
  const height = 180
  const chartPadding = { left: 44, right: 12, top: 12, bottom: 28 }

  const chartData = useMemo(() => {
    if (selectedMeasurements.length === 0) return { points: [], tMin: 0, tMax: 1, vMin: 0, vMax: 1 }
    const times = selectedMeasurements.map(m => new Date(m.timestamp).getTime())
    const vals = selectedMeasurements.map(m => parseFloat(m.value))
    const tMin = Math.min(...times)
    const tMax = Math.max(...times)
    const vMin = Math.min(...vals)
    const vMax = Math.max(...vals)
    const innerW = width - chartPadding.left - chartPadding.right
    const innerH = height - chartPadding.top - chartPadding.bottom
    const points = selectedMeasurements.map(m => {
      const t = new Date(m.timestamp).getTime()
      const x = chartPadding.left + ((t - tMin) / Math.max(1, tMax - tMin)) * innerW
      // handle flat series
      const vRange = Math.max(1e-6, vMax - vMin)
      const y = chartPadding.top + (1 - (parseFloat(m.value) - vMin) / vRange) * innerH
      return { x, y, time: m.timestamp, value: parseFloat(m.value) }
    })
    return { points, tMin, tMax, vMin, vMax }
  }, [selectedMeasurements])

  // helper: compute mean for sensor type across selected range
  const meanForType = (type) => {
    const relevantSensorIds = sensors.filter(s => s.type === type).map(s => String(s.id))
    const vals = measurements
      .filter(m => relevantSensorIds.includes(String(m.sensorId)))
      .filter(m => new Date(m.timestamp) >= rangeStart)
      .map(m => parseFloat(m.value))
      .filter(v => Number.isFinite(v))
    if (vals.length === 0) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }

  const typeLabel = (type) => {
    switch (type) {
      case 'pm2_5': return 'PM2.5 (µg/m³)'
      case 'pm10': return 'PM10 (µg/m³)'
      case 'co2': return 'CO2 (ppm)'
      case 'temperature': return 'Temperatura (°C)'
      case 'humidity': return 'Wilgotność (%)'
      default: return type || '—'
    }
  }

  return (
    <div className="air-container">
      <div className="air-header">
        <button className="back" onClick={onBack}>Wróć</button>
        <div className="title">MooMeter</div>
      </div>

      <div className="air-content">
        {alert && (
          <div className="air-alert-banner">Uwaga: {alert.message} od {alert.startTime}</div>
        )}

        <div className="air-grid">
          <div className="aqi-card">
            <div className="aqi-value">AQI 45</div>
            <div className="aqi-status">Dobra Jakość</div>
          </div>
          <div className="small-cards">
            <div className="small-card">PM2.5<br/>{meanForType('pm2_5') ?? '-'} µg/m³</div>
            <div className="small-card">PM10<br/>{meanForType('pm10') ?? '-'} µg/m³</div>
            <div className="small-card">CO2<br/>{meanForType('co2') ?? '-'} ppm</div>
          </div>
        </div>

        <div className="trend-and-list">
          <div className="trend-card">
            <div className="trend-header">Trend {rangeDays === 1 ? '24h' : rangeDays === 7 ? '7 dni' : '30 dni'}</div>
            <div className="trend-meta">Typ: {typeLabel(sensors.find(s => String(s.id) === String(selectedSensorId))?.type)}</div>
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="trend-svg" role="img" aria-label="Trend">
              <rect x={0} y={0} width={width} height={height} fill="#fff" rx={6} ry={6} stroke="#ddd" />
              {/* draw grid and axes */}
              {chartData.points.length > 0 && (() => {
                const ticksY = 4
                const values = []
                for (let i = 0; i <= ticksY; i++) {
                  const v = chartData.vMin + (i / ticksY) * (chartData.vMax - chartData.vMin)
                  const y = chartPadding.top + (1 - (v - chartData.vMin) / Math.max(1e-6, chartData.vMax - chartData.vMin)) * (height - chartPadding.top - chartPadding.bottom)
                  values.push({ v: Math.round(v), y })
                }
                const ticksX = 4
                const tVals = []
                for (let i = 0; i <= ticksX; i++) {
                  const t = chartData.tMin + (i / ticksX) * (chartData.tMax - chartData.tMin)
                  const x = chartPadding.left + (i / ticksX) * (width - chartPadding.left - chartPadding.right)
                  tVals.push({ t, x })
                }

                return (
                  <g>
                    {values.map((tv, idx) => (
                      <g key={idx}>
                        <line x1={chartPadding.left} x2={width - chartPadding.right} y1={tv.y} y2={tv.y} stroke="#eee" />
                        <text x={chartPadding.left - 8} y={tv.y + 4} fontSize="11" textAnchor="end" fill="#333">{tv.v}</text>
                      </g>
                    ))}

                    {tVals.map((t, idx) => (
                      <g key={idx}>
                        <line x1={t.x} x2={t.x} y1={height - chartPadding.bottom} y2={height - chartPadding.bottom + 6} stroke="#ccc" />
                        <text x={t.x} y={height - chartPadding.bottom + 18} fontSize="11" textAnchor="middle" fill="#333">
                          {rangeDays === 1 ? new Date(t.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(t.t).toLocaleDateString()}
                        </text>
                      </g>
                    ))}

                    {/* y axis label */}
                    <text x={12} y={height / 2} fontSize="12" transform={`rotate(-90 12 ${height / 2})`} textAnchor="middle" fill="#333">{typeLabel(sensors.find(s => String(s.id) === String(selectedSensorId))?.type)}</text>
                  </g>
                )
              })()}

              {/* polyline and points */}
              {chartData.points.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#4a90e2"
                  strokeWidth={2}
                  points={chartData.points.map(p => `${p.x},${p.y}`).join(' ')}
                />
              )}
              {chartData.points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke="#4a90e2" />
                </g>
              ))}
            </svg>
            <div className="trend-controls">
              <button className="small" onClick={() => setRangeDays(1)}>24h</button>
              <button className="small" onClick={() => setRangeDays(7)}>7 dni</button>
              <button className="small" onClick={() => setRangeDays(30)}>30 dni</button>
            </div>
          </div>

          <div className="sensors-list">
            <div className="sensors-title">Twoje Czujniki</div>
            {sensors.map(s => (
              <button
                key={s.id}
                className={`sensor-item ${String(s.id) === String(selectedSensorId) ? 'selected' : ''}`}
                onClick={() => setSelectedSensorId(String(s.id))}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
