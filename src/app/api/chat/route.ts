import { NextResponse } from "next/server";

import { brands, getBrand } from "@/lib/sizecharts";
import { translate, TranslateError, type Anchor } from "@/lib/translate";

export const maxDuration = 60;

// 사이즈 도우미 챗봇. 도메인은 사이즈·핏·반품으로 한정하고,
// 사용자가 브랜드와 사이즈를 말하면 실제 번역 엔진을 함수로 호출해 답한다 (function calling).

const SYSTEM = `너는 사이즈 번역기 서비스 "너비"의 사이즈 도우미다.
답할 수 있는 범위: 옷 사이즈·핏 고민, 브랜드별 사이즈 차이, 실측 재는 법, 반품·교환 요령, 세탁 후 수축, 오버핏/슬림핏 선택 같은 옷 구매 관련 질문.
규칙:
- 한국어 존댓말, 3문장 이내로 짧게. 이모지와 특수 대시 금지.
- 사용자가 "잘 맞는 브랜드+사이즈"와 "사려는 브랜드"를 말하면 translate_size 함수를 호출해 실제 추천을 받아 답하라. 함수 결과의 수치만 인용하고 새 숫자를 만들지 마라.
- 지원 목록에 없는 브랜드면 함수를 부르지 말고, 화면의 번역기에서 "AI로 사이즈표 가져오기"를 쓰라고 안내하라.
- 특정 브랜드의 구체 실측 수치를 기억으로 단정하지 마라.
- 범위 밖 질문(정치, 코딩, 일반 상식 등)은 정중히 사이즈 이야기로 돌려라.
- 지원 브랜드: ${brands.map((b) => b.name).join(", ")}.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "translate_size",
      description:
        "잘 맞는 옷(브랜드+사이즈, 여러 벌 가능)을 기준으로 사려는 브랜드의 추천 사이즈를 계산한다. 브랜드는 한국어 이름 그대로.",
      parameters: {
        type: "object",
        properties: {
          anchors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                brandName: { type: "string", description: "잘 맞는 옷의 브랜드 한국어 이름" },
                size: { type: "string", description: "그 옷의 사이즈 라벨 (예: M, 100, L (100))" },
              },
              required: ["brandName", "size"],
            },
          },
          targetBrandName: { type: "string", description: "사려는 브랜드 한국어 이름" },
        },
        required: ["anchors", "targetBrandName"],
      },
    },
  },
];

function resolveBrand(name: string) {
  const n = name.trim().toLowerCase();
  return (
    brands.find((b) => b.name.toLowerCase() === n) ??
    brands.find((b) => b.name.toLowerCase().includes(n) || n.includes(b.name.toLowerCase()))
  );
}

function resolveSize(brandId: string, size: string) {
  const b = getBrand(brandId);
  if (!b) return null;
  const s = size.trim().toLowerCase();
  return (
    b.sizes.find((r) => r.label.toLowerCase() === s) ??
    b.sizes.find((r) => r.label.toLowerCase().startsWith(s) || r.label.toLowerCase().includes(s))
  );
}

function runTranslateTool(args: {
  anchors?: { brandName?: string; size?: string }[];
  targetBrandName?: string;
}): string {
  const anchors: Anchor[] = [];
  for (const a of args.anchors ?? []) {
    const brand = a.brandName ? resolveBrand(a.brandName) : undefined;
    if (!brand) return JSON.stringify({ error: `"${a.brandName}" 브랜드는 지원 목록에 없음` });
    const row = a.size ? resolveSize(brand.id, a.size) : undefined;
    if (!row)
      return JSON.stringify({
        error: `${brand.name}에 "${a.size}" 사이즈 없음. 있는 라벨: ${getBrand(brand.id)!.sizes.map((s) => s.label).join(", ")}`,
      });
    anchors.push({ brandId: brand.id, size: row.label });
  }
  const target = args.targetBrandName ? resolveBrand(args.targetBrandName) : undefined;
  if (!target) return JSON.stringify({ error: `"${args.targetBrandName}" 브랜드는 지원 목록에 없음` });
  try {
    const r = translate(anchors, target.id);
    console.log(`[chat-tool] ${anchors.map((a) => a.brandId + "/" + a.size).join("+")} -> ${target.id} = ${r.recommended}`);
    return JSON.stringify({
      recommended: r.recommended,
      confidence: r.confidence,
      runnerUp: r.runnerUp,
      targetBrand: r.targetBrandName,
      targetProduct: r.targetProduct,
      deltas: r.deltas,
    });
  } catch (e) {
    return JSON.stringify({ error: e instanceof TranslateError ? e.code : "translate-failed" });
  }
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const history: Msg[] = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m: unknown): m is Msg =>
            ((m as Msg)?.role === "user" || (m as Msg)?.role === "assistant") &&
            typeof (m as Msg)?.content === "string",
        )
        .slice(-8)
        .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, 500) }))
    : [];

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "llm-unavailable" }, { status: 503 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [{ role: "system", content: SYSTEM }, ...history];

    for (let round = 0; round < 3; round++) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-5.4-mini", messages, tools: TOOLS }),
      });
      if (!res.ok) {
        console.log(`[chat] upstream ${res.status}`);
        return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
      }
      const data = await res.json();
      const msg = data?.choices?.[0]?.message;
      if (!msg) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });

      if (Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
        messages.push(msg);
        for (const call of msg.tool_calls.slice(0, 3)) {
          let toolResult = JSON.stringify({ error: "unknown-tool" });
          if (call?.function?.name === "translate_size") {
            try {
              toolResult = runTranslateTool(JSON.parse(call.function.arguments ?? "{}"));
            } catch {
              toolResult = JSON.stringify({ error: "bad-arguments" });
            }
          }
          messages.push({ role: "tool", tool_call_id: call.id, content: toolResult });
        }
        continue;
      }

      const reply = (msg.content ?? "").trim().slice(0, 600);
      if (!reply) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
      return NextResponse.json({ reply });
    }
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  }
}
