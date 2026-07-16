# 20260716-nubi-2step-rebuild

## Target
- Goal: 팀 피드백 2건 구현 — ① 브랜드 단위 → **상품 단위** 데이터·적합도 ② 3스텝 → **2스텝 플로우** (Step1 내 옷 특정: 브랜드→상품→사이즈 + 실측 직접 입력 옵션 / Step2 상품 그리드 메인 + 검색 + 카드 클릭→쇼핑몰)
- 실행 방식: 오케스트레이터(설계·계약·게이트) + sonnet 백그라운드 2기 병렬(데이터 빌드 / UI 리빌드), 엔진 헬퍼는 오케스트레이터 직접
- ROADMAP milestone: B2 (사용자 선택 "지금 풀 리빌드", 2026-07-16)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/data/product-charts.json` | 상품 단위 실측 차트 245개 (시드 120 + 크롤러 라벨복구 176 → URL dedupe·단조성·무결성 검사 후) — 이미지 182개, brandId 매칭 117브랜드 |
| `src/lib/translate.ts` | `translateToRows()` 신설 — 임의 상품 사이즈표 대상 앵커 평균 매칭 (기존 가중치·신뢰도 캡 규칙 유지) |
| `src/components/translator.tsx` | 2스텝 재구성 — 상품 선택 앵커(시드 대표=Anchor, 그 외=CustomSource 재사용, 엔진 무수정), 실측 4치수 직접 입력(접이식·보조), AI 검색·다중 앵커·공유 URL·?target 딥링크 보존 |
| `src/components/product-grid.tsx` | 카드 전체 클릭=판매처(outbound_click+adopt_size), 보조 "비교" 인라인 확장(치수 delta 표 + feedback_fit 맞았어요/틀렸어요 — V0 계측 계약 유지) |
| `src/app/page.tsx` | 푸터 브랜드 수 리터럴 → `{brands.length}` |
| `src/data/size-charts.json` | 613서울 가슴 566→56.6 오탈자 수정 (데이터 에이전트가 단조성 검사로 발견) |

## Verification
- [x] `pnpm build`/`lint`/`design:lint` PASS (0/0) — 에이전트 자체 검증 + 오케스트레이터 재검증
- [x] E2E(dev): 나이키 검색→브랜드→상품 목록→사이즈 M→앵커→STEP2 그리드 244상품→검색 필터(스파오)→비교 확장(delta 표+피드백 버튼) 전 단계 관측, 스크린샷 3장(`rb-step1-products.png`·`rb-step2-grid.png`·`rb-compare.png`)
- [x] 상품 단위 적합도 실증: 같은 아디다스 두 상품이 각각 추천 XXL/XS로 갈림 — 피드백 1의 요지가 화면에서 확인됨
- [x] 프로덕션: 배포+alias 후 `?a=nike~M` 200 + "STEP 1 / 2" 마크업 확인
- [x] 데이터 게이트: URL 중복 48 제외·단조성 위반 3 제외, 제외 내역 `product-charts-exclusions.json` 박제

## Result
- Status: passed
- Notes: ⑴ `/api/translate`·`/api/fit-comment`는 UI에서 미사용 전환(dead code — 기존 `/api/mine-reviews`와 함께 정리 시점 팀 판단) ⑵ view_result의 elapsed_ms 파라미터 소멸(단일 API 왕복 없어짐) ⑶ 시드 대표 외 상품 앵커는 공유 URL 재현 불가(기존 custom 앵커와 동일 규칙) ⑷ KPI 퍼널(start_input→view_result→adopt_size)·feedback_fit·mall 딥링크 계약은 전부 보존 — V0/V1 측정 즉시 가능.
