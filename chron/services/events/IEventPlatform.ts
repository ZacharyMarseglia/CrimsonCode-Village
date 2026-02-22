// events/IEventPlatform.ts
import type { DayOfWeek, TimeOfDay } from "./events";

export interface IEventPlatform {
  todayDayOfWeek(): DayOfWeek;
  nowTimeOfDay(): TimeOfDay;
}