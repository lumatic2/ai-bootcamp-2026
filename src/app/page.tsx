import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Translator } from "@/components/translator";

export default function Home() {
  return (
    <main>
      <header className="border-b bg-card">
        <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              너비
            </span>
            <div>
              <p className="text-sm font-semibold">너비 — 사이즈 번역기</p>
              <p className="font-mono text-[0.65rem] text-muted-foreground">
                SIZE IS A RELATION, NOT A NUMBER
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="eyebrow mb-4 text-evidence">첫 브랜드 구매의 사이즈 도박, 끝</p>
          <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            줄자 없이,
            <br />
            <span className="text-muted-foreground">잘 맞는 옷 하나로</span> 사이즈를 번역합니다.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            같은 &lsquo;M&rsquo;이라도 브랜드마다 가슴단면이 5cm까지 다릅니다. 내 실측 치수를 몰라도
            돼요 — 지금 잘 맞는 브랜드와 사이즈만 고르면, 처음 사는 브랜드의 사이즈를 실측
            데이터와 리뷰 신호로 알려드립니다.
          </p>
          <div className="mt-7">
            <Button className="h-10 px-4" size="lg" nativeButton={false} render={<a href="#translate" />}>
              30초 만에 번역하기
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      <Translator />

      <footer className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>너비 · AI Vibe Coding Bootcamp 2026 MVP</p>
        <p className="font-mono">HYPOTHESIS → BUILD → MEASURE → LEARN</p>
      </footer>
    </main>
  );
}
