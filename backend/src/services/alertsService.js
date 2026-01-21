import { list } from '../storage/repository.js';

function unitForSensorType(type) {
  if (type === 'co2') return 'ppm';
  if (type === 'pm2_5' || type === 'pm10') return 'µg/m³';
  return '';
}

export async function computeAlerts() {
  const [measurements, thresholds, sensors] = await Promise.all([
    list('measurements'),
    list('alarmThresholds'),
    list('sensors'),
  ]);

  const exceeded = (measurements || []).filter((m) => {
    const t = (thresholds || []).find((th) => String(th.sensorId) === String(m.sensorId));
    if (!t) return false;
    const val = Number.parseFloat(m.value);
    const thVal = Number.parseFloat(t.thresholdValue);
    if (!Number.isFinite(val) || !Number.isFinite(thVal)) return false;
    return (t.condition === 'greater' && val > thVal) || (t.condition === 'less' && val < thVal);
  });

  if (exceeded.length === 0) return [];

  const bySensor = {};
  for (const e of exceeded) {
    const sid = String(e.sensorId);
    bySensor[sid] = bySensor[sid] || [];
    bySensor[sid].push(e);
  }

  const alerts = [];
  for (const sid of Object.keys(bySensor)) {
    const group = bySensor[sid];
    const sensor = (sensors || []).find((s) => String(s.id) === String(sid));
    const values = group
      .map((g) => Number.parseFloat(g.value))
      .filter((v) => Number.isFinite(v));

    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
    const startTs = new Date(Math.min(...group.map((g) => new Date(g.timestamp).getTime())));
    const startTime = startTs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const threshold = (thresholds || []).find((th) => String(th.sensorId) === String(sid));

    alerts.push({
      message: threshold?.warningMessage || 'Przekroczono wartość progową',
      location: sensor ? sensor.name : `Czujnik ${sid}`,
      value: avg,
      unit: unitForSensorType(sensor?.type),
      startTime,
    });
  }

  return alerts;
}

