export interface IPlatform {
  vaultIsInitialized(): boolean | Promise<boolean>;
  isBatterySafe(): boolean | Promise<boolean>;
  isDndDisabled(): boolean | Promise<boolean>;

  showCallNotification(): void | Promise<void>;
  startRingtoneAndVibration(): void | Promise<void>;

  nowLocalHHMM(): string;
  todayISODate(): string;

  appendToDailyNoteMarkdown(dateIso: string, line: string): void | Promise<void>;
}