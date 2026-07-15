// GA4 이벤트 헬퍼 — KPI 6종 계약: docs/presentation-2026-07-15.md §3
// start_input · view_result · adopt_size · feedback_fit · repeat_query · predict_unavailable

type GaParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type GaEventName =
  | "start_input"
  | "view_result"
  | "adopt_size"
  | "feedback_fit"
  | "repeat_query"
  | "predict_unavailable";

export function gaEvent(name: GaEventName, params: GaParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  if (process.env.NODE_ENV !== "production") {
    console.log("[ga]", name, params);
  }
}
