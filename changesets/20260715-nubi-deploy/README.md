# 20260715-nubi-deploy

## Target

- Goal: 너비 MVP Vercel 프로덕션 배포 + bootcamp.askewly.com 연결
- ROADMAP milestone: B2 (plan: `docs/plans/2026-07-15-nubi-mvp-build.md` step-2)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| Vercel project `nubi` (외부) | REST로 생성, env 2종 주입(OPENAI_API_KEY encrypted, GA ID plain) | 프로덕션 런타임 |
| Vercel domains (외부) | `bootcamp.askewly.com` attach + 공개 별칭 `nubi-alpha.vercel.app` | 배포 채널 URL |
| 이 README | 배포 증거 기록 | evidence |

## Contract

- Source of truth: git `main` (배포 시점 `5bfae34`) — 로컬 소스 업로드 방식(npx vercel deploy --prod)
- Deploy/sync target: Vercel team `yusongs-projects` / project `nubi` (prj_IihZFHsM1GVGnSGRw1LAjGLhzVYS)
- Compatibility: Next.js 16 자동 감지, 추가 설정 파일 불필요
- Out of scope: Cloudflare DNS 레코드 생성(토큰 없음 — 사용자 수동), GitHub 연동 자동 배포(내일 필요 시)

## Evidence Contract

- Scenario: 공개 URL에서 페이지 로드 + 번역/리뷰마이닝 API 실호출
- Expected evidence: HTTP 200 + API 실응답 + GA 태그 HTML 포함
- Failure mode probe: env 미주입이 아닌 정상 주입 확인(mine-reviews가 프로덕션에서 실 LLM 응답 = OPENAI_API_KEY 주입 증명), 미지원 브랜드 400
- Cleanup receipt: 토큰은 세션 스크래치패드에만 존재(레포·출력 미노출)
- Not evidence: 배포 성공 메시지만으로 완료 주장

## Verification

- [x] Targeted tests: `https://nubi-alpha.vercel.app/` 200 · `/api/translate` 실응답(무신사 M→스투시) · `/api/mine-reviews` 실 LLM 응답(크게1·정사이즈1, 원문 인용) — env 주입 증명 · 미지원 브랜드 400
- [x] Smoke: HTML에 `gtag/js?id=G-42Z5R1WD7Z` 포함 확인 (GA 프로덕션 활성)
- [x] Sync/deploy: production 배포 dpl_2ZfSyoB12ykgS3p5VhGBE2jtpD7k ready, alias 4종 활성
- [x] Drift/dirty-tree check: 배포 소스 = 커밋 `5bfae34` 시점 워킹트리(clean)

## Result

- Status: passed (도메인 1건 사용자 액션 대기)
- Evidence: 본 README Verification 로그
- Notes: ① `bootcamp.askewly.com`은 Vercel attach 완료·verified. 단 askewly.com DNS가 Cloudflare NS라 **CNAME 레코드는 Cloudflare 대시보드에서 수동 추가 필요**: `CNAME / bootcamp / cname.vercel-dns.com / DNS only(회색 구름)`. 추가 전까지 공개 URL은 `nubi-alpha.vercel.app` ② 팀 배포 보호로 `*-yusongs-projects` 배포 URL은 302(정상) — 공개 채널은 alias만 사용 ③ 배포 방식은 로컬 업로드 — 내일 팀 세션 중 재배포는 `npx vercel deploy --prod` 재실행
