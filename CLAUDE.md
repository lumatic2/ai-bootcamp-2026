# AI Vibe Coding Bootcamp 2026

> 3일 동안 팀이 가설 → Build → Product → Measure → Data → Learn 루프를 실행하고, 결정과 검증 근거를 재현 가능하게 남기는 작업 레포.

## 기술 스택
- 런타임: Node.js 22 LTS 호환을 목표로 하는 Next.js App Router + TypeScript
- 패키지 매니저: pnpm
- UI: Tailwind CSS v4 + shadcn/ui + Lucide
- 디자인 정본: 루트 `DESIGN.md`; `@google/design.md` lint로 구조·대비·토큰 참조 검증
- 테스트/검증: ESLint, Next.js production build, 디자인 lint, 브라우저 smoke
- 배포: 제품 결정 전에는 보류. 발표용 배포가 필요해지면 Vercel을 기본 후보로 검토

## 프로젝트 구조
```text
src/app/       Next.js 앱과 전역 스타일
src/components/ shadcn/ui 및 제품 컴포넌트
docs/          Objective, PRD, architecture, ADR, 팀 킥오프 자료
playbooks/      반복 가능한 팀 진행 절차
experiments/    가설·방법·결과·학습 기록
references/     외부 레퍼런스 분석
changesets/     구현 변경과 검증 증거
```

## 개발 명령어
```bash
pnpm dev
pnpm lint
pnpm build
pnpm design:lint
```

## Gotchas
- `DESIGN.md`의 초기 토큰은 팀 논의 전 사용하는 임시값이다. 제품과 사용자가 결정되면 레퍼런스 선택 근거와 함께 교체한다.
- `awesome-design-md`는 참고 카탈로그이지 그대로 복제할 제품 정본이 아니다.
- 백엔드, 인증, 데이터베이스, AI API는 문제와 최소 실험이 결정되기 전 설치하지 않는다.
- 아이디어 참신성보다 문제 선정 근거, 가설, 측정 데이터, 학습과 피벗 기록을 우선한다.

## 작업 방식
- 모든 제품 판단은 `가설 → Build → Product → Measure → Data → Learn → 다음 가설`로 닫는다.
- 결정에는 선택지, 선택 이유, 반증 조건, 증거 위치를 남긴다.
- 1 changeset = 1 구현 작업 단위이며 검증 checklist 없이 완료하지 않는다.
- 실험은 `experiments/`의 가설·방법·결과·통찰 4섹션을 모두 채운다.
- 팀 진행은 `playbooks/3-day-build-measure-learn.md`를 기준으로 하되, 사람의 문제 정의와 우선순위 판단을 자동화하지 않는다.

## ROADMAP 운영
- `ROADMAP.md`는 current horizon / active milestone 장부이며 150줄 이하로 유지한다.
- `BACKLOG.md`는 완료·보류·아카이브된 milestone 압축 이력이다.
- ROADMAP/BACKLOG 쓰기 소유자는 `/harness`다. milestone 완료·compact·horizon-check는 `/harness`가 처리한다.
- `session-end`는 ROADMAP을 수정하지 않는다. read-only로 확인하고 `CLAUDE.local.md` handoff에만 반영한다.

## 컨텍스트 갱신 규칙
- 사용자가 같은 교정을 2회 이상 반복하거나 "항상 ~해줘"·"다시는 ~하지 마"라고 하면 이 파일과 `AGENTS.md` 갱신을 제안한다.
- 이 레포에만 해당하는 사실은 여기에, 모든 레포에 해당하면 글로벌 지침에 제안한다.
- 정기적으로 `context-manager`를 전체 점검으로 실행해 배치 오류와 drift를 확인한다.

## ⚠ Judge 규약
> 코드·스킬·런타임 변경은 targeted test/smoke/sync 증거 없이는 완료 보고하지 않는다. 디자인 변경은 `DESIGN.md` lint와 렌더 확인을 모두 통과해야 한다.

## 의사결정 이력
의도적으로 선택하거나 제외한 기술·범위는 `docs/adr/`에 보존한다.
