// platform/DevPlatform.ts
import type { IPlatform } from "./IPlatform";
import { DayOfWeek, TimeOfDay, type IEventPlatform } from "../events/events"; 

export class DevPlatform implements IPlatform, IEventPlatform {
  async vaultIsInitialized(): Promise<boolean> { return true; }
  async isBatterySafe(): Promise<boolean> { return true; }
  async isDndDisabled(): Promise<boolean> { return true; }

  showCallNotification(): void {}
  startRingtoneAndVibration(): void {}

  nowLocalHHMM(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }

  todayISODate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  appendToDailyNoteMarkdown(dateIso: string, line: string): void {
    console.log(`[NOTE ${dateIso}] ${line}`);
  }

  todayDayOfWeek(): DayOfWeek {
    return new Date().getDay() as DayOfWeek;
  }

  nowTimeOfDay(): TimeOfDay {
    const d = new Date();
    return new TimeOfDay(d.getHours(), d.getMinutes());
  }
}