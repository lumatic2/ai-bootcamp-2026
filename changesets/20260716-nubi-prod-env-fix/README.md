# 20260716-nubi-prod-env-fix

## Target
- Goal: 프로덕션 AI 기능 전면 불능(챗봇·AI 사이즈표 검색 503) 원인 진단·수리
- ROADMAP milestone: B2 (사용자 보고 2026-07-16 "사이트에 AI도 작동을 안 하는데")

## Scope
| 대상 | 조치 |
|-----------|--------|
| Vercel env (Production) | `OPENAI_API_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` 주입 — **프로젝트에 env가 0개였음** (전일 배포 시 주입 누락) |
| 배포 | env 반영 재배포 + `vercel alias set` (도메인 수동 이동 절차) |

코드 무변경. 로컬 `.env.local`은 정상이라 로컬/프로덕션 비교로 원인 격리 (로컬 200 vs 프로덕션 503 `llm-unavailable` = route.ts:120 키 부재 분기).

## Verification
- [x] 진단: 동일 페이로드 `/api/chat` — 로컬 200 / 프로덕션 503 → 키·모델 스코프·코드 배제, env 소거
- [x] `vercel env ls` — 주입 전 0개 → 주입 후 2개(Encrypted, Production) 확인
- [x] 수리 후: `/api/chat` 200 실응답 · `/api/parse-chart` search 모드 200 (나이키 드라이핏 실측표 + 출처 URL, 22.8s — maxDuration=150 內) · 홈 HTML에 `G-42Z5R1WD7Z` 스니펫 존재
- [x] Failure probe: `/api/parse-chart` 잘못된 페이로드 → 400 `empty-text`/`empty-brand` graceful 확인

## Result
- Status: passed
- Notes: **GA 계측이 전일 저녁부터 프로덕션에서 미작동이었음** — 전일 밤 유입 데이터는 GA에 없다. V0/V1 측정 전 복구됨. 재발 방지: 배포 후 스모크에 "env 개수 ≥2 + /api/chat 200" 추가 권장.
