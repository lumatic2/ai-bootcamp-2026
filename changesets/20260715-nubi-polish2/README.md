# 20260715-nubi-polish2

## Target
- Goal: 히어로 카피 압축·줄바꿈, 헤더 LOGIN 텍스트 버튼, 로그인 모달 소셜 전용(구글+카카오, 일반 로그인 제거), 히어로 이미지 에셋 보관
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/page.tsx` | 히어로 설명 2줄 압축 |
| `src/components/login-dialog.tsx` | ghost LOGIN 트리거, 이메일 폼 제거, 구글(브랜드 G SVG)+카카오 버튼 |
| `public/images/hero-tailor.png` | 사용자 제공 AI 생성 테일러 이미지 보관 (2MB, 사용 시 압축 필요) |

## Verification
- [x] `pnpm check` PASS
- [x] Vercel 프로덕션 재배포 완료
- [x] Drift check: clean

## Result
- Status: passed
- Notes: 소셜 버튼은 껍데기(클릭 시 데모 안내). 히어로 이미지는 아직 미사용 — 인터랙션 결정 후 활용 검토.
