# 20260715-nubi-seed-expansion

## Target

- Goal: 팀 구글시트(무신사 랭킹 스크랩) 실측표를 시드에 병합 — 9 → 48개 브랜드
- ROADMAP milestone: B2 (plan step-4의 시드 보강을 데이터 도착으로 선행 처리)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/data/size-charts.json` | 시트 100행 파싱·필터·병합 (+39 브랜드) | 번역 커버리지 확대 |

## Contract

- Source of truth: 팀 구글시트 (2026-07-15 수신) → 병합 스크립트 필터 통과분만
- Deploy/sync target: Vercel 재배포로 프로덕션 반영
- Compatibility: 기존 스키마 유지 (라벨 원표기, 가슴단면 기준, 결측 null)
- Out of scope: 시트의 여성/크롭/단일사이즈 상품, 이미지·가격 컬럼

## Evidence Contract

- Scenario: 신규 브랜드로 번역 요청 시 정상 추천
- Expected evidence: 브랜드 48개 로드 + 신규 브랜드 스모크 + `pnpm check` PASS + 프로덕션 반영
- Failure mode probe: 파싱 불확실 행은 통째로 폐기(숫자 오염 방지) — 병합 정책에 명시
- Cleanup receipt: 스크래치패드 CSV·스크립트는 세션 종료 시 소멸
- Not evidence: 행 수만 세고 값 검증 없이 완료 주장

## 병합 정책 (판정 근거)

- 포함: 사이즈표 존재 + 사이즈 ≥2 + 전 사이즈 총장 ≥60cm
- 제외 34건: 단일 사이즈 13 · 총장<60(크롭/여성 추정) 11 · 여성 명시 5 · 기존 브랜드 5
- 같은 브랜드 복수 상품은 사이즈 수 최다 1개 채택
- `--`(결측 소매 등)는 null, 파싱 모호 행은 폐기

## Verification

- [x] Targeted tests: 48개 브랜드 ID 유일성·비어있음 0 확인, 신규 브랜드 스모크 2건(무신사 M→챔피온 M/mid, 스노우피크 95(M)→바버 정상 응답)
- [x] Smoke: `pnpm check` PASS
- [x] Sync/deploy: Vercel 프로덕션 재배포 + 프로덕션에서 신규 브랜드 번역 1건 확인
- [x] Drift/dirty-tree check: 커밋 후 clean

## Result

- Status: passed
- Evidence: 본 README + 병합 스크립트 출력 로그 (39 추가 / 34 제외 사유별)
- Notes: 시트는 랭킹 스크랩이라 소형 브랜드 비중 높음 — 발표 시 "커버리지 48개"로 어필 가능. 내일 V0에서 신규 브랜드 실측 정확도도 함께 검증할 것.
