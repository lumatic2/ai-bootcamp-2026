# 20260716-nubi-headerfooter-mark

## Target
- Goal: 헤더·푸터의 워드마크 로고(`logo-nubi.png`)를 시안 B 화살표 마크로 교체 (사용자 지시 2026-07-16 — "아이콘은 파비콘이 아니라 헤더와 푸터")
- ROADMAP milestone: B2

## Scope
| File/Path | Reason |
|-----------|--------|
| `public/images/logo-nubi-mark.png` | 시안 B 원본 512px RGBA 복사 (`~/Desktop/nubi-favicon-marks/b-arrow-512.png`) |
| `src/app/page.tsx` | 헤더(h-8)·푸터(h-6) Image src·치수 교체, 마크 자체 라운딩이 있어 `rounded-md`/`rounded` 클래스 제거 (이중 클리핑 방지) |

`public/images/logo-nubi.png`(워드마크)는 삭제하지 않고 보존 — 다른 참조 없음 확인, 되돌리기 1줄.

## Verification
- [x] Smoke: `pnpm build` PASS · `pnpm lint` PASS
- [x] 렌더: dev 서버(3456) Playwright로 헤더·푸터 실스크린샷 — 헤더 배지 정상, 푸터(검정 배경)는 사각 배지가 배경에 녹고 흰 화살표 글리프만 노출됨을 확인, 가독성 수용 판정 (반전판 옵션은 사용자 판단 대기)
- [x] 프로덕션: 배포 + `vercel alias set` 후 `bootcamp.askewly.com/images/logo-nubi-mark.png` 200, 홈 HTML에 참조 존재
- 증거: 스크래치 `header-mark.png` / `footer-mark.png`

## Result
- Status: passed
- Notes: 커스텀 도메인 alias 수동 이동 절차는 `20260716-nubi-apple-icon` changeset에서 발견·문서화된 것을 재사용.
