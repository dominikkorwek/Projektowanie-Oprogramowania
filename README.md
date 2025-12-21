# Projektowanie Oprogramowania - React App

Projekt React utworzony z Vite.

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

### Architektura

```
src/
├── database/
│   ├── dbConfig.js    # Konfiguracja (URL, headers)
│   └── dbClient.js    # Klient bazy danych z metodami CRUD
├── services/
│   └── sensorService.js  # Serwis używający dbClient
└── components/
    └── ...               # Komponenty używające db bezpośrednio
```

## Budowanie

Aby zbudować aplikację do produkcji:

```bash
npm run build
```

## Podgląd produkcji

Aby zobaczyć zbudowaną aplikację:

```bash
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

# Uruchom testy z pokryciem kodu
npm run test:coverage
```

### Testowane metody

1. **validateFormat** - walidacja formatowania danych wejściowych
2. **validateBusiness** - walidacja reguł biznesowych dla różnych typów sensorów

Szczegółowe informacje o testach znajdują się w `src/services/__tests__/README.md`

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
| `npm run test:coverage` | Testy z pokryciem kodu |
