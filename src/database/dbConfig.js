// Konfiguracja bazy danych
export const dbConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

