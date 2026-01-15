/**
 * Database configuration object.
 * 
 * Contains configuration settings for connecting to the JSON Server database,
 * including the base URL, timeout, and default HTTP headers.
 * 
 * @constant
 * @type {Object}
 * @property {string} baseUrl - Base URL for the database API (from environment variable or defaults to localhost:3001)
 * @property {number} timeout - Request timeout in milliseconds
 * @property {Object} headers - Default HTTP headers for all database requests
 * @property {string} headers.Content-Type - Content type for request/response bodies
 */
export const dbConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

