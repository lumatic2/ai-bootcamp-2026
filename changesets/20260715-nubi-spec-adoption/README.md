# 20260715-nubi-spec-adoption

## Target
- Goal: 팀 디자인 스펙(references/nubi-style-spec/SPEC.md) 채택 — 풀 리스킨(오프화이트+시그널 라임+Pretendard/Space Grotesk) + 48브랜드 일괄 번역 그리드 + 쇼핑몰 양방향 연결고리
- ROADMAP milestone: B2 (사용자 결정 2026-07-15: 리스킨 진행·그리드 추가·몰은 팀원 구현)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/globals.css` | 토큰 전면 교체: canvas #f6f6f0, ink #141414, signal lime #c8ff3d(신호 전용), match-high/mid/low 3단, border #deded6, ring #5367ff, Pretendard/Space Grotesk 폰트 스택 |
| `src/app/layout.tsx` | Geist 제거, Pretendard Variable CDN + Space Grotesk(next/font) |
| `src/app/page.tsx` | 라임 eyebrow 칩, extrabold 헤드라인, 검정 마퀴 밴드+지원 브랜드 캡션, 54px CTA, 검정 푸터 |
| `src/components/brand-marquee.tsx` | 검정 밴드 위 흰 텍스트 |
| `src/components/rotating-label.tsx` | 라임 밑줄 하이라이트 |
| `src/components/translator.tsx` | 진행 바(4px 라임), 라임 키워드 하이라이트, 신뢰도 배지 라임/노랑/중립(빨강 판정 제거), 차이 ≤0.5cm "거의 같음", 로딩 카피, 47브랜드 적합도순 그리드(클라이언트 엔진 실행, %+설명 라벨, 카드 클릭 전환), `?target=` 몰 딥링크+GA mall_referral, 판매처에서 보기+GA outbound_click |
| `src/lib/ga.ts` | 이벤트 3종 추가: view_grid·mall_referral·outbound_click |
| `DESIGN.md` | v2.0 — 스펙 기반 토큰·원칙 교체, 근거(레퍼런스 선택 이유) 명시 |
| `docs/mall-integration.md` | 몰 팀원용 인터페이스 계약서 (sonnet 에이전트 작성, 검수 완료) |
| `docs/presentation-2026-07-15.md` | 오늘 변경 반영 (sonnet 에이전트 작성, 검수 완료) |

## Verification
- [x] Targeted tests: 브라우저 E2E — 공유 URL 진입 → Step3 그리드 9카드 적합도순(89%→83%) 렌더, 카드 클릭 → 더마일 S 상세 전환 + URL 갱신 + 판매처 링크(musinsa) 확인 (reskin-grid.png)
- [x] Smoke: `pnpm lint` PASS · `pnpm build` PASS · `pnpm design:lint` 0 errors 0 warnings · 리스킨 렌더(reskin-hero.png)
- [x] Failure probe: GA 신규 이벤트 타입 미등록 시 빌드 타입 에러로 차단 확인(수정 전 재현) · 그리드에서 same-brand는 엔진 예외로 자동 제외
- [x] Drift check: 라임은 신호 용도(eyebrow·진행바·하이라이트·신뢰도)에만 사용, 전면 배경 사용 없음 — 스펙 원칙 준수

## Result
- Status: passed
- Evidence: reskin-hero.png, reskin-grid.png
- Notes: 적합도% = 100 - 12.5×distance (하한 45), 90+/75+/미만 3단 라벨 — V0 교차검증에서 임계 보정 예정. 몰 연계는 URL 계약만으로 성립(CORS·API 불필요), 몰 쪽 구현은 팀원 담당.
