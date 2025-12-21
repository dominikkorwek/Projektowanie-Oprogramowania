# Header

Komponent nagłówka aplikacji MooMeter z mechanizmem synchronizacji danych.

## Funkcjonalność

- **Logo/Tytuł** – wyświetla nazwę aplikacji "MooMeter"
- **Status synchronizacji** – animowany wskaźnik z przejściami między stanami
- **Przyciski nawigacji** – opcjonalne przyciski "Wróć" i "Wyjdź"

## Stany synchronizacji

| Stan | Opis | Czas |
|------|------|------|
| `started` | "Synchronizacja rozpoczęta" | 0–1s |
| `sending` | "Przesyłanie danych" | 1–2.5s |
| `loading` | Tylko spinner | 2.5–3.5s |
| `success` | Sukces (klikalne) | po 3.5s |
| `error` | "Błąd synchronizacji" (klikalne) | po 3.5s |

Po zakończeniu synchronizacji (success/error) użytkownik może kliknąć ikonę, aby rozpocząć ponownie.

## Props

| Prop | Typ | Domyślnie | Opis |
|------|-----|-----------|------|
| `onBack` | `function` | – | Callback dla przycisku powrotu |
| `onExit` | `function` | – | Callback dla przycisku wyjścia |
| `backLabel` | `string` | `'Wróć'` | Etykieta przycisku powrotu |
| `exitLabel` | `string` | `'Wyjdź'` | Etykieta przycisku wyjścia |

## Pliki

- `Header.jsx` – logika komponentu
- `Header.css` – style i animacje

