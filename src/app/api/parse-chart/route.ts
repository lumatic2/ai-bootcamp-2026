import { NextResponse } from "next/server";

import type { SizeRow } from "@/lib/sizecharts";

// 웹서치 모드는 오래 걸린다 — Vercel 함수 타임아웃 상향
export const maxDuration = 150;

// 시드에 없는 브랜드 대응 — 두 모드:
// paste  : 사용자가 상품 페이지에서 복사한 사이즈표 텍스트를 LLM이 표준 스키마로 파싱
// search : LLM web_search 로 해당 브랜드 반팔티 실측표를 찾아 파싱 (베타 — 출처 URL 필수)

const PARSE_SCHEMA = `다음 JSON 스키마로만 답하라 (JSON 외 텍스트 금지):
{
  "sizes": [{"label": "<원표기 그대로>", "length": <총장 cm|null>, "shoulder": <어깨너비 cm|null>, "chest": <가슴단면 cm|null>, "sleeve": <소매길이 cm|null>}],
  "note": "<특이사항 한 줄 (예: 가슴이 둘레 표기라 ÷2 환산함)>",
  "sourceUrl": "<근거 웹페이지 URL, 없으면 빈 문자열>"
}
규칙: 가슴이 "둘레"(원주)로 표기됐으면 반드시 2로 나눠 단면으로 환산하고 note 에 명시. 확인 안 되는 값은 null. 숫자를 지어내지 마라.`;

function sane(rows: unknown): SizeRow[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      const row = r as Record<string, unknown>;
      const num = (v: unknown, min: number, max: number) => {
        const n = typeof v === "number" ? v : Number(v);
        return Number.isFinite(n) && n >= min && n <= max ? n : null;
      };
      return {
        label: typeof row.label === "string" ? row.label.slice(0, 20) : "",
        length: num(row.length, 40, 100),
        shoulder: num(row.shoulder, 30, 70),
        chest: num(row.chest, 30, 80),
        sleeve: num(row.sleeve, 5, 45),
      };
    })
    .filter((r) => r.label && r.chest !== null && r.length !== null);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const mode = body?.mode === "search" ? "search" : "paste";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const brandName = typeof body?.brandName === "string" ? body.brandName.trim().slice(0, 40) : "";

  if (mode === "paste" && !text) {
    return NextResponse.json({ error: "empty-text" }, { status: 400 });
  }
  if (mode === "search" && !brandName) {
    return NextResponse.json({ error: "empty-brand" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "llm-unavailable" }, { status: 503 });
  }

  try {
    let content: string | undefined;

    if (mode === "paste") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-5.4-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: `너는 의류 사이즈표 파서다. 입력 텍스트에서 반팔 티셔츠 실측 사이즈표를 추출한다.\n${PARSE_SCHEMA}` },
            { role: "user", content: text.slice(0, 6000) },
          ],
        }),
      });
      if (!res.ok) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
      const data = await res.json();
      content = data?.choices?.[0]?.message?.content;
    } else {
      // 검색 각도를 바꿔가며 최대 2회 시도 (공식몰·무신사 → 블로그·리뷰의 실측 인용)
      const queries = [
        `웹 검색을 여러 번 사용해서, 브랜드 "${brandName}"의 남성 기본 반팔 티셔츠 실측 사이즈표(총장·어깨너비·가슴·소매, cm)를 찾아라. 좋은 출처: 브랜드 공식몰 상품 페이지의 사이즈 정보, 무신사 상품 설명, 사이즈 스펙을 그대로 옮겨 적은 쇼핑 블로그·리뷰 글. 페이지 본문에서 실제로 읽은 수치만 쓰고, 검색 결과에 없는 숫자는 절대 만들지 마라. 2개 사이즈만 찾아도 반환하라. sourceUrl 에는 수치를 읽은 페이지 주소를 반드시 적어라.`,
        `"${brandName} 반팔티 실측" 또는 "${brandName} 티셔츠 사이즈 총장 어깨"로 웹 검색해서, 블로그나 착용 후기에 인용된 실측 사이즈표를 찾아라. 본문에서 실제로 읽은 수치만 쓰고 sourceUrl 을 반드시 채워라. 2개 사이즈 이상이면 반환하라.`,
      ];
      // 두 각도를 병렬로 쏘고 먼저 검증을 통과한 응답을 쓴다
      const attempt = async (q: string): Promise<string> => {
        const res = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-5.4-mini",
            tools: [{ type: "web_search" }],
            tool_choice: "auto",
            reasoning: { effort: "medium" },
            input: `${q}\n${PARSE_SCHEMA}`,
          }),
        });
        if (!res.ok) throw new Error(`upstream ${res.status}`);
        const data = await res.json();
        const msg = Array.isArray(data?.output)
          ? data.output.find((o: { type?: string }) => o.type === "message")
          : null;
        const candidate: string | undefined = msg?.content?.find?.(
          (c: { type?: string }) => c.type === "output_text",
        )?.text;
        if (!candidate) throw new Error("no text");
        const j = JSON.parse(candidate.match(/\{[\s\S]*\}/)?.[0] ?? candidate);
        // 출처 URL 없는 검색 결과는 기억으로 지어냈을 위험이 있어 버린다
        if (sane(j?.sizes).length >= 2 && typeof j?.sourceUrl === "string" && j.sourceUrl.startsWith("http")) {
          return candidate;
        }
        throw new Error("insufficient");
      };
      try {
        content = await Promise.any(queries.map(attempt));
      } catch {
        console.log(`[parse-chart] search exhausted for "${brandName}"`);
        return NextResponse.json({ error: "chart-not-found" }, { status: 422 });
      }
    }

    if (!content) return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    const sizes = sane(parsed?.sizes);

    if (sizes.length < 2) {
      console.log(`[parse-chart] ${mode} insufficient rows (${sizes.length})`);
      return NextResponse.json({ error: "chart-not-found" }, { status: 422 });
    }

    console.log(`[parse-chart] ${mode} ok — ${sizes.length} sizes${parsed?.sourceUrl ? ` src=${parsed.sourceUrl}` : ""}`);
    return NextResponse.json({
      sizes,
      note: typeof parsed?.note === "string" ? parsed.note.slice(0, 120) : "",
      sourceUrl: typeof parsed?.sourceUrl === "string" ? parsed.sourceUrl.slice(0, 300) : "",
    });
  } catch (e) {
    console.log(`[parse-chart] error: ${e instanceof Error ? e.message : e}`);
    return NextResponse.json({ error: "llm-upstream-error" }, { status: 502 });
  }
}
