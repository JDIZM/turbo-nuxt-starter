import pino, { type Logger, type LoggerOptions } from 'pino'

/**
 * Log levels
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level?: LogLevel
  pretty?: boolean
  name?: string
  redact?: string[]
}

/**
 * Get Pino transport for pretty printing
 */
function getPrettyTransport() {
  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: false,
      messageFormat: '{levelLabel} - {msg}'
    }
  }
}

/**
 * Create a Pino logger instance
 */
export function createLogger(config: LoggerConfig = {}): Logger {
  const {
    level = 'info',
    pretty = process.env.NODE_ENV !== 'production',
    name,
    redact = []
  } = config

  const options: LoggerOptions = {
    level,
    name,
    redact: {
      paths: ['password', 'token', 'accessToken', 'refreshToken', 'authorization', ...redact],
      censor: '[REDACTED]'
    },
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err
    },
    timestamp: pino.stdTimeFunctions.isoTime
  }

  if (pretty) {
    options.transport = getPrettyTransport()
  }

  return pino(options)
}

/**
 * Default logger instance
 */
export const logger = createLogger({
  name: 'app',
  level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  pretty: process.env.NODE_ENV !== 'production'
})

/**
 * Export Pino types for convenience
 */
export type { Logger } from 'pino'
