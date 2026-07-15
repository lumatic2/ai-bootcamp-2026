# PLAN — "너비"(사이즈 번역기) MVP 구축·측정 (B2)

Status: proposed

> 생성: 2026-07-15 · 산출물: mixed (changeset ×2, playbook, experiment evidence) · scope: B2 milestone — 스캐폴딩·배포는 오늘, 구현 완성·측정은 내일 팀 세션

## 북극성 → horizon → milestone → step
- **북극성**: 팀이 가설부터 학습까지 한 사이클을 실행하고 결정·검증 증거를 발표한다. (← `docs/OBJECTIVE.md`)
- **horizon**: 3일 Build–Measure–Learn 루프 (← `docs/horizons/bootcamp-3day-loop.md`)
- **milestone**: B2 팀 문제·솔루션 선정과 최소 실험 실행. 문제 선정(완료)·스캐폴딩·배포·측정·학습의 독립 step ≥2 + 통합 검증(실험 기록으로의 연결)이 필요하므로 milestone 규모다.

## planning_gate
```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "리서치·데이터 확보는 이미 sonnet 위임으로 완료(E0 GO). 남은 구현은 단일 레포 응집 변경으로 검증 커맨드가 명확하고, 내일 구현은 팀 실시간 세션이라 background 위임 부적합."
    target_roles: []
    execution_path: local_manual
  spec_delta: "ROADMAP B2 active 승격 + Gap 갱신(이 커밋). PRD는 MVP 계약으로 갱신(step-1에 포함)."
  perspectives:
    product: "페르소나(첫 브랜드 구매 20대 남성)의 결정 1개(사이즈 선택)를 60초 내 대체 — 리서치 5경로 수렴 근거"
    architecture: "Next.js 단일앱 + API route 2 + 정적 JSON 시드. DB·인증 없음(레포 규약 준수)"
    security: "OpenAI 키는 서버측만. .env.local gitignore 확인됨. 사용자 PII 미수집(브랜드·사이즈만)"
    qa: "pnpm check(design:lint+lint+build) + 브라우저 E2E smoke + 실패 경로(미지원 브랜드·키 부재) 확인"
    skeptic: "실측표 편차·라벨 혼재로 매핑이 틀릴 수 있음 — V0 팀원 교차검증으로 내일 오전 즉시 반증 가능하게 설계"
  role_lanes:
    explorer: "완료 — E0 실측 수집(09), 경쟁 검증(07)"
    planner: "이 plan doc"
    reviewer: "step 커밋 전 diff self-review, scope_posture=selective 대조"
    qa: "changeset Verification checklist + browse smoke"
    gate: "B2 완료 주장은 ledger 3-event + 실험 기록 4섹션 완성 후에만"
  dod:
    - "pnpm design:lint && pnpm lint && pnpm build PASS"
    - "브라우저 E2E: 3스텝 입력→결과 화면 도달 + /api/translate 실응답 관측"
    - "실패 모드: 미지원 브랜드 선택 시 graceful 안내, OPENAI_API_KEY 부재 시 mine-reviews 에러 경로 확인"
    - "배포 URL 200 + GA 이벤트 발화 관측(ID 연결 후)"
    - "experiments/01 결과·통찰 섹션이 실측 데이터로 채워짐(내일)"
```

## 범위와 중단점
- 실행 모드: `continuous`
- 포함(오늘 run): step-1 스캐폴딩 changeset, step-2 배포 changeset, step-3 내일 런북. 
- 포함(내일, 팀 세션): step-4 구현 완성+측정, step-5 실험 기록 완성.
- 제외(non-goals): 하의·아우터 카테고리, 회원가입·인증, DB, 결제, Chrome 확장, 크롤링 자동화 파이프라인(수동 큐레이션으로 충분), 코디 추천(2단계 로드맵).
- 중단점(hard-stop): completed · blocked/error · 새 사용자 소유 결정(신규 리스크·스코프 변경·크레덴셜) · secret_required(GA4 ID·Vercel 토큰이 필요한데 부재) · 외부 서비스 장애.
- 롤백/정리: 각 changeset diff 단위 revert. Vercel 프로젝트는 삭제로 원복. 임시 dev 서버 종료.

## 결정 로그
- status: resolved
- 확정 주체: 2026-07-15 팀 미팅 + 사용자
- 서비스명: 가칭 **"너비"** (확정 시 메타·카피만 교체)
- 카테고리: **남성 반팔 티셔츠 1개 한정** (의도적 축소 — 적중률 우선)
- 신뢰도 표현: **상/중/하** (% 금지 — 오답 시 신뢰 손상 관리)
- 예측 불가 UX: **지원 브랜드 목록을 입력 단계에서 명시** (실패 노출 최소화)
- 결과 피드백: **"맞았어요/틀렸어요" 버튼 필수** (= 핏 적중률 KPI 수집기)
- 도박 비용 공유 카드(S5): slice 3 — 여유 시에만, 우선순위 컷 대상
- 데이터: 정적 JSON 시드(E0 수집 9브랜드 + 팀 구글시트 유입분). DB 없음
- 아키텍처: Next.js 단일앱, API route 2개(`/api/translate`, `/api/mine-reviews`), OpenAI 서버측 호출, Vercel 배포
- 측정: GA4 이벤트 6종. **측정 ID는 발급 대기** — env 변수 자리만 배선해 진행, ID 도착 즉시 주입 (스캐폴딩 blocker 아님)
- 펜딩 입력(결정 아님): GA4 측정 ID, 팀 시트의 추가 실측 데이터

## Step 트리
- [ ] **step-1-scaffold-changeset** — "너비" MVP 전체 골격을 한 changeset으로 구현한다.
  - 산출물: changeset (`changesets/20260715-nubi-mvp-scaffold/`)
  - 파일: `src/data/size-charts.json`(시드 9브랜드 정규화), `src/lib/translate.ts`(실측 매핑 로직), `src/lib/ga.ts`(이벤트 헬퍼 6종), `src/app/page.tsx`(3스텝 플로우), `src/app/api/translate/route.ts`, `src/app/api/mine-reviews/route.ts`, `src/app/layout.tsx`(너비 메타+GA 조건부 스니펫), `DESIGN.md`(임시 토큰→제품 토큰 교체), `docs/PRD.md`(MVP 계약 갱신)
  - 의존성: E0 시드 데이터(`references/research-clothes-20260715/09-size-chart-feasibility.md`), OpenAI 키(.env.local 완비)
  - 검증: `pnpm design:lint && pnpm lint && pnpm build` + `/browse` E2E(3스텝 전환→결과 도달, `/api/translate` 실응답, GA 이벤트 console 관측)
  - 실패 검증: 미지원 브랜드 graceful 안내 · 빈 리뷰 입력 시 mine-reviews 생략 경로 · OPENAI_API_KEY 제거 상태에서 translate(비 LLM 경로)는 동작하고 mine-reviews만 명시적 에러
  - 커밋 경계: `feat(nubi): mvp scaffold — 3-step flow, translate engine, seed data` 단일 커밋
- [ ] **step-2-deploy-changeset** — Vercel 프로젝트 생성, env 주입, bootcamp.askewly.com 연결.
  - 산출물: changeset (`changesets/20260715-nubi-deploy/`)
  - 파일: Vercel 프로젝트 설정(외부), `changesets/20260715-nubi-deploy/README.md`, 필요 시 `next.config.ts`
  - 의존성: step-1 커밋, Vercel 토큰(`~/.claude/memory/deploy.md` REST 관례), Cloudflare DNS 접근
  - 검증: 프로덕션 URL HTTP 200 + `/api/translate` 프로덕션 실호출 1건 + 도메인 CNAME 해석
  - 실패 검증: env(OPENAI_API_KEY) 미주입 상태의 에러 응답 확인 후 주입·재확인
  - 커밋 경계: `chore(deploy): vercel + cloudflare dns for nubi` 단일 커밋
- [ ] **step-3-build-day-runbook** — 내일 팀 세션(한 노트북 공동 작업) 런북을 작성한다.
  - 산출물: playbook (`playbooks/mvp-build-day.md`)
  - 파일: `playbooks/mvp-build-day.md`, `playbooks/README.md` 인덱스
  - 의존성: step-1 구조 확정
  - 검증: 시간대별 절차 + thin slice별 완료 기준 + V0/V1 측정 스크립트 + 근거 섹션(리서치 링크) 존재
  - 실패 검증: 미기입 표식(미정 항목) 검색 0건
  - 커밋 경계: `playbook: mvp build day` 단일 커밋
- [ ] **step-4-team-build-measure** — (내일, 팀 세션) thin slice 2·3 완성, V0 팀원 교차검증, V1 블라인드 15~20명 배포·측정.
  - 산출물: experiment evidence (`experiments/01-size-translator-accuracy/` V0/V1 데이터)
  - 파일: `experiments/01-size-translator-accuracy/README.md` 결과 섹션, GA4 export/서버 로그
  - 의존성: step-1~3, GA4 측정 ID, 팀 시트 실측 데이터 유입
  - 검증: KPI 6종 실측값 기록(적중률 표본 ≥15)
  - 실패 검증: 적중률 <40% 시 반증 조건 발동 기록(피벗 결정 포함)
  - 커밋 경계: `experiment: V0/V1 measurement data` 커밋
- [ ] **step-5-learn-close** — 실험 기록 4섹션 완성(통찰 필수), B2 완료 처리.
  - 산출물: experiment 완결 + milestone 완료 (ledger 3-event, roadmap_sync complete)
  - 파일: `experiments/01-size-translator-accuracy/README.md`, `.harness/execution-ledger.jsonl`, `ROADMAP.md`
  - 의존성: step-4 데이터
  - 검증: 통찰 섹션 비어 있지 않음 + PASS/FAIL 판정 + B2 DoD 전 항목 evidence 경로 존재
  - 실패 검증: "통찰이 비었으면 실험이 안 끝난 것" 규칙 위반 검사
  - 커밋 경계: `experiment: close 01 + roadmap B2 complete`

## 검증/DoD (milestone 통합)
- B2 DoD 그대로: 문제 증거(리서치 01~09) → 가설(experiments/01) → 지표(KPI 6종) → 최소 제품(배포 URL) → 관찰 데이터(V0/V1) → 학습 결론(통찰 섹션)이 한 실험 기록에서 역추적된다.

## finding 큐
- 팀 시트 실측 데이터의 정규화 자동 변환(시트→JSON) — step-1 중 여유 시 스크립트화
- 라코스테 라벨 매핑·NDY 소매 이상치 재검증
- GA4 ID 도착 시 env 주입 + 이벤트 실발화 확인
- 서비스명 확정 시 메타·카피 교체

## 진행 로그
- 2026-07-15 plan 작성. 승인 대기.
