import express from 'express';
import cors from 'cors';
import { buildApiRouter } from './routes/api.js';
import { resolveDbPath } from './storage/dbPath.js';

export function createApp() {
  const app = express();

  // CORS configuration - restrict in production
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:4173']; // Default for dev

  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? allowedOrigins 
      : true, // Allow all origins in development
    credentials: false,
  }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (req, res) => {
    res.json({ ok: true, dbPath: resolveDbPath() });
  });

  app.use('/api', buildApiRouter());

  // Basic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  });

  return app;
}

export const app = createApp();

