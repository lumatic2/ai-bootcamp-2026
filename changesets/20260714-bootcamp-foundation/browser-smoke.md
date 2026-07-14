# Browser smoke — 2026-07-14

## 환경
- Chrome extension backend
- URL: `http://127.0.0.1:3000`
- Next.js dev server, production build 별도 PASS

## Desktop/default viewport
- 문서 title: `AI Bootcamp Workbench`
- H1 visible: PASS
- horizontal overflow: 없음
- primary action 2개 노출: PASS
- console warning/error: 0

## Mobile 390 × 844
- H1 visible: PASS
- main width: 390px
- horizontal overflow: 없음
- primary action 높이: 40px / 40px
- 준비 체크리스트가 단일 column으로 노출: PASS
- console warning/error: 0

## 확인한 첫 화면 계약
- 가설·Build·Measure·Learn 맥락이 첫 viewport에 보인다.
- 첫 행동 `첫 45분 시작하기`가 보인다.
- mock 측정값이나 제품 종속 기능을 표시하지 않는다.

## Cleanup
- viewport override reset
- Chrome 검증 탭 finalize
- 로컬 dev server 종료
