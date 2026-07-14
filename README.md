# AI Vibe Coding Bootcamp 2026

3일 동안 팀이 문제 정의부터 제품, 측정 데이터, 학습과 발표까지 하나의 evidence chain으로 연결하는 작업 레포입니다.

## 시작
```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 품질 게이트
```bash
pnpm check
```

`DESIGN.md` lint, ESLint, Next.js production build를 순서대로 실행합니다.

## 팀이 모이면
1. [`docs/team-kickoff.md`](docs/team-kickoff.md)로 첫 45분을 진행합니다.
2. [`playbooks/3-day-build-measure-learn.md`](playbooks/3-day-build-measure-learn.md)의 단계별 gate를 사용합니다.
3. 첫 가설을 `experiments/EXPERIMENT_TEMPLATE.md`에서 복사해 기록합니다.
4. 제품 방향이 정해지면 임시 [`DESIGN.md`](DESIGN.md)를 팀이 선택한 근거와 함께 교체합니다.
   후보 비교에는 [`docs/design-reference-selection.md`](docs/design-reference-selection.md)와 [getdesign.md](https://getdesign.md/)를 사용합니다.

## 현재 범위
- Next.js App Router + TypeScript
- Tailwind CSS v4
- shadcn/ui
- Google `design.md` lint

백엔드, 인증, 데이터베이스, AI API와 배포는 팀의 문제·실험이 요구할 때 결정합니다.
