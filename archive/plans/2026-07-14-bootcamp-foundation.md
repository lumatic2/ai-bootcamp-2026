# PLAN — 팀 논의 전 실험·구현 기반 준비

Status: approved

> 생성: 2026-07-14 · 산출물: mixed (changeset, playbook, reference) · scope: 아이디어 비종속 기반만 구축

## 북극성 → horizon → milestone → step
- **북극성**: 팀이 가설부터 학습까지 한 사이클을 실행하고 결정·검증 증거를 발표한다. (← `docs/OBJECTIVE.md`)
- **horizon**: 3일 Build–Measure–Learn 루프 (← `docs/horizons/bootcamp-3day-loop.md`)
- **milestone**: B1 팀 논의 전 실험·구현 기반 준비. 문서, workflow, runtime, design gate의 독립 step과 통합 build 검증이 필요하므로 milestone 규모다.

## 범위와 중단점
- 실행 모드: `continuous`
- 포함: 팀 플레이북, 킥오프 문서, DESIGN.md 레퍼런스 분석, Next.js/Tailwind/shadcn 스타터, 디자인 lint, 전체 lint/build/smoke.
- 제외: 제품 아이디어, 백엔드, 인증, 데이터베이스, AI API, 배포, 특정 브랜드 디자인 복제.
- 중단점: completed, blocked, decision_required, risk_gate, secret_required, 외부 설치 실패.
- 롤백/정리: 생성 패키지와 소스는 해당 changeset diff로 되돌리고, 임시 프로세스와 캐시는 종료·삭제한다.

## 결정 로그
- status: resolved
- 스택: Next.js App Router + TypeScript + pnpm + Tailwind CSS v4 + shadcn/ui.
- 디자인: 특정 브랜드를 복사하지 않고 임시 중립 토큰을 사용하며 제품 결정 후 교체한다.
- 제품 종속 범위: 백엔드·인증·AI API·배포는 팀 결정 전 설치하지 않는다.
- 승인: 2026-07-14 사용자 `진행`.

## Step 트리
- [ ] **step-1-planning-playbook** — 팀 실행 계약과 디자인 레퍼런스 근거를 완성한다.
  - 산출물: playbook, kickoff 문서, reference analysis
  - 파일: `playbooks/`, `docs/team-kickoff.md`, `references/voltagent-awesome-design-md/`
  - 의존성: 승인된 Objective/Horizon과 공식 GitHub 자료
  - 검증: playbook 4섹션, analysis 5섹션, 링크와 날짜 존재 여부 검사
  - 실패 검증: placeholder와 빈 필수 섹션 검색
  - 커밋 경계: `playbook: 3-day build-measure-learn` 단일 커밋
- [ ] **step-2-web-scaffold** — 범용 Next.js/Tailwind/shadcn 실행 환경을 구축한다.
  - 산출물: changeset
  - 파일: `package.json`, lockfile, Next 설정, `src/`, `components/`, `components.json`
  - 의존성: Node.js, pnpm, npm registry
  - 검증: `pnpm lint && pnpm build`
  - 실패 검증: 제품 종속 서비스와 secret 의존성이 설치되지 않았는지 검사
  - 커밋 경계: foundation changeset 구현 커밋
- [ ] **step-3-design-contract** — DESIGN.md를 Tailwind와 shadcn 토큰에 연결하고 lint한다.
  - 산출물: changeset
  - 파일: `DESIGN.md`, `src/app/globals.css`, package scripts
  - 의존성: `@google/design.md`, shadcn CSS 변수
  - 검증: `pnpm design:lint && pnpm build`
  - 실패 검증: 깨진 token reference와 WCAG AA 미달 finding 검사
  - 커밋 경계: foundation changeset 구현 커밋에 포함
- [ ] **step-4-integrated-gate** — 문서·디자인·코드와 브라우저 첫 화면을 통합 검증한다.
  - 산출물: evidence
  - 파일: changeset README, 실행 ledger, machine-local work state
  - 의존성: step 1~3 완료
  - 검증: design lint, ESLint, production build, 로컬 렌더 smoke 모두 PASS
  - 실패 검증: 빈 화면, console error, 제품 종속 외부 호출이 없는지 확인
  - 커밋 경계: evidence와 status 기록 커밋

## 검증/DoD
- 팀 플레이북, 범용 스타터, 임시 디자인 계약, 킥오프 문서가 존재하고 `pnpm design:lint && pnpm lint && pnpm build` 및 브라우저 smoke가 통과한다.

## finding 큐
- 제품 문제와 사용자가 정해지면 DESIGN.md 토큰과 PRD를 팀 결정으로 교체한다.
- B2 시작 전 측정 이벤트와 데이터 수집 경계를 별도 승인한다.

## 진행 로그
- 2026-07-14 사용자가 제시된 전체 계획을 승인했다.
