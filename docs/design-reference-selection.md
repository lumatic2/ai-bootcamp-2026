# getdesign.md 레퍼런스 선택 절차

> 목적: 제품과 사용자가 정해진 뒤, 취향이 아니라 과업 적합성으로 `DESIGN.md` 후보를 선택한다.

## 언제 사용하나
- 문제, 핵심 사용자, 첫 product surface가 합의된 뒤 사용한다.
- 지금 루트 `DESIGN.md`는 중립 starter 검증용이다. 후보가 정해지기 전 덮어쓰지 않는다.

## 15분 선택 절차
1. [getdesign.md](https://getdesign.md/)에서 제품 카테고리와 가까운 분석을 찾는다.
2. 사용자 과업, 정보 밀도, 신뢰감, 콘텐츠 유형이 다른 후보 2~3개만 고른다.
3. 각 상세 페이지의 Preview와 DESIGN.md를 보고 아래 표를 팀이 함께 채운다.
4. 최고 점수를 자동 채택하지 않고, 제품에서 반드시 지켜야 할 원칙 3개와 버릴 패턴 3개를 합의한다.
5. 선택한 후보의 URL과 이유를 새 ADR에 기록한다.
6. root에서 설치하기 전 현재 `DESIGN.md`를 보존하고 diff를 검토한다.
7. `pnpm design:lint && pnpm build`와 브라우저 smoke가 통과한 경우에만 채택한다.

## 후보 비교표
| 후보/URL | 사용자 과업 적합성 | 정보 밀도 | 신뢰·감정 톤 | 모바일 적합성 | 채택할 원칙 | 버릴 패턴 |
|----------|--------------------|-----------|--------------|---------------|-------------|-----------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

## 설치 명령과 안전 경계
상세 페이지가 제시하는 기본 형식:

```bash
npx getdesign@latest add <slug>
```

- 이 명령은 팀이 후보를 확정하고 ADR을 만든 뒤에만 루트에서 실행한다.
- 설치 결과를 그대로 승인하지 않는다. 현재 `DESIGN.md`와 diff하고 브랜드 고유 자산·상표·제품에 맞지 않는 패턴을 제거한다.
- `getdesign.md`의 분석은 공개적으로 관찰한 독립적 참고 자료이며 해당 브랜드의 공식 디자인 시스템으로 주장하지 않는다.

## 근거
- [getdesign.md 홈](https://getdesign.md/) — 카테고리별 DESIGN.md 분석 탐색과 preview 제공. 접근일 2026-07-14.
- [Claude 분석 예시](https://getdesign.md/claude/design-md) — 스타일 설명, preview, `npx getdesign@latest add claude` 사용법과 비공식 분석 고지. 접근일 2026-07-14.
- [Google design.md](https://github.com/google-labs-code/design.md) — 설치 후 구조·참조·대비 lint와 Tailwind export 검증. 접근일 2026-07-14.
