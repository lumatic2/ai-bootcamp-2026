# 3일 Build–Measure–Learn 팀 플레이북

> 목표: 아이디어의 참신성보다 문제 선정 근거, 가설, 최소 제품, 측정 데이터와 학습의 연결을 재현한다.

## 입력 (Inputs)
- 팀원별 문제 후보: 관찰한 사람·상황·불편·현재 대안·근거 URL 또는 원문.
- 시간·기술·발표 제약: 사용 가능한 3일 일정, 팀 역할, 외부 API/secret 가능 여부.
- 사용자 접근 경로: 인터뷰, 직접 관찰, smoke test 중 실제 수행 가능한 방법.
- 초기 디자인 후보: `references/voltagent-awesome-design-md/ANALYSIS.md`와 제품 맥락에 맞는 2~3개 후보.

## 절차 (Procedure)
1. **문제 수집 — 판단 필요**: 각자 문제 후보를 사실과 해석으로 분리해 `docs/team-kickoff.md`에 적는다.
2. **문제 리서치 — 판단 필요**: 1차 사용자 신호와 원 출처를 모으고, 모르는 점을 질문으로 남긴다.
3. **문제 선정 — 판단 필요**: 문제 빈도/강도, 사용자 접근성, 3일 내 검증 가능성, 팀 역량을 각각 1~5점으로 채점하되 합계만으로 결정하지 않는다.
4. **가설 작성 — 판단 필요**: `experiments/EXPERIMENT_TEMPLATE.md`를 복사해 사용자·문제·행동 변화가 반증 가능한 한 문장이 되게 한다.
5. **Measure 먼저 설계 — 판단 필요**: metric, raw data, 수집 방법, 표본, PASS/FAIL/판단불가 기준을 Build 전에 적는다.
6. **최소 솔루션 선정 — 판단 필요**: 측정에 꼭 필요한 product surface만 선택하고 나머지는 제외 목록에 넣는다.
7. **스캐폴딩·구현 — 결정론적**: starter에서 새 branch를 만들고 작은 vertical slice부터 구현한다. 매 slice는 lint/build/smoke로 닫는다.
8. **Product 전달 — 판단 필요**: 실제 사용자 또는 명시된 proxy에게 제품을 보여주고 개입 없이 행동을 관찰한다.
9. **Measure/Data — 결정론적**: 사전 정의된 metric만 계산하고 raw data 위치, 누락, 표본 한계를 함께 기록한다.
10. **Learn — 판단 필요**: 가설을 PASS/FAIL/판단불가로 판정하고 keep/change/stop 중 다음 행동과 새 가설을 적는다.
11. **패키징·발표 — 결정론적**: 문제 → 가설 → 제품 → 데이터 → 학습 → 다음 가설을 각 evidence 경로에 연결한다.

## 체크리스트 (Checklist)
- [ ] 문제 주장마다 직접 관찰, 사용자 원문 또는 원 출처가 있다.
- [ ] 가설이 한 번의 관찰로도 틀릴 수 있는 문장이다.
- [ ] Build 전에 metric과 판정 기준을 합의했다.
- [ ] 제품 범위의 각 기능이 특정 가설 또는 측정에 연결된다.
- [ ] mock·synthetic·proxy·actual 데이터를 명확히 구분했다.
- [ ] raw data와 해석을 분리하고 표본·누락·편향을 기록했다.
- [ ] 실패한 가설도 삭제하지 않고 다음 결정 근거로 남겼다.
- [ ] 발표의 핵심 주장마다 레포 evidence 경로가 있다.
- [ ] 개인정보·secret·저작권 제한 자료가 커밋되지 않았다.

## 근거 (★ Judge)
- [The Lean Startup principles](https://theleanstartup.com/principles) — Build–Measure–Learn과 validated learning을 불확실성 속 진척의 기준으로 사용. 접근일 2026-07-14.
- 부트캠프 강사 안내(2026-07-14 사용자 전달) — 아이디어 참신성보다 결정 과정, planning, 검증 과정과 반복을 평가한다.
- [Google design.md](https://github.com/google-labs-code/design.md) — DESIGN.md가 토큰과 rationale을 함께 제공하고 lint/export를 지원함. 접근일 2026-07-14.
- [shadcn/ui Next.js 설치](https://ui.shadcn.com/docs/installation/next) — Next.js, Tailwind, import alias와 소유 가능한 UI 컴포넌트 설정 근거. 접근일 2026-07-14.
- 참고: `docs/DOMAIN.md#핵심-기준`

## 메타
- 작성일: 2026-07-14
- 마지막 적용: 적용 전
- 적용 횟수: 0
- 관련 ADR: `docs/adr/0001-web-starter-stack.md`, `docs/adr/0002-provisional-design-contract.md`
