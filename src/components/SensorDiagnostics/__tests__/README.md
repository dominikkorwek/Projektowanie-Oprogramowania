# Testy SensorDiagnostics

Zestaw testów jednostkowych dla komponentu `SensorDiagnostics`.

## Technologie

- **Vitest** – framework testowy
- **React Testing Library** – renderowanie i interakcja z komponentami
- **Mock sensorService** – symulacja odpowiedzi serwisu

## Pokrycie testowe

| Test | Opis |
|------|------|
| Renderowanie nagłówka | Sprawdza obecność "MooMeter" i "Diagnostyka czujników" |
| Ładowanie czujników | Weryfikuje wyświetlenie listy czujników z API |
| Historia testów | Sprawdza wyświetlenie początkowej historii |
| Stan przycisku podczas diagnostyki | Weryfikuje tekst "Trwa diagnozowanie" i blokadę przycisku |
| Wpis w historii podczas diagnostyki | Sprawdza dodanie wpisu "Diagnozowanie..." |
| Zakończenie diagnostyki | Weryfikuje przywrócenie przycisku "Uruchom" |
| Callback onBack | Testuje wywołanie funkcji powrotu |

## Uruchomienie

```bash
npm test -- SensorDiagnostics
```

## Uwagi

- Testy używają `vi.useFakeTimers()` do kontrolowania asynchronicznych operacji
- Mock `Math.random()` pozwala na deterministyczne testowanie losowych wyników diagnostyki

