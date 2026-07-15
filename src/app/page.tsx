import { ArrowDown } from "lucide-react";

import { BrandMarquee } from "@/components/brand-marquee";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/login-dialog";
import { RotatingLabel } from "@/components/rotating-label";
import { SizeChat } from "@/components/size-chat";
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
              <p className="text-sm font-semibold">너비 · 사이즈 번역기</p>
              <p className="font-mono text-[0.65rem] text-muted-foreground">
                SIZE IS A RELATION, NOT A NUMBER
              </p>
            </div>
          </div>
          <LoginDialog />
        </div>
      </header>

      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-16">
          <p className="eyebrow mb-4 text-evidence">처음 보는 브랜드도 내 사이즈로</p>
          <h1 className="text-3xl leading-[1.2] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            내 사이즈는 <RotatingLabel />,
            <br />
            <span className="text-muted-foreground">브랜드마다 이름만 다릅니다</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            줄자 없이, 잘 맞는 옷 하나만 고르세요.
            <br />
            나머지는 너비가 찾아드려요.
          </p>
          <div className="mt-7">
            <Button className="h-10 px-4" size="lg" nativeButton={false} render={<a href="#translate" />}>
              30초 만에 번역하기
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pt-8 pb-2 sm:px-8">
          <BrandMarquee />
        </div>
      </section>

      <Translator />

      <footer className="border-t bg-card">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid size-6 place-items-center rounded bg-primary text-[0.6rem] font-bold text-primary-foreground">
                  너비
                </span>
                사이즈 번역기
              </p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                사이즈는 숫자가 아니라 관계라고 믿습니다. 잘 맞는 옷 한 벌이 가장 정확한
                줄자입니다.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                지금 되는 것
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li>반팔 티셔츠 48개 브랜드 번역</li>
                <li>리뷰 속 핏 신호 AI 분석</li>
                <li>없는 브랜드는 사이즈표 붙여넣기로</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                만드는 사람들
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li>AI Vibe Coding Bootcamp 2026</li>
                <li>실측 데이터: 무신사 공개 실측표</li>
                <li>피드백은 결과 화면의 버튼으로</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t pt-5 text-center font-mono text-[0.65rem] text-muted-foreground">
            HYPOTHESIS → BUILD → MEASURE → LEARN · 너비 2026
          </p>
        </div>
      </footer>

      <SizeChat />
    </main>
  );
}
