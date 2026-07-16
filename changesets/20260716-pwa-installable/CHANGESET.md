# 20260716-pwa-installable

## Target

- Goal: 모바일 브라우저에서 "홈 화면에 추가" 시 앱 아이콘으로 실행되고 standalone(전체화면)으로 표시되도록 PWA 설치 가능성을 추가한다.
- ROADMAP milestone: (해당 없음 — 사용자 직접 요청)

## Scope

| File/Path | Reason | Expected effect |
|-----------|--------|-----------------|
| `src/app/manifest.ts` | Next.js 파일 기반 manifest 라우트 추가 | `/manifest.webmanifest` 제공, 이름/아이콘/standalone display 정의 |
| `src/app/layout.tsx` | metadata에 manifest 링크, apple-web-app 메타, viewport themeColor 추가 | 브라우저가 설치 가능한 PWA로 인식 |
| `public/icons/icon-192.png`, `public/icons/icon-512.png` | 기존 로고(`public/images/logo-nubi-mark.png`, 512x512)를 리사이즈해 생성 | manifest가 참조하는 홈 화면 아이콘 |

## Contract

- Source of truth: `public/images/logo-nubi-mark.png` (기존 로고 원본)
- Deploy/sync target: Vercel (기존 배포 파이프라인, `bootcamp.askewly.com`)
- Compatibility: `next-pwa` 대신 Next.js 16 내장 `manifest.ts` 파일 컨벤션 사용 — 이 프로젝트가 Turbopack(`next.config.ts`의 `turbopack.root`)을 쓰고 있어 webpack 플러그인 기반인 `next-pwa`와 충돌 위험이 있고, 요청 범위(설치 가능성 + standalone 표시)에는 서비스워커/오프라인 캐싱이 불필요하기 때문. 서비스워커를 추가하지 않았으므로 배포된 앱은 항상 최신 버전을 로드한다(캐시 stale 이슈 없음).
- Out of scope: 오프라인 캐싱, 푸시 알림, 서비스워커

## Evidence Contract

- Scenario: `pnpm build` 후 `pnpm start`로 production 서버 기동, `/manifest.webmanifest` 및 아이콘 응답, 홈페이지 head 태그 확인
- Expected evidence: manifest JSON에 name/short_name/standalone/icons 포함, 아이콘 200 응답, head에 `<link rel="manifest">`, `<meta name="theme-color">`, `<meta name="apple-mobile-web-app-title">` 존재
- Failure mode probe: manifest 라우트 404, 아이콘 404, build 실패 여부 확인
- Cleanup receipt: smoke 테스트용 production 서버 프로세스(PID 17328) 종료 완료
- Not evidence: 로컬 build 성공만으로 실제 모바일 "홈 화면에 추가" UX까지 보증하지 않음 — Vercel 배포 후 실제 모바일 브라우저(Chrome/Safari)에서 설치 확인 필요

## Verification

- [x] Targeted tests: 해당 없음 (자동 테스트 스위트 없음, 리포지토리 컨벤션)
- [x] Smoke: `pnpm build` 성공(Turbopack, 13/13 페이지), `pnpm start` 기동 후 `/manifest.webmanifest`(200, 올바른 JSON), `/icons/icon-192.png`(200, 5479 bytes), `/icons/icon-512.png`(200, 8832 bytes), `/`(200, head에 manifest/theme-color/apple-web-app 메타 확인)
- [ ] Sync/deploy if skill changed: N/A (skill 아님)
- [ ] Deployed copy grep if skill changed: N/A
- [x] Drift/dirty-tree check: 변경 파일만 스테이징 예정 (`git status` 확인 후 커밋)

## Result

- Status: done (로컬 검증 완료, 배포는 push 승인 대기)
- Evidence: 위 Smoke 항목 참고
- Notes: 실제 모바일 기기에서 "홈 화면에 추가" 최종 확인은 Vercel 배포 후 사용자가 직접 진행 권장
