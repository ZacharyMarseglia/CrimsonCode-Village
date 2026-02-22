// logging/ConsoleLogger.ts
import type { ILogger } from "./ILogger";

export class ConsoleLogger implements ILogger {
    private static _instance: ConsoleLogger;

    static instance(): ConsoleLogger {
        if (!this._instance) {
            this._instance = new ConsoleLogger();
        }
        return this._instance;
    }
private constructor() {}
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}