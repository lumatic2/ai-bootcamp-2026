# 20260715-nubi-brand-assets

## Target
- Goal: 사용자 지정 원본으로 favicon 재빌드 + 너비 워드마크 로고(흑백 반전) 헤더·푸터 적용 + 헤드라인 "다음→다른" 교체
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/favicon.ico` | 사용자 지정 codex 원본(1254px)으로 재빌드 — RGBA 16/32/48/64 (RGB ICO는 Next 디코더가 500 에러) |
| `public/images/favicon-neobi.png` | favicon 원본 보관을 지정 이미지 기준 512px로 교체 |
| `public/images/logo-nubi.png` | 너비 워드마크(흑→백 반전, 여백 트림, 217x160) 신규 |
| `src/app/page.tsx` | 헤더 size-8 텍스트 칩·푸터 size-6 칩 → 로고 이미지(next/image), 둘째 줄 "다른 브랜드에서는 뭘까요?" |

## Verification
- [x] Targeted tests: 브라우저 렌더 — 헤더 로고 43x32 표시(logo-hero.png), 푸터 로고 33x24 DOM 검증, 새 문구 렌더 확인
- [x] Smoke: `pnpm lint` PASS · `pnpm design:lint` 0 errors · `pnpm build` PASS · `/favicon.ico` 200 image/x-icon
- [x] Failure probe: RGB 모드 ICO가 dev 서버 500 유발 → RGBA 재저장으로 해소(재현·수정 확인)
- [x] Drift check: Codex favicon changeset(#12)은 커밋 완료 상태였고, 본 변경은 그 위에 원본만 교체

## Result
- Status: passed
- Evidence: logo-hero.png (헤더 로고 + 새 헤드라인 동시 확인)
- Notes: 로고는 원본 wordmark의 검정 글자/미색 배경을 반전해 near-black 배경 + 백색 글자로 사용. 기존 favicon(#12)과 같은 디자인이나 사용자 지정 파일 기준으로 화살표 비례 통일.
