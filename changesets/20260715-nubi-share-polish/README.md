# 20260715-nubi-share-polish

## Target
- Goal: 내일 배포 채널(카톡·QR) 대비 공유 인프라 — OG 미리보기, 결과 공유 URL, QR, GA 실수신 검증
- ROADMAP milestone: B2 (plan step-4 마감 품질 선행)

## Scope
| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/app/layout.tsx` | openGraph 메타 + metadataBase | 카톡 링크 미리보기 카드 |
| `public/og.png` | 1200×630 OG 이미지 | 미리보기 시각 |
| `src/components/translator.tsx` | 결과를 `?from=&size=&to=`로 동기화 + 공유 URL 진입 시 자동 재생 | 결과 공유 → 유입 루프 |
| `docs/qr-bootcamp.png` | bootcamp.askewly.com QR (600px) | 현장 배포 |

## Contract
- Source of truth: git main / Deploy: Vercel prod (배포 완료)
- Out of scope: 공유 전용 이벤트 추가(KPI 6종 계약 유지), 카피 버튼

## Verification
- [x] Targeted tests: `pnpm check` PASS (React 19 effect-setState lint, onClick 타입 수정 포함)
- [x] Smoke: 프로덕션에서 공유 URL 진입 → 결과 자동 재생(394ms) 확인, OG 태그 4종 HTML 확인
- [x] GA 실수신: `google-analytics.com/g/collect`에 `page_view`·`view_result`(ep.recommended=M, ep.confidence=high) POST → 204 — 네트워크 레벨 증명
- [x] Drift/dirty-tree check: 커밋 후 clean

## Result
- Status: passed
- Evidence: 본 README Verification (프로덕션 네트워크 로그 기반)
- Notes: 공유 URL은 리뷰 텍스트를 전달하지 않음(의도 — URL 길이·프라이버시). elapsed_ms 394ms = 공유 진입 시 KPI "≤60초"를 사실상 즉시 충족.
