# 몰-너비 연동 계약: 인터페이스 문서

> 대상 독자: 데모 쇼핑몰을 만드는 팀원. 이 문서에 적힌 대로 링크만 걸면 연동이 끝난다.
> 너비 배포 주소: `https://bootcamp.askewly.com`

## 개요

너비(사이즈 번역기)와 데모 쇼핑몰은 별도 배포된 두 독립 서비스다. API 호출이나 CORS 설정 없이 URL 링크 두 개로만 연결한다.

- 몰 → 너비: 상품 페이지의 "내 사이즈로 확인" 버튼이 너비로 딥링크한다.
- 너비 → 몰: 너비 결과 화면의 "판매처에서 보기" 버튼이 몰 상품 페이지로 이동한다.

두 방향 모두 GA4 이벤트가 찍혀, 발표 때 실시간(Realtime) 화면으로 유입·유출을 동시에 보여줄 수 있다.

## 1. 몰 → 너비 딥링크

요청 URL: `https://bootcamp.askewly.com/?target=<brandId>#translate`

- `brandId`는 아래 브랜드 id 표의 값을 그대로 넣는다 (예: `covernat`).
- 이 링크로 진입하면 너비가 해당 브랜드를 "사려는 브랜드"로 미리 선택한 채 Step 1(잘 맞는 옷 입력)부터 시작한다.
- 몰이 다루지 않는 브랜드에는 이 링크를 걸지 않는다.

| 이벤트 | 발화 시점 | 파라미터 |
|---|---|---|
| `mall_referral` | `?target=` 파라미터로 진입한 순간 | `target` (brandId) |

몰 상품 페이지 버튼 권장 사양: 문구 "이 브랜드, 내 사이즈로 확인", 외부 링크 아이콘, `target="_blank"`.

## 2. 너비 → 몰

너비 결과 화면의 "판매처에서 보기" 버튼은 `src/data/size-charts.json`의 `brands[].url`로 새 탭 이동한다. 몰이 다루는 브랜드에 한해 이 `url`을 몰 상품 페이지 URL로 교체하면 그대로 연동된다. 몰 쪽 별도 작업은 없다.

예시 diff (`size-charts.json`, `covernat`을 몰 상품 페이지로 연결):

```diff
     "id": "covernat",
     "name": "커버낫",
-    "url": "https://www.musinsa.com/products/1943792",
+    "url": "https://<데모몰-도메인>/products/covernat-cool-cotton-tee",
```

| 이벤트 | 발화 시점 | 파라미터 |
|---|---|---|
| `outbound_click` | "판매처에서 보기" 클릭 순간 | `target_brand` (brandId), `url_host` (이동 URL의 host) |

## 3. GA 측정

`mall_referral`(유입)과 `outbound_click`(유출)을 합치면 몰 → 너비 → 몰 왕복 퍼널을 볼 수 있다. 발표 중 GA4 Realtime 보고서를 띄워두고 관객이 실제로 왕복하는 장면을 보여주면 측정이 살아 있음을 그 자리에서 증명할 수 있다.

## 4. 주의사항

- 몰은 너비와 완전히 별도 배포다. API 연동, CORS 설정, 인증 공유가 전부 필요 없다.
- 연동은 URL 링크 두 개(딥링크 파라미터 + 상품 URL 교체)로 끝난다.
- `brandId`는 대소문자·하이픈까지 정확히 일치해야 한다. 표에 없는 값이면 너비가 브랜드 미선택 상태로 시작한다.

## 5. 브랜드 id 표

`src/data/size-charts.json`의 `brands[].id` 전체 목록이다.

| id | 브랜드명 | id | 브랜드명 |
|---|---|---|---|
| `musinsa-standard` | 무신사 스탠다드 | `brand-654` | 그루브라임 |
| `covernat` | 커버낫 | `brand-283` | 마인드브릿지 |
| `spao` | 스파오 | `brand-652` | 브랜디드 |
| `markgonzales` | 마크곤잘레스 | `brand-75` | 노티카 |
| `yale` | 예일 | `brand-212` | 비바라비다 |
| `stussy` | 스투시 | `brand-793` | 메종미네드 |
| `thisisneverthat` | 디스이즈네버댓 | `brand-51` | 디미트리블랙 |
| `adidas` | 아디다스 | `brand-424` | 락케이크 |
| `thenorthface` | 노스페이스 | `brand-744` | 블루잉 |
| `filluminate` | 필루미네이트 | `brand-844` | 바이모노 |
| `compagno` | 꼼파뇨 | `brand-255` | 아웃스탠딩 |
| `xiaoxiko` | 시아오시코 | `brand-783` | 퍼스텝 |
| `snowpeak` | 스노우피크 어패럴 | `brand-705` | 아페쎄 |
| `alvinclo` | 앨빈클로 | `brand-350` | 그라픽 |
| `travel` | 트래블 | `brand-245` | 아모우 |
| `milo-archive` | 밀로 아카이브 | `brand-19` | 노드유 |
| `yosemite` | 요세미티 | `brand-292` | 썬러브 |
| `gildan` | 길단 | `brand-853` | 드로우핏 |
| `champion` | 챔피온 | `brand-827` | 마하그리드 |
| `creegan` | 크리건 | `brand-835` | 미나브 |
| `barbour` | 바버 | `613` | 613서울 |
| `leare` | 르아르 | | |
| `brand-939` | 맥우드건 | | |
| `brand-412` | 도톤 | | |
| `brand-977` | 엑스오엑스 | | |
| `brand-525` | 더마일 | | |
| `brand-973` | 데이 | | |

## 6. 데모 시나리오 (발표 순서 제안)

1. GA4 Realtime 보고서를 발표 화면 한쪽에 띄워둔다.
2. 몰 상품 페이지(예: 커버낫)에서 "이 브랜드, 내 사이즈로 확인" 클릭 → 너비가 커버낫을 미리 선택한 채 시작. Realtime에 `mall_referral` 표시.
3. 자기 옷 사이즈를 입력해 결과까지 도달한다.
4. 결과 화면의 "판매처에서 보기" 클릭 → 몰 상품 페이지로 복귀. Realtime에 `outbound_click` 표시.
5. 왕복 퍼널이 실시간으로 잡힌다는 걸 결론으로 정리한다.

## 7. 체크리스트

- [ ] 몰 상품 페이지에 "이 브랜드, 내 사이즈로 확인" 버튼 추가 (외부 링크 아이콘 + 새 탭)
- [ ] 버튼 href를 `https://bootcamp.askewly.com/?target=<brandId>#translate` 형식으로 연결
- [ ] 몰이 다루는 각 브랜드의 `brandId`를 5번 표에서 정확히 확인
- [ ] 몰이 다루는 브랜드에 한해 `size-charts.json`의 `url`을 몰 상품 페이지로 교체 (너비 쪽 작업)
- [ ] GA4 Realtime에서 `mall_referral`, `outbound_click` 두 이벤트가 모두 찍히는지 발표 전 리허설
