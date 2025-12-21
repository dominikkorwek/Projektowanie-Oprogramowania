import { dbConfig } from './dbConfig.js';

/**
 * Definicje tabel w bazie danych
 */
const TABLES = {
  dataTypes: 'dataTypes',
  sensors: 'sensors',
  alarmThresholds: 'alarmThresholds',
  diagnosticTests: 'diagnosticTests',
  userDataSummaries: 'userDataSummaries',
  analysisTypes: 'analysisTypes',
  recommendations: 'recommendations'
};

/**
 * Wewnętrzny klient HTTP do komunikacji z bazą danych
 */
const httpClient = {
  async request(method, endpoint, data = null) {
    const url = `${dbConfig.baseUrl}${endpoint}`;
    
    const options = {
      method,
      headers: dbConfig.headers
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Błąd bazy danych: ${response.status} - ${response.statusText}`);
    }
    
    if (method === 'DELETE') {
      return true;
    }
    
    return response.json();
  }
};

/**
 * Tworzy obiekt tabeli z metodami CRUD
 */
function createTable(tableName) {
  return {
    async findAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/${tableName}${queryString ? `?${queryString}` : ''}`;
      return httpClient.request('GET', endpoint);
    },

    async findById(id) {
      return httpClient.request('GET', `/${tableName}/${id}`);
    },

    async findBy(field, value) {
      return this.findAll({ [field]: value });
    },

    async getNextId() {
      const records = await this.findAll();
      if (records.length === 0) return 1;
      const maxId = Math.max(...records.map(r => typeof r.id === 'number' ? r.id : 0));
      return maxId + 1;
    },

    async create(data) {
      // Generuj numeryczne ID jeśli nie podano
      if (!data.id) {
        data.id = await this.getNextId();
      }
      return httpClient.request('POST', `/${tableName}`, data);
    },

    async patch(id, data) {
      return httpClient.request('PATCH', `/${tableName}/${id}`, data);
    },

    async delete(id) {
      return httpClient.request('DELETE', `/${tableName}/${id}`);
    }
  };
}

/**
 * Główny obiekt bazy danych
 */
export const db = {
  // Strona 1: Progi alarmowe
  dataTypes: createTable(TABLES.dataTypes),
  sensors: createTable(TABLES.sensors),
  alarmThresholds: createTable(TABLES.alarmThresholds),
  
  // Strona 2: Diagnostyka czujników
  diagnosticTests: createTable(TABLES.diagnosticTests),
  
  // Strona 3: Analiza danych użytkowników
  userDataSummaries: createTable(TABLES.userDataSummaries),
  analysisTypes: createTable(TABLES.analysisTypes),
  recommendations: createTable(TABLES.recommendations),

  async fetchMultiple(tableNames) {
    const results = await Promise.all(
      tableNames.map(name => this[name].findAll())
    );
    
    return tableNames.reduce((acc, name, index) => {
      acc[name] = results[index];
      return acc;
    }, {});
  }
};
