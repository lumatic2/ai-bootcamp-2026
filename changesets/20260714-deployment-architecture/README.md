# 20260714-deployment-architecture

## Target

- Goal: 발표용 Next.js 앱의 호스팅과 `askewly.com` 서브도메인 소유 경로를 팀 구현 전에 고정한다.
- ROADMAP milestone: B3 — 제품 패키징과 발표 evidence 구성 (선행 배포 결정)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `CLAUDE.md` | 배포 정본을 기록 | 구현 단계의 호스팅 선택 drift 방지 |
| `docs/adr/0003-vercel-cloudflare-domain.md` | 의사결정과 실행 순서 보존 | Vercel 호스팅과 Cloudflare DNS 책임 분리 |
| `docs/adr/README.md` | ADR 인덱스 갱신 | 결정 문서 탐색 가능 |

## Contract

- Source of truth: ADR 0003
- Deploy/sync target: Vercel 프로젝트 + Cloudflare DNS의 `bootcamp.askewly.com` CNAME (제품 구현 후)
- Compatibility: Next.js App Router starter와 호환
- Out of scope: Vercel 프로젝트 생성, DNS 레코드 생성, 실제 앱 배포

## Evidence Contract

- Scenario: 이 Mac에서 Cloudflare OAuth 기반 Wrangler 인증을 수행한다.
- Expected evidence: `npx wrangler whoami`가 인증된 OAuth 상태와 zone 읽기 권한을 보고한다.
- Failure mode probe: Wrangler 미설치 상태에서 `npx` 경로로 인증을 시도한다.
- Cleanup receipt: 인증 정보는 사용자 홈의 Wrangler credential store에만 보관하고 레포에는 기록하지 않는다.
- Not evidence: OAuth 로그인 성공만으로 Vercel 프로젝트, DNS 레코드, 라이브 URL이 생성됐다는 뜻은 아니다.

## Verification

- [x] Targeted tests: `npx wrangler whoami` — OAuth 인증 및 zone 조회 권한 확인
- [x] Smoke: 기존 `kifrs.askewly.com` Cloudflare custom-domain 배포 설정과 대조
- [ ] Sync/deploy if skill changed: 해당 없음
- [ ] Deployed copy grep if skill changed: 해당 없음
- [x] Drift/dirty-tree check: 변경 범위가 배포 결정 문서로 한정됨

## Result

- Status: passed
- Evidence: Wrangler OAuth 로그인 성공; `kifrs.askewly.com`의 custom-domain 배포 선례
- Notes: 실제 DNS CNAME 값은 Vercel 프로젝트 생성 후 확인한다.
