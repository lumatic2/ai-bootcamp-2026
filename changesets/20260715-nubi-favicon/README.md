# 20260715-nubi-favicon

## Target
- ROADMAP milestone: B2 — 너비 MVP의 서비스 식별성을 favicon에 반영

## Scope
| File/Path | Reason |
|-----------|--------|
| `public/images/favicon-neobi.png` | 생성 원본 PNG 보관 |
| `src/app/favicon.ico` | 브라우저가 사용하는 다중 크기 favicon 교체 |

## Contract
- Source of truth: `public/images/favicon-neobi.png`
- Runtime target: `src/app/favicon.ico`
- Visual contract: `DESIGN.md`의 near-black/white/evidence-blue, measurement-first 정체성
- Out of scope: 페이지 로고·OG 이미지·카피·레이아웃 변경

## Planning gate
```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: hold
  delegation_decision:
    remote_background_agents: skip
    reason: "단일 정사각형 자산이며 축소 렌더와 빌드로 검증 가능"
    target_roles: []
    execution_path: local_manual
  spec_skip_reason: "기존 DESIGN.md와 PRD의 measurement-first 제품 정체성을 그대로 시각화"
  perspectives:
    product: "브라우저 탭에서 너비 측정 서비스임을 즉시 구분"
    architecture: "Next.js file-based metadata의 기존 favicon 경로 유지"
    security: "외부 입력·권한·secret 영향 없음"
    qa: "16px/32px 축소 가독성, ICO 멀티사이즈, production build 확인"
    skeptic: "측정선이 축소 시 사라질 수 있어 실픽셀 렌더로 판정"
  role_lanes:
    explorer: "기존 favicon과 DESIGN 토큰 확인"
    planner: "단색 3컬러 심볼로 범위 고정"
    reviewer: "텍스트·장식·scope drift 여부 확인"
    qa: "축소 렌더와 빌드"
    gate: "changeset checklist와 git diff 대조"
  dod:
    - "16px 및 32px에서 티셔츠와 너비 측정선이 구분된다"
    - "src/app/favicon.ico가 유효한 브라우저 아이콘이다"
    - "pnpm build가 통과한다"
```

## Verification
- [x] 생성 원본의 색상·실루엣·금지 요소 육안 확인 — near-black/white/evidence-blue 3색, 텍스트·장식 없음
- [x] 16px/32px 축소 렌더 육안 확인 — 16px 티셔츠+측정선, 32px 양방향 화살표 식별
- [x] ICO 포맷과 포함 크기 확인 — 16/32/48/64/128/256px
- [x] `pnpm build` PASS — 첫 RGB ICO 실패 후 RGBA 프레임으로 교정, 재실행 PASS
- [x] Targeted diff와 unrelated dirty files 비접촉 확인 — favicon PNG/ICO와 changeset 기록만 변경

### Verification log
- First build: FAIL — Turbopack ICO decoder requires embedded PNG frames in RGBA, but the generated ICO used RGB frames.
- Second build: PASS — Next.js 16.2.10 production build and TypeScript/static generation completed.

## Result
- Status: passed
- Notes: 내장 image generation으로 생성한 심볼을 3색으로 정리하고, RGBA 멀티사이즈 ICO로 변환했다.
