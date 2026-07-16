# 20260716-nubi-product-grid

## Target
- Goal: Step3 결과에 "이 기준으로 살 수 있는 옷" 상품 그리드 추가 — 무신사 TOP500 수집분을 브랜드 적합도 위에 얹어 번역기→쇼핑 연결 (팀원 제안 방향의 레이어드 구현, 사용자 "다 해줘" 지시 2026-07-16)
- ROADMAP milestone: B2
- 디자인 근거: `references/nubi-style-spec/SPEC.md` §12(그리드 규격·4:5·overlay 2개 제한)·§13(카드 정보 위계)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/data/products.json` | TOP500 xlsx → 변환 472상품 (여성 라인 28행 제외, rank·name·brand·price·listPrice·discountPct·image·url) |
| `src/components/product-grid.tsx` | 신규 — SPEC §12-13 카드(4:5 이미지, 좌상단 적합도·우상단 추천 사이즈 overlay, 가격·할인, 브랜드 기준 delta 2종, 상세비교/판매처 버튼), 12개 기본+전체 토글 |
| `src/components/translator.tsx` | `productRows` memo(브랜드명 정확일치 매칭, 적합도→순위 정렬) + 브랜드 그리드 아래 렌더 |
| `next.config.ts` | `image.msscdn.net` remotePatterns (next/image 최적화·lazy) |

정직성 처리: 적합도·추천 사이즈가 브랜드 대표 실측 기준임을 섹션 부제로 명시 (상품별 실측 아님).

## Verification
- [x] `pnpm build` PASS · `pnpm lint` PASS · `pnpm design:lint` 0/0
- [x] 렌더(dev 3456, 공유 URL `?a=musinsa-standard~M&to=covernat`): 섹션 렌더 + 카드 12 + 실이미지, 92개 상품 매칭 — 스크린샷 `product-grid.png`
- [x] 프로덕션(bootcamp.askewly.com, alias 이동 후): cards=12, imgs=12 관측 — 스크린샷 `product-grid-prod.png`
- [x] Failure probe: 이미지 없는 상품은 placeholder(bg-muted) 경로 · 판매처 클릭은 GA `outbound_click`(기존 이벤트 재사용)
- [x] 버튼 세로 줄바꿈 결함 발견 → `whitespace-nowrap` 수정 후 재빌드

## Result
- Status: passed
- Notes: 시드에 없는 브랜드 상품은 매칭 제외(현재 92/472 노출) — 시드가 늘수록 자동 확대. 상품별 실측 라벨이 확보되면(TOP500 라벨 재추출) 상품 단위 적합도로 승급 가능.
