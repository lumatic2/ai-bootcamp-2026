# 20260716-nubi-measurement-contract

## Target

- Goal: V0/V1 측정 전에 GA4 이벤트를 KPI 계산 계약과 일치시킨다.
- ROADMAP milestone: B2 (`docs/plans/2026-07-15-nubi-mvp-build.md` step-4)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/components/translator.tsx` | `view_result`에 소요시간이 누락됨 | `elapsed_ms` 중앙값 계산 가능 |
| `src/components/product-grid.tsx` | `feedback_fit`이 문서 계약의 `correct`를 보내지 않음 | GA4에서 핏 적중률 직접 계산 가능 |
| `changesets/README.md` | 변경 인덱스 등록 | 측정 계약 수정 추적 |

## Contract

- Source of truth: `docs/analytics-plan.md`의 GA4 이벤트·KPI 정의와 `src/lib/ga.ts` 이벤트 헬퍼
- Deploy/sync target: Vercel 프로덕션(배포는 측정 시작 전 별도 수행)
- Compatibility: 기존 `fit=hit|miss` 파라미터를 유지하고 `correct`를 추가한다.
- Out of scope: V0/V1 표본 생성, GA4 보고서 조회, KPI 판정, 데이터 파일 변경

## Evidence Contract

- Scenario: 사용자가 입력을 시작해 결과에 도달하고, 상품 비교에서 맞았어요/틀렸어요를 누른다.
- Expected evidence: `view_result.elapsed_ms`가 0 이상의 숫자이고 `feedback_fit.correct`가 boolean으로 발화하는 코드 경로 + production build PASS
- Failure mode probe: 기존 `fit` 파라미터가 사라져 과거/신규 이벤트 구분이 깨지지 않는지 확인
- Cleanup receipt: 실행한 빌드 프로세스 종료
- Not evidence: GA4 화면을 열지 못한 상태에서 수신됐다고 주장하는 것

## Verification

- [x] Targeted tests: 이벤트 호출부 정적 검사 PASS — `elapsed_ms`, click timestamp, `correct=true|false`, legacy `fit=hit|miss` 확인
- [x] Smoke: `pnpm check` PASS — design lint 0/0, ESLint, Next.js production build
- [x] Sync/deploy: Vercel production deploy READY, `bootcamp.askewly.com` alias 갱신, HTTP 200
- [x] Drift/dirty-tree check: 별도 임시 worktree에서 커밋 `0031d33`만 배포해 사용자 소유 데이터 변경을 제외

## Result

- Status: passed
- Evidence: 정적 이벤트 계약 검사 출력, `pnpm check` exit 0, Vercel deployment `dpl_6amdRyLtbXLG2w7Z4yje4mcUVWyq`, `https://bootcamp.askewly.com` HTTP 200
- Notes: 첫 구현은 `Date.now()`가 React purity lint에 걸려 클릭 이벤트 `timeStamp` + 결과 effect의 `performance.now()` 차이로 수정 후 재검증했다. Chrome 연결 실패로 기존 GA4 수신 데이터는 확인하지 못했다. V0/V1 표본 수집은 이 changeset 범위 밖이다.
