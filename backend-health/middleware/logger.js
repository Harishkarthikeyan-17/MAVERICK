/**
 * middleware/logger.js
 * Morgan-based HTTP request logger
 */

const morgan = require('morgan');

// Custom token: compact one-liner per request
const logger = morgan(':method :url :status :response-time ms - :res[content-length]');

module.exports = logger;
