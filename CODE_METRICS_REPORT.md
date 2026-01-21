# Raport Metryk Kodu - Projektowanie Oprogramowania

Data wygenerowania: 2026-01-18

## Narzędzia użyte w analizie

| Narzędzie | Opis | Wersja |
|-----------|------|--------|
| **sloc** | Source Lines of Code Counter - analiza linii kodu | npm package |
| **jscpd** | JavaScript Copy/Paste Detector - wykrywanie duplikacji | npm package |
| **madge** | Module Dependency Graph - analiza zależności | npm package |
| **ESLint** | JavaScript/JSX Linter - analiza jakości kodu | 8.55.0 |

---

## 1. Metryki podstawowe

**Narzędzie:** `sloc` (Source Lines of Code Counter)

### Podsumowanie projektu

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba linii (Physical LOC) | 6,920 |
| Linie kodu źródłowego (Source LOC) | 5,471 |
| Linie komentarzy | 581 |
| Puste linie | 917 |
| Liczba plików ogółem | 57 |
| Liczba plików JS | 5 |
| Liczba plików JSX | 31 |
| Liczba plików CSS | 21 |

### Rozkład kodu według typu pliku

| Typ | Pliki | Physical LOC | Source LOC | Komentarze | Puste linie |
|-----|-------|--------------|------------|------------|-------------|
| **CSS** | 21 | 2,563 | 2,221 | 39 | 322 |
| **JSX** | 31 | 3,522 | 2,834 | 233 | 484 |
| **JS** | 5 | 835 | 416 | 309 | 111 |

### Statystyki komentarzy

| Typ komentarza | Liczba |
|----------------|--------|
| Komentarze jednoliniowe | 170 |
| Komentarze blokowe | 411 |
| Komentarze mieszane | 49 |

---

## 2. Największe pliki (Top 10 według Source LOC)

**Narzędzie:** `sloc`

| Plik | Source LOC | Komentarze | Typ |
|------|------------|------------|-----|
| src/App.jsx | 328 | 31 | JSX |
| src/services/__tests__/sensorService.test.js | 244 | 66 | JS |
| src/components/SensorDiagnostics/SensorDiagnostics.css | 238 | 0 | CSS |
| src/components/ExportData/ExportPanel.jsx | 223 | 11 | JSX |
| src/components/UserDataAnalysis/AnalysisForm.css | 208 | 0 | CSS |
| src/components/UserDataAnalysis/AnalysisForm.jsx | 193 | 5 | JSX |
| src/components/AirQuality/AirQuality.jsx | 182 | 9 | JSX |
| src/components/AlarmThresholds/ThresholdForm.css | 196 | 0 | CSS |
| src/components/AlarmThresholds/ErrorModal.css | 161 | 8 | CSS |
| src/components/UserDataAnalysis/DataSummary.css | 155 | 2 | CSS |

---

## 3. Duplikacja kodu

**Narzędzie:** `jscpd` (JavaScript Copy/Paste Detector)

### Podsumowanie duplikacji

| Format | Pliki | Klony | Zduplikowane linie | % duplikacji | Zduplikowane tokeny | % tokenów |
|--------|-------|-------|-------------------|--------------|---------------------|-----------|
| **JavaScript** | 35 | 6 | 79 | 3.28% | 599 | 2.98% |
| **JSX** | 31 | 15 | 176 | 5.07% | 1,771 | 5.58% |
| **CSS** | 21 | 23 | 641 | 25.53% | 4,236 | 25.39% |
| **Markdown** | 3 | 0 | 0 | 0% | 0 | 0% |
| **RAZEM** | 90 | 44 | 896 | 10.53% | 6,606 | 9.49% |

### Analiza duplikacji

- **Najwyższa duplikacja**: CSS (25.53%)
- **Średnia duplikacja**: JSX (5.07%)
- **Najniższa duplikacja**: JavaScript (3.28%)
- **Całkowita liczba klonów**: 44

### Główne obszary duplikacji

#### CSS
- Największa duplikacja w plikach stylów komponentów UserDataAnalysis
- Wspólne style między: AnalysisForm.css, RecommendationsReview.css, DataSummary.css
- Duplikacja stylów modalnych: CancelRecommendationModal.css ↔ SuccessRecommendationModal.css (46 linii)

#### JSX
- Duplikacja w testach: AnalysisForm.test.jsx, ThresholdForm.test.jsx
- Powtarzające się struktury formularzy w komponentach
- Podobne komponenty modalne

#### JavaScript
- Duplikacja w testach jednostkowych sensorService.test.js
- Powtarzające się struktury testów walidacji

---

## 4. Analiza komponentów React

**Narzędzie:** Ręczna analiza na podstawie wyników `sloc`

### Liczba komponentów według kategorii

| Kategoria | Liczba komponentów |
|-----------|-------------------|
| **Komponenty funkcjonalne** | 31 |
| **Komponenty testowe** | 11 |
| **Komponenty główne** | 20 |

### Komponenty według modułów

| Moduł | Komponenty |
|-------|-----------|
| UserDataAnalysis | 6 |
| AlarmThresholds | 4 |
| SensorDiagnostics | 1 |
| ManageFodder | 2 |
| ExportData | 1 |
| AirQuality | 1 |
| Login | 1 |
| Header | 1 |
| AlertModal | 1 |
| MainMenu | 1 |
| App (główny) | 1 |

---

## 5. Metryki złożoności (szacunkowe)

**Narzędzie:** `sloc` (dla LOC), szacowanie złożoności na podstawie rozmiaru i struktury kodu

### Pliki o największej złożoności

| Plik | LOC | Funkcje/Metody | Szacowana złożoność |
|------|-----|----------------|---------------------|
| src/App.jsx | 328 | ~15 | Wysoka |
| src/components/ExportData/ExportPanel.jsx | 223 | ~8 | Średnia |
| src/components/AnalysisForm.jsx | 193 | ~6 | Średnia |
| src/components/AirQuality/AirQuality.jsx | 182 | ~5 | Średnia |
| src/components/SensorDiagnostics/SensorDiagnostics.jsx | 134 | ~4 | Średnia |

---

## 6. Podsumowanie statystyk

**Narzędzie:** Agregacja danych z `sloc` i `jscpd`

### Wskaźniki ogólne

| Wskaźnik | Wartość |
|----------|---------|
| Średnia długość pliku (Source LOC) | 96 linii |
| Stosunek komentarzy do kodu | 10.6% |
| Stosunek testów do kodu produkcyjnego | ~30% |
| Duplikacja kodu (ogólna) | 10.53% |
| Duplikacja CSS | 25.53% |
| Duplikacja JSX | 5.07% |
| Duplikacja JS | 3.28% |

### Rozkład plików według wielkości

| Zakres LOC | Liczba plików |
|------------|---------------|
| 0-50 | 15 |
| 51-100 | 18 |
| 101-200 | 18 |
| 201-300 | 5 |
| 301+ | 1 |

---

## 7. Struktura testów

**Narzędzie:** `sloc` (analiza plików testowych)

### Pokrycie testami

| Typ | Pliki testowe | Linie testów |
|-----|---------------|--------------|
| Testy jednostkowe | 11 | 1,226 |
| Testy komponentów | 10 | 983 |
| Testy serwisów | 1 | 244 |

### Pliki testowe

1. src/services/__tests__/sensorService.test.js (244 LOC)
2. src/components/SensorDiagnostics/__tests__/SensorDiagnostics.test.jsx (142 LOC)
3. src/components/AlarmThresholds/__tests__/ThresholdForm.test.jsx (101 LOC)
4. src/components/UserDataAnalysis/__tests__/AnalysisForm.test.jsx (115 LOC)
5. src/components/UserDataAnalysis/__tests__/DataSummary.test.jsx (89 LOC)
6. src/components/ExportData/__tests__/ExportPanel.test.jsx (66 LOC)
7. src/components/Login/__tests__/Login.test.jsx (64 LOC)
8. src/components/Header/__tests__/Header.test.jsx (58 LOC)
9. src/components/AlarmThresholds/__tests__/SensorList.test.jsx (56 LOC)
10. src/components/ManageFodder/__tests__/ManageFodder.test.jsx (49 LOC)
11. src/components/AirQuality/__tests__/AirQuality.test.jsx (43 LOC)

---

## 8. Metryki CSS

**Narzędzie:** `sloc` (analiza plików CSS)

### Statystyki stylów

| Metryka | Wartość |
|---------|---------|
| Całkowita liczba plików CSS | 21 |
| Całkowita liczba linii CSS | 2,563 |
| Średnia długość pliku CSS | 122 linii |
| Komentarze w CSS | 39 linii (1.5%) |

### Największe pliki CSS

1. SensorDiagnostics.css - 238 LOC
2. ThresholdForm.css - 196 LOC
3. AnalysisForm.css - 208 LOC
4. ErrorModal.css - 161 LOC
5. DataSummary.css - 155 LOC


