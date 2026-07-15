# ROADMAP

> 마지막 업데이트: 2026-07-14
> 상태: 3-day evidence loop horizon
> 북극성: 팀이 가설부터 학습까지 한 사이클을 실행하고 결정·검증 증거를 발표한다.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="bootcamp-3day-loop" -->
목표: 팀이 문제 선정부터 발표까지 Build–Measure–Learn 루프를 재현 가능하게 수행한다. (상세 plan → `docs/horizons/bootcamp-3day-loop.md`)

## Active Milestones

<!-- harness:milestone id="B1" status="completed" priority="P0" evidence="changesets/20260714-bootcamp-foundation/README.md" -->
### B1 — 팀 논의 전 실험·구현 기반 준비
- DoD: 팀 플레이북, 범용 Next.js/Tailwind/shadcn 스타터, lint 가능한 임시 DESIGN.md, 킥오프 문서가 있고 전체 lint/build가 통과한다.
- Evidence: changesets/20260714-bootcamp-foundation/README.md
- Gap: 현재 레포에는 팀이 바로 문제를 정의하고 검증 가능한 제품을 만들 공통 절차와 실행 환경이 없다.
- Status: [x]

- Completed at: 2026-07-14
- Summary: 팀 플레이북, Next.js/Tailwind/shadcn starter, DESIGN.md lint, Chrome smoke PASS
<!-- harness:milestone id="B2" status="active" priority="P0" -->
### B2 — 팀 문제·솔루션 선정과 최소 실험 실행
- DoD: 문제 증거, 반증 가능한 가설, 측정 지표, 최소 제품, 실제 관찰 데이터, 학습 결론이 한 실험 기록으로 연결된다.
- Evidence: `experiments/01-size-translator-accuracy/README.md`와 실행 데이터
- Gap: 문제(A: 사이즈 도박)·솔루션(사이즈 번역기 "너비")·KPI는 2026-07-15 팀 미팅에서 확정됨(`references/research-clothes-20260715/`). 남은 것: MVP 구현, 배포, V0/V1 측정, 학습 기록.
- Status: [ ]

<!-- harness:milestone id="B3" status="pending" priority="P1" -->
### B3 — 제품 패키징과 발표 evidence 구성
- DoD: 실행 가능한 제품, 데모 경로, 의사결정 타임라인, 측정 결과와 학습이 발표 자료에서 추적된다.
- Evidence: 발표 자료, 데모 URL, `docs/presentation-evidence.md`
- Gap: 구현 결과만이 아니라 결정·검증 과정이 평가자에게 명확히 전달되어야 한다.
- Blocked by: B2 실험 결과
- Status: [ ]

## Next Candidates
- B3는 B2의 데이터와 학습 결론이 나온 뒤 active로 승격한다.

## 의사결정 이력 (추가)
- 2026-07-15 — Problem A(사이즈 도박)·솔루션(사이즈 번역기, 가칭 "너비") 팀 확정. B2 blocker 해소로 active 승격. 근거: `references/research-clothes-20260715/06-problem-scoring.md`, `08-solution-convergence.md`.

## Archive Pointer
완료 이력은 `BACKLOG.md` 참조.

## 의사결정 이력
- 2026-07-14 — 범용 웹 스타터는 준비하되 백엔드·인증·AI API는 문제 선정 이후로 미룸.
