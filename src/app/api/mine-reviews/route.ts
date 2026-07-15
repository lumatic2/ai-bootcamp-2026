import { NextResponse } from "next/server";

// 리뷰 텍스트에서 핏 신호("크게/정사이즈/작게")를 추출한다.
// LLM 없이는 성립하지 않는 코어 — 키 부재 시 503으로 명시적 실패한다.

const SYSTEM_PROMPT = `너는 한국어 의류 쇼핑몰 리뷰에서 "핏(사이즈) 신호"만 추출하는 분석기다.
입력된 리뷰 뭉치에서 사이즈/핏에 대한 언급만 골라 다음 JSON 으로만 답하라:
{
  "larger": <"크게 나온다/한 사이즈 줄여라" 취지 리뷰 수>,
  "fit": <"정사이즈다" 취지 리뷰 수>,
  "smaller": <"작게 나온다/한 사이즈 키워라" 취지 리뷰 수>,
  "quotes": [{"text": "<리뷰 원문에서 그대로 인용한 짧은 구절 (25자 이내)>", "signal": "larger"|"fit"|"smaller"}]
}
규칙: quotes 는 최대 3개, 반드시 입력에 실제로 존재하는 문자열만 인용한다. 지어내지 마라.
핏 언급이 전혀 없으면 모든 수를 0으로, quotes 를 빈 배열로 반환한다. JSON 외 다른 텍스트 금지.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const reviews = typeof body?.reviews === "string" ? body.reviews.trim() : "";

  if (!reviews) {
    return NextResponse.json({ error: "empty-reviews" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "llm-unavailable" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // 팀 프로젝트 키가 허용하는 모델: gpt-5.4-mini / gpt-5.4-nano (2026-07-15 /v1/models 확인)
        model: "gpt-5.4-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: reviews.slice(0, 8000) },
        ],
      }),
    });

    if (!res.ok) {
      console.log(`[mine-reviews] upstream ${res.status}`);
      return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    const result = {
      larger: Number(parsed?.larger) || 0,
      fit: Number(parsed?.fit) || 0,
      smaller: Number(parsed?.smaller) || 0,
      quotes: Array.isArray(parsed?.quotes)
        ? parsed.quotes
            .filter(
              (q: unknown): q is { text: string; signal: string } =>
                typeof (q as { text?: unknown })?.text === "string" &&
                typeof (q as { signal?: unknown })?.signal === "string",
            )
            .slice(0, 3)
        : [],
    };
    console.log(
      `[mine-reviews] larger=${result.larger} fit=${result.fit} smaller=${result.smaller} quotes=${result.quotes.length}`,
    );
    return NextResponse.json(result);
  } catch (e) {
    console.log(`[mine-reviews] parse/network error: ${e instanceof Error ? e.message : e}`);
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  }
}
