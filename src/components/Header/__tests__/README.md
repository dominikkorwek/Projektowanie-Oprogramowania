# Testy Header

Zestaw testów jednostkowych dla komponentu `Header`.

## Technologie

- **Vitest** – framework testowy
- **React Testing Library** – renderowanie i interakcja z komponentami
- **Fake Timers** – kontrola asynchronicznych zmian stanu

## Pokrycie testowe

| Test | Opis |
|------|------|
| Renderowanie początkowe | Sprawdza "MooMeter" i "Synchronizacja rozpoczęta" |
| Przejścia stanów (success) | Weryfikuje sekwencję: started → sending → loading → success |
| Przejścia stanów (error) | Sprawdza wyświetlenie "Błąd synchronizacji" |
| Restart synchronizacji | Testuje kliknięcie ikony po zakończeniu synchronizacji |
| Blokada przycisku | Weryfikuje `disabled` podczas trwania synchronizacji |
| Przycisk "Wróć" | Testuje wywołanie callback `onBack` |
| Przycisk "Wyjdź" | Testuje wywołanie callback `onExit` |

## Uruchomienie

```bash
npm test -- Header
```

## Uwagi

- Testy używają `vi.useFakeTimers()` i `vi.advanceTimersByTime()` do symulacji upływu czasu
- Mock `Math.random()` zapewnia deterministyczne wyniki synchronizacji (success/error)

