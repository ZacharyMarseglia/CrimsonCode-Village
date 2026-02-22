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
}

export class MemoryEventStore implements IEventStore {
    loadEvents(): Event[] {
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

    const dayIdx = today as number; // 0..6
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
}
