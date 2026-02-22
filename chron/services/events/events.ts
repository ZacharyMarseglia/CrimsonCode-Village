// events.ts 
import type { ILogger } from "../logging/ILogger"; 
import * as SQLite from "expo-sqlite";

export interface IEventPlatform {
  todayDayOfWeek(): DayOfWeek;
  nowTimeOfDay(): TimeOfDay;
}

export enum DayOfWeek {
    Sun = 0,
    Mon = 1,
    Tue = 2,
    Wed = 3,
    Thu = 4,
    Fri = 5,
    Sat = 6
}

export class TimeOfDay {
    hour : number;
    minute : number;

    constructor(hour: number = 0, minute: number = 0) {
        this.hour = hour;
        this.minute = minute;
    }

    static fromHHMM(hhmm: string): TimeOfDay {
        if (hhmm.length !== 5 || hhmm[2] !== ':') {
            throw new Error("Invalid time format, expected HH:MM");
        }

        const h = Number(hhmm.substring(0, 2));
        const m = Number(hhmm.substring(3, 5));

          if (!Number.isFinite(h) || !Number.isFinite(m)) {
      throw new Error("TimeOfDay.fromHHMM expects numeric HH:mm");
    }
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      throw new RangeError("TimeOfDay is out of range");
    }

    return new TimeOfDay(h, m);
  }

  toMinutes(): number {
    return this.hour * 60 + this.minute;
  }
}

export type Event = {
    name: string;
    enabled: boolean;

    recurrence: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]; // Sun-Sat

    start: TimeOfDay;
    end: TimeOfDay;
}


export interface IEventStore {
    loadEvents(): Event[] | Promise<Event[]>;
    saveEvents(events: Event[]): void | Promise<void>;
}


export class MemoryEventStore implements IEventStore {
  private events: Event[];

  constructor(seed?: Event[]) {
    this.events = seed ?? MemoryEventStore.defaultSeed();
  }

  loadEvents(): Event[] {
    // Return a shallow copy to avoid callers mutating internal array directly
    return [...this.events];
  }

  saveEvents(events: Event[]): void {
    // Store a copy
    this.events = [...events];
  }
      private static defaultSeed(): Event[] {
        const study: Event = {
            name: "Study Block",
            enabled: true,
            recurrence: [false, false, false, false, false, false, false],
            start: new TimeOfDay(18, 0),
            end: new TimeOfDay(20, 0)
        };
        study.recurrence[DayOfWeek.Mon] = true;
        study.recurrence[DayOfWeek.Wed] = true;
        study.recurrence[DayOfWeek.Fri] = true;

        const gym: Event = {
            name: "Gym",
            enabled: true,
            recurrence: [false, false, false, false, false, false, false],
            start: new TimeOfDay(7, 0),
            end: new TimeOfDay(8, 0)
        };
        gym.recurrence[DayOfWeek.Tue] = true;
        gym.recurrence[DayOfWeek.Thu] = true;

        return [study, gym];
    }
}

export class EventManager {
  private readonly platform: IEventPlatform;
  private readonly logger: ILogger;
  private readonly store: IEventStore;

  constructor(platform: IEventPlatform, logger: ILogger, store: IEventStore) {
    this.platform = platform;
    this.logger = logger;
    this.store = store;
  }
  
  private static isWithinWindow(nowMin: number, startMin: number, endMin: number): boolean {
    if (startMin === endMin) return false; // No time window if start and end are the same
    if (startMin < endMin) {
      return nowMin >= startMin && nowMin < endMin; // Normal case
    } else {
      return nowMin >= startMin || nowMin < endMin; // Overnight case
    }
  }

  async getActiveEventName(): Promise<string | null> {
    const today = this.platform.todayDayOfWeek();
    const now = this.platform.nowTimeOfDay();

    const dayIdx = today as number; 
    const nowMin = now.toMinutes();

    const events = await Promise.resolve(this.store.loadEvents());

    for (const e of events) {
      if (!e.enabled) continue;

      if (dayIdx < 0 || dayIdx >= 7 || !e.recurrence[dayIdx]) continue;

      const startMin = e.start.toMinutes();
      const endMin = e.end.toMinutes();
      if (EventManager.isWithinWindow(nowMin, startMin, endMin)) {
        this.logger.info(`[Event] Active: ${e.name}`);
        return e.name;
      }
    }

    return null;
  }

  async listEvents(): Promise<Event[]> {
    return await Promise.resolve(this.store.loadEvents());
  }

  async addEvent(event: Event): Promise<void> {
    EventManager.validateEvent(event);

    const events = await this.listEvents();
    events.push(event);

    await Promise.resolve(this.store.saveEvents(events));
    this.logger.info(`[Event] Added: ${event.name}`);
  }

  async replaceEvent(index: number, event: Event): Promise<void> {
    EventManager.validateIndex(index);

    EventManager.validateEvent(event);

    const events = await this.listEvents();
    if (index < 0 || index >= events.length) throw new RangeError("Event index out of range");

    events[index] = event;

    await Promise.resolve(this.store.saveEvents(events));
    this.logger.info(`[Event] Replaced index ${index} -> ${event.name}`);
  }

  async updateEvent(index: number, patch: Partial<Event>): Promise<void> {
    EventManager.validateIndex(index);

    const events = await this.listEvents();
    if (index < 0 || index >= events.length) throw new RangeError("Event index out of range");

    const current = events[index];

    const next: Event = {
      ...current,
      ...patch,
      recurrence: (patch.recurrence ?? current.recurrence) as Event["recurrence"],
      start: patch.start ?? current.start,
      end: patch.end ?? current.end,
      enabled: patch.enabled ?? current.enabled,
      name: patch.name ?? current.name,
    };

    EventManager.validateEvent(next);

    events[index] = next;

    await Promise.resolve(this.store.saveEvents(events));
    this.logger.info(`[Event] Updated index ${index} -> ${next.name}`);
  }

  async deleteEvent(index: number): Promise<void> {
    EventManager.validateIndex(index);

    const events = await this.listEvents();
    if (index < 0 || index >= events.length) throw new RangeError("Event index out of range");

    const [removed] = events.splice(index, 1);

    await Promise.resolve(this.store.saveEvents(events));
    this.logger.info(`[Event] Deleted index ${index} -> ${removed?.name ?? "(unknown)"}`);
  }

  async toggleEventEnabled(index: number, enabled?: boolean): Promise<void> {
    const events = await this.listEvents();
    if (index < 0 || index >= events.length) throw new RangeError("Event index out of range");

    const nextEnabled = enabled ?? !events[index].enabled;
    await this.updateEvent(index, { enabled: nextEnabled });
  }

  async setEventRecurrenceDay(index: number, day: DayOfWeek, value: boolean): Promise<void> {
    const events = await this.listEvents();
    if (index < 0 || index >= events.length) throw new RangeError("Event index out of range");

    const rec = [...events[index].recurrence] as Event["recurrence"];
    rec[day] = value;

    await this.updateEvent(index, { recurrence: rec });
  }
  private static validateIndex(index: number): void {
    if (!Number.isInteger(index)) throw new TypeError("Event index must be an integer");
    if (index < 0) throw new RangeError("Event index must be >= 0");
  }

  static validateEvent(e: Event): void {
    if (!e.name || e.name.trim().length === 0) throw new Error("Event name is required");

    if (!Array.isArray(e.recurrence) || e.recurrence.length !== 7) {
      throw new Error("Event recurrence must be an array of 7 booleans (Sun-Sat)");
    }

    const startMin = e.start.toMinutes();
    const endMin = e.end.toMinutes();
    if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) throw new Error("Invalid start/end time");
  }
}

type EventRow = {
  id: number;
  name: string;
  enabled: number;          
  recurrenceMask: number;   
  startMin: number;          
  endMin: number;
};

function recurrenceToMask(rec: Event["recurrence"]): number {
  let mask = 0;
  for (let i = 0; i < 7; i++) {
    if (rec[i]) mask |= 1 << i;
  }
  return mask;
}

function maskToRecurrence(mask: number): Event["recurrence"] {
  const rec: boolean[] = [];
  for (let i = 0; i < 7; i++) rec[i] = (mask & (1 << i)) !== 0;
  return rec as Event["recurrence"];
}

export class SQLiteEventStore implements IEventStore {
  private readonly dbReady: Promise<SQLite.SQLiteDatabase>;

  constructor(dbName: string = "chron.db") {
    this.dbReady = this.init(dbName);
  }

  private async init(dbName: string): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync(dbName);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        enabled INTEGER NOT NULL,
        recurrenceMask INTEGER NOT NULL,
        startMin INTEGER NOT NULL,
        endMin INTEGER NOT NULL
      );
    `);

    return db;
  }

  private async db(): Promise<SQLite.SQLiteDatabase> {
    return await this.dbReady;
  }

  async loadEvents(): Promise<Event[]> {
    const db = await this.db();

    const rows = await db.getAllAsync<EventRow>(`
      SELECT id, name, enabled, recurrenceMask, startMin, endMin
      FROM events
      ORDER BY id ASC;
    `);

    return rows.map((r) => ({
      name: r.name,
      enabled: r.enabled === 1,
      recurrence: maskToRecurrence(r.recurrenceMask),
      start: new TimeOfDay(Math.floor(r.startMin / 60), r.startMin % 60),
      end: new TimeOfDay(Math.floor(r.endMin / 60), r.endMin % 60),
    }));
  }

  async saveEvents(events: Event[]): Promise<void> {
    const db = await this.db();

    await db.execAsync("BEGIN TRANSACTION;");
    try {
      await db.execAsync("DELETE FROM events;");

      for (const e of events) {
        await db.runAsync(
          `INSERT INTO events (name, enabled, recurrenceMask, startMin, endMin)
           VALUES (?, ?, ?, ?, ?);`,
          [
            e.name,
            e.enabled ? 1 : 0,
            recurrenceToMask(e.recurrence),
            e.start.toMinutes(),
            e.end.toMinutes(),
          ]
        );
      }

      await db.execAsync("COMMIT;");
    } catch (err) {
      await db.execAsync("ROLLBACK;");
      throw err;
    }
  }

  async seedIfEmpty(defaultEvents: Event[]): Promise<void> {
    const db = await this.db();

    const rows = await db.getAllAsync<{ c: number }>(
      "SELECT COUNT(*) as c FROM events;"
    );

    const count = rows[0]?.c ?? 0;
    if (count === 0) {
      await this.saveEvents(defaultEvents);
    }
  }
}