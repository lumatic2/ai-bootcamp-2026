# 20260716-nubi-musinsa-api-harvest

## Target
- Goal: 데이터 갭을 팀원 재추출 대기 없이 직접 해소 — 무신사 `actual-size` 공개 API 발견·전량 수집으로 라벨 문제 원천 해결 (사용자 지시 "부족한 지점 찾아서 수정하고 메워줘", 2026-07-16)
- ROADMAP milestone: B2

## Scope
| 대상 | 결과 |
|---|---|
| 발견 | `goods-detail.musinsa.com/api2/goods/{id}/actual-size` — 일반 HTTP로 사이즈 **라벨 포함** 실측표 JSON 반환. 엔드포인트 자체가 실측 사이즈 탭 데이터라 "실측/기준표" 출처 불확실성도 해소 |
| 수집 | 4개 소스 합집합 584개 상품 id, API 성공률 **100%** (실측표 보유 579), 원시 응답 `musinsa-api-raw.jsonl` 박제(이어받기 가능) |
| `src/data/product-charts.json` | 245 → **537 상품** (+292) |
| `src/data/size-charts.json` | 120 → **206 브랜드** (+86, id `msapi-*`) |

## 병합 정책 (V0 측정 진행 중 보호)
- **기존 값 무변경 + 추가만** — 기존 245상품·120브랜드 바이트 동일 검증(에이전트), 오케스트레이터가 nike·613서울 스팟 재검증
- 여성 라인 29 제외, 가슴 단조성 위반 17 제외(API 원본 오류 추정), 불일치 1건(613서울 가슴 — **무신사 원본이 566.0 오기**, 우리 보정값 56.6 유지가 옳았음이 API로 역확인)

## Verification
- [x] 무결성: id 중복 0 · 빈 라벨 0 · chest/length null 0 · 가슴 30~80 범위 전수 통과 · 신규 3브랜드 무작위 샘플 육안 정상
- [x] `pnpm build`/`lint` PASS
- [x] 렌더(dev): 206브랜드 표기 · 결과 그리드 536상품 · STEP2 정상
- [x] 프로덕션: 배포 후 동일 수치 확인 (아래 Result)
- 리포트: 스크래치 `api-harvest-report.md` / `api-discrepancy-report.md`

## Result
- Status: passed
- Notes: 팀원 크롤러 재추출 요청은 사실상 소멸 — 남은 데이터 갭은 무신사 외 브랜드(유니클로·자라·탑텐·라코스테) 수기뿐. 발표 소재: "커뮤니티가 못 푼 282행을 공개 API 발견으로 당일 해소, 원본(무신사) 데이터 오류 1건을 역으로 검증".
