# 구글 애널리틱스(GA4) 활용 방안 — 너비

> 측정 ID: `G-42Z5R1WD7Z` · 배선: `src/app/layout.tsx`(gtag 로더) + `src/lib/ga.ts`(이벤트 헬퍼) · KPI 정본: `docs/presentation-2026-07-15.md` §3
> 실수신 검증 완료 (2026-07-15): 프로덕션에서 `google-analytics.com/g/collect` POST → 204 확인 (changeset #6)

## 1. 무엇을 왜 재나 — 설계 원리

MAU 같은 "쌓이는 수"가 아니라, **"이 서비스가 사용자의 사이즈 결정을 실제로 대체했는가"**를 잰다 (팔란티어 프레임: What decision / How much impact / What data). GA4는 이벤트 기반이라 이 설계와 정확히 맞는다 — 페이지뷰가 아니라 행동 6종을 심었다.

## 2. 이벤트 스키마 (구현 완료)

| 이벤트 | 발화 시점 | 파라미터 | 연결 KPI |
|---|---|---|---|
| `start_input` | 첫 브랜드 선택 순간 | — | 퍼널 시작 (완료율 분모) |
| `view_result` | 결과 화면 도달 | source_brand, target_brand, recommended, confidence, **elapsed_ms** | 첫 예측 완료율·소요시간 |
| `adopt_size` | "이 사이즈로 살게요" 클릭 | target_brand, recommended, confidence | 결정 채택률 |
| `feedback_fit` | "맞았어요/틀렸어요" 클릭 | **correct(bool)**, target_brand, recommended | ★핏 적중률 |
| `repeat_query` | "다른 브랜드도 해보기" | source_brand | 당일 재조회율 |
| `predict_unavailable` | 번역 실패·파싱 실패 | reason | 가드레일(예측불가율) |

기본 수집되는 `page_view`는 방문 분모로만 쓴다.

## 3. 내일 실전 운용 절차

**(발표 중 라이브 데모)** GA 계정 주인이 [analytics.google.com](https://analytics.google.com) → 보고서 → **실시간(Realtime)** 열기 → 관객이 QR로 접속해 번역을 돌리면 30초 내 이벤트가 카운트로 뜬다. "측정이 살아 있다"를 눈앞에서 증명하는 장면 — 발표 5번 항목(전달) 득점 포인트.

**(측정 데이터 수집·집계)** V1 블라인드 중에는 손대지 않고, 마감 시점에:
1. 실시간 보고서 → 이벤트 수 스크린샷 박제 (`experiments/01`의 evidence)
2. KPI 계산: 첫 예측 완료율 = view_result 사용자 ÷ start_input 사용자 · 채택률 = adopt_size ÷ view_result · **적중률 = feedback_fit(correct=true) ÷ feedback_fit 전체** · 소요시간 = elapsed_ms 중앙값 · 재조회율 = repeat_query 사용자 ÷ view_result 사용자
3. 교차 검증: Vercel 함수 로그(`[translate]` 구조화 로그)와 GA 수치 대조 — 단일 소스 의존 방지

## 4. 한계 (발표에서 물어보면 이렇게 답한다)

- **표준 보고서는 24~48시간 지연** — 그래서 당일 판정은 실시간 보고서 + 서버 로그로 한다 (한계를 알고 설계했다는 답변 자체가 득점)
- 광고 차단기가 GA 요청을 막을 수 있음 → 서버 로그가 백업 소스
- `feedback_fit`은 자기보고 편향 가능 → V0(팀원 실물 교차검증)이 통제군 역할
- 사용자 식별 없음(로그인 미구현) → 사용자 단위 지표는 GA의 익명 client_id 기준

## 5. 다음 단계 (정식 버전 가정)

- 로그인 연동 시 user_id 기반 리텐션 측정 (D7 재방문)
- BigQuery export로 원본 이벤트 분석
- `confidence`별 적중률 세그먼트 → 신뢰도 임계값 자동 보정 루프
