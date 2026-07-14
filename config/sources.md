# 외부 데이터 소스·도구 카탈로그

## 공식·권위 소스
| 이름 | 용도 | 호출 방법 | 인증 |
|------|------|----------|------|
| The Lean Startup principles | Build–Measure–Learn과 validated learning 기준 | `https://theleanstartup.com/principles` | - |
| Google design.md | DESIGN.md spec, lint, Tailwind export | `pnpm exec designmd ...` | - |
| VoltAgent/awesome-design-md | 제품별 디자인 레퍼런스 후보 탐색 | GitHub README와 `design-md/*/DESIGN.md` | - |
| shadcn/ui docs | Next.js 설치와 컴포넌트 추가 방식 | `https://ui.shadcn.com/docs/installation/next` | - |
| Tailwind CSS docs | Tailwind v4 Next.js 설정 | `https://tailwindcss.com/docs/installation/framework-guides/nextjs` | - |

## 팀이 추가할 1차 데이터 소스
| 이름 | 용도 | 필수 기록 |
|------|------|----------|
| 사용자 인터뷰 | 문제·행동·언어 관찰 | 일시, 모집 기준, 질문, 익명 원문, 한계 |
| 행동 smoke test | CTA·과업 완료·반복 사용 관찰 | 이벤트 정의, 표본, raw 결과, 실패 조건 |
| 공개 통계·시장 자료 | 문제 규모와 맥락 확인 | 원 출처 URL, 기준일, 지표 정의 |

## 인용 형식
- 웹 자료: `출처명 · URL · 접근일 · 사용한 주장`.
- 인터뷰: `참여자 익명 ID · 일시 · 질문 · 원문 또는 관찰 · 해석 분리`.
- 측정: `metric 정의 · 수집 시점 · raw data 경로 · 표본/누락`.

## ⚠ 주의
- 모든 외부 호출 결과에 접근 시점을 기록한다.
- 검색 요약보다 원 출처를 우선한다.
- 캐시된 결과와 mock 데이터를 현재 사실로 다시 인용하지 않는다.
- 개인정보와 secret은 레포에 저장하지 않는다.
