# 20260715-nubi-v2-multianchor-ai

## Target
- Goal: 다중 앵커(팀 제안) + AI 확대(핏 코멘트·사이즈 도우미 챗봇) + 카피 정리(em dash 제거·humanize) + 히어로 중앙 정렬 + 푸터
- ROADMAP milestone: B2 (사용자 지시 2026-07-15 오후)

## Scope
| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/lib/translate.ts` | Anchor[] 평균 벡터 + 다중 앵커 신뢰도 완화(팀 제안: 여러 벌 → 정확도↑) | 개별 상품 편차 상쇄 |
| `src/app/api/translate/route.ts` | anchors 배열 수용 (legacy 단일 호환) | |
| `src/app/api/fit-comment/route.ts` | 신규 — 치수 차이의 자연어 한 줄 해석 | 결과 카드 AI 코멘트 |
| `src/app/api/chat/route.ts` | 신규 — 사이즈·핏·반품 도메인 한정 챗봇 | 우하단 플로팅 도우미 |
| `src/components/translator.tsx` | 다중 앵커 UI(칩·최대5벌)·공유 URL `?a=` 확장·코멘트 표시·카피 humanize | |
| `src/components/size-chat.tsx` | 신규 — 챗 위젯 | |
| `src/app/page.tsx` | 히어로·CTA 중앙 정렬, 3단 푸터 신설 | |
| `src/app/layout.tsx`·`public/og.png`·`login-dialog` | 사용자 노출 텍스트 em dash 전수 제거 | |

## Contract
- Source of truth: git main / Deploy: Vercel prod (완료)
- Compatibility: legacy `?from=&size=` 공유 URL과 단일 sourceBrand API 하위 호환 유지
- Out of scope: 챗봇의 번역기 function calling(2단계), 대화 저장

## Verification
- [x] Targeted tests: 다중 앵커 API(무신사M+커버낫M→스투시 M high, 2벌 완화 임계 동작) · legacy 단일 호환 · fit-comment(소매 -2.7 → "팔이 타이트" 정확 해석) · chat 도메인 내 응답+도메인 밖(파이썬) 정중 거절 — 로컬·프로덕션 각각
- [x] Smoke: `pnpm check` PASS · 브라우저 E2E 2벌 선택→"2벌로 다음"→결과("2벌 평균" 라벨, 평균 실측표, AI 코멘트 렌더, `?a=` URL) — `e2e-full.png`
- [x] 카피: 사용자 노출 문자열 em dash 0건 (grep 검증, 코드 주석·LLM 프롬프트 제외)
- [x] Drift/dirty-tree check: 커밋 후 clean

## Result
- Status: passed
- Evidence: `e2e-full.png` + 본 README + 프로덕션 응답 로그
- Notes: 챗봇 이용량은 GA 이벤트 미계측(KPI 6종 계약 보존) — 필요 시 내일 추가 논의. 다중 앵커는 V0에서 1벌 vs 2벌+ 적중률 비교로 팀 제안의 효과를 실측할 것.
