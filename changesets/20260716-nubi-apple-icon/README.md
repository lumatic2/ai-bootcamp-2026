# 20260716-nubi-apple-icon

## Target
- Goal: 시안 B(양방향 화살표) 마크를 apple-icon으로 설치 — iOS 홈 화면 추가·공유 시 노출되는 비어 있던 아이콘 슬롯
- ROADMAP milestone: B2 (사용자 지시 2026-07-16)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/apple-icon.png` | `~/Desktop/nubi-favicon-marks/b-arrow-512.png`(시안 B 원본 512px)를 PIL LANCZOS로 180×180 RGBA 변환 — Next.js apple-icon 컨벤션 |

파비콘 자체는 무변경: 사용자가 제시한 마크가 기설치된 `src/app/icon.svg`(시안 B)와 SVG 원본 바이트 동일함을 diff로 확인.

## Verification
- [x] Targeted: `src/app/icon.svg` vs 마크 원본 `b-arrow.svg` diff IDENTICAL — 파비콘 중복 교체 회피
- [x] Smoke: `pnpm build` PASS · `pnpm lint` PASS · `pnpm design:lint` 0 errors/0 warnings
- [x] 프로덕션: 배포 후 `https://bootcamp.askewly.com/apple-icon.png` → 200 `image/png`
- [x] Failure probe: 배포 직후 커스텀 도메인이 404 지속 — 원인은 `bootcamp.askewly.com`이 전일 배포에 alias 고정(`x-vercel-cache: HIT`, age 16h). `vercel alias set <새 배포 URL> bootcamp.askewly.com`으로 이전 후 200 확인

## Result
- Status: passed
- Evidence: 본 문서 Verification 로그 (curl 상태코드·alias 성공 출력은 세션 기록)
- Notes: **운영 함정 발견** — 이 프로젝트는 `vercel deploy --prod`만으로 커스텀 도메인이 안 바뀐다. 배포 후 `vercel alias set` 필수 (CLAUDE.local.md 배포 절차에 반영).
