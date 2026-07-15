---
version: beta
name: nubi-single-category-style-spec
description: 너비는 반팔 티셔츠 한 가지 품목만 다루는 실측 기반 사이즈 검색 서비스다. 일반 패션 쇼핑몰처럼 카테고리·랭킹·세일·장바구니를 제공하지 않고, 사용자가 잘 맞는 기존 반팔티를 기준으로 다른 브랜드의 적정 사이즈와 유사한 실측 상품을 찾는 한 가지 행동에 집중한다. 디자인은 무신사형 상품 탐색 화면의 높은 비교 효율을 참고하되, bootcamp.askewly.com의 선언적인 카피와 단계형 번역 흐름을 중심으로 재설계한다. 시각 방향은 따뜻한 오프화이트 바탕, 강한 검정 타이포그래피, 측정·선택 상태에만 사용하는 시그널 라임, 얇은 테두리와 작은 모서리 반경을 결합한 editorial-tech 스타일이다.

scope:
  included:
    - 랜딩 페이지
    - 기준 반팔티 선택
    - 브랜드 및 상품 검색
    - 기준 사이즈 선택
    - 최대 5벌 기준 옷 저장
    - 실측표 직접 입력 또는 붙여넣기
    - 추천 결과 목록
    - 추천 사이즈 및 실측 차이 표시
    - 브랜드 필터
    - 적합도 기준 정렬
    - 외부 판매처 상품 보기
    - 로그인
  excluded:
    - 의류 카테고리 탐색
    - 반팔티 외 품목
    - 랭킹 탭
    - 세일 탭
    - 기획전
    - 쿠폰 및 할인 중심 UI
    - 장바구니
    - 주문 및 결제
    - 배송 조회
    - 내부 구매 전환 기능

colors:
  primary: "#141414"
  primary-active: "#000000"
  primary-soft: "#2a2a28"
  accent: "#c8ff3d"
  accent-active: "#aee525"
  accent-soft: "#efffc7"
  focus: "#5367ff"
  ink: "#141414"
  body: "#353532"
  muted: "#71716b"
  muted-soft: "#9b9b94"
  disabled: "#bdbdb5"
  canvas: "#f6f6f0"
  surface: "#ffffff"
  surface-soft: "#efefe8"
  surface-selected: "#f2ffd5"
  surface-pressed: "#e7e7df"
  hairline: "#deded6"
  hairline-strong: "#bdbdb4"
  on-primary: "#ffffff"
  on-accent: "#141414"
  match-high: "#b7ef36"
  match-medium: "#ffd76a"
  match-low: "#e4e4dc"
  positive: "#18845b"
  warning: "#b56c13"
  error: "#c83f34"
  scrim: "#000000"

typography:
  display-hero:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -1.8px
  display-xl:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -1.1px
  display-lg:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 32px
    fontWeight: 750
    lineHeight: 1.22
    letterSpacing: -0.8px
  section-title:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 24px
    fontWeight: 750
    lineHeight: 1.33
    letterSpacing: -0.5px
  title-lg:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.3px
  title-md:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.41
    letterSpacing: -0.2px
  title-sm:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 15px
    fontWeight: 650
    lineHeight: 1.47
    letterSpacing: -0.12px
  body-lg:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: -0.2px
  body-md:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.1px
  body-sm:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.54
    letterSpacing: -0.05px
  caption:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-strong:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    fontSize: 12px
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: 0
  micro-label:
    fontFamily: "'Space Grotesk', 'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 11px
    fontWeight: 650
    lineHeight: 1.36
    letterSpacing: 0.5px
    textTransform: uppercase
  numeric-lg:
    fontFamily: "'Space Grotesk', 'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.6px
  numeric-md:
    fontFamily: "'Space Grotesk', 'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: -0.2px
  product-brand:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.38
    letterSpacing: -0.08px
  product-name:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.08px
  button-lg:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.16px
  button-md:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 14px
    fontWeight: 650
    lineHeight: 1.43
    letterSpacing: -0.1px
  button-sm:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.42
    letterSpacing: 0

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section: 56px
  section-lg: 80px
  hero: 112px

breakpoints:
  compact: "360px"
  mobile: "390px"
  tablet: "744px"
  desktop: "1024px"
  wide: "1280px"
  max: "1440px"

components:
  site-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderBottom: "1px solid {colors.hairline}"
    height: 72px
    padding: "0 24px"
  mobile-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderBottom: "1px solid {colors.hairline}"
    height: 56px
    padding: "0 16px"
  brand-wordmark:
    textColor: "{colors.ink}"
    typography: "{typography.title-lg}"
  header-link:
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
  header-login:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    height: 36px
    padding: "0 14px"
  hero-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    minHeight: 620px
    padding: "112px 24px 80px"
  hero-eyebrow:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.micro-label}"
    rounded: "{rounded.xs}"
    height: 24px
    padding: "0 8px"
  hero-cta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.md}"
    height: 54px
    padding: "0 24px"
  hero-cta-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 54px
    padding: "0 20px"
  brand-marquee:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    height: 48px
  process-shell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    padding: "32px"
  progress-track:
    backgroundColor: "{colors.surface-soft}"
    height: 4px
    rounded: "{rounded.full}"
  progress-value:
    backgroundColor: "{colors.accent}"
    height: 4px
    rounded: "{rounded.full}"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 52px
    padding: "0 16px"
  select-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 52px
    padding: "0 40px 0 16px"
  reference-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
    padding: "16px"
  reference-card-selected:
    backgroundColor: "{colors.surface-selected}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "2px solid {colors.primary}"
    padding: "15px"
  size-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.hairline-strong}"
    height: 44px
    padding: "0 16px"
  size-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.primary}"
    height: 44px
    padding: "0 16px"
  measurement-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.hairline-strong}"
    height: 48px
    padding: "0 40px 0 12px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    height: 50px
    padding: "0 20px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    height: 50px
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline-strong}"
    height: 50px
    padding: "0 20px"
  results-summary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  reference-summary-chip:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    height: 32px
    padding: "0 10px"
  result-toolbar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderBottom: "1px solid {colors.hairline}"
    height: 56px
  fit-filter-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.hairline-strong}"
    height: 36px
    padding: "0 12px"
  fit-filter-button-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.primary}"
    height: 36px
    padding: "0 12px"
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.hairline}"
  product-photo:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.sm} {rounded.sm} 0 0"
    aspectRatio: "4 / 5"
  match-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.sm}"
    height: 26px
    padding: "0 8px"
  recommended-size:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.sm}"
    height: 26px
    padding: "0 8px"
  measurement-delta:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    height: 24px
    padding: "0 7px"
  product-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.hairline-strong}"
    height: 38px
    padding: "0 12px"
  result-detail-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl} {rounded.xl} 0 0"
    padding: "24px 16px"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    padding: "48px 24px"

---

# 너비 반팔티 사이즈 검색 서비스 디자인 스펙

## 1. 문서 목적

이 문서는 `bootcamp.askewly.com`에서 운영 중인 **너비 · 사이즈 번역기**에 적용할 시각 디자인과 UI 구조를 정의한다.

이번 MVP는 일반적인 패션 쇼핑몰이 아니다. 사용자가 상품을 둘러보다 구매하는 서비스가 아니라, **이미 잘 맞는 반팔티를 기준으로 다른 브랜드의 적절한 사이즈와 유사한 실측 상품을 찾는 검색 도구**다.

따라서 무신사 상품 목록의 다음 장점만 참고한다.

- 여러 상품을 빠르게 비교하는 그리드
- 브랜드명·상품명·핵심 수치의 명확한 위계
- 검색 결과를 좁히는 간결한 필터
- 데스크톱과 모바일에서 유지되는 정보 밀도

다음 쇼핑몰 기능은 디자인과 정보 구조에서 완전히 제외한다.

- 카테고리 메뉴
- 랭킹
- 세일
- 기획전
- 장바구니
- 결제
- 주문·배송
- 쿠폰 중심의 가격 강조

---

## 2. 서비스 핵심 행동

모든 화면은 다음 한 문장을 지원해야 한다.

> **잘 맞는 반팔티를 고르면, 다른 브랜드에서 비슷하게 맞는 사이즈를 찾아준다.**

### 권장 사용자 흐름

```text
랜딩
  ↓
기준 반팔티 검색
  ↓
브랜드·상품 선택
  ↓
기준 사이즈 선택
  ↓
필요하면 기준 옷 추가 또는 실측표 입력
  ↓
사이즈 번역 결과
  ↓
유사 실측 반팔티 비교
  ↓
외부 판매처에서 상품 확인
```

### 정보 구조 원칙

1. 한 화면에 하나의 주요 행동만 둔다.
2. 사용자는 현재 몇 단계인지 항상 알 수 있어야 한다.
3. 상품 가격보다 **추천 사이즈와 실측 차이**가 먼저 보여야 한다.
4. “적합도”는 판매 랭킹이 아니라 사용자의 기준 옷과의 유사도임을 명확히 표시한다.
5. 구매는 외부 판매처에서 이루어지며 내부 장바구니는 제공하지 않는다.

---

## 3. 디자인 방향

### 스타일 키워드

- Editorial
- Measurement
- Utility
- Dense but calm
- High contrast
- Technical, not corporate
- Fashion, not marketplace

### 시각적 조합

`bootcamp.askewly.com`의 선언적인 문장과 단계형 서비스 흐름에 다음 요소를 결합한다.

- 큰 검정 타이포그래피
- 따뜻한 오프화이트 배경
- 정밀 측정을 연상시키는 숫자·단위 표현
- 선택과 적합도에만 사용하는 시그널 라임
- 얇은 1px 테두리
- 2~12px의 낮은 모서리 반경
- 불필요한 그림자를 제거한 평면 구성

### 피해야 할 표현

- 쇼핑몰처럼 많은 상단 메뉴
- 빨간 할인율 중심의 상품 카드
- 쿠폰·특가·마감 임박 배지
- 과도한 pill 형태
- 둥글고 말랑한 금융 앱 스타일
- 그라디언트가 많은 AI 서비스 스타일
- 모든 영역에 라임색을 사용하는 방식
- 카드마다 큰 그림자를 주는 방식

---

## 4. 색상

### 기본 배경

- **Canvas — `#f6f6f0`**
  - 전체 페이지 배경
  - 순백색보다 부드러워 패션 이미지와 검정 글자를 안정적으로 받쳐준다.

- **Surface — `#ffffff`**
  - 입력창
  - 단계형 폼
  - 결과 상품 카드
  - 상세 sheet

- **Surface Soft — `#efefe8`**
  - 이미지 placeholder
  - 비활성 선택지
  - 실측 수치 배경
  - 테이블 교차 행

### 핵심 색상

- **Primary — `#141414`**
  - 헤드라인
  - 주 버튼
  - 선택된 사이즈
  - 결과 요약 영역
  - 푸터

- **Signal Lime — `#c8ff3d`**
  - 현재 단계
  - 선택 완료
  - 높은 적합도
  - 핵심 숫자 강조
  - 작은 eyebrow label

라임은 브랜드 배경색이 아니라 **측정 결과와 선택 상태를 알려주는 신호색**으로만 사용한다.

### 텍스트

| 역할 | 색상 |
|---|---|
| 제목·핵심 수치 | `#141414` |
| 일반 본문 | `#353532` |
| 보조 정보 | `#71716b` |
| placeholder | `#9b9b94` |
| 비활성 | `#bdbdb5` |

### 적합도 색상

적합도는 판매 순위가 아니라 실측 유사도를 뜻한다.

| 상태 | 범위 예시 | 표현 |
|---|---:|---|
| 매우 유사 | 90–100% | 라임 `#b7ef36` |
| 유사 | 75–89% | 노랑 `#ffd76a` |
| 차이 있음 | 0–74% | 중립 회색 `#e4e4dc` |

낮은 적합도를 오류처럼 빨간색으로 표시하지 않는다. 사용자의 취향에 따라 여유 있는 핏이 더 적합할 수도 있기 때문이다.

---

## 5. 타이포그래피

### 기본 폰트

```css
font-family:
  "Pretendard Variable",
  Pretendard,
  -apple-system,
  BlinkMacSystemFont,
  "Apple SD Gothic Neo",
  "Noto Sans KR",
  sans-serif;
```

### 숫자와 영문 보조 폰트

실측 수치, 퍼센트, 영문 슬로건에는 `Space Grotesk`를 선택적으로 사용한다.

```css
font-family:
  "Space Grotesk",
  "Pretendard Variable",
  Pretendard,
  sans-serif;
```

폰트 파일을 추가하기 어렵다면 전체를 Pretendard로 통일해도 된다.

### 핵심 크기

| 항목 | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| 랜딩 핵심 문장 | 56px | 36px | 800 |
| 큰 페이지 제목 | 40px | 30px | 800 |
| 결과 제목 | 32px | 26px | 750 |
| 섹션 제목 | 24px | 21px | 750 |
| 본문 강조 | 18px | 16px | 400 |
| 일반 본문 | 15px | 14px | 400 |
| 상품 브랜드 | 13px | 12px | 700 |
| 상품명 | 13px | 12px | 400 |
| 실측 수치 | 16px | 14px | 650 |
| 작은 상태 | 11–12px | 11px | 500–650 |

### 헤드라인 원칙

- 한 줄에 12~16자를 넘기지 않는 편이 좋다.
- 랜딩 헤드라인은 최대 3줄이다.
- 글자 크기만 크게 만들지 말고 줄 간격을 `1.08~1.15`로 좁힌다.
- 핵심 단어에만 라임색 사각형 배경 또는 짧은 underline을 사용한다.
- 모든 제목을 영문 대문자로 만들지 않는다.

### 추천 랜딩 표현

```text
처음 보는 브랜드도
내가 입던 반팔티처럼.
```

또는 현재 카피를 유지한다.

```text
내 사이즈는 M,
브랜드마다 이름만 다릅니다.
```

---

## 6. 모양과 선

### Corner Radius

| 요소 | Radius |
|---|---:|
| 상품 이미지 | 4px |
| 상품 카드 | 4px |
| 입력창 | 8px |
| 주요 버튼 | 8px |
| 작은 칩 | 4px |
| 단계형 폼 shell | 12px |
| 모바일 bottom sheet | 상단 16px |
| 적합도 progress bar | full |

전체를 pill 형태로 만들지 않는다. 서비스의 정밀하고 도구적인 인상을 유지하기 위해 **작고 각진 반경**을 기본으로 한다.

### Borders

- 기본: `1px solid #deded6`
- 강조 입력: `1px solid #bdbdb4`
- focus: `2px solid #141414`
- 키보드 focus ring: `0 0 0 3px rgba(83,103,255,0.25)`

### Shadow

기본 카드에는 그림자를 사용하지 않는다.

다음 overlay에만 사용한다.

```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

- 자동완성 검색창
- 브랜드 선택 dropdown
- 모바일 상세 sheet
- 로그인 dialog

---

## 7. 레이아웃

### Container

- 최대 콘텐츠 폭: `1280px`
- 랜딩 텍스트 최대 폭: `720px`
- 단계형 입력 폼 최대 폭: `960px`
- 결과 목록 최대 폭: `1280px`
- 데스크톱 좌우 여백: `24px`
- 태블릿 좌우 여백: `16px`
- 모바일 좌우 여백: `16px`
- 모바일 결과 grid만 필요에 따라 `8px`까지 축소 가능

### Vertical Rhythm

- 랜딩 주요 섹션: 80px
- 일반 섹션: 56px
- 폼 그룹 사이: 24px
- 폼 label과 input: 8px
- 상품 이미지와 메타: 10px
- 메타 행 사이: 4px
- 결과 카드 행 간격: 24px

---

## 8. 헤더

### Desktop

```text
[너비]          사이즈 찾기   작동 방식   데이터 안내          [로그인]
```

- 높이: 72px
- sticky 가능
- 배경: 오프화이트
- 하단 1px 선
- 로고 영역: 좌측
- 설명용 링크: 중앙 또는 우측
- 로그인: 우측

### Mobile

```text
[너비]                                      [로그인]
```

- 높이: 56px
- 설명용 내비게이션은 숨긴다.
- 햄버거 메뉴를 반드시 만들 필요는 없다.
- 핵심 기능이 하나이므로 로고와 로그인만으로 충분하다.

### 제거되는 메뉴

- 카테고리
- 추천
- 브랜드 탐색 탭
- 발매
- 랭킹
- 세일
- 장바구니

브랜드 검색은 상단 메뉴가 아니라 **사이즈 번역 과정 안의 검색 input**으로 제공한다.

---

## 9. 랜딩 페이지

### Hero

#### Desktop

- 최소 높이: 620px
- 위 padding: 112px
- 아래 padding: 80px
- 콘텐츠 최대 폭: 720px
- CTA는 1개를 우선한다.

```text
SIZE IS A RELATION, NOT A NUMBER

처음 보는 브랜드도
내가 입던 반팔티처럼.

줄자 없이, 잘 맞는 옷 하나만 고르세요.
나머지는 너비가 찾아드려요.

[30초 만에 사이즈 찾기]
```

### CTA

- 높이: 54px
- 배경: 검정
- 글자: 흰색
- radius: 8px
- 좌우 padding: 24px
- 모바일에서는 폭 100%

보조 CTA가 필요할 때만 다음을 추가한다.

```text
[작동 방식 보기]
```

보조 CTA는 outline으로 표현하고 주 CTA보다 시각적 강도를 낮춘다.

### 브랜드 Marquee

현재 사이트처럼 지원 브랜드가 많다는 사실은 신뢰 요소가 된다.

- 높이: 48px
- 검정 배경
- 흰색 브랜드 텍스트
- `24~32px` 간격
- 무한 자동 스크롤
- hover 시 정지
- 브랜드 로고가 아니라 텍스트 이름만 사용
- 배경 장식이 아니라 “지원 범위”를 설명하는 기능으로 사용

Marquee 바로 아래에 다음 설명을 둔다.

```text
현재 반팔티 48개 브랜드의 실측 데이터를 지원합니다.
```

숫자는 실제 데이터 수에 맞춰 동적으로 표시한다.

---

## 10. 단계형 사이즈 번역 화면

### 기본 구조

```text
STEP 1 / 3
[진행 바]

지금 갖고 있는 옷 중
제일 잘 맞는 반팔티를 골라주세요.

[브랜드 또는 상품 검색]

[선택한 기준 옷 카드]

                                 [다음]
```

### Process Shell

- 최대 폭: 960px
- 배경: 흰색
- border: 1px
- radius: 12px
- padding: desktop 32px / mobile 20px 16px
- margin-top: 40px
- 내부 요소는 한 번에 너무 많이 노출하지 않는다.

### 진행 상태

- `STEP 1 / 3`: 11px 영문·숫자형
- 진행 바 높이: 4px
- 비활성: 연회색
- 활성: 라임
- 단계가 바뀔 때 width transition 220ms

### STEP 1 — 기준 옷 선택

필수 정보:

- 브랜드
- 상품명
- 사용자가 입는 사이즈
- 선택 여부

최대 5벌을 저장할 수 있지만 첫 사용자는 1벌만으로도 다음 단계로 이동할 수 있어야 한다.

#### 검색 input

- 높이: 52px
- placeholder: `브랜드나 상품명을 검색하세요`
- 좌측 검색 아이콘: 18px
- clear 버튼 제공
- 결과는 input 아래 dropdown
- 브랜드와 상품을 별도 그룹으로 표시

### STEP 2 — 사이즈 선택

```text
이 반팔티에서 어떤 사이즈를 입나요?

[XS] [S] [M] [L] [XL] [XXL]
```

- 칩 높이: 44px
- 최소 폭: 56px
- 선택: 검정 배경 + 흰 글자
- 비선택: 흰 배경 + 회색 border
- 존재하지 않는 사이즈는 disabled

### STEP 3 — 핏 해석

MVP에서 사용자의 복잡한 체형 문진은 피한다.

권장 선택지는 3개다.

```text
[지금 핏 그대로]
[조금 더 여유롭게]
[조금 더 슬림하게]
```

선택적으로 가장 중요한 치수를 고르게 할 수 있다.

```text
핏을 비교할 때 더 중요하게 볼 부분
[가슴] [어깨] [총장] [소매]
```

기본값은 “전체 균형”이다.

### 데이터에 없는 상품

현재 사이트의 방향처럼 실측표 붙여넣기를 지원한다.

- 별도 링크: `찾는 상품이 없나요?`
- 누르면 textarea 또는 표 입력 UI를 펼친다.
- 필수 항목:
  - 어깨
  - 가슴
  - 총장
  - 소매 길이
- 단위는 `cm`로 고정
- 숫자 input 오른쪽에 단위를 고정 표시한다.

---

## 11. 결과 페이지

### 결과 상단 요약

결과 페이지의 첫 화면에서는 상품보다 먼저 사용자의 기준을 다시 보여준다.

```text
기준 반팔티와 비슷한 상품을 찾았어요.

기준
브랜드 A · 상품명 · M

중요하게 본 부분
가슴 · 어깨

총 24개 결과
```

### Results Summary Card

- 검정 배경
- 흰색 글자
- radius 12px
- padding 24px
- 선택한 기준 옷은 어두운 회색 chip으로 표시
- “다시 설정”은 outline 또는 text button

### 결과 필터

카테고리는 제공하지 않는다.

허용되는 필터는 사이즈 검색과 직접 관련된 것만 사용한다.

- 브랜드
- 추천 사이즈
- 실측 오차 범위
- 원하는 핏
- 가격대 — 가격 데이터를 제공할 경우에만
- 품절 제외 — 판매처 상태를 확인할 수 있을 경우에만

### 정렬

판매 랭킹과 세일순은 제공하지 않는다.

권장 정렬:

1. 적합도 높은 순
2. 가슴 치수 가까운 순
3. 어깨 치수 가까운 순
4. 총장 가까운 순
5. 최신 데이터 순

기본 정렬은 항상 `적합도 높은 순`이다.

---

## 12. 결과 상품 그리드

실측 정보를 보여줘야 하므로 일반 쇼핑몰의 6열보다 넓은 카드를 사용한다.

| Viewport | Columns | Gap | Gutter |
|---|---:|---:|---:|
| ≥1280px | 4 | 16px | 24px |
| 1024–1279px | 4 | 12px | 20px |
| 744–1023px | 3 | 12px | 16px |
| 390–743px | 2 | 8px | 8–12px |
| <390px | 2 | 4–8px | 4–8px |

### 이미지

- 비율: 4:5
- `object-fit: cover`
- 상품 이미지가 없으면 회색 placeholder와 옷 실루엣 사용
- 상품 이미지 위 overlay는 최대 2개

허용 overlay:

- 좌상단: 적합도
- 우상단: 추천 사이즈

찜 버튼과 장바구니 버튼은 두지 않는다.

---

## 13. 결과 상품 카드

### 정보 순서

```text
[상품 이미지]
[적합도 94%]          [추천 M]

브랜드명
상품명

기준 옷과 비교
가슴 +1.0 · 어깨 -0.5
총장 +2.0 · 소매 +0.3

[상세 비교] [판매처에서 보기]
```

### 우선순위

1. 적합도
2. 추천 사이즈
3. 브랜드
4. 상품명
5. 핵심 실측 차이
6. 외부 판매처 링크
7. 가격 — 제공 가능한 경우에만 보조 표시

가격을 표시하더라도 할인율을 핵심 정보로 만들지 않는다.

### Product Card Size

#### Desktop

- 카드 폭: 약 288~296px
- 이미지: 약 288 × 360px
- 메타 영역: 최소 154px
- 전체 높이: 약 530px

#### Mobile 390px

- 카드 폭: 약 183~187px
- 이미지: 약 183 × 229px
- 메타 영역: 약 144~164px
- 전체 높이: 약 390px

### 모바일 정보 축약

모바일 카드에는 다음만 우선 표시한다.

```text
적합도
추천 사이즈
브랜드
상품명 2줄
가슴·어깨 차이
상세 보기
```

총장과 소매 차이는 상세 sheet에서 확인한다.

### 적합도 표현

숫자와 설명을 함께 제공한다.

```text
94% · 매우 비슷해요
82% · 비슷한 편이에요
68% · 여유 차이가 있어요
```

퍼센트만 표시하지 않는다. 사용자가 적합도의 의미를 오해할 수 있기 때문이다.

### 실측 차이

```text
가슴 +1.0cm
어깨 -0.5cm
총장 +2.0cm
소매 +0.3cm
```

원칙:

- `+`는 기준 옷보다 큼
- `-`는 기준 옷보다 작음
- 절댓값 `0.5cm` 이하는 `거의 같음`으로 표시 가능
- 수치 옆에 반드시 `cm` 또는 표의 단위 안내 제공
- 좋고 나쁨을 색으로 판단하지 않는다.

---

## 14. 상품 상세 비교

별도 상품 상세 페이지를 만들지 않아도 된다.

MVP에서는 카드의 `상세 비교` 버튼을 누르면 desktop은 side panel, mobile은 bottom sheet를 사용한다.

### 상세 정보

- 상품 이미지
- 브랜드
- 상품명
- 추천 사이즈
- 적합도 설명
- 기준 옷 실측
- 추천 상품 실측
- 항목별 차이
- 해당 차이가 착용감에 미치는 의미
- 외부 판매처 링크
- 데이터 출처와 수집일

### 비교 테이블

| 항목 | 기준 옷 | 추천 상품 | 차이 |
|---|---:|---:|---:|
| 어깨 | 48.0 | 47.5 | -0.5 |
| 가슴 | 55.0 | 56.0 | +1.0 |
| 총장 | 70.0 | 72.0 | +2.0 |
| 소매 | 22.0 | 22.5 | +0.5 |

숫자만 보여주지 말고 아래에 자연어 해설을 추가한다.

```text
가슴은 거의 비슷하고, 총장은 기준 옷보다 약간 깁니다.
```

---

## 15. 버튼

### Primary

- 배경: 검정
- 글자: 흰색
- 높이: 50~54px
- radius: 8px
- 사용:
  - 30초 만에 사이즈 찾기
  - 다음
  - 결과 보기
  - 선택 적용

### Accent

- 배경: 라임
- 글자: 검정
- 높이: 50px
- 사용:
  - 선택 완료를 명확히 보여줄 때
  - 결과 상품 개수를 포함한 적용 버튼
  - 핵심 적합도 행동

Primary와 Accent를 한 화면에서 동일한 강도로 동시에 사용하지 않는다.

### Secondary

- 흰색 또는 투명 배경
- 검정 글자
- 1px 테두리
- 사용:
  - 이전
  - 다시 설정
  - 상세 비교
  - 실측표 직접 입력

### External Link

`판매처에서 보기`는 내부 구매 버튼처럼 보이면 안 된다.

- 높이: 38~44px
- outline
- 외부 링크 아이콘
- 새 탭 이동 시 명확한 label
- `장바구니 담기`와 같은 문구 사용 금지

---

## 16. 반응형

### Desktop — 1280px 이상

- 헤더 72px
- Hero 620px 이상
- 랜딩 h1 56px
- 과정 shell 최대 960px
- 결과 4열
- 상세 비교는 우측 side panel
- 결과 toolbar는 한 줄

### Tablet — 744~1023px

- 헤더 64px
- Hero headline 44px
- 과정 shell 좌우 16px
- 결과 3열
- 브랜드 필터는 dropdown 또는 drawer
- 상세 비교는 너비 480px drawer

### Mobile — 390~743px

- 헤더 56px
- Hero headline 36px
- Hero CTA 100%
- 브랜드 marquee 유지
- 단계 shell radius 0~12px
- 결과 2열
- 결과 toolbar는 `브랜드`, `조건`, `정렬` 3개 compact button
- 상세 비교는 90vh bottom sheet
- 하단 장바구니 내비게이션 없음
- 필요 시 단계 화면에만 하단 `다음` 버튼 고정

### Compact — 390px 미만

- h1 32px
- 결과 2열 유지
- 상품 카드 gap 4px
- 측정 chip은 1개 행만 표시
- 긴 설명은 상세 sheet로 이동
- 주요 버튼 최소 높이 48px

---

## 17. 인터랙션

### 검색

- 입력 후 150~250ms debounce
- 결과를 브랜드와 상품으로 그룹화
- 키보드 위·아래 탐색 지원
- Enter 선택
- 검색 결과가 없으면 실측표 입력 유도
- “반팔티만 지원” 안내를 input 근처에 고정

### 기준 옷 선택

- 카드 클릭 즉시 선택
- 체크 표시와 border 변화
- 최대 5개 제한
- 첫 번째 옷은 `주 기준`으로 표시
- 여러 옷을 선택하면 평균 또는 가중 기준 사용 방식을 설명

### 결과 로딩

일반적인 spinner만 보여주지 않는다.

```text
브랜드별 실측을 비교하고 있어요.
가슴 · 어깨 · 총장 · 소매를 기준으로 찾는 중
```

Skeleton:

- 이미지 비율 4:5 유지
- 텍스트 4줄
- 적합도 badge placeholder

### Motion

- 선택·필터: 120~180ms
- 진행 바: 220ms
- drawer·sheet: 240~300ms
- easing: `cubic-bezier(0.2, 0, 0, 1)`
- 카드 hover scale 최대 1.005
- 그리드 위치가 움직이는 animation 금지
- `prefers-reduced-motion` 지원

---

## 18. 접근성

- 기본 글자 대비 WCAG AA 4.5:1 이상
- 라임 위에는 검정 글자만 사용
- 작은 11px 글자는 보조 정보에만 사용
- 적합도를 색상만으로 구분하지 않음
- 모든 아이콘 버튼에 `aria-label`
- 검색 자동완성에 combobox role 적용
- 단계 변경 시 제목으로 focus 이동
- 오류 발생 시 input과 오류 문구 연결
- bottom sheet에 focus trap
- ESC로 overlay 닫기
- 실측표의 행·열 header를 정확하게 제공
- 외부 판매처 링크임을 텍스트와 아이콘으로 안내

---

## 19. 빈 상태와 오류

### 검색 결과 없음

```text
아직 이 상품의 실측 정보가 없어요.

사이즈표를 붙여넣으면
같은 방식으로 비교할 수 있습니다.

[사이즈표 붙여넣기]
```

### 추천 결과 없음

```text
현재 조건과 가까운 상품을 찾지 못했어요.

허용 오차를 1cm 넓히거나
중요하게 보는 치수를 바꿔보세요.
```

### 데이터 불확실

```text
이 상품은 실측 정보가 오래되었거나
판매처별 수치가 다를 수 있어요.
```

### 시스템 오류

사용자가 선택한 기준 옷을 유지하고 재시도할 수 있게 한다.

```text
비교 중 문제가 생겼어요.
선택한 옷은 그대로 저장되어 있습니다.

[다시 시도]
```

---

## 20. 페이지별 적용 요약

### 랜딩

- 카피 중심
- 주 CTA 1개
- 지원 브랜드 marquee
- 작동 방식 3단계
- 현재 지원 범위
- 로그인
- 푸터

### 사이즈 번역

- 진행 상태
- 브랜드·상품 검색
- 기준 사이즈
- 핏 선호
- 실측표 fallback
- 이전·다음

### 결과

- 기준 옷 요약
- 적합도 중심 정렬
- 브랜드·오차 범위 필터
- 4/3/2열 상품 목록
- 상세 비교 drawer/sheet
- 외부 판매처 링크

### 제공하지 않는 페이지

- 카테고리 목록
- 랭킹
- 세일
- 기획전
- 장바구니
- 주문
- 결제

---

## 21. Tailwind 구현 참고

### 색상

```ts
const colors = {
  primary: '#141414',
  primarySoft: '#2a2a28',
  accent: '#c8ff3d',
  accentActive: '#aee525',
  accentSoft: '#efffc7',
  focus: '#5367ff',
  ink: '#141414',
  body: '#353532',
  muted: '#71716b',
  canvas: '#f6f6f0',
  surface: '#ffffff',
  soft: '#efefe8',
  hairline: '#deded6',
  hairlineStrong: '#bdbdb4',
};
```

### Breakpoints

```ts
const screens = {
  compact: '360px',
  mobile: '390px',
  tablet: '744px',
  desktop: '1024px',
  wide: '1280px',
  max: '1440px',
};
```

### 결과 그리드

```tsx
<div
  className="
    grid grid-cols-2 gap-x-2 gap-y-6 px-2
    min-[744px]:grid-cols-3 min-[744px]:gap-3 min-[744px]:px-4
    min-[1024px]:grid-cols-4
    min-[1280px]:mx-auto min-[1280px]:max-w-[1280px]
    min-[1280px]:gap-4 min-[1280px]:px-6
  "
>
  {/* size-match product cards */}
</div>
```

### 상품 이미지

```tsx
<div className="relative aspect-[4/5] overflow-hidden rounded-t-sm bg-[#efefe8]">
  <img
    src={imageUrl}
    alt={`${brand} ${productName}`}
    className="h-full w-full object-cover"
  />
</div>
```

### 실측 차이

```tsx
<div className="flex flex-wrap gap-1.5">
  <span className="rounded-sm bg-[#efefe8] px-2 py-1 text-xs">
    가슴 +1.0cm
  </span>
  <span className="rounded-sm bg-[#efefe8] px-2 py-1 text-xs">
    어깨 -0.5cm
  </span>
</div>
```

---

## 22. 최종 원칙

### 반드시 유지

- 반팔티 단일 품목
- 기준 옷 중심의 검색
- 적합도와 추천 사이즈 우선
- 실측 차이를 쉽게 비교
- 한 화면 한 행동
- 모바일 2열 결과
- 외부 판매처 연결

### 반드시 제거

- 카테고리 내비게이션
- 랭킹
- 세일
- 쿠폰
- 장바구니
- 결제
- 일반 쇼핑몰식 복잡한 헤더
- 구매량을 인기 순위처럼 강조하는 UI

### 디자인 판단 기준

새 요소를 추가하기 전에 다음 질문을 확인한다.

> 이 요소가 사용자가 자신의 기준 반팔티와 비슷한 상품을 더 빠르고 정확하게 찾는 데 직접 도움이 되는가?

답이 아니라면 이번 MVP에서는 넣지 않는다.

---

## Sources & Basis

- 서비스 구조 참고: https://bootcamp.askewly.com/
- 기존 상품 목록 디자인 분석 문서: `MUSINSA_PRODUCT_LIST_DESIGN_SPEC.md`
- 디자인 참고 범위: 정보 밀도, 상품 카드 위계, 그리드, 필터 및 반응형 축소 방식
- 제외 범위: 무신사 로고, 고유 문구, 상품 이미지, 아이콘, 카테고리, 랭킹, 세일, 장바구니
- 본 문서의 색상·간격·폰트 수치는 너비 MVP에 적용하기 위한 독자적인 제안값이며 원 사이트의 공식 디자인 토큰이 아니다.
