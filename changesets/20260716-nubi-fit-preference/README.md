# 20260716-nubi-fit-preference

## Target
- Goal: 팀원 제안 "핏 해석" 구현 — 핏 방향(그대로/여유롭게/슬림하게) + 중요 부위(전체/가슴/어깨/총장/소매)를 Step2 그리드에 즉시 반영
- ROADMAP milestone: B2 (사용자 승인 "step2에 붙일 수 있을까" → 구현 지시, 2026-07-16)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/lib/translate.ts` | `FitPref` 옵션 — 목표 벡터 비율 조정(여유 101~102% / 슬림 98~99%, 팀원 프로토타입 수치 그대로) + 선택 부위 가중치 ×3. **표시 delta는 원본 내 옷 기준 재계산**(조정값 대비면 비교표가 거짓) |
| `src/components/translator.tsx` | Step2 검색창 아래 세그먼트 2줄(기존 시각 언어 재사용), 선택 즉시 그리드 재계산 — 원안의 "결과 보기" 버튼 불필요(클라이언트 계산이라 라이브), GA `repeat_query {via:"fit-pref"}` |

기본값: 지금 핏 그대로 + 전체 균형. 기존 translate()/translateCustom() 무변경.

## Verification
- [x] `pnpm build`/`lint` PASS (에이전트 + 오케스트레이터 재검증)
- [x] 엔진 스모크(에이전트, node 직접 호출): same→slim distance 0→0.78 / focus=sleeve 시 소매 오차 상품 0.69→1.8 / loose로 추천 L→XL 전환 케이스에서 deltas가 원본 기준임을 수치 확인
- [x] E2E(오케스트레이터): "조금 더 슬림하게" 클릭 → 그리드 1위 교체, "소매" 클릭 → 재교체 관측 (`fitpref.png`)
- [x] 프로덕션 배포+alias

## Result
- Status: passed
- Notes: focus ×3 증폭이 confidence 임계와는 독립(라벨이 거리감과 미세하게 어긋날 수 있음 — V0 보정 대상에 포함 가능). 발표 소재: "팀원 기획 문서 → 당일 구현" 협업 사례 2호.
