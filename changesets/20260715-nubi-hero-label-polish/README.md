# 20260715-nubi-hero-label-polish

## Target
- Goal: 로테이팅 라벨 `100` 잘림 수정(아웃라인 제거) + 헤드라인 둘째 줄 교체("다음 브랜드에서는 뭘까요?", 사용자 4안 선택)
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/components/rotating-label.tsx` | 테두리·배경·패딩 제거, 폭 2.6ch→3.4ch (mono 3자 `100` 수용, 쉼표 우측 이동) — 슬라이드 클리핑용 overflow-hidden 은 유지 |
| `src/app/page.tsx` | 둘째 줄 "브랜드마다 이름만 다릅니다" → "다음 브랜드에서는 뭘까요?" (5안 제시 중 사용자 4안 확정) |

## Verification
- [x] Targeted tests: 브라우저 렌더 — `100` 프레임 잘림 없음(hero-final.png), `66`·`M` 프레임 정상, SSR curl 로 새 문구 확인
- [x] Smoke: `pnpm design:lint` 0 errors / 0 warnings
- [x] Failure probe: 최장 라벨 `100` = mono 3ch ≤ 3.4ch 고정폭 — 구조적으로 잘림 불가, 애니메이션 슬라이드는 클리핑 유지로 헤드라인 밖 노출 없음
- [x] Drift check: 위 2개 파일 외 변경 없음

## Result
- Status: passed
- Evidence: hero-final.png (100 프레임 + 새 카피 동시 확인)
- Notes: 레포 public 전환 전 시크릿 스캔 수행 — 작업 트리·git 전체 이력에서 sk-proj/vcp_/ghp_/AIza/Bearer 패턴 0건, env 파일 이력 커밋 0건(.env.example 빈 키만), 노출 식별자는 Vercel prj_ ID뿐(토큰 없인 무용) → 공개 안전 판정.
