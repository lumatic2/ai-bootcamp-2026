# 20260716-nubi-compare-feedback-ui7

## Target
- Goal: ① 비교 피드백 계측 보강(맞았어요/틀렸어요 KPI 문서 채택분) ② UI 스타일 피드백 #6~12 전건 반영 ③ 이미지 채움이 유발한 나이키 크래시 수리
- ROADMAP milestone: B2 (사용자 지시 "구현하고 … 합리적인거 판단해서 구현도 해", 2026-07-16)

## Scope
**A. 계측** (ga.ts·product-grid.tsx): feedback_fit 파라미터 확장(match_score·rank·bucket — 이름 유지로 연속성 보존) + 후속 1탭 `feedback_basis_submit`(입어봤/갖고있/치수표만 — **적중률 vs 인지 정확도 분리 장치**) + 틀렸어요 한정 `comparison_feedback_reason_submit`(too_small~sleeve_mismatch). 상품당 1회 잠금 3중 맵.

**B. UI 7건**: #6 배지 "핏 적합도 NN%"(+aria) · #7 **행 늘어남 버그 수리**(grid items-start — 확장 카드 378→566px 동안 옆 카드 402.1px 불변 계측) · #8 비교 패널 내 판매처 링크 제거(카드 CTA·본문 링크 유지) · #9 비교 중 카드 ring+shadow 강조, 나머지 opacity-80(블러 폴백안) · #10 챗봇 pill "사이즈·핏 질문하기"(모바일 5초 후 접힘) · #11 맨 위로 플로팅(500px 스크롤 후 표시·reduced-motion 대응·44px) · #12 PC 전용 카드 hover lift(`hover:hover and pointer:fine`, transform만·비교 중 카드 제외) — 그림자 클리핑 방지 위해 카드 wrapper 이중화.

**C. 크래시 수리** (next.config.ts): 나이키 이미지 호스트(croketglobal CDN) remotePatterns 미등록 → 나이키 선택 시 next/image 런타임 크래시 — 에이전트가 발견, 오케스트레이터가 데이터 전체 이미지 호스트 감사(2종) 후 등록.

## Verification
- [x] `pnpm build`·`lint`·`design:lint` 0 errors (에이전트+오케스트레이터, config 변경 후 dev 재시작 포함)
- [x] 에이전트 계측: [ga] 3종 이벤트 payload 실관측 · #7 boundingBox 수치 검증 · #9 opacity 계산값 · #11 scrollY 동작
- [x] 오케스트레이터 게이트: 나이키 선택 재현 → pageerror 0 · "핏 적합도" 배지 렌더 · 패널 내 판매처 링크 0
- [x] 프로덕션 배포+alias

## Result
- Status: passed
- Notes: basis/reason 질문은 스킵 시 미발화(unknown 강제 전송 안 함). 폴로 이미지 1건은 출처 지역차단으로 placeholder 유지(정직성).
