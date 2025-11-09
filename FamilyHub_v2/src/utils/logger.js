// src/utils/logger.js
/**
 * Zentrales Logging-System für bessere Fehlerbehandlung
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class Logger {
  constructor(context) {
    this.context = context;
  }

  error(message, error = null) {
    console.error(`[${this.context}] ERROR:`, message, error);
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }
  }

  warn(message, data = null) {
    console.warn(`[${this.context}] WARN:`, message, data);
  }

  info(message, data = null) {
    console.info(`[${this.context}] INFO:`, message, data);
  }

  debug(message, data = null) {
    if (import.meta.env.DEV) {
      console.debug(`[${this.context}] DEBUG:`, message, data);
    }
  }
}

export function createLogger(context) {
  return new Logger(context);
}
