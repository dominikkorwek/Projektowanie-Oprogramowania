# SensorDiagnostics

Komponent odpowiedzialny za diagnostykę czujników w aplikacji MooMeter.

## Funkcjonalność

- **Ładowanie czujników** – pobiera listę dostępnych czujników z `sensorService`
- **Uruchamianie diagnostyki** – przycisk "Uruchom" inicjuje proces testowania czujników
- **Wyświetlanie statusów** – każdy czujnik pokazuje aktualny stan (OK/błąd)
- **Historia testów** – lista poprzednich wyników diagnostyki z datą i typem błędu
- **Wizualne sygnalizowanie stanu** – animowany spinner podczas diagnostyki

## Struktura widoku

| Sekcja lewa | Sekcja prawa |
|-------------|--------------|
| Historia diagnostyki | Tabela czujników ze statusami |
| Przycisk "Uruchom" | Wartości i stany czujników |

## Props

| Prop | Typ | Opis |
|------|-----|------|
| `onBack` | `function` | Callback wywoływany po kliknięciu przycisku "Wróć" |

## Zależności

- `sensorService` – serwis do pobierania danych o czujnikach
- `Header` – komponent nagłówka aplikacji

## Pliki

- `SensorDiagnostics.jsx` – logika komponentu
- `SensorDiagnostics.css` – style

