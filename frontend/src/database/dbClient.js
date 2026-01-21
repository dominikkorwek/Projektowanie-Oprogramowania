import { dbConfig } from './dbConfig.js';

/**
 * Database table definitions.
 * 
 * Maps logical table names to their corresponding endpoints in the JSON Server database.
 * 
 * @constant
 * @type {Object.<string, string>}
 * @property {string} dataTypes - Data types table
 * @property {string} sensors - Sensors table
 * @property {string} alarmThresholds - Alarm thresholds table
 * @property {string} diagnosticTests - Diagnostic tests table
 * @property {string} userDataSummaries - User data summaries table
 * @property {string} analysisTypes - Analysis types table
 * @property {string} recommendations - Recommendations table
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
 * Internal HTTP client for database communication.
 * 
 * Provides a low-level interface for making HTTP requests to the JSON Server database.
 * Handles request construction, error handling, and response parsing.
 * 
 * @namespace
 */
const httpClient = {
  /**
   * Makes an HTTP request to the database.
   * 
   * Constructs and sends an HTTP request with the specified method, endpoint, and optional data.
   * Automatically includes configured headers and handles errors.
   * 
   * @async
   * @function
   * @param {string} method - HTTP method (GET, POST, PATCH, DELETE)
   * @param {string} endpoint - API endpoint path (e.g., '/sensors', '/sensors/1')
   * @param {Object|null} [data=null] - Request body data (for POST/PATCH requests)
   * @returns {Promise<Object|boolean>} Parsed JSON response or true for DELETE requests
   * @throws {Error} If the request fails or server returns an error status
   */
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
 * Creates a table object with CRUD methods.
 * 
 * Factory function that generates a table interface with standard database operations
 * (Create, Read, Update, Delete) for a specific table.
 * 
 * @function
 * @param {string} tableName - Name of the database table
 * @returns {Object} Table object with CRUD methods
 */
function createTable(tableName) {
  return {
    /**
     * Retrieves all records from the table, optionally filtered by query parameters.
     * 
     * @async
     * @function
     * @param {Object} [params={}] - Query parameters for filtering (e.g., {status: 'active'})
     * @returns {Promise<Array<Object>>} Array of all matching records
     * @example
     * // Get all sensors
     * await table.findAll();
     * // Get sensors filtered by type
     * await table.findAll({ type: 'temperature' });
     */
    async findAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/${tableName}${queryString ? `?${queryString}` : ''}`;
      return httpClient.request('GET', endpoint);
    },

    /**
     * Retrieves a single record by its ID.
     * 
     * @async
     * @function
     * @param {string|number} id - Record ID
     * @returns {Promise<Object>} Record object
     * @throws {Error} If record not found
     */
    async findById(id) {
      return httpClient.request('GET', `/${tableName}/${id}`);
    },

    /**
     * Finds records by a specific field value.
     * 
     * Convenience method that filters records where the specified field matches the given value.
     * 
     * @async
     * @function
     * @param {string} field - Field name to filter by
     * @param {*} value - Value to match
     * @returns {Promise<Array<Object>>} Array of matching records
     * @example
     * await table.findBy('status', 'active');
     */
    async findBy(field, value) {
      return this.findAll({ [field]: value });
    },

    /**
     * Generates the next available ID for the table.
     * 
     * Calculates the next sequential ID by finding the maximum existing ID and incrementing it.
     * Returns '1' if the table is empty.
     * 
     * @async
     * @function
     * @returns {Promise<string>} Next available ID as a string
     */
    async getNextId() {
      const records = await this.findAll();
      if (records.length === 0) return 1;
      const maxId = Math.max(...records.map(r => typeof r.id === 'number' ? r.id : typeof r.id === 'string' ? parseInt(r.id) : 0));
      return String(maxId + 1);
    },

    /**
     * Creates a new record in the table.
     * 
     * If no ID is provided in the data object, automatically generates the next sequential ID.
     * 
     * @async
     * @function
     * @param {Object} data - Record data to create
     * @returns {Promise<Object>} Created record with generated ID
     * @example
     * await table.create({ name: 'Temperature Sensor', type: 'temp' });
     */
    async create(data) {
      // Generate numeric ID if not provided
      if (!data.id) {
        data.id = await this.getNextId();
      }
      return httpClient.request('POST', `/${tableName}`, data);
    },

    /**
     * Partially updates a record by ID.
     * 
     * Updates only the specified fields, leaving other fields unchanged.
     * 
     * @async
     * @function
     * @param {string|number} id - Record ID to update
     * @param {Object} data - Partial data to update
     * @returns {Promise<Object>} Updated record
     * @example
     * await table.patch('1', { status: 'inactive' });
     */
    async patch(id, data) {
      return httpClient.request('PATCH', `/${tableName}/${id}`, data);
    },

    /**
     * Deletes a record by ID.
     * 
     * @async
     * @function
     * @param {string|number} id - Record ID to delete
     * @returns {Promise<boolean>} True if deletion was successful
     * @example
     * await table.delete('1');
     */
    async delete(id) {
      return httpClient.request('DELETE', `/${tableName}/${id}`);
    }
  };
}

/**
 * Main database client object.
 * 
 * Provides access to all database tables through a unified interface.
 * Each table property offers CRUD operations (create, read, update, delete).
 * 
 * @namespace
 * @property {Object} dataTypes - Data types table interface
 * @property {Object} sensors - Sensors table interface
 * @property {Object} alarmThresholds - Alarm thresholds table interface (Page 1: Alarm Thresholds)
 * @property {Object} diagnosticTests - Diagnostic tests table interface (Page 2: Sensor Diagnostics)
 * @property {Object} userDataSummaries - User data summaries table interface (Page 3: User Data Analysis)
 * @property {Object} analysisTypes - Analysis types table interface (Page 3: User Data Analysis)
 * @property {Object} recommendations - Recommendations table interface (Page 3: User Data Analysis)
 * 
 * @example
 * // Get all sensors
 * const sensors = await db.sensors.findAll();
 * 
 * // Create a new diagnostic test
 * const test = await db.diagnosticTests.create({
 *   date: new Date().toISOString(),
 *   status: 'ok'
 * });
 * 
 * // Update a recommendation
 * await db.recommendations.patch('1', { approved: true });
 */
export const db = {
  // Page 1: Alarm Thresholds
  dataTypes: createTable(TABLES.dataTypes),
  sensors: createTable(TABLES.sensors),
  alarmThresholds: createTable(TABLES.alarmThresholds),
  
  // Page 2: Sensor Diagnostics
  diagnosticTests: createTable(TABLES.diagnosticTests),
  
  // Page 3: User Data Analysis
  userDataSummaries: createTable(TABLES.userDataSummaries),
  analysisTypes: createTable(TABLES.analysisTypes),
  recommendations: createTable(TABLES.recommendations),

  /**
   * Fetches data from multiple tables in parallel.
   * 
   * Convenience method that retrieves all records from multiple tables simultaneously
   * and returns them as a single object with table names as keys.
   * 
   * @async
   * @function
   * @param {Array<string>} tableNames - Array of table names to fetch
   * @returns {Promise<Object>} Object mapping table names to their records
   * @example
   * const data = await db.fetchMultiple(['sensors', 'dataTypes']);
   * // Returns: { sensors: [...], dataTypes: [...] }
   */
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
