# 20260715-nubi-mvp-scaffold

## Target

- Goal: "너비"(사이즈 번역기) MVP 골격 — 3스텝 플로우, 번역 엔진, 시드 데이터, GA4 계측
- ROADMAP milestone: B2 (plan: `docs/plans/2026-07-15-nubi-mvp-build.md` step-1)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/data/size-charts.json` | E0 수집 9브랜드 실측표 정규화 시드 | 번역 엔진 데이터 소스 |
| `src/lib/sizecharts.ts` | 시드 타입·로더 | 타입 안전한 데이터 접근 |
| `src/lib/translate.ts` | 실측 가중 거리 매핑 엔진 | 추천 사이즈+신뢰도+치수 근거 산출 |
| `src/lib/ga.ts` | GA4 이벤트 헬퍼 6종 | KPI 계측 |
| `src/app/layout.tsx` | 너비 메타 + gtag 스니펫(env 조건부) | GA 로드 |
| `src/app/page.tsx` | 랜딩+3스텝 플로우로 교체 | 제품 화면 |
| `src/components/translator.tsx` | 클라이언트 플로우 컴포넌트 | 스텝 상태·API 연동·이벤트 발화 |
| `src/app/api/translate/route.ts` | 번역 API | 서버 판정+로그 |
| `src/app/api/mine-reviews/route.ts` | LLM 리뷰 핏 신호 추출 API | 근거 카드 2(리뷰 인용) |
| `DESIGN.md` | 임시 토큰 → 너비 제품 토큰 | 디자인 계약 갱신 (repo gotcha 해소) |
| `docs/PRD.md` | MVP 계약 반영 | spec 정본 갱신 |
| `.env.local` | GA4 측정 ID 주입 (비커밋) | 계측 활성화 |

## Contract

- Source of truth: 이 레포 `src/` + `DESIGN.md` + `docs/PRD.md`
- Deploy/sync target: Vercel (step-2 별도 changeset)
- Compatibility: Next.js 16 App Router, React 19, Tailwind 4. 신규 npm 의존성 0 (OpenAI는 REST fetch)
- Out of scope: 하의·아우터, 회원가입, DB, 크롤링 자동화, 공유 카드(제외 확정), 배포(step-2)

## Evidence Contract

- Scenario: 사용자가 잘 맞는 브랜드+사이즈 선택 → 대상 브랜드 선택(+리뷰 붙여넣기) → 추천 사이즈·신뢰도·근거 확인 → 피드백 버튼
- Expected evidence: `pnpm check` PASS + 브라우저 E2E(3스텝→결과 도달, API 실응답, GA 이벤트 발화 로그)
- Failure mode probe: ① 미지원 브랜드 API 요청 → 400 ② 빈 리뷰 입력 → mine-reviews 400 ③ OPENAI_API_KEY 부재 → mine-reviews 503 (translate는 정상)
- Cleanup receipt: dev 서버 종료
- Not evidence: 타입체크만 통과, 스크린샷 없는 "됐다" 주장

## Verification

- [x] Targeted tests: API 스모크 4종 PASS — ① 무신사 M→커버낫 = M(high, 가슴 0cm 차) ② 라벨 혼재 스파오 M(095)→마크곤잘레스 = 090(low — 오버사이즈 브랜드 정직 반영) ③ 미지원 브랜드 400 ④ 빈 리뷰 400
- [x] Smoke: `pnpm check`(design:lint+lint+build) PASS · 브라우저 E2E 3스텝→결과 도달, GA 이벤트 5종(`start_input`/`view_result`/`adopt_size`/`feedback_fit`/`repeat_query`) 콘솔 실발화, 콘솔 에러 0 · 리뷰 마이닝 실 LLM 응답(크게2·정사이즈1, 원문 인용 정확)
- [x] Failure probe: OPENAI_API_KEY 부재 기동 → mine-reviews 503 + translate 200 (비 LLM 경로 독립성 확인)
- [x] Sync/deploy: 해당 없음 (배포는 step-2 changeset)
- [x] Drift/dirty-tree check: 커밋 후 clean 확인

## Result

- Status: passed
- Evidence: `smoke-full-flow.png` (전체 플로우 렌더), 본 README Verification 로그, dev 서버 `[translate]`/`[mine-reviews]` 구조화 로그
- Notes: ① 모델은 프로젝트 키 허용 목록(`/v1/models`) 확인 후 `gpt-5.4-mini` 채택 (gpt-4o-mini 403) ② `view_result.elapsed_ms`는 수동 조작 기준이라 실사용 측정은 V1에서 ③ 아디다스 래글런 소매·노스페이스 둘레→단면 환산은 시드 레벨에서 정규화 완료
