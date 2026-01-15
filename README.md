# Projektowanie Oprogramowania - MOO METER

**MOO METER by MooLife** - aplikacja webowa do monitorowania i zarządzania systemami czujników w gospodarstwie rolnym.

## O projekcie

MOO METER to kompleksowe narzędzie umożliwiające:
- **Monitorowanie jakości powietrza** - śledzenie parametrów środowiskowych (PM2.5, PM10, CO2, NH3)
- **Konfigurację progów alarmowych** - ustawianie i zarządzanie wartościami progowymi dla czujników
- **Diagnostykę czujników** - sprawdzanie stanu i historii działania czujników
- **Analizę danych użytkownika** - przeglądanie i analizowanie zebranych pomiarów
- **Zarządzanie paszą** - monitorowanie i planowanie karmienia zwierząt
- **Eksport danych** - eksportowanie pomiarów i raportów

Projekt React utworzony z Vite.

## Technologie

- **React 18** - biblioteka do budowania interfejsu użytkownika
- **Vite** - szybkie narzędzie do budowania aplikacji
- **JSON Server** - lokalna baza danych REST API
- **Vitest** - framework do testów jednostkowych
- **ESLint** - linter do analizy kodu JavaScript/React

## Instalacja

Zainstaluj zależności:

```bash
npm install
```

## Uruchomienie

### Pełne uruchomienie (aplikacja + baza danych)

```bash
npm run dev:all
```

To uruchomi jednocześnie:
- **JSON Server** (baza danych) na `http://localhost:3001`
- **Vite** (aplikacja React) na `http://localhost:5173`

### Uruchomienie osobno

```bash
# Tylko aplikacja React
npm run dev

# Tylko baza danych
npm run db
```

## Baza danych

Projekt wykorzystuje **JSON Server** jako lokalną bazę danych opartą na pliku `db.json`.

### Architektura bazy danych

```
src/
├── database/
│   ├── dbConfig.js    # Konfiguracja (URL, headers)
│   └── dbClient.js    # Klient bazy danych z metodami CRUD
├── services/
│   └── sensorService.js  # Serwis używający dbClient
└── components/
    └── ...               # Komponenty używające db
```

### Struktura komponentów

Aplikacja składa się z następujących głównych modułów:

- **Login** - system logowania użytkowników
- **MainMenu** - menu główne aplikacji
- **AirQuality** - monitorowanie jakości powietrza z alertami
- **AlarmThresholds** - konfiguracja progów alarmowych dla czujników
- **SensorDiagnostics** - diagnostyka i śledzenie stanu czujników
- **UserDataAnalysis** - analiza zebranych danych pomiarowych
- **ManageFodder** - zarządzanie karmą dla zwierząt
- **ExportData** - eksport danych do różnych formatów

## Budowanie i Preview

Aby zbudować aplikację do produkcji i zobaczyć podgląd:

```bash
# Zbuduj aplikację
npm run build

# Uruchom podgląd produkcji
npm run preview
```

## Testy jednostkowe

Projekt zawiera testy jednostkowe dla logiki biznesowej. Testy pokrywają metody walidacji w `sensorService`:

### Uruchomienie testów

```bash
# Uruchom wszystkie testy
npm test

# Uruchom testy w trybie watch
npm test -- --watch

# Uruchom testy z interfejsem graficznym
npm run test:ui
```

## Skrypty npm

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchom aplikację React |
| `npm run db` | Uruchom bazę danych JSON Server |
| `npm run dev:all` | Uruchom aplikację i bazę danych jednocześnie |
| `npm run build` | Zbuduj aplikację do produkcji |
| `npm run preview` | Podgląd zbudowanej aplikacji |
| `npm run lint` | Sprawdź kod linterem |
| `npm test` | Uruchom testy |
| `npm run test:ui` | Testy z interfejsem graficznym |
