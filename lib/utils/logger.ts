/**
 * Centralized logging utility with error tracking
 * Updated for Prisma
 */

import { prisma } from '@/lib/db/prisma'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
  path?: string
  method?: string
  [key: string]: unknown
}

/**
 * Logger class for structured logging
 */
class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`
  }

  async log(level: LogLevel, message: string, context?: LogContext): Promise<void> {
    const formatted = this.formatMessage(level, message, context)
    
    // Console output
    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted)
        break
      case LogLevel.WARN:
        console.warn(formatted)
        break
      case LogLevel.DEBUG:
        if (process.env['NODE_ENV'] === 'development') {
          console.debug(formatted)
        }
        break
      default:
        console.log(formatted)
    }

    // Database logging for errors and API calls
    if (level === LogLevel.ERROR || (context?.method && context?.path)) {
      try {
        await prisma.apiLog.create({
          data: {
            method: context?.method || 'UNKNOWN',
            path: context?.path || 'UNKNOWN',
            statusCode: level === LogLevel.ERROR ? 500 : 200,
            responseTime: 0,
            ipAddress: context?.ipAddress || null,
            userAgent: context?.userAgent || null,
            userId: context?.userId || null,
            error: level === LogLevel.ERROR ? message : null,
          },
        })
      } catch (dbError) {
        // Don't fail if logging fails
        console.error('Failed to log to database:', dbError)
      }
    }
  }

  async debug(message: string, context?: LogContext): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context)
  }

  async info(message: string, context?: LogContext): Promise<void> {
    await this.log(LogLevel.INFO, message, context)
  }

  async warn(message: string, context?: LogContext): Promise<void> {
    await this.log(LogLevel.WARN, message, context)
  }

  async error(message: string, error?: Error, context?: LogContext): Promise<void> {
    const errorMessage = error
      ? `${message}: ${error.message}\n${error.stack}`
      : message
    await this.log(LogLevel.ERROR, errorMessage, context)
  }
}

export const logger = new Logger()

/**
 * API request logging middleware helper
 */
export async function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  responseTime: number,
  context?: LogContext
): Promise<void> {
  try {
    await prisma.apiLog.create({
      data: {
        method,
        path,
        statusCode,
        responseTime,
        ipAddress: context?.ipAddress || null,
        userAgent: context?.userAgent || null,
        userId: context?.userId || null,
        error: statusCode >= 400 ? (context?.['error'] as string) || null : null,
      },
    })
  } catch (error) {
    // Don't fail if logging fails
    console.error('Failed to log API request:', error)
  }
}
