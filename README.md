# Projektowanie Oprogramowania - React App

Projekt React utworzony z Vite.

## Instalacja

Zainstaluj zależności:

```bash
npm install
```

## Uruchomienie

Uruchom serwer deweloperski:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`

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




