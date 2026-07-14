# VoltAgent/awesome-design-md 분석

> 원본: https://github.com/VoltAgent/awesome-design-md · 접근일 2026-07-14

## 1. 한 줄 요약 / 무엇을 하는 하네스인가

실제 서비스에서 분석한 디자인 토큰·패턴·규칙을 브랜드별 `DESIGN.md`로 제공해 AI 코딩 에이전트가 일관된 UI를 만들게 하는 레퍼런스 카탈로그다.

## 2. 디렉터리 지도

```text
awesome-design-md/
├── design-md/          # 서비스별 폴더와 DESIGN.md
├── README.md           # 개념, 사용법, 카탈로그
├── CONTRIBUTING.md     # 새 분석 기여 절차
└── LICENSE             # MIT 라이선스
```

## 3. 하네스 구성요소 매핑

| 계층 | 위치 | 내용 |
|------|------|------|
| L0 Model | 외부 AI 코딩 에이전트 | 저장소가 모델을 제공하지 않고 문맥을 공급한다. |
| L1 Executor | 없음 | 파일 복사 후 에이전트가 구현하는 정적 reference 방식이다. |
| L2 Plugins/tools | `design-md/*/DESIGN.md` | 색, 타이포, spacing, component와 규칙을 공급한다. |
| L3 Self-diag | 없음 | 원 저장소 자체에는 프로젝트별 렌더 검증이 없다. |
| Guardrails | 각 DESIGN.md의 Do/Don't, responsive 규칙 | 시각 언어의 허용·금지 패턴을 명시한다. |

## 4. 인상 깊은 코드/패턴

- [`README.md:L244-L258`](https://github.com/VoltAgent/awesome-design-md#what-is-designmd) — `AGENTS.md`는 어떻게 만들지, `DESIGN.md`는 어떻게 보여야 할지를 나눈다. 디자인 의도를 코드 지침과 분리하는 경계가 명확하다.
- [`design-md/claude/DESIGN.md`](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/claude/DESIGN.md) — 색과 글꼴 이름만이 아니라 레이아웃 리듬, 반응형 변화, Do/Don't를 함께 제공해 단순 theme보다 풍부하다.
- [`README.md:L272-L330`](https://github.com/VoltAgent/awesome-design-md#collection) — 여러 산업·서비스를 한 카탈로그에 배치해 제품 성격에 맞는 후보 비교가 가능하다.

## 5. 내 정의에 어떻게 반영할 것인가

- `DESIGN.md`를 AI용 분위기 프롬프트가 아니라 토큰, component, 반응형, 금지 패턴을 포함하는 실행 계약으로 사용한다.
- 한 브랜드를 그대로 복제하지 않고 제품 사용자·과업과 맞는 2~3개 후보의 원리를 비교한다.
- 원 저장소에 없는 lint와 렌더 검증은 Google `design.md`, Tailwind build, 브라우저 smoke로 보완한다.
- 브랜드 자산과 고유 표현을 복제하지 않고 구조적 패턴과 토큰 선택 근거만 참고한다.
- 관련 ADR: `docs/adr/0002-provisional-design-contract.md`

## 메타
- 수집일: 2026-07-14
- 자료: [awesome-design-md](https://github.com/VoltAgent/awesome-design-md), [Google design.md](https://github.com/google-labs-code/design.md)
- 소요 시간: 25분
- 다음 후보: 제품 방향 결정 후 해당 카테고리 2~3개 DESIGN.md 비교
