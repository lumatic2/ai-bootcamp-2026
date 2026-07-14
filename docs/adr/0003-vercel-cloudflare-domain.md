# ADR 0003 — 발표용 Vercel 호스팅과 Cloudflare DNS

- 상태: Accepted
- 날짜: 2026-07-14

## 맥락

3일 부트캠프의 데모는 안정적인 공개 URL이 필요하다. 팀의 Next.js 앱은 Vercel의 빠른 Git 연동과 Preview 배포를 활용하고, `askewly.com` 서브도메인의 DNS는 기존 Cloudflare zone에서 관리한다.

## 결정

발표용 앱은 Vercel 프로젝트에 배포한다. 최종 공개 주소는 `bootcamp.askewly.com`으로 정하고, Vercel이 제시하는 대상에 Cloudflare DNS CNAME을 연결한다. Cloudflare Workers/Pages는 이번 기본 경로에서 제외하되, 정적 산출물만 필요해지는 경우의 대안으로 남긴다.

## 근거

- Next.js와 Vercel의 배포 경로는 팀이 가장 빨리 데모를 공개하고 Preview를 공유할 수 있는 기본 조합이다.
- Cloudflare가 `askewly.com` DNS를 계속 소유하므로 서브도메인과 향후 서비스의 도메인 관리를 한곳에서 유지한다.
- 이미 Cloudflare OAuth 인증 및 zone 조회 권한을 확인해, Vercel 프로젝트가 준비되면 DNS 연결을 실행할 수 있다.

## 결과

- 실제 연결 순서는 Vercel 프로젝트 생성 → Vercel custom domain 등록 → Cloudflare CNAME 생성 → HTTPS와 공개 URL smoke 확인이다.
- 팀의 제품명과 무관하게 이번 발표 URL은 `bootcamp.askewly.com`을 사용한다. 다른 이름이 필요하면 이 ADR을 supersede한다.
- CNAME 대상 값은 Vercel 프로젝트가 생성된 뒤 대시보드가 제공하는 값만 사용한다.
