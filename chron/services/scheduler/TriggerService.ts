// TriggerService.ts 

import type { IPlatform } from "../platform/IPlatform";
import type { ILogger } from "../logging/ILogger";
import type { ICallActions } from "../call/ICallActions";
import { EventManager } from "../events/events";


export class TriggerService {
  private readonly platform: IPlatform;
  private readonly logger: ILogger;
  private readonly events: EventManager;
  private readonly call: ICallActions;

  constructor(
    platform: IPlatform,
    logger: ILogger,
    events: EventManager,
    call: ICallActions
  ) {
    this.platform = platform;
    this.logger = logger;
    this.events = events;
    this.call = call;
  }

  // Called on each alarm tick
  async runTrigger(): Promise<void> {
    // requires vault setup
    if (!(await this.platform.vaultIsInitialized())) {
      this.logger.info("[Trigger] Vault not initialized -> skip");
      return;
    }

    // bypass battery + DND checks, no notification
    const activeEvent = await this.events.getActiveEventName();
    if (activeEvent !== null) {
      this.logger.info("[Trigger] Event override -> auto-log: " + activeEvent);
      this.call.autoLogEvent(activeEvent);
      return;
    }

    // Battery Level: skip if < 5%
    if (!(await this.platform.isBatterySafe())) {
      this.logger.info("[Trigger] Battery too low -> skip");
      return;
    }

    // skip if any DND mode
    if (!(await this.platform.isDndDisabled())) {
      this.logger.info("[Trigger] DND active -> skip");
      return;
    }

    // start call experience
    this.logger.info("[Trigger] Starting call interaction");
    this.call.startIncomingCall();
  }
}