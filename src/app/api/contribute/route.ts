import { NextResponse } from "next/server";

import type { SizeRow } from "@/lib/sizecharts";

// AI 검색·붙여넣기로 커스텀 앵커가 성공 생성될 때 그 사이즈표를 기록한다.
// 오늘의 영속화 계층은 console.log(Vercel 함수 로그)뿐이다 — DB는 레포 규약상
// 문제·실험이 확정된 뒤에 설치한다 (CLAUDE.md 참고).

const VIA = ["search", "paste", "manual"] as const;
type Via = (typeof VIA)[number];

function sane(rows: unknown): SizeRow[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .slice(0, 10)
    .map((r) => {
      const row = r as Record<string, unknown>;
      const num = (v: unknown) => {
        const n = typeof v === "number" ? v : Number(v);
        return Number.isFinite(n) ? n : null;
      };
      return {
        label: typeof row.label === "string" ? row.label.slice(0, 20) : "",
        length: num(row.length),
        shoulder: num(row.shoulder),
        chest: num(row.chest),
        sleeve: num(row.sleeve),
      };
    })
    .filter((r) => r.label);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const brand = typeof body?.brand === "string" ? body.brand.trim().slice(0, 40) : "";
  const product = typeof body?.product === "string" ? body.product.trim().slice(0, 60) : "";
  const sourceUrl = typeof body?.sourceUrl === "string" ? body.sourceUrl.trim().slice(0, 300) : "";
  const via: Via = VIA.includes(body?.via) ? body.via : "manual";
  const sizes = sane(body?.sizes);

  if (!brand || sizes.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.log("[contribute]", JSON.stringify({ brand, product, sourceUrl, via, sizes }));
  return NextResponse.json({ ok: true });
}
