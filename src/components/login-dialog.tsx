"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <Button variant="outline" size="sm" className="h-9">
            <LogIn data-icon="inline-start" /> 로그인
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
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-email">이메일</Label>
              {/* 데모 껍데기: 자동완성 차단 — 비밀번호 관리자가 실제 크레덴셜을 채우지 않도록 */}
              <Input id="login-email" type="email" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">비밀번호</Label>
              <Input id="login-password" type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>
            <Button type="submit" className="h-10 w-full">
              로그인
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90"
              onClick={() => setSubmitted(true)}
            >
              카카오로 3초 만에 시작
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              데모 버전이라 계정 없이도 모든 기능을 쓸 수 있어요.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
