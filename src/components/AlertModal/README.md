# AlertModal

## Opis
Komponent `AlertModal` to modalne okno dialogowe, które wyświetla alerty dotyczące stężenia zanieczyszczeń lub innych ostrzeżeń w systemie monitorowania jakości powietrza.

## Funkcjonalność
Komponent wyświetla informacje o alercie w postaci elegancko sformatowanego okna z następującymi elementami:
- **Etykieta**: Wyświetla tekst "Alert"
- **Tytuł**: "Uwaga!" informujący użytkownika o ważności wiadomości
- **Wiadomość**: Główna treść alertu
- **Szczegóły**: Informacje o:
  - Kiedy doszło do zdarzenia (startTime)
  - Gdzie doszło do zdarzenia (location)
  - Średnie stężenie zanieczyszczenia (value i unit)
- **Przycisk**: Przycisk "Zamknij" do zamknięcia modalu

## Props
- `alert` (object | null): Obiekt zawierający informacje o alercie
  - `message` (string): Treść alertu
  - `startTime` (string): Czas początkowy zdarzenia
  - `location` (string): Lokalizacja zdarzenia
  - `value` (number): Wartość stężenia zanieczyszczenia
  - `unit` (string, opcjonalnie): Jednostka miary

- `onClose` (function): Callback wywoływany po kliknięciu przycisku "Zamknij"

## Użycie
```jsx
const [alert, setAlert] = useState(null);

<AlertModal 
  alert={alert} 
  onClose={() => setAlert(null)} 
/>
```

## Styl
Komponent używa stylów zdefiniowanych w pliku `AlertModal.css`.
