# 20260716-nubi-ui-feedback-5

## Target
- Goal: 팀 UI 피드백 5건 반영 — 용어·정렬 픽셀·홈 내비·조건 그룹화·음각 인터랙션 (+GA 이탈률 KPI 사전 선언)
- ROADMAP milestone: B2

## Scope
| # | 변경 |
|---|---|
| 1 | "앵커 수정" → **"기준 옷 바꾸기"** (translator.tsx, 기능·아이콘 무변경) |
| 2 | CTA 패딩 비대칭 수리 — 원인: buttonVariants lg의 `has-data-[icon=inline-end]:pr-2`(8px)가 `px-6` 우측을 이김 → 같은 셀렉터로 `pr-6` 오버라이드. 검증: computed 24px/24px |
| 3 | 헤더 홈 버튼(House+"홈", 모바일 아이콘만+aria-label) + 로고 클릭 홈 — **페이지 이동 아닌 최상단 스크롤**(기준 옷 상태 보존 요구). 에이전트가 page.tsx 전체를 "use client"로 만든 것을 오케스트레이터가 `header-home.tsx` 클라이언트 소컴포넌트로 분리해 서버 컴포넌트 경계 복원 |
| 4 | Step2 핏+중요치수 → **"추천 조건 설정"** 카드(소제목 2개), 정렬 버튼 → "상품 정렬" 라벨 영역 (로직·GA 무변경) |
| 5 | `.pressable` 유틸(globals.css) — hover 은은한 inset, active 강화·0.5px 침하. Step1 브랜드·상품·사이즈·AI검색·붙여넣기·직접입력 전 인터랙션 적용, 선택 상태 시각 무변경 |
| + | `docs/presentation-2026-07-15.md` §3에 **Step2 도달률 KPI** 사전 선언 (GA 퍼널 page_view→start_input→view_result, 목표 ≥40%) — 코드 변경 불필요(이벤트 기발화) |

## Verification
- [x] `pnpm build`·`lint`·`design:lint` 0/0 PASS (에이전트+오케스트레이터 이중)
- [x] E2E: CTA computed padding 24/24 · 홈 클릭 후 scrollY=0 · "추천 조건 설정"/"원하는 핏"/"상품 정렬"/"기준 옷 바꾸기" 렌더 확인 · 스크린샷 `fb-header.png`/`fb-step2-grouped.png`
- [x] 프로덕션 배포+alias

## Result
- Status: passed
