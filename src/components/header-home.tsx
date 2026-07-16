import Image from "next/image";

// 홈 = 로고 클릭 시 홈 새로고침 (팀 피드백 2026-07-16 — 별도 홈 버튼 제거, 로고가 홈 역할)
export function HeaderLogoHome() {
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- 의도된 풀 리로드: "홈 새로고침"이 요구사항 (Link는 소프트 내비게이션이라 상태가 남음)
    <a href="/" className="flex items-center gap-3" aria-label="홈으로 새로고침">
      <Image
        src="/images/logo-nubi-mark.png"
        alt="너비 로고"
        width={512}
        height={512}
        className="h-8 w-auto"
      />
      <div>
        <p className="text-sm font-semibold">너비 · 사이즈 번역기</p>
        <p className="font-mono text-[0.65rem] text-muted-foreground">
          SIZE IS A RELATION, NOT A NUMBER
        </p>
      </div>
    </a>
  );
}
