# changesets/

스킬·스크립트·런타임 유지보수 작업의 status machine. 1 changeset = 1 작업 단위.

각 changeset 은 `<YYYYMMDD>-<slug>/README.md` 형식이며, 템플릿은 [CHANGESET_TEMPLATE.md](CHANGESET_TEMPLATE.md).

## 인덱스

| # | Changeset | 날짜 | Scope | Verification | Status |
|---|-----------|------|-------|--------------|--------|
| 1 | 20260714-bootcamp-foundation | 2026-07-14 | 팀 workflow + web/design starter | ✅ | passed |
| 2 | 20260714-deployment-architecture | 2026-07-14 | Vercel 호스팅 + Cloudflare DNS 결정 및 OAuth 인증 | ✅ | passed |
| 3 | 20260715-nubi-mvp-scaffold | 2026-07-15 | 너비 MVP: 3스텝 플로우+번역엔진+시드+GA4 | ✅ | passed |
| 4 | 20260715-nubi-deploy | 2026-07-15 | Vercel 프로덕션 배포 + 도메인 연결 | ✅ | passed |
| 5 | 20260715-nubi-seed-expansion | 2026-07-15 | 팀 시트 병합 — 시드 9→48 브랜드 | ✅ | passed |
| 6 | 20260715-nubi-share-polish | 2026-07-15 | OG·공유URL·QR·GA 실수신 검증 | ✅ | passed |
| 7 | 20260715-nubi-ui-llm-expand | 2026-07-15 | 미지원 브랜드 LLM 파싱·로그인 껍데기·브랜드 검색·GA 문서 | ✅ | passed |
| 8 | 20260715-nubi-v2-multianchor-ai | 2026-07-15 | 다중 앵커·AI 핏코멘트·챗봇·카피 정리·푸터 | ✅ | passed |
| 9 | 20260715-nubi-polish2 | 2026-07-15 | 히어로 카피 압축·LOGIN 텍스트·소셜 로그인 모달·이미지 보관 | ✅ | passed |
| 10 | 20260715-nubi-search-fix-interactions | 2026-07-15 | 자동검색 수리·챗봇 tool calling·히어로 인터랙션 A+B | ✅ | passed |
| 11 | 20260715-nubi-hero-label-polish | 2026-07-15 | 로테이팅 라벨 잘림 수정·헤드라인 문구 교체 | ✅ | passed |
| 12 | 20260715-nubi-favicon | 2026-07-15 | 너비 측정 심볼 favicon 생성·교체 | 0/5 | in_progress |

## 운영 원칙

- 영향 파일과 배포 경로를 먼저 적고 변경한다.
- SKILL.md 변경은 sync 전후 차이를 확인한다.
- 완료 보고 전 targeted test, smoke, sync/deploy evidence 중 해당되는 항목을 기록한다.
- 배포본이 있는 tooling 은 source 파일만 보고 완료 처리하지 않는다.
