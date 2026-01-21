# AirQuality

## Opis
Komponent `AirQuality` to główna strona monitorowania jakości powietrza. Wyświetla pomiary stężenia zanieczyszczeń z czujników, trendy temporalne oraz indeks AQI (Air Quality Index).

## Funkcjonalność
Komponent umożliwia:
- **Wyświetlanie wartości AQI**: Pokazuje ogólny indeks jakości powietrza z oceną (Dobra Jakość, itp.)
- **Karty szybkie**: Wyświetlanie średnich stężeń PM2.5, PM10 i CO2 dla wybranego zakresu czasowego
- **Interaktywny wykres trendu**: Liniowy diagram SVG pokazujący zmiany wartości w czasie
- **Wybór czujnika**: Lista czujników umożliwiająca przełączanie się między nimi
- **Zakres czasowy**: Możliwość wyświetlenia danych z ostatnich 24h, 7 dni lub 30 dni
- **Alert baner**: Wyświetlenie alertu, jeśli jest dostępny
- **Nawigacja**: Przycisk "Wróć" do powrotu do poprzedniego widoku

## Props
- `onBack` (function): Callback wywoływany po kliknięciu przycisku "Wróć"
- `alert` (object | null): Opcjonalny obiekt alertu do wyświetlenia w bannerze z polami:
  - `message` (string): Treść alertu
  - `startTime` (string): Czas początkowy zdarzenia

## Źródła Danych
Komponent pobiera dane z API:
- `GET http://localhost:3001/sensors` - lista czujników
- `GET http://localhost:3001/measurements` - historyczne pomiary

## Struktura Danych Czujnika
```javascript
{
  id: number,
  name: string,
  type: string // 'pm2_5' | 'pm10' | 'co2' | 'temperature' | 'humidity'
}
```

## Struktura Danych Pomiaru
```javascript
{
  sensorId: number,
  value: number,
  timestamp: string (ISO 8601)
}
```

## Styl
Komponent używa stylów zdefiniowanych w pliku `AirQuality.css`.

## Testowanie
Testy jednostkowe są dostępne w `__tests__/AirQuality.test.jsx`.
