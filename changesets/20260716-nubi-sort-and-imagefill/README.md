# 20260716-nubi-sort-and-imagefill

## Target
- Goal: 팀 피드백 — Step2 그리드 정렬 UI(적합도/가격) + 데이터 공백(이미지·가격) 마감
- ROADMAP milestone: B2

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/components/product-grid.tsx` | 정렬 세그먼트(적합도순·낮은/높은 가격순), 가격 없는 상품은 가격 정렬 시 후순위 |
| `src/data/product-charts.json` | 공백 채움 — 가격 63→10 (시트·products.json URL 조인), 이미지 91→**3** (크롤러 시트 조인 + 무신사 og:image 수집 88건, 잔여 3은 무신사 외 AI 출처 상품 = placeholder 정상) |

측정값(sizes)은 무변경 — 메타(이미지·가격)만 채움이라 V0 진행과 무충돌.

## Verification
- [x] `pnpm build`/`lint` PASS
- [x] 렌더: "낮은 가격순" 클릭 → 첫 6개 가격 6,000→9,900원 오름차순 관측 (`sort-price.png`)
- [x] 데이터 감사: 537상품 기준 이미지 534(99.4%)·가격 527(98.1%), 시드 206브랜드 중 상품 미보유 3(613서울·그루브라임·디아도라 — 브랜드 카드 없이 시드 앵커로만 존재, 기능 영향 없음)
- [x] 프로덕션 배포 + alias 확인

## Result
- Status: passed
- Notes: "우선순위" 정렬은 적합도순(기본)이 담당 — 추가 축(할인율·인기순)은 rank 필드로 5분 확장 가능.
