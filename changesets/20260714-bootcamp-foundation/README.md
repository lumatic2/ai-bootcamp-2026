# 20260714-bootcamp-foundation

## Target
- Goal: 팀 논의 전에 실험 절차와 범용 웹·디자인 실행 환경을 준비한다.
- ROADMAP milestone: B1

## Scope
| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `package.json`, lockfile, Next config | 재현 가능한 웹 런타임 | 팀원이 같은 명령으로 실행·빌드 |
| `src/`, `components/`, `lib/` | 중립 starter UI와 shadcn primitive | 제품 결정 후 즉시 확장 |
| `DESIGN.md`, global CSS | 디자인 토큰 정본과 실행 연결 | AI·사람·코드가 같은 디자인 계약 사용 |
| `docs/`, `playbooks/`, `references/` | 결정·검증 과정 박제 | 발표 evidence와 팀 온보딩 개선 |

## Contract
- Source of truth: `docs/OBJECTIVE.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `DESIGN.md`
- Deploy/sync target: 로컬 레포만. 외부 배포 없음.
- Compatibility: Node.js 22 LTS, pnpm 10+, 현대 브라우저
- Out of scope: 제품 기능, 백엔드, 인증, DB, AI API, 배포, 브랜드 복제

## Evidence Contract
- Scenario: 새 checkout에서 의존성을 설치하고 design lint, code lint, production build, 첫 화면 smoke를 실행한다.
- Expected evidence: 모든 명령 exit 0, 첫 화면 nonblank, 핵심 다음 행동 노출, console error 없음.
- Failure mode probe: secret/env 요구, 외부 API 호출, 깨진 디자인 참조, 저대비, 빈 화면을 확인한다.
- Cleanup receipt: dev server 종료, 임시 스크린샷과 캐시 경로 정리.
- Not evidence: 파일 존재만 확인, mock 데이터를 실제 측정이라고 주장, dev server 시작 로그만 제시.

## Verification
- [ ] Targeted tests: `pnpm design:lint`
- [ ] Smoke: `pnpm lint && pnpm build` + 브라우저 렌더 확인
- [x] Sync/deploy if skill changed: 해당 없음 — 스킬 변경 없음
- [x] Deployed copy grep if skill changed: 해당 없음 — 스킬 변경 없음
- [ ] Drift/dirty-tree check: 의도한 파일만 변경됐는지 확인

## Result
- Status: pending
- Evidence: 실행 후 기록
- Notes: 제품 결정 후 B2에서 PRD와 DESIGN.md를 팀 합의로 갱신한다.
