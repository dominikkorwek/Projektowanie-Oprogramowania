# Testy jednostkowe - sensorService

## Opis

Ten plik zawiera testy jednostkowe dla metod logiki biznesowej w `sensorService`:

### 1. validateFormat
Metoda walidująca format danych wejściowych dla progów alarmowych.

**Testowane scenariusze:**
- ✅ Poprawne dane (wszystkie pola wypełnione)
- ✅ Pusta wartość progowa
- ✅ Wartość progowa nie jest liczbą
- ✅ Brak wybranego warunku
- ✅ Pusty komunikat ostrzegawczy
- ✅ Komunikat zawierający tylko białe znaki
- ✅ Wiele błędów jednocześnie
- ✅ Ujemna wartość liczbowa
- ✅ Wartość dziesiętna

### 2. validateBusiness
Metoda walidująca reguły biznesowe dla różnych typów sensorów.

**Testowane scenariusze:**
- ✅ Temperatura w poprawnym zakresie (-50°C do 100°C)
- ✅ Temperatura poniżej zakresu
- ✅ Temperatura powyżej zakresu
- ✅ Temperatura na granicy zakresu (dolna i górna)
- ✅ Wilgotność w poprawnym zakresie (0% do 100%)
- ✅ Wilgotność poniżej/powyżej zakresu
- ✅ Ciśnienie w poprawnym zakresie (0 do 2000 hPa)
- ✅ Ciśnienie poniżej/powyżej zakresu
- ✅ Nieznany typ sensora (brak reguł)
- ✅ Wartość dziesiętna

## Uruchomienie testów

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

## Pokrycie testami

Testy pokrywają:
- Wszystkie ścieżki wykonania w metodzie `validateFormat`
- Wszystkie ścieżki wykonania w metodzie `validateBusiness`
- Graniczne przypadki (boundary values)
- Przypadki błędne i poprawne

