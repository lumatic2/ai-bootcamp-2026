# 20260715-nubi-search-fix-interactions

## Target
- Goal: 자동 검색 실동작 수리 + 챗봇 function calling(번역 엔진 도구화) + 히어로 A/B 인터랙션(라벨 로테이션·브랜드 마퀴)
- ROADMAP milestone: B2 (사용자 지시 2026-07-15)

## Scope
| File/Path | Reason |
|-----------|--------|
| `src/app/api/parse-chart/route.ts` | 검색 2각도 병렬(Promise.any) + reasoning medium + 출처 URL 필수 검증 + `maxDuration=150` (Vercel 15s 기본 타임아웃 함정 해소) |
| `src/app/api/chat/route.ts` | translate_size 함수 도구 등록, 브랜드명 퍼지 매칭, 최대 3라운드 tool loop, `maxDuration=60` |
| `src/components/rotating-label.tsx` | 헤드라인 사이즈 라벨 로테이션 (M·95·L·100·XL·66, 의존성 0, reduced-motion 대응) |
| `src/components/brand-marquee.tsx` | 48개 브랜드 무한 마퀴 (CSS만, hover 정지, edge fade) |
| `src/app/globals.css` | label-swap·marquee keyframes |
| `src/app/page.tsx` | 헤드라인 교체("내 사이즈는 [M], 브랜드마다 이름만 다릅니다") + 마퀴 배치 |

## Verification
- [x] Targeted tests: 검색 프로덕션 실측 — 유니클로 4사이즈+출처 URL, 21.5초(병렬화 전 131초) · 챗 function calling 프로덕션 — "커버낫 L 잘 맞아요, 챔피온은?" → "L 추천, 보조 M"(엔진 실호출 로그 확인) · 출처 URL 없는 검색 응답 폐기 로직
- [x] Smoke: `pnpm check` PASS · 브라우저 렌더(hero.png) — 로테이션 칩·마퀴·중앙 정렬 확인
- [x] Failure probe: 검색 2각도 모두 실패 시 422 → UI가 붙여넣기 유도
- [x] Drift check: clean

## Result
- Status: passed
- Evidence: hero.png + 프로덕션 응답 로그
- Notes: 검색 소요 20초~2분 편차 — 버튼 문구로 기대 설정("1분쯤 걸려요"). 챗봇 tool 호출은 서버 로그 `[chat-tool]`로 관측 가능.
