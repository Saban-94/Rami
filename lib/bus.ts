// lib/bus.ts
export type BusEvent =
  | { type: "STAGED_PATCH_SET"; patch: any[] }
  | { type: "STAGED_PATCH_CLEAR" }
  | { type: "MANIFEST_APPLIED"; manifest: any }
  | { type: "LOCALE_CHANGED"; locale: "en" | "he" | "ar" };

export class NileBus {
  private ch: BroadcastChannel | null = null;

  constructor(name = "nile-bus") {
    // בדיקה קריטית: האם אנחנו בשרת או בדפדפן?
    if (typeof window !== "undefined") {
      this.ch = new BroadcastChannel(name);
    }
  }

  post(e: BusEvent) {
    if (!this.ch) return; // לא עושים כלום בשרת
    this.ch.postMessage(e);
  }

  on(cb: (e: BusEvent) => void) {
    if (!this.ch) return;
    this.ch.onmessage = (ev) => cb(ev.data);
  }

  close() {
    this.ch?.close();
  }
}
