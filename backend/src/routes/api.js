import express from 'express';
import { list, getById, create, patch, remove } from '../storage/repository.js';
import { computeAlerts } from '../services/alertsService.js';
import { login } from '../services/authService.js';
import { createAlarmThreshold, deleteAlarmThreshold, listAlarmThresholds, updateAlarmThreshold } from '../services/alarmThresholdsService.js';
import { generateExport } from '../services/exportService.js';

export function buildApiRouter() {
  const router = express.Router();

  // Simple read-only resources
  router.get('/dataTypes', async (req, res, next) => {
    try { res.json(await list('dataTypes')); } catch (e) { next(e); }
  });
  router.get('/sensors', async (req, res, next) => {
    try { res.json(await list('sensors')); } catch (e) { next(e); }
  });
  router.get('/measurements', async (req, res, next) => {
    try { res.json(await list('measurements')); } catch (e) { next(e); }
  });
  router.get('/userDataSummaries', async (req, res, next) => {
    try { res.json(await list('userDataSummaries')); } catch (e) { next(e); }
  });
  router.get('/analysisTypes', async (req, res, next) => {
    try { res.json(await list('analysisTypes')); } catch (e) { next(e); }
  });

  // Alarm thresholds (with business validation)
  router.get('/alarmThresholds', async (req, res, next) => {
    try { res.json(await listAlarmThresholds(req.query)); } catch (e) { next(e); }
  });
  router.post('/alarmThresholds', async (req, res, next) => {
    try {
      const result = await createAlarmThreshold(req.body);
      if (!result.ok) return res.status(result.status).json({ errors: result.errors });
      res.status(201).json(result.data);
    } catch (e) { next(e); }
  });
  router.patch('/alarmThresholds/:id', async (req, res, next) => {
    try {
      const result = await updateAlarmThreshold(req.params.id, req.body);
      if (!result.ok) return res.status(result.status).json({ errors: result.errors });
      res.json(result.data);
    } catch (e) { next(e); }
  });
  router.delete('/alarmThresholds/:id', async (req, res, next) => {
    try {
      const ok = await deleteAlarmThreshold(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Not found' });
      res.status(204).end();
    } catch (e) { next(e); }
  });

  // Diagnostic tests (CRUD-lite)
  router.get('/diagnosticTests', async (req, res, next) => {
    try { res.json(await list('diagnosticTests')); } catch (e) { next(e); }
  });
  router.post('/diagnosticTests', async (req, res, next) => {
    try { res.status(201).json(await create('diagnosticTests', req.body)); } catch (e) { next(e); }
  });
  router.patch('/diagnosticTests/:id', async (req, res, next) => {
    try {
      const updated = await patch('diagnosticTests', req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (e) { next(e); }
  });

  // Recommendations
  router.get('/recommendations', async (req, res, next) => {
    try { res.json(await list('recommendations')); } catch (e) { next(e); }
  });
  router.post('/recommendations', async (req, res, next) => {
    try { res.status(201).json(await create('recommendations', req.body)); } catch (e) { next(e); }
  });
  router.get('/recommendations/:id', async (req, res, next) => {
    try {
      const r = await getById('recommendations', req.params.id);
      if (!r) return res.status(404).json({ message: 'Not found' });
      res.json(r);
    } catch (e) { next(e); }
  });
  router.delete('/recommendations/:id', async (req, res, next) => {
    try {
      const ok = await remove('recommendations', req.params.id);
      if (!ok) return res.status(404).json({ message: 'Not found' });
      res.status(204).end();
    } catch (e) { next(e); }
  });

  // Auth
  router.post('/auth/login', async (req, res, next) => {
    try {
      const result = await login(req.body || {});
      if (!result.ok) return res.status(result.status).json({ message: result.message });
      res.json(result.data);
    } catch (e) { next(e); }
  });

  // Alerts (business aggregation)
  router.get('/alerts', async (req, res, next) => {
    try { res.json(await computeAlerts()); } catch (e) { next(e); }
  });

  // Export (returns file)
  router.post('/export', async (req, res, next) => {
    try {
      const out = await generateExport(req.body || {});
      res.setHeader('Content-Type', out.contentType);
      res.setHeader('Content-Disposition', `attachment; filename=\"${out.filename}\"`);
      res.status(200).send(out.buffer);
    } catch (e) { next(e); }
  });

  return router;
}

