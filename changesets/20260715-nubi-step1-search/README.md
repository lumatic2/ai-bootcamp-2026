# 20260715-nubi-step1-search

## Target
- Goal: favicon 원복 + Step 1(내 옷)에도 AI 사이즈표 검색 추가(시드 밖 브랜드를 앵커로) + 리뷰 붙여넣기 기능 제거 + 검색 특정성 개선(상품명 옵션)
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/favicon.ico` | 티셔츠+화살표 아이콘이 어색하다는 피드백 — 파운데이션(2ae071a) 기본으로 원복 |
| `src/lib/translate.ts` | `CustomSource` 타입 — 시드 밖 앵커(실측 행 직접 제공) 지원, 평균 벡터에 합산, 신뢰도 상한 '보통' 캡 |
| `src/app/api/translate/route.ts` | anchors 배열에 `{name,size,row}` 커스텀 앵커 수용 + saneRow 검증(범위 밖 수치 폐기) |
| `src/app/api/parse-chart/route.ts` | `productName` 옵션 — "나이키 반팔티" 뭉뚱그림 대신 특정 상품 실측표를 노림, note에 상품명 기록 지시 |
| `src/components/translator.tsx` | Step 1 AI 검색 블록(브랜드+상품명+붙여넣기, 파싱된 사이즈에서 내 사이즈 선택→앵커 칩), 리뷰 붙여넣기 UI·mining 제거, 커스텀 앵커 시 공유 링크 버튼 숨김 |
| `src/app/page.tsx` | 푸터 기능 목록 현행화(리뷰 분석 제거, 챗봇·웹 검색 반영) |

## Verification
- [x] Targeted tests: API — 커스텀 앵커 단독("나이키 L"→커버낫 M)·시드+커스텀 혼합(anchorCount 2, 라벨 "스파오 L (100) + 나이키 L") 200 확인 · 브라우저 E2E — Step1 붙여넣기 파싱→사이즈 선택→앵커 칩→번역 결과(step3-custom-anchor.png)
- [x] Smoke: `pnpm lint` PASS · `pnpm build` PASS · `pnpm design:lint` 0 errors
- [x] Failure probe: 범위 밖 실측(총장 999 등) 커스텀 앵커 → saneRow 폐기 → 400 missing-fields 확인 · 커스텀 앵커 결과는 URL 재현 불가 → 공유 버튼 숨김
- [x] Drift check: mine-reviews API 라우트는 미삭제(dead code) — 유입 경로 없음, 필요 시 후속 정리

## Result
- Status: passed
- Evidence: step1-ai-block.png, step3-custom-anchor.png
- Notes: 시드 밖 앵커는 검증 안 된 데이터라 신뢰도 상한 '보통'. 검색 특정성 문제(같은 브랜드라도 상품별 실측 상이)는 상품명 옵션 + note 상품명 표기 + 출처 URL로 1차 대응 — 근본 해법은 상품 URL 직접 파싱(후속 후보).
