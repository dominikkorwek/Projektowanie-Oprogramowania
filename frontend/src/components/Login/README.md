# Login

## Opis
Komponent `Login` to formularz uwierzytelniania użytkownika. Pozwala zalogować się do aplikacji poprzez podanie loginu i hasła, które są weryfikowane względem danych w bazie danych.

## Funkcjonalność
Komponent zapewnia:
- **Pole loginu**: Input do wpisania nazwy użytkownika
- **Pole hasła**: Bezpieczne pole input do wpisania hasła
- **Walidacja**: Sprawdzenie czy login nie jest pusty
- **Weryfikacja kredencjałów**: Pobranie użytkownika z API i porównanie hasła (SHA-256)
- **Haszowanie hasła**: Konwersja hasła do SHA-256 za pomocą Web Crypto API
- **Obsługa błędów**: Wyświetlanie komunikatów o błędach
- **Stan ładowania**: Wyłączenie przycisku podczas wysyłania żądania
- **Przyciski akcji**: 
  - "Zaloguj" - przesyła formularz
  - "Anuluj" (opcjonalny) - anuluje logowanie

## Props
- `onLogin` (function): Callback wywoływany po pomyślnym zalogowaniu, otrzymujący obiekt użytkownika
- `onCancel` (function | optional): Callback wywoływany po kliknięciu przycisku "Anuluj"

## Źródła Danych
Komponent komunikuje się z API:
- `GET http://localhost:3001/users?login={login}` - pobiera dane użytkownika

## Struktura Danych Użytkownika
```javascript
{
  login: string,
  passwordHash: string // SHA-256 hash hasła
}
```

## Bezpieczeństwo
- Hasła są haszowane po stronie klienta za pomocą SHA-256
- Porównanie następuje w aplikacji (bez wysyłania czystego hasła)
- Komunikat o błędzie jest uogólniony ("Niepoprawny login lub hasło") aby nie ujawniać czy login istnieje

## Styl
Komponent używa stylów zdefiniowanych w pliku `Login.css`.

## Testowanie
Testy jednostkowe są dostępne w `__tests__/Login.test.jsx`.
