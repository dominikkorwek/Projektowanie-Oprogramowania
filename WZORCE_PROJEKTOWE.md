# Analiza Wzorców Projektowych w Projekcie MOO METER

## Wprowadzenie

Niniejszy dokument zawiera szczegółową analizę wzorców projektowych zastosowanych w projekcie MOO METER. Projekt wykorzystuje zarówno klasyczne wzorce projektowe, jak i wzorce specyficzne dla React.

---

## 1. Service Layer Pattern (Warstwa Serwisowa)

**Lokalizacja:** `src/services/sensorService.js`

**Opis:** Wzorzec Service Layer oddziela logikę biznesową od warstwy prezentacji i dostępu do danych. `sensorService` enkapsuluje wszystkie operacje związane z sensorami, walidacją i progowami alarmowymi.

**Przykłady użycia:**
- `sensorService.getAvailableSensors()` - pobieranie dostępnych sensorów
- `sensorService.validateFormat()` - walidacja formatowania danych
- `sensorService.validateBusiness()` - walidacja reguł biznesowych
- `sensorService.saveAlarmThresholds()` - zapisywanie progów alarmowych

**Korzyści:**
- Centralizacja logiki biznesowej
- Łatwiejsze testowanie
- Możliwość ponownego użycia w różnych komponentach

---

## 2. Repository Pattern (Wzorzec Repozytorium)

**Lokalizacja:** `src/database/dbClient.js`

**Opis:** Wzorzec Repository abstrahuje dostęp do danych, zapewniając jednolity interfejs do operacji na danych. Funkcja `createTable()` tworzy obiekty repozytoriów z standardowymi operacjami CRUD.

**Przykłady użycia:**
```javascript
// Pobranie wszystkich sensorów
await db.sensors.findAll()

// Pobranie sensora po ID
await db.sensors.findById(1)

// Utworzenie nowego rekordu
await db.alarmThresholds.create(data)

// Aktualizacja rekordu
await db.alarmThresholds.patch(id, updates)

// Usunięcie rekordu
await db.alarmThresholds.delete(id)
```

**Korzyści:**
- Abstrakcja dostępu do danych
- Łatwa zamiana źródła danych
- Jednolity interfejs dla wszystkich tabel

---

## 3. Factory Pattern (Wzorzec Fabryki)

**Lokalizacja:** `src/database/dbClient.js` - funkcja `createTable()`

**Opis:** Wzorzec Factory tworzy obiekty repozytoriów dla różnych tabel bez bezpośredniego użycia konstruktora. Funkcja `createTable()` generuje obiekty z identycznym interfejsem CRUD dla każdej tabeli.

**Przykład implementacji:**
```javascript
function createTable(tableName) {
  return {
    async findAll(params = {}) { ... },
    async findById(id) { ... },
    async create(data) { ... },
    async patch(id, data) { ... },
    async delete(id) { ... }
  }
}

// Użycie
db.sensors = createTable('sensors')
db.alarmThresholds = createTable('alarmThresholds')
```

**Korzyści:**
- Eliminacja duplikacji kodu
- Spójny interfejs dla wszystkich tabel
- Łatwe dodawanie nowych tabel

---

## 4. Singleton Pattern (Wzorzec Singleton)

**Lokalizacja:** `src/database/dbClient.js`, `src/services/sensorService.js`

**Opis:** Obiekty `db` i `sensorService` są eksportowane jako pojedyncze instancje, zapewniając globalny dostęp do funkcjonalności bez tworzenia wielu instancji.

**Przykład:**
```javascript
// dbClient.js
export const db = {
  sensors: createTable('sensors'),
  alarmThresholds: createTable('alarmThresholds'),
  // ...
}

// sensorService.js
export const sensorService = {
  async getAvailableSensors() { ... },
  // ...
}
```

**Korzyści:**
- Kontrola liczby instancji
- Globalny dostęp
- Oszczędność zasobów

---

## 5. Facade Pattern (Wzorzec Fasady)

**Lokalizacja:** `src/database/dbClient.js`

**Opis:** Obiekt `db` działa jako fasada, upraszczając złożone operacje na bazie danych. Ukrywa szczegóły implementacji HTTP i JSON Server, oferując prosty interfejs.

**Przykłady:**
```javascript
// Zamiast bezpośrednich wywołań HTTP
const data = await db.fetchMultiple(['sensors', 'dataTypes'])
// Automatycznie wykonuje równoległe zapytania i zwraca zorganizowane dane
```

**Korzyści:**
- Uproszczony interfejs dla klientów
- Ukrycie złożoności systemu
- Łatwiejsze utrzymanie

---

## 6. Strategy Pattern (Wzorzec Strategii)

**Lokalizacja:** `src/services/sensorService.js`

**Opis:** Wzorzec Strategy pozwala na wybór algorytmu walidacji w czasie wykonania. Projekt używa dwóch strategii walidacji: `validateFormat()` i `validateBusiness()`.

**Przykład użycia w `App.jsx`:**
```javascript
// Strategia walidacji formatowania
const formatValidation = sensorService.validateFormat(thresholdData)
if (!formatValidation.isValid) {
  setFormErrors(formatValidation.errors)
  setErrorType('format')
  return
}

// Strategia walidacji biznesowej
const businessValidation = sensorService.validateBusiness(thresholdData, selectedSensor)
if (!businessValidation.isValid) {
  setFormErrors(businessValidation.errors)
  setErrorType('business')
  return
}
```

**Korzyści:**
- Elastyczność w wyborze algorytmu
- Łatwe dodawanie nowych strategii walidacji
- Separacja różnych typów walidacji

---

## 7. Component Pattern (Wzorzec Komponentu)

**Lokalizacja:** Wszystkie komponenty React w `src/components/`

**Opis:** Wzorzec Component jest podstawowym wzorcem React, gdzie każdy komponent jest niezależną, wielokrotnego użytku jednostką UI.

**Przykłady komponentów:**
- `Login` - komponent logowania
- `Header` - nagłówek aplikacji
- `SensorList` - lista sensorów
- `AlertModal` - modal z alertami

**Korzyści:**
- Modularność
- Wielokrotne użycie
- Łatwe testowanie
- Separacja odpowiedzialności

---

## 8. Container/Presentational Pattern (Wzorzec Kontener/Prezentacja)

**Lokalizacja:** `src/App.jsx` (kontener) vs komponenty prezentacyjne

**Opis:** Wzorzec dzieli komponenty na kontenery (zarządzające stanem i logiką) i komponenty prezentacyjne (tylko renderujące UI).

**Struktura:**
- **Kontener:** `App.jsx` - zarządza stanem (`currentView`, `sensors`, `isLoggedIn`), logiką nawigacji i komunikacją z serwisami
- **Prezentacyjne:** `MainMenu`, `SensorList`, `Login` - otrzymują dane i callbacki przez props, nie zarządzają stanem globalnym

**Korzyści:**
- Separacja logiki od prezentacji
- Łatwiejsze testowanie komponentów prezentacyjnych
- Możliwość ponownego użycia komponentów prezentacyjnych

---

## 9. Observer Pattern (Wzorzec Obserwatora)

**Lokalizacja:** React hooks (`useState`, `useEffect`)

**Opis:** React implementuje wzorzec Observer poprzez system stanu i efektów. Komponenty "obserwują" zmiany stanu i automatycznie się aktualizują.

**Przykład:**
```javascript
const [currentView, setCurrentView] = useState('menu')

useEffect(() => {
  // Reaguje na zmiany isLoggedIn i currentView
  if (!isLoggedIn || currentView !== 'air-quality') return
  
  const checkAlerts = async () => {
    // Logika sprawdzania alertów
  }
  
  checkAlerts()
}, [isLoggedIn, currentView])
```

**Korzyści:**
- Reaktywność UI
- Automatyczna synchronizacja stanu z widokiem
- Deklaratywne programowanie

---

## 10. Module Pattern (Wzorzec Modułu)

**Lokalizacja:** Cały projekt (ES6 modules)

**Opis:** Kod jest zorganizowany w moduły ES6 z wyraźnymi eksportami i importami, zapewniając enkapsulację i organizację kodu.

**Przykłady:**
```javascript
// Eksport
export const sensorService = { ... }
export default function Login() { ... }

// Import
import { sensorService } from './services/sensorService'
import Login from './components/Login/Login'
```

**Korzyści:**
- Organizacja kodu
- Enkapsulacja
- Zarządzanie zależnościami
- Drzewo wstrząsające (tree-shaking)

---

## 11. State Machine Pattern (Wzorzec Maszyny Stanów)

**Lokalizacja:** `src/components/Header/Header.jsx`

**Opis:** Komponent `Header` implementuje maszynę stanów dla procesu synchronizacji. Stan przechodzi przez sekwencję: `'started'` → `'sending'` → `'loading'` → `'success'/'error'`.

**Implementacja:**
```javascript
const [syncState, setSyncState] = useState('started')

useEffect(() => {
  const timers = []
  
  // Przejście: started → sending
  timers.push(setTimeout(() => setSyncState('sending'), 1000))
  
  // Przejście: sending → loading
  timers.push(setTimeout(() => setSyncState('loading'), 2500))
  
  // Przejście: loading → success/error
  timers.push(setTimeout(() => {
    setSyncState(Math.random() >= 0.5 ? 'success' : 'error')
  }, 3500))
  
  return () => timers.forEach(t => clearTimeout(t))
}, [syncKey])
```

**Korzyści:**
- Przewidywalne przejścia stanów
- Łatwe zarządzanie złożonymi procesami
- Możliwość wizualizacji przepływu

---

## 12. Conditional Rendering Pattern (Wzorzec Renderowania Warunkowego)

**Lokalizacja:** `src/App.jsx`

**Opis:** Wzorzec renderowania warunkowego pozwala na wyświetlanie różnych komponentów w zależności od stanu aplikacji.

**Przykład:**
```javascript
{currentView === 'menu' && (
  <MainMenu onSelectOption={handleSelectOption} />
)}
{currentView === 'sensor-list' && (
  <SensorList
    sensors={sensors}
    onSelectSensor={handleSelectSensor}
    onBack={handleBack}
  />
)}
{currentView === 'threshold-form' && (
  <ThresholdForm
    selectedSensor={selectedSensor}
    onSubmit={handleFormSubmit}
    onBack={handleBack}
    errors={formErrors}
    errorType={errorType}
  />
)}
```

**Korzyści:**
- Dynamiczne UI
- Zarządzanie widokami w jednym miejscu
- Czytelny kod

---

## 13. Callback Pattern (Wzorzec Callback)

**Lokalizacja:** Wszystkie komponenty React

**Opis:** Funkcje są przekazywane jako props do komponentów potomnych, umożliwiając komunikację w górę hierarchii komponentów.

**Przykłady:**
```javascript
// Definicja w App.jsx
const handleLogin = (user) => {
  setIsLoggedIn(true)
  setUser(user)
}

// Przekazanie do komponentu
<Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />

// Użycie w komponencie Login
onLogin(user)
```

**Korzyści:**
- Komunikacja między komponentami
- Elastyczność
- Dekompozycja odpowiedzialności

---

## 14. Configuration Object Pattern (Wzorzec Obiektu Konfiguracyjnego)

**Lokalizacja:** `src/database/dbConfig.js`

**Opis:** Konfiguracja aplikacji jest scentralizowana w jednym obiekcie, ułatwiając zarządzanie ustawieniami.

**Implementacja:**
```javascript
export const dbConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
}
```

**Korzyści:**
- Centralizacja konfiguracji
- Łatwa zmiana ustawień
- Wsparcie dla zmiennych środowiskowych

---

## 15. Separation of Concerns (Rozdzielenie Odpowiedzialności)

**Opis:** Projekt wyraźnie oddziela różne warstwy odpowiedzialności:

1. **Warstwa Prezentacji (UI):** Komponenty React w `src/components/`
2. **Warstwa Logiki Biznesowej:** Serwisy w `src/services/`
3. **Warstwa Dostępu do Danych:** Klient bazy danych w `src/database/`
4. **Warstwa Konfiguracji:** Pliki konfiguracyjne

**Struktura:**
```
src/
├── components/     # Warstwa prezentacji
├── services/       # Warstwa logiki biznesowej
├── database/       # Warstwa dostępu do danych
└── App.jsx         # Kontener łączący warstwy
```

**Korzyści:**
- Łatwiejsze utrzymanie
- Możliwość niezależnego testowania warstw
- Elastyczność w zmianie implementacji

---

## Podsumowanie

Projekt MOO METER wykorzystuje szeroki zakres wzorców projektowych, zarówno klasycznych wzorców GoF (Gang of Four), jak i wzorców specyficznych dla React i architektury aplikacji webowych.

### Wzorce Architektoniczne:
- ✅ Service Layer Pattern
- ✅ Repository Pattern
- ✅ Facade Pattern
- ✅ Separation of Concerns

### Wzorce Kreacyjne:
- ✅ Factory Pattern
- ✅ Singleton Pattern
- ✅ Module Pattern

### Wzorce Behawioralne:
- ✅ Strategy Pattern
- ✅ Observer Pattern
- ✅ State Machine Pattern
- ✅ Callback Pattern

### Wzorce Specyficzne dla React:
- ✅ Component Pattern
- ✅ Container/Presentational Pattern
- ✅ Conditional Rendering Pattern
- ✅ Hooks Pattern (useState, useEffect, useCallback)

### Inne Wzorce:
- ✅ Configuration Object Pattern

