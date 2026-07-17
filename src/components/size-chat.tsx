"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowUp, MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const GREETING: Msg = {
  role: "assistant",
  content:
    "안녕하세요, 너비 사이즈 도우미예요. 사이즈나 핏 고민, 반품 요령 같은 걸 물어보세요. 정확한 사이즈 추천은 위의 번역기를 쓰시면 돼요.",
};

const CONNECTION_ERROR = "잠시 연결이 원활하지 않아요. 조금 뒤에 다시 물어봐 주세요.";

export function SizeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: CONNECTION_ERROR, error: true }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: CONNECTION_ERROR, error: true }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-20 z-50 flex h-[min(28rem,72dvh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-card shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b bg-primary px-4 py-3 text-primary-foreground">
            <p className="text-sm font-semibold break-keep">사이즈 도우미</p>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="-mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto p-4" role="log" aria-relevant="additions">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex max-w-[85%] items-start gap-1.5 rounded-lg px-3.5 py-2.5 text-sm leading-6 break-keep ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : m.error
                      ? "border border-destructive/30 bg-destructive/5 text-destructive"
                      : "bg-muted text-foreground"
                }`}
              >
                {m.error && <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />}
                <span>{m.content}</span>
              </div>
            ))}
            {busy && (
              <div
                role="status"
                className="flex max-w-[85%] items-center gap-1.5 rounded-lg bg-muted px-3.5 py-3"
              >
                <span className="sr-only">답변을 쓰는 중</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none" />
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            className="flex gap-2.5 border-t p-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="사이즈 고민을 물어보세요"
              className="h-11"
            />
            <Button type="submit" size="icon" className="size-11 shrink-0" disabled={busy || !input.trim()} aria-label="보내기">
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}
      {showScrollTop && !open && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed right-4 bottom-20 z-50 flex size-11 items-center justify-center rounded-full border bg-card text-foreground shadow-lg outline-none ring-2 ring-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="사이즈·핏 질문하기"
        className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex h-13 items-center rounded-full bg-primary px-4 text-primary-foreground shadow-lg outline-none ring-2 ring-background shadow-[0_4px_12px_rgb(0_0_0/0.25)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? (
          <X className="size-5 shrink-0" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
        )}
        <span
          className="ml-2 max-w-[10rem] overflow-hidden text-sm font-medium whitespace-nowrap opacity-100 transition-[max-width,opacity,margin-left] duration-200 motion-reduce:transition-none sm:ml-0 sm:max-w-0 sm:opacity-0 sm:group-hover:ml-2 sm:group-hover:max-w-[10rem] sm:group-hover:opacity-100 sm:group-focus-visible:ml-2 sm:group-focus-visible:max-w-[10rem] sm:group-focus-visible:opacity-100"
        >
          사이즈·핏 질문하기
        </span>
      </button>
    </>
  );
}
