# 20260716-nubi-card-cta-feedback

## Target

- Goal: 팀 UI 피드백 문서(NUBI_PRODUCT_CARD_CTA_FEEDBACK_2026-07-16.md) 8건 전건 구현 + V1 설문(n=16) 결과를 experiments/01에 기록
- ROADMAP milestone: B2 (팀 문제·솔루션 선정과 최소 실험 실행)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| src/components/product-grid.tsx | 피드백 1·2·8 | CTA 한 줄 h-10 고정·"사이즈" 중복 제거, 카드당 외부 링크 1개(본문 링크 제거, GA는 CTA로 일원화), 비교 카드 transform 부상 + 형제 blur(0.6px, hover 해제), aria-expanded |
| src/components/translator.tsx | 피드백 3·4·5 | 점선 상자 전체 버튼화(pressable, 672px 풀 표면), 브랜드 목록 상·하단 스크롤 페이드(스크롤 위치 연동, pointer-events-none), Step1 상품 카드 card-hover-lift |
| src/components/size-chat.tsx | 피드백 6·7 | 텍스트+아이콘 단일 버튼 통합(모바일 pill 상시·5초 접힘 제거, PC hover/focus 좌측 확장), 아이보리 ring-2 상시(검은 푸터 대비), 맨 위로 버튼에도 동일 ring |
| experiments/01-size-translator-accuracy/ | V1 설문 도착 | README에 16명 집계·한계 명시, raw CSV를 data/에 박제 |

## Contract

- Source of truth: 팀 피드백 문서 8건 (Downloads, 원문 유지) — 전건 채택 판정
- Deploy/sync target: https://bootcamp.askewly.com (alias 완료)
- Compatibility: GA 이벤트명 전부 불변. 카드 본문의 outbound_click/adopt_size(via:"card")는 CTA 발화와 중복이라 제거 — CTA(via:"cta")가 단일 소스
- Out of scope: V0 적중률 측정(팀 진행분 대기), "추천 M로"의 조사 교정(팀 문서 권장 표기 그대로)

## Evidence Contract

- Scenario: 브랜드→상품→사이즈→결과 보기→비교 확장, 모바일 390px 재측정
- Expected evidence: 카드당 target=_blank 1개 / CTA 텍스트·높이 균일 / sibling computed filter=blur(0.6px) / FAB 단일 버튼+ring / 점선 버튼 폭=상자 폭
- Failure mode probe: 에이전트 산출물에 "추천 {size} 사이즈로" 잔존 → 게이트에서 "추천 {size}로"로 교정(모바일 nowrap 오버플로 방지)
- Not evidence: lint 통과 단독 (구조 검증은 DOM 실측으로)

## Verification

- [x] Targeted tests: `pnpm lint` 0/0, `pnpm build` 성공
- [x] Smoke: localhost:3456 Playwright — extPerCard=1, ctaText="추천 M로 보러가기", ctaH=40.8, aria-label OK, bodyIsLink=false, aria-expanded=true, sibling blur(0.6px) computed, fabCount=1(ring-2 ring-[#f6f6f0]), dashed 버튼 670/672px, fade div 2개; 390px에서 CTA 높이 단일값 40·오버플로 0·FAB 텍스트 상시 노출·화면 내
- [x] Sync/deploy: ai-bootcamp-2026-gb0ok7d6w → `vercel alias set` bootcamp.askewly.com (200, 신규 FAB 문자열 확인)
- [x] Drift/dirty-tree check: 커밋 7b4fd44 푸시 완료

## Result

- Status: done
- Evidence: 본문 Verification 실측값 + experiments/01-size-translator-accuracy/data/v1-survey-2026-07-16.csv
