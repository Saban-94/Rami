// lib/bus.ts
export class NileBus {
  private ch: BroadcastChannel | null = null;

  constructor(name = "nile-bus") {
    // בדיקה אם אנחנו בדפדפן
    if (typeof window !== "undefined") {
      this.ch = new BroadcastChannel(name);// lib/bus.ts

export type BusEvent =
  | { type: "STAGED_PATCH_SET"; patch: any[] }
  | { type: "STAGED_PATCH_CLEAR" }
  | { type: "MANIFEST_APPLIED"; manifest: any }
  | { type: "LOCALE_CHANGED"; locale: "en" | "he" | "ar" };

export class NileBus {
  private ch: BroadcastChannel | null = null;

  constructor(name = "nile-bus") {
    // בדיקה: אם אנחנו לא בשרת (יש window), תייצר את הערוץ
    if (typeof window !== "undefined") {
      this.ch = new BroadcastChannel(name);
    }
  }

  post(e: BusEvent) {
    if (!this.ch) return;
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
