// CallController.ts

interface ICallActions {
  startIncomingCall(): void;
  autoLogEvent(eventName: string): void;
}

interface ILogger {
  info(message: string): void;
}

interface IPlatform {
  showCallNotification(): void | Promise<void>;
  startRingtoneAndVibration(): void | Promise<void>;

  nowLocalHHMM(): string;
  todayISODate(): string;

  appendToDailyNoteMarkdown(dateIso: string, line: string): void | Promise<void>;
}

export class CallController implements ICallActions {
  private readonly platform: IPlatform;
  private readonly logger: ILogger;

  constructor(platform: IPlatform, logger: ILogger) {
    this.platform = platform;
    this.logger = logger;
  }

  startIncomingCall(): void {
    this.logger.info("[Call] startIncomingCall()");

    // Fire-and-forget, safe whether these are sync or async.
    void Promise.resolve(this.platform.showCallNotification());
    void Promise.resolve(this.platform.startRingtoneAndVibration());
  }

  autoLogEvent(eventName: string): void {
    this.logger.info("[Call] autoLogEvent(): " + eventName);

    // Later this becomes a proper markdown table row.
    const line = `- ${this.platform.nowLocalHHMM()} ${eventName}`;

    void Promise.resolve(
      this.platform.appendToDailyNoteMarkdown(this.platform.todayISODate(), line)
    );
  }
}