import { pathToFileURL } from 'node:url';
import { app } from './app.js';

export default app;

// Only listen when executed directly (not when imported by tests).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number.parseInt(process.env.PORT || '3001', 10);
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

