# FORME Store

독자적인 패션 커머스 데모다. 특정 쇼핑몰의 로고, 상표, 상품 이미지, 문구, 아이콘을 복제하지 않고 고밀도 상품 탐색 구조만 참고해 구현했다.

## 기술 스택

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 방식의 Button, Input, Badge, Checkbox, Sheet, Separator
- Radix UI primitives
- Lucide icons

## 페이지

- `/` 메인 페이지
- `/products` 상품 목록 페이지
- `/products/[id]` 상품 상세 페이지
- `/search?q=셔츠` 검색 결과 페이지
- `/cart` 장바구니 페이지

## 실행

```bash
npm install
npm run dev
```

프로덕션 확인:

```bash
npm run build
npm start
```

## 주요 기능

- 데스크톱 고정 필터 / 태블릿·모바일 필터 Sheet
- 추천순, 신상품순, 판매순, 가격순, 할인율순 정렬
- 검색어 기반 상품 필터링
- 옵션 선택 및 장바구니 저장(localStorage)
- 수량 변경 및 삭제
- 5열 / 3열 / 2열 반응형 상품 그리드
- 모바일 상품 이미지 가로 스냅 갤러리
- 모바일 구매·주문 고정 CTA
