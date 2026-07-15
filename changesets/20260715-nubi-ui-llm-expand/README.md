# 20260715-nubi-ui-llm-expand

## Target
- Goal: 미지원 브랜드 LLM 대응 + 로그인 껍데기 + UI 개선(브랜드 검색·링크 복사) + GA 활용 문서
- ROADMAP milestone: B2 (사용자 지시 2026-07-15 저녁)

## Scope
| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/app/api/parse-chart/route.ts` | 신규 — LLM 사이즈표 파싱 (paste 주경로 / search 베타) | 시드 없는 브랜드도 번역 가능 |
| `src/lib/translate.ts` | rank() 추출 + translateCustom() | 커스텀 표 대상 번역, 신뢰도 '보통' 캡 |
| `src/app/api/translate/route.ts` | targetCustom 수용 | custom 경로 |
| `src/components/translator.tsx` | 브랜드 검색 필터(48개 벽 해소)·미지원 브랜드 블록·결과 링크 복사 | UX 개선 |
| `src/components/login-dialog.tsx` + `ui/dialog,input,label` | shadcn 로그인 껍데기 모달 (인증 없음, autocomplete 차단) | 데모용 |
| `src/app/page.tsx` | 헤더 로그인 버튼 | |
| `docs/analytics-plan.md` | GA4 활용 방안 (스키마·운용 절차·한계·다음 단계) | 발표·운영 참조 |

## Contract
- Source of truth: git main / Deploy: Vercel prod (완료)
- Out of scope: 실제 인증(백엔드 없음 유지), 자동 검색 신뢰도 개선(베타 라벨)

## Verification
- [x] Targeted tests: parse-chart paste — 가슴둘레 104→단면 52 자동 환산+note / custom translate — 무신사 M(55.5)→최근접 L(56), 신뢰도 mid 캡 / 로컬·프로덕션 각 1회
- [x] Smoke: `pnpm check` PASS · 브라우저 E2E — 로그인 모달 열림/카카오 버튼→데모 안내/닫기, 브랜드 필터 "챔피"→1개, 48개 그리드 스크롤
- [x] Failure probe: search 모드 미발견 시 422→UI가 붙여넣기 유도 문구 표시 (지어낸 숫자 대신 정직한 실패 — 의도)
- [x] Drift/dirty-tree check: 커밋 후 clean

## Result
- Status: passed
- Evidence: 본 README + 프로덕션 응답 로그
- Notes: ① search 베타는 모델이 보수적으로 빈 배열을 자주 반환 — 주경로는 붙여넣기, 베타 라벨 유지 ② 로그인은 UI 껍데기 — 전송·저장 없음, autocomplete off/new-password 로 실제 크레덴셜 유입 차단 ③ 커스텀 표 결과는 URL 공유 제외(재현 불가)
