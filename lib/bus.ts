// lib/bus.ts

export type BusEvent =
  | { type: "STAGED_PATCH_SET"; patch: any[] }
  | { type: "STAGED_PATCH_CLEAR" }
  | { type: "MANIFEST_APPLIED"; manifest: any }
  | { type: "LOCALE_CHANGED"; locale: "en" | "he" | "ar" };

export class NileBus {
  private ch: BroadcastChannel;

  constructor(name = "nile-bus") {
    this.ch = new BroadcastChannel(name);
  }

  post(e: BusEvent) {
    this.ch.postMessage(e);
  }

  on(cb: (e: BusEvent) => void) {
    this.ch.onmessage = (ev) => cb(ev.data);
  }

  close() {
    this.ch.close();
  }
}
