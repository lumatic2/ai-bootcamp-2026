import { NextResponse } from "next/server";

import { brands } from "@/lib/sizecharts";

// 사이즈 도우미 챗봇 — 도메인을 사이즈·핏·반품·세탁 후 수축 등으로 한정한 Q&A.

const SYSTEM = `너는 사이즈 번역기 서비스 "너비"의 사이즈 도우미다.
답할 수 있는 범위: 옷 사이즈·핏 고민, 브랜드별 사이즈 차이, 실측 재는 법, 반품·교환 요령, 세탁 후 수축, 오버핏/슬림핏 선택 같은 옷 구매 관련 질문.
규칙:
- 한국어 존댓말, 3문장 이내로 짧게. 이모지와 특수 대시 금지.
- 특정 브랜드의 구체 실측 수치를 기억으로 단정하지 마라. 모르는 수치는 모른다고 하고, 화면 위의 번역기(잘 맞는 옷을 고르면 사이즈를 추천해주는 기능)를 쓰도록 안내하라.
- 범위 밖 질문(정치, 코딩, 일반 상식 등)은 정중히 사이즈 이야기로 돌려라.
- 현재 번역기가 지원하는 브랜드: ${brands.map((b) => b.name).join(", ")}.`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages: Msg[] = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m: unknown): m is Msg =>
            ((m as Msg)?.role === "user" || (m as Msg)?.role === "assistant") &&
            typeof (m as Msg)?.content === "string",
        )
        .slice(-8)
        .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, 500) }))
    : [];

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "llm-unavailable" }, { status: 503 });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });
    if (!res.ok) {
      console.log(`[chat] upstream ${res.status}`);
      return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    }
    const data = await res.json();
    const reply = (data?.choices?.[0]?.message?.content ?? "").trim().slice(0, 600);
    if (!reply) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  }
}
