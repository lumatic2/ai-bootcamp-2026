# 20260715-nubi-icon-b

## Target
- Goal: 사용자 선택 시안 B(양방향 화살표) SVG를 파비콘으로 설치
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/icon.svg` | 손으로 그린 시안 B — Next.js SVG 파비콘 공식 컨벤션, 모든 크기 선명 |
| `src/app/favicon.ico` | 구형 브라우저 폴백 — 같은 마크의 RGBA 다중 크기 ICO |

## Verification
- [x] Targeted tests: 시안 3종(레터마크·화살표·캘리퍼)을 resvg로 512/32px 렌더 비교 — B만 16px에서 형태 온전(아티팩트 비교 페이지 + 바탕화면 PNG로 사용자 확인 후 B 확정)
- [x] Smoke: `pnpm build` PASS · dev `/favicon.ico` 200
- [x] Failure probe: RGB ICO는 Next 디코더 500 유발(직전 changeset에서 확인) — RGBA 저장으로 예방
- [x] Drift check: 마크 SVG 원본은 스크래치 보관, 레포에는 산출물만

## Result
- Status: passed
- Evidence: 시안 비교 아티팩트, changesets/20260715-nubi-spec-adoption/reskin-hero.png (탭 아이콘 포함 렌더)
- Notes: GitHub 리서치 결론(SVG 우선 + icon.svg 컨벤션 + resvg CLI) 그대로 적용한 사례.
