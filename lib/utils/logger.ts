/**
 * Centralized logging utility
 * Replace console statements with proper logging
 */

type LogLevel = "log" | "error" | "warn" | "info";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  
  error: (message: string, error?: unknown, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
    // In production, you might want to send to error tracking service
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
};
