import type { ILogger } from "../logging/ILogger";
import type { IPlatform } from "../platform/IPlatform";
import type { ICallActions } from "../call/ICallActions";
import { EventManager } from "../events/events";

export class TriggerService {
  private static _instance: TriggerService | null = null;

  static instance(
    platform: IPlatform,
    logger: ILogger,
    events: EventManager,
    call: ICallActions
  ): TriggerService {
    if (!this._instance) this._instance = new TriggerService(platform, logger, events, call);
    return this._instance;
  }

  private constructor(
    private readonly platform: IPlatform,
    private readonly logger: ILogger,
    private readonly events: EventManager,
    private readonly call: ICallActions
  ) {}

  async runTrigger(): Promise<void> {
    if (!(await this.platform.vaultIsInitialized())) {
      this.logger.info("[Trigger] Vault not initialized -> skip");
      return;
    }

    const activeEvent = await this.events.getActiveEventName();
    if (activeEvent !== null) {
      this.logger.info("[Trigger] Event override -> auto-log: " + activeEvent);
      this.call.autoLogEvent(activeEvent);
      return;
    }

    if (!(await this.platform.isBatterySafe())) {
      this.logger.info("[Trigger] Battery too low -> skip");
      return;
    }

    if (!(await this.platform.isDndDisabled())) {
      this.logger.info("[Trigger] DND active -> skip");
      return;
    }

    this.logger.info("[Trigger] Starting call interaction");
    this.call.startIncomingCall();
  }
}