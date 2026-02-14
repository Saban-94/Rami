export class NileBus {
  private ch: BroadcastChannel | null = null;

  constructor(name = "nile-bus") {
    // בדיקה קריטית: האם אנחנו בדפדפן?
    if (typeof window !== "undefined") {
      this.ch = new BroadcastChannel(name);
    }
  }

  post(e: BusEvent) {
    if (this.ch) this.ch.postMessage(e);
  }

  on(cb: (e: BusEvent) => void) {
    if (this.ch) {
      this.ch.onmessage = (ev) => cb(ev.data);
    }
  }
}
