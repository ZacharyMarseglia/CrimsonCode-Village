//ICallActions.ts

export interface ICallActions {
  startIncomingCall(): void;
  autoLogEvent(eventName: string): void;
}