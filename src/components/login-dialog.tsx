"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// 데모 껍데기 — 실제 인증 없음. 정식 버전에서 잘 맞는 옷 프로필을 저장하는 자리.
export function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSubmitted(false);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-9 font-mono text-xs tracking-[0.12em]">
            LOGIN
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>너비에 로그인</DialogTitle>
          <DialogDescription>
            잘 맞는 옷 프로필을 저장해두면, 다음부터 바로 번역해 드려요.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <p className="rounded-md border border-success/40 bg-success/5 p-4 text-center text-sm text-success">
            데모 기간에는 로그인 없이 모든 기능을 쓸 수 있어요. 그대로 이용해 주세요!
          </p>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => setSubmitted(true)}
            >
              <svg viewBox="0 0 24 24" className="mr-2 size-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3a7.19 7.19 0 0 1-10.8-3.78H1.28v3.1A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.3a7.22 7.22 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l3.99-3.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.98 11.98 0 0 0 1.28 6.6l3.99 3.1A7.17 7.17 0 0 1 12 4.75Z"
                />
              </svg>
              구글로 계속하기
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-transparent bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90"
              onClick={() => setSubmitted(true)}
            >
              카카오로 계속하기
            </Button>
            <p className="pt-1 text-center text-xs text-muted-foreground">
              데모 버전이라 계정 없이도 모든 기능을 쓸 수 있어요.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
