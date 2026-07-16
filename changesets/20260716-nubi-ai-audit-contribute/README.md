# 20260716-nubi-ai-audit-contribute

## Target
- Goal: ① 라이브 AI 사용처(챗봇·parse-chart) 전수 감사 ② 팀원 제안 "AI 발굴 브랜드 데이터 축적" 구현
- ROADMAP milestone: B2 (사용자 지시 2026-07-16)

## Scope
| File/Path | Reason |
|-----------|--------|
| (감사 — 무수정) `api/chat`·`size-chat`·`api/parse-chart` | 낡은 서술 0건 확인: 챗봇 프롬프트는 브랜드 목록 동적 주입(현재 213), 스텝 수·리뷰 언급 없음. 불필요 변경 회피 |
| `src/app/api/contribute/route.ts` 신규 | 커스텀 앵커 확정 시 사이즈표 축적 — 검증 후 구조화 로그(`[contribute]`, Vercel 함수 로그). DB는 레포 규약(실험 확정 전 금지)상 후속 결정, 주석 명시 |
| `src/components/translator.tsx` | `addCustomAnchor()` 단일 지점 fire-and-forget POST (search/paste/manual 3경로 커버, UX 영향 0) |

## Verification
- [x] 실호출(에이전트): 챗봇 function calling — "나이키 M인데 커버낫 추천" → 도구 경유 "S 추천, M 차선" · parse-chart 정상 표 3행 정확 파싱 · 쓰레기 입력 → `chart-not-found`(환각 없음)
- [x] contribute: 정상 200 {ok:true} / 결측 400 / manual 경로 200 (에이전트) + 오케스트레이터 로컬·**프로덕션** 재검증 200
- [x] `pnpm build`(라우트 등록 확인)·`lint` PASS

## Result
- Status: passed
- Notes: 축적 페이로드는 사용자가 확정한 사이즈 행 단위(전체 표 아님 — "확정 시점" 의미 보존). 로그 회수→시드 병합 파이프라인은 기존 파서 재사용 가능. 발표 소재: 데이터 플라이휠 배선 완료.
