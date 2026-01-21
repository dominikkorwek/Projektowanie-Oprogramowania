# Raport Metryk Kodu - Projektowanie Oprogramowania

Data wygenerowania: 2026-01-21

## Narzędzia użyte w analizie

| Narzędzie | Opis | Wersja |
|-----------|------|--------|
| **sloc** | Source Lines of Code Counter - analiza linii kodu | npm package |
| **jscpd** | JavaScript Copy/Paste Detector - wykrywanie duplikacji | npm package |
| **ESLint** | JavaScript/JSX Linter - analiza jakości kodu | 8.55.0 |

---

## 1. Podsumowanie projektu

### Przegląd całego projektu

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba linii (Physical LOC) | 8,513 |
| Linie kodu źródłowego (Source LOC) | 6,567 |
| Linie komentarzy | 813 |
| Puste linie | 1,186 |
| Liczba plików ogółem | 69 |

### Rozkład według typu pliku

| Typ | Pliki | Physical LOC | Source LOC | Komentarze | Puste linie |
|-----|-------|--------------|------------|------------|-------------|
| **JavaScript (JS)** | 26 | 2,082 | 1,430 | 325 | 343 |
| **React (JSX)** | 32 | 3,869 | 2,916 | 454 | 520 |
| **CSS** | 21 | 2,562 | 2,221 | 34 | 323 |
| **Razem** | 79 | 8,513 | 6,567 | 813 | 1,186 |

### Rozkład według lokalizacji

| Lokalizacja | Pliki | Source LOC | % całości |
|-------------|-------|------------|-----------|
| **Frontend** (`frontend/src/`) | 56 | 5,065 | 77.1% |
| **Backend** (`backend/src/`) | 21 | 1,430 | 21.8% |
| **E2E Tests** (`e2e/`) | 2 | 72 | 1.1% |

---

## 2. Frontend - Metryki szczegółowe

### Podsumowanie frontend

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba linii | 6,332 |
| Linie kodu źródłowego | 5,065 |
| Linie komentarzy | 511 |
| Puste linie | 809 |
| Liczba plików | 56 |

### Rozkład według typu (frontend)

| Typ | Pliki | Physical LOC | Source LOC | Komentarze |
|-----|-------|--------------|------------|------------|
| **JSX Components** | 32 | 3,869 | 2,916 | 454 |
| **CSS Styles** | 21 | 2,562 | 2,221 | 34 |
| **JS Services/Tests** | 3 | 354 | 271 | 23 |

### Komponenty React (32 pliki JSX)

#### Komponenty według modułów

| Moduł | Komponenty | Pliki |
|-------|-----------|-------|
| **UserDataAnalysis** | 6 głównych + 3 testy | 9 |
| **AlarmThresholds** | 4 główne + 2 testy | 6 |
| **SensorDiagnostics** | 1 główny + 1 test | 2 |
| **ManageFodder** | 2 główne + 1 test | 3 |
| **ExportData** | 1 główny + 1 test | 2 |
| **AirQuality** | 1 główny + 1 test | 2 |
| **Login** | 1 główny + 1 test | 2 |
| **Header** | 1 główny + 1 test | 2 |
| **AlertModal** | 1 główny | 1 |
| **MainMenu** | 1 główny | 1 |
| **App (główny)** | 1 + main.jsx | 2 |

#### Największe komponenty JSX (Top 10)

| Plik | Source LOC | Komentarze | Physical LOC |
|------|------------|------------|--------------|
| `frontend/src/App.jsx` | 290 | 27 | 342 |
| `frontend/src/components/ExportData/ExportPanel.jsx` | 221 | 12 | 258 |
| `frontend/src/components/UserDataAnalysis/AnalysisForm.jsx` | 193 | 98 | 306 |
| `frontend/src/components/AirQuality/AirQuality.jsx` | 187 | 8 | 212 |
| `frontend/src/components/AlarmThresholds/ThresholdForm.jsx` | 149 | 83 | 251 |
| `frontend/src/components/UserDataAnalysis/RecommendationsReview.jsx` | 130 | 1 | 147 |
| `frontend/src/components/SensorDiagnostics/SensorDiagnostics.jsx` | 129 | 66 | 209 |
| `frontend/src/components/SensorDiagnostics/__tests__/SensorDiagnostics.test.jsx` | 128 | 0 | 157 |
| `frontend/src/components/ManageFodder/ManageFodder.jsx` | 126 | 5 | 150 |
| `frontend/src/components/UserDataAnalysis/__tests__/AnalysisForm.test.jsx` | 115 | 0 | 159 |

### Testy komponentów (11 plików testowych)

| Plik testowy | Source LOC | Physical LOC |
|--------------|------------|--------------|
| `frontend/src/services/__tests__/apiClient.test.js` | 218 | 263 |
| `frontend/src/components/SensorDiagnostics/__tests__/SensorDiagnostics.test.jsx` | 128 | 157 |
| `frontend/src/components/UserDataAnalysis/__tests__/AnalysisForm.test.jsx` | 115 | 159 |
| `frontend/src/components/AlarmThresholds/__tests__/ThresholdForm.test.jsx` | 101 | 134 |
| `frontend/src/components/UserDataAnalysis/__tests__/RecommendationsReview.test.jsx` | 99 | 134 |
| `frontend/src/components/UserDataAnalysis/__tests__/DataSummary.test.jsx` | 91 | 115 |
| `frontend/src/components/AirQuality/__tests__/AirQuality.test.jsx` | 82 | 105 |
| `frontend/src/components/ExportData/__tests__/ExportPanel.test.jsx` | 71 | 105 |
| `frontend/src/components/Login/__tests__/Login.test.jsx` | 60 | 80 |
| `frontend/src/components/Header/__tests__/Header.test.jsx` | 58 | 87 |
| `frontend/src/components/AlarmThresholds/__tests__/SensorList.test.jsx` | 56 | 71 |
| `frontend/src/components/ManageFodder/__tests__/ManageFodder.test.jsx` | 49 | 82 |

**Podsumowanie testów frontend:**
- Łącznie 12 plików testowych (11 JSX + 1 JS)
- Łącznie 1,128 linii kodu testowego
- 11/20 głównych komponentów ma dedykowane testy (55%)

### Największe pliki CSS (Top 10)

| Plik | Source LOC | Physical LOC |
|------|------------|--------------|
| `frontend/src/components/SensorDiagnostics/SensorDiagnostics.css` | 238 | 272 |
| `frontend/src/components/UserDataAnalysis/AnalysisForm.css` | 208 | 238 |
| `frontend/src/components/AlarmThresholds/ThresholdForm.css` | 196 | 223 |
| `frontend/src/components/AlarmThresholds/ErrorModal.css` | 161 | 190 |
| `frontend/src/components/UserDataAnalysis/DataSummary.css` | 155 | 178 |
| `frontend/src/components/UserDataAnalysis/AnalysisResults.css` | 133 | 152 |
| `frontend/src/components/UserDataAnalysis/RecommendationsReview.css` | 132 | 151 |
| `frontend/src/components/AlarmThresholds/SensorList.css` | 109 | 124 |
| `frontend/src/components/ExportData/ExportPanel.css` | 105 | 128 |
| `frontend/src/components/Header/Header.css` | 101 | 123 |

---

## 3. Backend - Metryki szczegółowe

### Podsumowanie backend

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba linii | 1,591 |
| Linie kodu źródłowego | 1,104 |
| Linie komentarzy | 295 |
| Puste linie | 206 |
| Liczba plików JS | 21 |

### Architektura backend

Backend jest zorganizowany w architekturę warstwową:

#### Warstwa API (1 plik)
- `backend/src/routes/api.js` - 120 LOC
  - Routing dla wszystkich endpointów API
  - Obsługa 15+ tras REST

#### Warstwa serwisowa (7 plików)
| Plik | Source LOC | Komentarze | Opis |
|------|------------|------------|------|
| `backend/src/services/alertsService.js` | 48 | 0 | Obliczanie alertów |
| `backend/src/services/exportService.js` | 56 | 2 | Eksport danych do PDF |
| `backend/src/services/alarmThresholdsService.js` | 46 | 49 | Zarządzanie progami alarmów |
| `backend/src/services/diagnosticService.js` | 32 | 18 | Diagnostyka sensorów |
| `backend/src/services/airQualityService.js` | 26 | 13 | Statystyki jakości powietrza |
| `backend/src/services/sensorService.js` | 20 | 22 | Zarządzanie sensorami |
| `backend/src/services/authService.js` | 15 | 0 | Autoryzacja użytkowników |

**Suma warstwy serwisowej:** 243 LOC, 104 linii komentarzy

#### Warstwa walidacji (2 pliki)
| Plik | Source LOC | Komentarze |
|------|------------|------------|
| `backend/src/services/validation/exportValidation.js` | 27 | 26 |
| `backend/src/services/validation/alarmThresholdValidation.js` | 27 | 1 |

**Suma warstwy walidacji:** 54 LOC, 27 linii komentarzy

#### Warstwa przechowywania danych (4 pliki)
| Plik | Source LOC | Komentarze | Opis |
|------|------------|------------|------|
| `backend/src/storage/repository.js` | 68 | 78 | Operacje CRUD na kolekcjach |
| `backend/src/storage/jsonDb.js` | 32 | 47 | Niskopoziomowy dostęp do JSON DB |
| `backend/src/storage/mutex.js` | 16 | 4 | Synchronizacja dostępu do plików |
| `backend/src/storage/dbPath.js` | 7 | 7 | Konfiguracja ścieżki do bazy |

**Suma warstwy storage:** 123 LOC, 136 linii komentarzy

#### Pliki konfiguracyjne (2 pliki)
- `backend/src/app.js` - 27 LOC (konfiguracja Express)
- `backend/src/server.js` - 9 LOC (punkt wejścia)

### Testy backend (4 pliki)

| Plik testowy | Source LOC | Physical LOC |
|--------------|------------|--------------|
| `backend/src/services/__tests__/airQualityService.test.js` | 154 | 198 |
| `backend/src/services/validation/__tests__/exportValidation.test.js` | 150 | 190 |
| `backend/src/services/__tests__/diagnosticService.test.js` | 114 | 145 |
| `backend/src/services/__tests__/sensorService.test.js` | 93 | 122 |

**Podsumowanie testów backend:**
- Łącznie 4 pliki testowe
- Łącznie 511 linii kodu testowego
- 4/7 głównych serwisów ma dedykowane testy (57%)

### Statystyki komentarzy backend

| Warstwa | Komentarze | % od kodu |
|---------|------------|-----------|
| Storage | 136 | 110.6% |
| Serwisy | 104 | 42.8% |
| Walidacja | 27 | 50.0% |
| Testy | 13 | 2.5% |
| API/Config | 15 | 11.6% |
| **Średnia backend** | 295 | 26.7% |

---

## 4. Testy E2E

### Podsumowanie testów E2E

| Metryka | Wartość |
|---------|---------|
| Liczba plików E2E | 2 |
| Całkowita liczba linii | 97 |
| Linie kodu źródłowego | 72 |
| Linie komentarzy | 7 |

### Pliki testów E2E

| Plik | Source LOC | Komentarze | Physical LOC | Opis |
|------|------------|------------|--------------|------|
| `e2e/login.spec.js` | 35 | 5 | 47 | Testy logowania użytkownika |
| `e2e/airQuality.spec.js` | 37 | 2 | 50 | Testy funkcji jakości powietrza |

---

## 5. Duplikacja kodu

**Narzędzie:** `jscpd` (JavaScript Copy/Paste Detector)

### Podsumowanie duplikacji

| Format | Pliki | Linie ogółem | Klony | Zduplikowane linie | % duplikacji | Zduplikowane tokeny | % tokenów |
|--------|-------|--------------|-------|-------------------|--------------|---------------------|-----------|
| **JavaScript** | 54 | 3,645 | 9 | 97 | 2.66% | 1,065 | 3.00% |
| **JSX** | 32 | 3,814 | 17 | 194 | 5.09% | 1,917 | 5.93% |
| **CSS** | 21 | 2,510 | 23 | 641 | 25.54% | 4,236 | 25.40% |
| **Markdown** | 6 | 235 | 0 | 0 | 0% | 0 | 0% |
| **RAZEM** | 113 | 10,204 | 49 | 932 | 9.13% | 7,218 | 8.32% |

### Analiza duplikacji

#### CSS - Duplikacja (25.54%)
**Wykryte klony:**
- Duplikacja między stylami modułu UserDataAnalysis (AnalysisForm.css, DataSummary.css, RecommendationsReview.css)
- Style modalne: CancelRecommendationModal.css ↔ SuccessRecommendationModal.css (46 linii, 304 tokeny)
- Wspólne style formularzy: ThresholdForm.css ↔ AnalysisForm.css (56 linii, 329 tokenów)
- Wspólne style kontenerów: SensorList.css ↔ RecommendationsReview.css (46 linii, 288 tokenów)

#### JSX - Duplikacja (5.09%)
**Wykryte klony:**
- Duplikacja w testach: ThresholdForm.test.jsx ↔ AnalysisForm.test.jsx (30+ linii)
- Podobne struktury modalnych komponentów: CancelRecommendationModal.jsx ↔ SuccessRecommendationModal.jsx
- Powtarzające się wzorce formularzy w AnalysisForm.jsx i ThresholdForm.jsx

#### JavaScript - Duplikacja (2.66%)
**Wykryte klony:**
- Duplikacja w testach backendu (exportValidation.test.js, airQualityService.test.js)
- Powtarzające się wzorce obsługi błędów w api.js

---

## 6. Metryki złożoności

### Pliki o największej złożoności

#### Frontend
| Plik | LOC | Szacowana liczba funkcji | Złożoność |
|------|-----|-------------------------|-----------|
| `frontend/src/App.jsx` | 290 | ~20 | Wysoka |
| `frontend/src/components/ExportData/ExportPanel.jsx` | 221 | ~10 | Wysoka |
| `frontend/src/components/UserDataAnalysis/AnalysisForm.jsx` | 193 | ~8 | Średnia-Wysoka |
| `frontend/src/components/AirQuality/AirQuality.jsx` | 187 | ~6 | Średnia |

#### Backend
| Plik | LOC | Szacowana liczba funkcji | Złożoność |
|------|-----|-------------------------|-----------|
| `backend/src/routes/api.js` | 120 | ~15 | Średnia-Wysoka |
| `backend/src/storage/repository.js` | 68 | ~6 | Średnia |
| `backend/src/services/exportService.js` | 56 | ~3 | Średnia |
| `backend/src/services/alertsService.js` | 48 | ~2 | Niska-Średnia |

---

## 7. Statystyki zagregowane

### Wskaźniki ogólne

| Wskaźnik | Wartość |
|----------|---------|
| Całkowita liczba plików źródłowych | 79 |
| Średnia długość pliku (Source LOC) | 83 linii |
| Stosunek komentarzy do kodu | 12.4% |
| Stosunek kodu testowego do produkcyjnego | 30.5% |
| Duplikacja kodu (ogólna) | 9.13% |
| Duplikacja CSS | 25.54% |
| Duplikacja JSX | 5.09% |
| Duplikacja JS | 2.66% |

### Rozkład plików według wielkości (Source LOC)

| Zakres LOC | Liczba plików | % całości |
|------------|---------------|-----------|
| 0-50 | 35 | 44.3% |
| 51-100 | 20 | 25.3% |
| 101-150 | 13 | 16.5% |
| 151-200 | 7 | 8.9% |
| 201-250 | 3 | 3.8% |
| 251+ | 1 | 1.3% |

### Porównanie Frontend vs Backend

| Metryka | Frontend | Backend | Stosunek F:B |
|---------|----------|---------|--------------|
| Liczba plików | 56 | 21 | 2.67:1 |
| Source LOC | 5,065 | 1,104 | 4.59:1 |
| Komentarze | 511 | 295 | 1.73:1 |
| % komentarzy | 10.1% | 26.7% | - |
| Testy (pliki) | 12 | 4 | 3:1 |
| Testy (LOC) | 1,128 | 511 | 2.21:1 |
| Duplikacja | 11.4%* | 2.66% | - |

\* Średnia ważona duplikacji JSX (5.09%) i CSS (25.54%)

### Pokrycie testami

| Kategoria | Kod produkcyjny | Kod testowy | Stosunek |
|-----------|----------------|-------------|----------|
| **Frontend Components** | 2,645 LOC (JSX) | 1,128 LOC | 42.6% |
| **Backend Services** | 243 LOC | 511 LOC | 210.3% |
| **Frontend Services** | 47 LOC (apiClient) | 218 LOC | 463.8% |
| **Ogółem** | 5,404 LOC | 1,711 LOC | 31.7% |

---

**Koniec raportu**

Raport wygenerowany automatycznie z użyciem narzędzi: sloc v0.3.0, jscpd v4.0.0  
Ostatnia aktualizacja: 2026-01-21
