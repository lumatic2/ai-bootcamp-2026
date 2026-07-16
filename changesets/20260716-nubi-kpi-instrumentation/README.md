# 20260716-nubi-kpi-instrumentation

## Target
- Goal: 팀 KPI 문서(kpi측정방안.md) 채택분 4종 구현 — 1시간 컷 체리픽 (사용자 지시 2026-07-16)
- ROADMAP milestone: B2

## Scope
| 이벤트 | 트리거 | 의미 |
|---|---|---|
| `recommendation_adopted` | 카드 주 CTA "추천 {size} 사이즈로 보러가기" 클릭 (7 파라미터: item·brand·size·match_score·rank·fit_preference·priority_dimension) | 북극성 행동 KPI — 상품 관심(카드 클릭)과 사이즈 수용을 분리 |
| `recommendation_feedback` | Step2 하단 2문항 카드(선호 방식 3지선다 + 신뢰도 1~5) 제출, 1회 잠금 | 가설 직접 검증 — 데이터 방식 선호율·신뢰도 |
| `anchor_edit` | "기준 옷 바꾸기" 클릭 | 결과 이상 신호 |
| `compare_item` | 비교 확장 시(열 때만) | 근거 확인 행동 |

기존 이벤트 전량 유지(병행 발화) — 당일 수집 데이터 연속성 보존. 파일: ga.ts(유니온 4종)·product-grid.tsx(CTA 2버튼 재구성+props)·translator.tsx(FeedbackCard·anchor_edit·props 배선).

## Verification
- [x] `pnpm build`/`lint`/`design:lint` 0 errors (에이전트+오케스트레이터 이중)
- [x] dev 콘솔 [ga] 로그로 4종 실발화 관측 (payload 전 파라미터 확인 — 에이전트가 console 가로채기로 검증)
- [x] 렌더: CTA 문구·피드백 카드 존재, 1회 제출 후 잠금 (`kpi-final.png`)
- [x] 프로덕션 배포+alias

## Result
- Status: passed
- Notes: 이커머스 items 체계·A/B 인프라·커스텀 차원은 부트캠프 이후 설계서(원문 문서)로 이관. 설문의 중복 질문(선호 방식)은 설문에서 제거 요청됨.
