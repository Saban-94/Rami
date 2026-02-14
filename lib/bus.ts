// lib/bus.ts
export class NileBus {
  private ch: BroadcastChannel | null = null;

  constructor(name = "nile-bus") {
    // בדיקה אם אנחנו בדפדפן
    if (typeof window !== "undefined") {
      this.ch = new BroadcastChannel(name);
    }
  }

  post(e: any) {
    this.ch?.postMessage(e);
  }

  on(cb: (e: any) => void) {
    if (this.ch) {
      this.ch.onmessage = (ev) => cb(ev.data);
    }
  }

  close() {
    this.ch?.close();
  }
}
