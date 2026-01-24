# MooMeter - Cattle Monitoring System

A full-stack application for monitoring cattle health through sensor data analysis.

## 🚀 Quick Start

```bash
# Install all dependencies (root, frontend, backend)
# Workspaces configuration handles all packages automatically
npm install

# Set up environment variables (optional)
# See backend/ENV_VARIABLES.md and frontend/ENV_VARIABLES.md for details

# Start frontend, backend, and docs server
npm run dev:all

# Or start individually
npm run dev:backend    # Backend on http://localhost:3001
npm run dev:frontend   # Frontend on http://localhost:5173
npm run dev:docs       # API docs on http://localhost:8081
```

## 📚 Documentation

### View Complete Documentation in Browser

The **complete project documentation** (backend + frontend + e2e) is automatically started with `npm run dev:all` and available at `http://localhost:8081`.

Alternatively, start it separately:

```bash
# From project root
npm run dev:docs      # Just the docs server
npm run docs:serve    # Generate and serve docs
```

The documentation now covers:
- ✅ **Backend** - All services, storage layer, API routes, and utilities
- ✅ **Frontend** - React components, API client, and utilities  
- ✅ **E2E Tests** - End-to-end test specifications

## 🏗️ Project Structure

```
Projektowanie-Oprogramowania/
├── frontend/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── App.jsx        # Main app
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── storage/      # Data layer
│   ├── db.json           # JSON database
│   └── package.json
├── src/                  # E2E tests
│   └── tests/
│       └── e2e/          # Puppeteer e2e tests
├── docs/                 # Generated JSDoc (git-ignored, entire repo)
└── package.json          # Root package (monorepo with workspaces)
```

This project uses **npm workspaces** for monorepo management. Running `npm install` at the root automatically installs dependencies for all packages.

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests (frontend + backend)
npm test

# Run individually
npm --prefix frontend test -- --run
npm --prefix backend test
```

**Test Coverage:**
- Backend: 34 tests passing
- Frontend: 85 tests passing
- **Total: 119 tests passing ✅**

### End-to-End (E2E) Tests

The project includes comprehensive e2e tests using **Puppeteer** for browser automation:

```bash
# Run e2e tests (requires BOTH frontend and backend running)
npm run e2e

# Start frontend AND backend first, then run e2e tests
# Option 1: Use dev:all (recommended)
npm run dev:all       # Terminal 1 - starts frontend + backend + docs
npm run e2e           # Terminal 2 - run e2e tests

# Option 2: Start individually
npm run dev:backend   # Terminal 1 - backend on http://localhost:3001
npm run dev:frontend  # Terminal 2 - frontend on http://localhost:5173
npm run e2e           # Terminal 3 - run e2e tests
```

**E2E Test Coverage (14 tests passing):**

#### Login Module (`login.spec.cjs`)
- ✅ Empty form validation
- ✅ Invalid credentials error handling
- ✅ Successful login flow

#### Air Quality Module (`airQuality.spec.cjs`)
- ✅ Module initialization and data loading
- ✅ Navigation to air quality view
- ✅ Sensor list display
- ✅ Time range switching (7 days)
- ✅ Back navigation to main menu
- ✅ Alert display on module entry

#### Sensor Diagnostics Module (`sensorDiagnostics.spec.cjs`)
- ✅ **E2E-DIAG-001**: Module initialization and data display
- ✅ **E2E-DIAG-002**: Running diagnostics and result verification

#### Header/Sync Module (`header.spec.cjs`)
- ✅ **E2E-HEAD-001**: Synchronization process verification (success & error states)
- ✅ **E2E-HEAD-002**: Synchronization restart functionality
- ✅ Button disabled state during sync process

**Key Features:**
- Self-contained tests using bundled Chromium (no system browser required)
- Automatic login and navigation helpers
- Comprehensive state verification
- Timing-aware synchronization checks
- All tests follow consistent patterns

## 📖 Available Scripts (Root)

```bash
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:docs         # Start docs server only
npm run dev:all          # Start all three (recommended)
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm run lint             # Lint frontend code
npm run test             # Run all unit & integration tests
npm run e2e              # Run end-to-end tests (frontend must be running)
npm run docs             # Generate JSDoc documentation
npm run docs:serve       # Generate docs and open in browser
```

## 🏛️ Architecture

### Separation of Concerns

```
Frontend (React)          Backend (Express)         Database
     │                          │                       │
     │  HTTP/REST API           │                       │
     ├────────────────────────► │                       │
     │  (apiClient)             │                       │
     │                          │  Repository Pattern   │
     │                          ├──────────────────────►│
     │                          │                       │
     │                          │  (JSON for dev,       │
     │                          │   swap for prod)      │
     │                          │                       │
   Pure UI                  All Business Logic    Data Storage
```

### Key Principles

✅ **Zero business logic in frontend** - UI only  
✅ **All validation on backend** - Security  
✅ **Repository pattern** - Database abstraction  
✅ **Comprehensive tests** - 119 unit tests + 14 e2e tests  
✅ **Full documentation** - JSDoc for entire codebase (backend, frontend, e2e)  
✅ **E2E test coverage** - Critical user flows automated with Puppeteer  

## 🔧 Technologies

### Frontend
- React 18
- Vite
- Vitest + React Testing Library
- CSS Modules

### Backend
- Express.js
- Node.js (ES Modules)
- JSON file database (swappable)
- Vitest
- JSDoc + Docdash theme

### Testing
- Vitest (unit & integration)
- React Testing Library (frontend)
- Puppeteer (e2e browser automation)
- Chai (assertions)
- Mocha (e2e test runner)

## 🌐 API Endpoints

### Main Endpoints
- `/health` - Server health check
- `/api/sensors` - Sensor management
- `/api/alarmThresholds` - Alarm threshold CRUD
- `/api/diagnosticTests/run` - Run diagnostics
- `/api/airQualityStats` - Air quality statistics
- `/api/export` - Export data (PDF/CSV)

## 📊 Features

### Sensor Management
- Monitor temperature, humidity, CO2, PM2.5, PM10
- Real-time data visualization
- Historical data analysis

### Alarm Thresholds
- Configure custom thresholds per sensor
- Format and business rule validation
- Warning notifications

### Diagnostics
- Automated sensor testing
- Test history tracking
- Status monitoring

### Air Quality Analysis
- Statistical calculations
- Date range filtering
- Multi-sensor aggregation

### Data Export
- PDF and CSV formats
- Configurable parameters
- Validation and error handling

## 🔒 Security & Quality

- **Backend validation** - All data validated server-side
- **Error classification** - Format vs business errors
- **Atomic writes** - Data integrity guaranteed
- **Mutex locking** - Prevents race conditions
- **Repository pattern** - Database abstraction
- **Comprehensive tests** - All critical paths tested

## 📝 Documentation

- **JSDoc** - Complete codebase documentation (backend + frontend + e2e)
- **README files** - Frontend, backend, and root
- **Test coverage** - 119 tests with clear assertions
- **Code comments** - Complex logic explained

## 🚀 Deployment

### Development
```bash
# Install dependencies (workspaces will install all packages)
npm install

# Start everything (frontend, backend, docs)
npm run dev:all
```

### Production
```bash
# Build frontend
npm run build

# Start backend
cd backend && npm start

# Serve frontend build (use nginx, apache, or similar)
```

## 🤝 Contributing

This is an educational project. When making changes:

1. Keep business logic on backend
2. Update tests for new features
3. Add JSDoc comments for new functions
4. Run `npm test` and `npm run e2e` before committing
5. Regenerate docs with `npm run docs`
6. Ensure e2e tests pass for UI changes

## 📚 Additional Documentation

- View generated JSDoc at `http://localhost:8081` (run `npm run docs:serve`)

## 📄 License

Private project for educational purposes at Studia/Sem5/projektowanie_oprogramowania.
