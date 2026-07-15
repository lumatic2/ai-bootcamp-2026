import { NextResponse } from "next/server";

// 결과 카드에 붙는 AI 한 줄 코멘트. 치수 차이를 사람 말로 풀어준다 (환각 방지: 준 숫자만 언급).

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const deltas = Array.isArray(body?.deltas) ? body.deltas.slice(0, 4) : null;
  const sourceLabel = typeof body?.sourceLabel === "string" ? body.sourceLabel.slice(0, 120) : "";
  const targetBrandName = typeof body?.targetBrandName === "string" ? body.targetBrandName.slice(0, 40) : "";
  const recommended = typeof body?.recommended === "string" ? body.recommended.slice(0, 20) : "";
  const confidence = typeof body?.confidence === "string" ? body.confidence : "";

  if (!deltas || !recommended || !targetBrandName) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "llm-unavailable" }, { status: 503 });

  const dimKo: Record<string, string> = { chest: "가슴단면", shoulder: "어깨너비", length: "총장", sleeve: "소매길이" };
  const deltaText = deltas
    .map((d: { dim: string; delta: number }) => `${dimKo[d.dim] ?? d.dim} ${d.delta > 0 ? "+" : ""}${d.delta}cm`)
    .join(", ");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 사이즈 번역기 '너비'의 핏 코멘터다. 기준 옷 대비 추천 사이즈의 치수 차이를 보고, 한국어 존댓말 한 문장(45자 이내)으로 체감 핏을 알려줘라. 주어진 수치만 근거로 쓰고 새 숫자를 만들지 마라. 차이가 크면(2cm 이상) 그 부위를 짚고, 전반적으로 비슷하면 안심시켜라. 이모지, 특수 대시, 과장 금지.",
          },
          {
            role: "user",
            content: `기준: ${sourceLabel} / 추천: ${targetBrandName} ${recommended} (신뢰도 ${confidence}) / 치수 차이: ${deltaText}`,
          },
        ],
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    const data = await res.json();
    const comment = (data?.choices?.[0]?.message?.content ?? "").trim().slice(0, 120);
    if (!comment) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  }
}
