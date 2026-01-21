# JSDoc Documentation Guide

## 📚 Viewing Documentation in Browser

### Option 1: Serve Documentation Locally (Recommended)

```bash
# From backend directory
npm run docs:serve
```

This will:
1. Generate the JSDoc documentation
2. Start a local HTTP server on port 8081
3. Automatically open the documentation in your default browser

The documentation will be available at: `http://localhost:8081`

### Option 2: Manual Generation and Viewing

```bash
# Generate documentation
npm run docs

# Then open the file in your browser
# Windows:
start docs/index.html

# Mac:
open docs/index.html

# Linux:
xdg-open docs/index.html
```

## 📖 What's Documented

### Modules

1. **repository** - Database abstraction layer with CRUD operations
   - `list()` - List records with optional filtering
   - `getById()` - Get single record by ID
   - `create()` - Create new record
   - `patch()` - Update existing record
   - `remove()` - Delete record

2. **jsonDb** - JSON file database with atomic writes
   - `JsonDb` class - Database instance
   - `read()` - Read entire database
   - `update()` - Update with mutex locking

3. **sensorService** - Sensor data management
   - `getAvailableSensors()` - Get sensors with data types
   - `getSensorById()` - Get single sensor
   - `getDataTypes()` - Get all data types
   - `getSensors()` - Get all sensors

4. **diagnosticService** - Diagnostic test simulation
   - `runDiagnostics()` - Run diagnostic tests on sensors
   - `getDiagnosticTests()` - Get test history

5. **airQualityService** - Air quality statistics
   - `calculateMeanForSensorType()` - Calculate mean for sensor type
   - `getAirQualityStats()` - Get stats for all types

6. **alarmThresholdsService** - Alarm threshold management
   - `listAlarmThresholds()` - List all thresholds
   - `createAlarmThreshold()` - Create with validation
   - `updateAlarmThreshold()` - Update with validation
   - `deleteAlarmThreshold()` - Delete threshold

7. **exportValidation** - Export parameter validation
   - `validateExportParams()` - Validate export parameters

8. **app** - Express application factory
   - `createApp()` - Create configured Express app

## 🔍 Documentation Features

- **Type Information** - All parameters and return types documented
- **Examples** - Usage examples for most functions
- **Module Organization** - Grouped by functionality
- **Search** - Built-in search functionality
- **Source Links** - Links to source code for each function

## 📝 JSDoc Syntax Used

### Module Documentation
```javascript
/**
 * @module moduleName
 * @description Module description
 */
```

### Function Documentation
```javascript
/**
 * Function description.
 * 
 * @param {string} paramName - Parameter description
 * @returns {Promise<Object>} Return value description
 * @example
 * const result = await functionName('value');
 */
```

### Class Documentation
```javascript
/**
 * Class description.
 * @class
 */
export class ClassName {
  /**
   * Constructor description.
   * @param {string} param - Parameter description
   */
  constructor(param) {
    // ...
  }
}
```

## 🛠️ Regenerating Documentation

Whenever you update JSDoc comments in the code, regenerate the documentation:

```bash
npm run docs
```

Or to regenerate and view:

```bash
npm run docs:serve
```

## 📂 Documentation Location

Generated documentation is stored in: `backend/docs/`

This directory is git-ignored and should be regenerated as needed.

## 🎨 Theme

The documentation uses the **Docdash** theme for a clean, modern look with:
- Responsive design
- Dark/light mode support
- Easy navigation
- Search functionality
- Source code viewing
