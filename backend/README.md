# MooMeter Backend

Backend API server for the MooMeter application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Run tests
npm test

# View API documentation in browser
npm run docs:serve
```

## 📚 Documentation

### API Documentation (JSDoc)

View comprehensive API documentation in your browser:

```bash
npm run docs:serve
```

This will generate the documentation and open it at `http://localhost:8081`

See [JSDOC_GUIDE.md](./JSDOC_GUIDE.md) for more details.

## 🏗️ Architecture

```
src/
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── routes/
│   └── api.js              # API routes
├── services/               # Business logic layer
│   ├── sensorService.js
│   ├── diagnosticService.js
│   ├── airQualityService.js
│   ├── alarmThresholdsService.js
│   ├── alertsService.js
│   ├── authService.js
│   ├── exportService.js
│   └── validation/         # Validation logic
└── storage/                # Data access layer
    ├── repository.js       # Repository pattern
    ├── jsonDb.js           # JSON database
    ├── dbPath.js           # Database path resolver
    └── mutex.js            # Mutex for concurrency
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Current test coverage: **34 tests passing**

## 📖 Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm test` - Run all tests
- `npm run docs` - Generate JSDoc documentation
- `npm run docs:serve` - Generate docs and serve in browser

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Available variables:

- `PORT` - Server port (default: 3001)
- `DB_PATH` - Custom database path (default: backend/db.json)
- `NODE_ENV` - Environment (development/production/test)
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated)

### Database Path

Set custom database path via environment variable:

```bash
DB_PATH=/path/to/db.json npm run dev
```

Default: `backend/db.json`

### Port

Default port: `3001`

### CORS Configuration

In **development**, all origins are allowed.
In **production**, only origins listed in `CORS_ORIGIN` are allowed.

Example `.env`:
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### Sensors
- `GET /api/sensors` - List all sensors
- `GET /api/sensors/available` - Get sensors with data types
- `GET /api/sensors/:id` - Get sensor by ID
- `GET /api/dataTypes` - List all data types

### Alarm Thresholds
- `GET /api/alarmThresholds` - List thresholds
- `POST /api/alarmThresholds` - Create threshold
- `PATCH /api/alarmThresholds/:id` - Update threshold
- `DELETE /api/alarmThresholds/:id` - Delete threshold

### Diagnostics
- `GET /api/diagnosticTests` - Get diagnostic history
- `POST /api/diagnosticTests/run` - Run diagnostics

### Air Quality
- `GET /api/airQualityStats` - Get air quality statistics

### Other
- `GET /api/measurements` - List measurements
- `GET /api/alerts` - Get active alerts
- `POST /api/export` - Export data (PDF/CSV)
- `POST /api/auth/login` - User authentication

## 🛡️ Error Handling

All validation errors include:
- `errors`: Array of error messages
- `errorType`: Either `'format'` or `'business'`
- `status`: HTTP status code

Example error response:
```json
{
  "errors": ["Wartość progu musi być liczbą"],
  "errorType": "format",
  "status": 400
}
```

## 📦 Dependencies

### Production
- `express` - Web framework
- `cors` - CORS middleware
- `pdfkit` - PDF generation

### Development
- `vitest` - Testing framework
- `supertest` - HTTP testing
- `jsdoc` - Documentation generation
- `docdash` - JSDoc theme

## 🔒 Security

- All validation happens on the backend
- Frontend cannot bypass business rules
- Database access only through repository layer
- Atomic writes prevent data corruption
- Mutex locking prevents race conditions

## 📝 License

Private project for educational purposes.

