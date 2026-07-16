"use client";

import { Download, Share, SquarePlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplay() {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// 안드로이드/데스크톱 Chrome은 beforeinstallprompt로 네이티브 설치, iOS Safari는
// 그런 API 자체가 없어 공유 시트 안내로 대신한다 (애플 정책상 우회 불가).
export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay()) return;

    const iosDevice = isIos();
    setIos(iosDevice);
    if (iosDevice) {
      setVisible(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (!visible) return null;

  async function handleClick() {
    if (ios) {
      setShowIosGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        aria-label="앱 설치"
        className="gap-1.5"
      >
        <Download className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">앱 설치</span>
      </Button>

      <Dialog open={showIosGuide} onOpenChange={setShowIosGuide}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>홈 화면에 추가하기</DialogTitle>
            <DialogDescription>
              iPhone은 브라우저 공유 메뉴에서 직접 추가해야 해요.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-3 text-sm leading-6">
            <li className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-xs font-bold">
                1
              </span>
              하단 <Share className="mx-1 inline size-4" aria-hidden="true" /> 공유 버튼을
              탭하세요.
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-xs font-bold">
                2
              </span>
              목록에서{" "}
              <SquarePlus className="mx-1 inline size-4" aria-hidden="true" />
              &nbsp;&quot;홈 화면에 추가&quot;를 찾아 탭하세요.
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-xs font-bold">
                3
              </span>
              오른쪽 위 &quot;추가&quot;를 탭하면 완료돼요.
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
