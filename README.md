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

### View API Documentation in Browser

The API documentation is automatically started with `npm run dev:all` and available at `http://localhost:8081`.

Alternatively, start it separately:

```bash
# From project root
npm run dev:docs      # Just the docs server
npm run docs:serve    # Generate and serve docs
```

See [JSDOC_DOCUMENTATION_SUMMARY.md](./JSDOC_DOCUMENTATION_SUMMARY.md) for details.

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
│   ├── docs/             # Generated JSDoc (git-ignored)
│   └── package.json
└── package.json          # Root package (monorepo with workspaces)
```

This project uses **npm workspaces** for monorepo management. Running `npm install` at the root automatically installs dependencies for all packages.

## 🧪 Testing

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

## 📖 Available Scripts (Root)

```bash
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:docs         # Start docs server only
npm run dev:all          # Start all three (recommended)
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm run lint             # Lint frontend code
npm run test             # Run all tests
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
✅ **Comprehensive tests** - 119 tests  
✅ **Full documentation** - JSDoc for all services  

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

## 🌐 API Endpoints

See [backend/README.md](./backend/README.md) for complete API documentation.

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

- **JSDoc** - All backend functions documented
- **README files** - Frontend, backend, and root
- **Test coverage** - 119 tests with clear assertions
- **Code comments** - Complex logic explained
- **Architecture docs** - BUSINESS_LOGIC_CLEANUP.md, TEST_COVERAGE_SUMMARY.md

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
4. Run `npm test` before committing
5. Regenerate docs with `npm run docs`

## 📚 Additional Documentation

- [JSDOC_DOCUMENTATION_SUMMARY.md](./JSDOC_DOCUMENTATION_SUMMARY.md) - Complete JSDoc guide
- [BUSINESS_LOGIC_CLEANUP.md](./BUSINESS_LOGIC_CLEANUP.md) - Architecture decisions
- [TEST_COVERAGE_SUMMARY.md](./TEST_COVERAGE_SUMMARY.md) - Test breakdown
- [backend/README.md](./backend/README.md) - Backend API details
- [backend/JSDOC_GUIDE.md](./backend/JSDOC_GUIDE.md) - Documentation usage

## 📄 License

Private project for educational purposes at Studia/Sem5/projektowanie_oprogramowania.
