import { ArrowDown } from "lucide-react";
import Image from "next/image";

import { BrandMarquee } from "@/components/brand-marquee";
import { brands } from "@/lib/sizecharts";
import { Button } from "@/components/ui/button";
import { HeaderLogoHome } from "@/components/header-home";
import { LoginDialog } from "@/components/login-dialog";
import { RotatingLabel } from "@/components/rotating-label";
import { SizeChat } from "@/components/size-chat";
import { Translator } from "@/components/translator";

export default function Home() {
  return (
    <main>
      <header className="border-b bg-background">
        <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-between px-5 sm:px-8">
          <HeaderLogoHome />
          <LoginDialog />
        </div>
      </header>

      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-16">
          <p className="eyebrow mb-4 inline-block rounded-xs bg-signal px-2 py-1">
            처음 보는 브랜드도 내 사이즈로
          </p>
          <h1 className="text-3xl leading-[1.15] font-extrabold tracking-[-0.04em] text-balance sm:text-5xl">
            내 사이즈는 <RotatingLabel />,
            <br />
            <span className="text-muted-foreground">다른 브랜드에서는 뭘까요?</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            줄자 없이, 잘 맞는 옷 하나만 고르세요.
            <br />
            나머지는 너비가 찾아드려요.
          </p>
          <div className="mt-7">
            <Button
              className="h-[54px] gap-2 px-6 has-data-[icon=inline-end]:pr-6 text-base"
              size="lg"
              nativeButton={false}
              render={<a href="#translate" />}
            >
              30초 만에 번역하기
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <div className="mt-10 bg-primary">
          <BrandMarquee />
        </div>
        <p className="py-3 text-center text-xs text-muted-foreground">
          현재 반팔티 {brands.length}개 브랜드의 실측 데이터를 지원합니다
        </p>
      </section>

      <Translator />

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Image
                  src="/images/logo-nubi-mark.png"
                  alt="너비 로고"
                  width={512}
                  height={512}
                  className="h-6 w-auto"
                />
                사이즈 번역기
              </p>
              <p className="mt-3 text-xs leading-5 text-primary-foreground/60">
                사이즈는 숫자가 아니라 관계라고 믿습니다. 잘 맞는 옷 한 벌이 가장 정확한
                줄자입니다.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary-foreground/50 uppercase">
                지금 되는 것
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-primary-foreground/60">
                <li>반팔 티셔츠 {brands.length}개 브랜드 번역</li>
                <li>없는 브랜드는 AI 웹 검색·붙여넣기로</li>
                <li>사이즈 도우미 챗봇</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary-foreground/50 uppercase">
                만드는 사람들
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-primary-foreground/60">
                <li>AI Vibe Coding Bootcamp 2026</li>
                <li>실측 데이터: 무신사 공개 실측표</li>
                <li>피드백은 결과 화면의 버튼으로</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t border-primary-foreground/15 pt-5 text-center font-mono text-[0.65rem] text-primary-foreground/50">
            HYPOTHESIS → BUILD → MEASURE → LEARN · 너비 2026
          </p>
        </div>
      </footer>

      <SizeChat />
    </main>
  );
}
