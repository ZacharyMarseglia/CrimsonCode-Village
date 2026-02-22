// CallController.ts
import type { ICallActions } from "./ICallActions";
import type { ILogger } from "../logging/ILogger";
import type { IPlatform } from "../platform/IPlatform";


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