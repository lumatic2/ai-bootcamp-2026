"use client";

import { House } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

// 홈 = 페이지 이동이 아니라 최상단 스크롤 — 사용자가 고른 기준 옷 상태를 보존한다 (팀 피드백 2026-07-16)
function scrollHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function HeaderLogoHome() {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={scrollHome}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollHome();
        }
      }}
      className="flex cursor-pointer items-center gap-3"
    >
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
    </div>
  );
}

export function HomeButton() {
  return (
    <Button variant="ghost" size="sm" onClick={scrollHome} aria-label="홈으로" className="gap-1.5">
      <House className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">홈</span>
    </Button>
  );
}
