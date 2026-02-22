// events.ts 
import type { ILogger } from "../logging/ILogger"; 


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
    enabled: Boolean;

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