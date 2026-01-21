# Wzorce Projektowe w Projekcie MOO METER

## Wprowadzenie

Projekt MOO METER wykorzystuje nowoczesną architekturę z wyraźnym podziałem na frontend (React) i backend (Express.js). Dokument opisuje wzorce projektowe zastosowane w obu warstwach.

---

## Architektura Systemu

```
┌─────────────────┐
│   Frontend      │  - Czyste UI (React)
│   (React)       │  - Wyświetlanie danych
└────────┬────────┘  - Zbieranie input
         │
         │ HTTP/REST API (apiClient)
         │
┌────────▼────────┐
│   Backend       │  - Cała logika biznesowa
│   (Express)     │  - Walidacja
└────────┬────────┘  - Agregacja danych
         │
         │ Repository Pattern
         │
┌────────▼────────┐
│   Database      │  - JSON (dev)
│                 │  - Łatwa wymiana na prod DB
└─────────────────┘
```

---

# Wzorce Backend (Node.js/Express)

## 1. Repository Pattern (Wzorzec Repozytorium) ⭐

**Lokalizacja:** `backend/src/storage/repository.js`

**Opis:** Abstrakcja dostępu do danych. Repository zapewnia jednolity interfejs CRUD dla wszystkich tabel, ukrywając szczegóły implementacji bazy danych.

**Implementacja:**
```javascript
// Wszystkie operacje CRUD w jednym miejscu
export async function list(table, query = {}) { ... }
export async function getById(table, id) { ... }
export async function create(table, data) { ... }
export async function patch(table, id, partial) { ... }
export async function remove(table, id) { ... }
```

**Użycie w serwisach:**
```javascript
// backend/src/services/sensorService.js
import { list, getById } from '../storage/repository.js';

export async function getAvailableSensors() {
  const [dataTypes, sensors] = await Promise.all([
    list('dataTypes'),
    list('sensors')
  ]);
  return { dataTypes, sensors };
}
```

**Korzyści:**
- ✅ Łatwa wymiana bazy danych (JSON → PostgreSQL/MongoDB)
- ✅ Jednolity interfejs dla wszystkich tabel
- ✅ Testowanie bez prawdziwej bazy danych
- ✅ Enkapsulacja logiki dostępu do danych

---

## 2. Service Layer Pattern (Warstwa Serwisowa) ⭐

**Lokalizacja:** `backend/src/services/`

**Opis:** Cała logika biznesowa jest w dedykowanych serwisach. Frontend NIE ma logiki biznesowej.

**Serwisy:**
- `sensorService.js` - Zarządzanie sensorami
- `diagnosticService.js` - Testy diagnostyczne
- `airQualityService.js` - Statystyki jakości powietrza
- `alarmThresholdsService.js` - Progi alarmowe z walidacją
- `alertsService.js` - Agregacja alertów
- `exportService.js` - Eksport danych (PDF/CSV)

**Przykład:**
```javascript
// backend/src/services/diagnosticService.js
export async function runDiagnostics(sensors) {
  // Symulacja testów diagnostycznych
  const diagnosingEntry = await create('diagnosticTests', {
    date: new Date().toISOString(),
    status: 'diagnosing'
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Logika biznesowa - generowanie wyników
  const sensorResults = sensors.map(sensor => ({
    id: sensor.id,
    status: Math.random() > 0.5 ? 'ok' : 'error'
  }));
  
  return await patch('diagnosticTests', diagnosingEntry.id, {
    status: hasErrors ? 'error' : 'ok',
    sensorResults
  });
}
```

**Korzyści:**
- ✅ Centralizacja logiki biznesowej
- ✅ Łatwe testowanie (unit tests)
- ✅ Wielokrotne użycie
- ✅ Bezpieczeństwo - frontend nie może obejść walidacji

---

## 3. Singleton Pattern (Wzorzec Singleton)

**Lokalizacja:** `backend/src/storage/jsonDb.js`

**Opis:** Pojedyncza instancja bazy danych z mutexem do synchronizacji.

**Implementacja:**
```javascript
const mutex = new Mutex();

export class JsonDb {
  constructor(dbPath = resolveDbPath()) {
    this.dbPath = dbPath;
  }
  
  async update(mutator) {
    return mutex.runExclusive(async () => {
      const db = await this.read();
      const next = await mutator(db);
      await writeJsonFileAtomic(this.dbPath, next);
      return next;
    });
  }
}

const db = new JsonDb(); // Jedna instancja
```

**Korzyści:**
- ✅ Kontrola współbieżności (mutex)
- ✅ Jedna instancja bazy danych
- ✅ Atomiczne zapisy

---

## 4. Strategy Pattern (Wzorzec Strategii)

**Lokalizacja:** `backend/src/services/validation/`

**Opis:** Różne strategie walidacji: formatowanie vs. reguły biznesowe.

**Implementacja:**
```javascript
// alarmThresholdsService.js
const format = validateThresholdFormat(data);
if (!format.isValid) {
  return { ok: false, errorType: 'format', errors: format.errors };
}

const business = validateThresholdBusiness(data, sensor);
if (!business.isValid) {
  return { ok: false, errorType: 'business', errors: business.errors };
}
```

**Strategie:**
- `validateThresholdFormat()` - Walidacja typów, wymaganych pól
- `validateThresholdBusiness()` - Walidacja reguł biznesowych (limity sensora)
- `validateExportParams()` - Walidacja parametrów eksportu

**Korzyści:**
- ✅ Separacja różnych typów walidacji
- ✅ Łatwe dodawanie nowych strategii
- ✅ Backend zwraca `errorType` do frontendu

---

## 5. Facade Pattern (Wzorzec Fasady)

**Lokalizacja:** `backend/src/routes/api.js`

**Opis:** API routes ukrywają złożoność serwisów za prostym interfejsem HTTP.

**Przykład:**
```javascript
router.post('/diagnosticTests/run', async (req, res, next) => {
  try {
    const sensors = req.body.sensors || [];
    const result = await runDiagnostics(sensors);
    res.status(201).json(result);
  } catch (e) { next(e); }
});
```

**Korzyści:**
- ✅ Prosty interfejs dla frontendu
- ✅ Ukrycie złożoności
- ✅ Jednolita obsługa błędów

---

## 6. Factory Pattern (Wzorzec Fabryki)

**Lokalizacja:** `backend/src/app.js` - `createApp()`

**Opis:** Funkcja fabryczna tworzy skonfigurowaną instancję Express.

**Implementacja:**
```javascript
export function createApp() {
  const app = express();
  
  app.use(cors({ origin: true, credentials: false }));
  app.use(express.json({ limit: '1mb' }));
  
  app.get('/health', (req, res) => {
    res.json({ ok: true, dbPath: resolveDbPath() });
  });
  
  app.use('/api', buildApiRouter());
  
  return app;
}
```

**Korzyści:**
- ✅ Enkapsulacja konfiguracji
- ✅ Łatwe testowanie
- ✅ Wielokrotne użycie

---

# Wzorce Frontend (React)

## 7. API Client Pattern (Wzorzec Klienta API) ⭐

**Lokalizacja:** `frontend/src/services/apiClient.js`

**Opis:** Cienki klient HTTP - ZERO logiki biznesowej. Tylko komunikacja z backendem.

**Implementacja:**
```javascript
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`HTTP ${response.status}`);
    error.errors = errorData.errors;
    error.errorType = errorData.errorType; // Z backendu!
    throw error;
  }
  
  return response.json();
}

export const apiClient = {
  getAvailableSensors: () => request('/sensors/available'),
  runDiagnostics: (sensors) => request('/diagnosticTests/run', {
    method: 'POST',
    body: JSON.stringify({ sensors })
  }),
  // ... więcej metod
};
```

**Korzyści:**
- ✅ Brak logiki biznesowej
- ✅ Wielokrotne użycie
- ✅ Łatwe mockowanie w testach
- ✅ Centralizacja API_BASE i headers

---

## 8. Component Pattern (Wzorzec Komponentu)

**Lokalizacja:** `frontend/src/components/`

**Opis:** Podstawowy wzorzec React - komponenty jako niezależne jednostki UI.

**Główne komponenty:**
- `Login` - Logowanie użytkownika
- `Header` - Nawigacja i synchronizacja
- `SensorDiagnostics` - Diagnostyka sensorów
- `AirQuality` - Wizualizacja jakości powietrza
- `ThresholdForm` - Formularz progów alarmowych
- `DataSummary` - Podsumowanie danych użytkowników
- `ExportPanel` - Eksport danych

**Korzyści:**
- ✅ Modularność
- ✅ Wielokrotne użycie
- ✅ Łatwe testowanie
- ✅ Separacja odpowiedzialności

---

## 9. Container/Presentational Pattern

**Lokalizacja:** `frontend/src/App.jsx` (kontener) vs komponenty

**Opis:** Podział na komponenty zarządzające stanem (kontenery) i prezentacyjne (UI).

**Kontener (App.jsx):**
```javascript
function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [sensors, setSensors] = useState([]);
  
  const loadSensors = async () => {
    const data = await apiClient.getAvailableSensors();
    setSensors(data.sensors);
  };
  
  return (
    <>
      {currentView === 'sensor-list' && (
        <SensorList 
          sensors={sensors}
          onSelectSensor={handleSelectSensor}
        />
      )}
    </>
  );
}
```

**Prezentacyjne (SensorList.jsx):**
```javascript
function SensorList({ sensors, onSelectSensor, onBack }) {
  return (
    <div>
      {sensors.map(sensor => (
        <button onClick={() => onSelectSensor(sensor)}>
          {sensor.name}
        </button>
      ))}
    </div>
  );
}
```

**Korzyści:**
- ✅ Separacja logiki od UI
- ✅ Łatwiejsze testowanie
- ✅ Ponowne użycie komponentów prezentacyjnych

---

## 10. Observer Pattern (React Hooks)

**Lokalizacja:** React hooks (`useState`, `useEffect`)

**Opis:** React automatycznie "obserwuje" zmiany stanu i rerenderuje komponenty.

**Przykład:**
```javascript
const [airQualityStats, setAirQualityStats] = useState({});

useEffect(() => {
  const loadStats = async () => {
    const stats = await apiClient.getAirQualityStats(rangeStart);
    setAirQualityStats(stats);
  };
  loadStats();
}, [rangeStart]); // Obserwuje zmiany rangeStart
```

**Korzyści:**
- ✅ Reaktywność UI
- ✅ Automatyczna synchronizacja
- ✅ Deklaratywne programowanie

---

## 11. Callback Pattern

**Lokalizacja:** Props w komponentach React

**Opis:** Funkcje przekazywane jako props umożliwiają komunikację w górę hierarchii.

**Przykład:**
```javascript
// App.jsx
const handleLogin = (user) => {
  setIsLoggedIn(true);
  setUser(user);
};

<Login onLogin={handleLogin} />

// Login.jsx
const submitLogin = () => {
  onLogin(credentials);
};
```

**Korzyści:**
- ✅ Komunikacja między komponentami
- ✅ Dekompozycja odpowiedzialności

---

## 12. Conditional Rendering Pattern

**Lokalizacja:** `frontend/src/App.jsx`

**Opis:** Dynamiczne renderowanie komponentów w zależności od stanu.

**Przykład:**
```javascript
{currentView === 'menu' && <MainMenu onSelectOption={handleSelectOption} />}
{currentView === 'sensor-diagnostics' && <SensorDiagnostics onBack={handleBack} />}
{currentView === 'air-quality' && <AirQuality onBack={handleBack} alert={alerts[0]} />}
```

**Korzyści:**
- ✅ Dynamiczne UI
- ✅ Zarządzanie widokami w jednym miejscu

---

# Wzorce Ogólne

## 13. Separation of Concerns (Rozdzielenie Odpowiedzialności) ⭐⭐⭐

**Opis:** Wyraźny podział odpowiedzialności między warstwami.

**Struktura:**
```
Frontend (frontend/)
├── components/        # TYLKO UI
├── services/
│   └── apiClient.js  # TYLKO HTTP, bez logiki

Backend (backend/)
├── routes/           # HTTP endpoints
├── services/         # CAŁA logika biznesowa
│   ├── sensorService.js
│   ├── diagnosticService.js
│   ├── airQualityService.js
│   └── validation/   # Wszystkie walidacje
└── storage/          # Dostęp do danych
    ├── repository.js
    └── jsonDb.js
```

**Zasady:**
- ✅ Frontend = **ZERO** logiki biznesowej
- ✅ Backend = **CAŁA** logika biznesowa
- ✅ Walidacja **TYLKO** na backendzie
- ✅ Frontend nie może obejść walidacji

---

## 14. Module Pattern (ES6 Modules)

**Opis:** Kod zorganizowany w moduły z wyraźnymi eksportami/importami.

**Przykład:**
```javascript
// Export
export async function getSensors() { ... }
export const apiClient = { ... }

// Import
import { getSensors } from './services/sensorService.js';
import { apiClient } from './services/apiClient.js';
```

---

# Podsumowanie Wzorców

## Backend (Node.js/Express) - 6 wzorców

| Wzorzec | Lokalizacja | Priorytet |
|---------|-------------|-----------|
| **Repository Pattern** | `storage/repository.js` | ⭐⭐⭐ |
| **Service Layer Pattern** | `services/` | ⭐⭐⭐ |
| **Strategy Pattern** | `services/validation/` | ⭐⭐ |
| **Singleton Pattern** | `storage/jsonDb.js` | ⭐⭐ |
| **Facade Pattern** | `routes/api.js` | ⭐ |
| **Factory Pattern** | `app.js` | ⭐ |

## Frontend (React) - 6 wzorców

| Wzorzec | Lokalizacja | Priorytet |
|---------|-------------|-----------|
| **API Client Pattern** | `services/apiClient.js` | ⭐⭐⭐ |
| **Component Pattern** | `components/` | ⭐⭐⭐ |
| **Container/Presentational** | `App.jsx` + components | ⭐⭐ |
| **Observer Pattern** | React hooks | ⭐⭐ |
| **Callback Pattern** | Props | ⭐⭐ |
| **Conditional Rendering** | `App.jsx` | ⭐ |

## Wzorce Architektoniczne - 2 wzorce

| Wzorzec | Priorytet |
|---------|-----------|
| **Separation of Concerns** | ⭐⭐⭐ |
| **Module Pattern** | ⭐⭐ |

---

# Kluczowe Decyzje Architektoniczne

## ✅ Bezpieczeństwo
- Wszystkie walidacje na backendzie
- Frontend nie ma dostępu do bazy danych
- Repository pattern umożliwia łatwą wymianę DB

## ✅ Testowalność
- 34 testy backend (logika biznesowa)
- 85 testów frontend (UI z mockowanym API)
- Łatwe mockowanie dzięki Service Layer

## ✅ Utrzymanie
- Wyraźna separacja frontend/backend
- JSDoc dla wszystkich funkcji backend
- Łatwa rozbudowa (dodawanie serwisów)

## ✅ Skalowalność
- JSON DB łatwo wymienić na PostgreSQL/MongoDB
- Service Layer gotowy do microservices
- API REST łatwo rozszerzyć

---

**Podsumowanie:** Projekt wykorzystuje **14 wzorców projektowych** z naciskiem na **Separation of Concerns**, **Repository Pattern** i **Service Layer Pattern**. Architektura zapewnia bezpieczeństwo, testowalność i łatwość utrzymania.
