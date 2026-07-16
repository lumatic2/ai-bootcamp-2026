// GA4 이벤트 헬퍼 — KPI 계약: docs/presentation-2026-07-15.md §3
// 핵심 6종: start_input · view_result · adopt_size · feedback_fit · repeat_query · predict_unavailable
// 부가 3종: view_grid(전 브랜드 그리드) · mall_referral(몰 유입) · outbound_click(판매처 유출)

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
  | "predict_unavailable"
  | "view_grid"
  | "mall_referral"
  | "outbound_click"
  | "recommendation_adopted"
  | "recommendation_feedback"
  | "anchor_edit"
  | "compare_item"
  | "feedback_basis_submit"
  | "comparison_feedback_reason_submit";

export function gaEvent(name: GaEventName, params: GaParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  if (process.env.NODE_ENV !== "production") {
    console.log("[ga]", name, params);
  }
}
