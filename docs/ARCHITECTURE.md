# 아키텍처

## 디렉토리 구조
```text
src/app/       Next.js App Router와 전역 토큰
components/ui/ shadcn 소유 컴포넌트
lib/           공용 유틸리티
docs/          계획·결정·발표 evidence
playbooks/     반복 가능한 팀 절차
experiments/   가설·방법·결과·학습
references/    외부 자료 분석
changesets/    변경 계약과 검증 결과
```

## 패턴
- Server Components를 기본으로 하고 브라우저 상태가 필요한 최소 surface만 Client Component로 둔다.
- 초기 화면은 starter readiness와 팀의 다음 행동만 보여준다. 가짜 제품 기능은 만들지 않는다.
- 디자인 값은 `DESIGN.md`가 의미 정본이고 `src/app/globals.css` 변수는 실행 정본이다.
- shadcn 컴포넌트는 레포가 소유하며 제품 맥락에 맞게 조정한다.

## 데이터 흐름
```text
팀 입력 → 문제/가설 기록 → 최소 제품 → 측정 데이터 → 실험 결과 → 학습/다음 결정
```

현재 starter 자체는 외부 데이터나 영속 저장소를 사용하지 않는다.

## 외부 의존성
- Next.js/React: 웹 제품 기본 런타임. → `docs/adr/0001-web-starter-stack.md`
- Tailwind CSS v4: CSS 토큰을 utility와 연결한다.
- shadcn/ui: 접근 가능한 React primitive를 프로젝트 소유 코드로 제공한다.
- `@google/design.md`: DESIGN.md 구조·참조·대비를 검사한다. → `docs/adr/0002-provisional-design-contract.md`

## 상태 관리
- starter에는 전역 상태 라이브러리를 설치하지 않는다.
- 서버 데이터가 생기면 그 데이터의 수명과 측정 요구를 먼저 정의한다.
- 단순 UI 상태는 해당 컴포넌트에 지역화한다.
