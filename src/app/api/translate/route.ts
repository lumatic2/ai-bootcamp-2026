import { NextResponse } from "next/server";

import {
  translate,
  translateCustom,
  TranslateError,
  type Anchor,
  type CustomSource,
} from "@/lib/translate";
import type { SizeRow } from "@/lib/sizecharts";

function saneRow(r: unknown): SizeRow | null {
  const row = r as Record<string, unknown>;
  const num = (v: unknown, min: number, max: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) && n >= min && n <= max ? n : null;
  };
  const out: SizeRow = {
    label: typeof row?.label === "string" ? row.label.slice(0, 20) : "",
    length: num(row?.length, 40, 100),
    shoulder: num(row?.shoulder, 30, 70),
    chest: num(row?.chest, 30, 80),
    sleeve: num(row?.sleeve, 5, 45),
  };
  return out.chest !== null && out.length !== null ? out : null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // anchors 배열(시드 {brandId,size} 또는 시드 밖 {name,size,row}) 또는 legacy 단일 sourceBrand/sourceSize
  let anchors: Anchor[] = [];
  const customs: CustomSource[] = [];
  if (Array.isArray(body?.anchors)) {
    for (const a of body.anchors.slice(0, 5)) {
      if (typeof a?.brandId === "string" && typeof a?.size === "string") {
        anchors.push({ brandId: a.brandId, size: a.size });
      } else if (typeof a?.name === "string" && typeof a?.size === "string" && a?.row) {
        const row = saneRow(a.row);
        if (row) customs.push({ name: a.name.slice(0, 40), size: a.size.slice(0, 20), row });
      }
    }
  } else if (typeof body?.sourceBrand === "string" && typeof body?.sourceSize === "string") {
    anchors = [{ brandId: body.sourceBrand, size: body.sourceSize }];
  }

  const targetBrand = typeof body?.targetBrand === "string" ? body.targetBrand : "";
  const targetCustom = body?.targetCustom as { name?: string; sizes?: SizeRow[] } | undefined;
  const hasCustom =
    !!targetCustom && typeof targetCustom.name === "string" && Array.isArray(targetCustom.sizes);

  if ((anchors.length === 0 && customs.length === 0) || (!targetBrand && !hasCustom)) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  try {
    const result = hasCustom
      ? translateCustom(anchors, targetCustom.name!.slice(0, 40), targetCustom.sizes!, customs)
      : translate(anchors, targetBrand, customs);
    const anchorLog = [
      ...anchors.map((a) => `${a.brandId}/${a.size}`),
      ...customs.map((c) => `custom:${c.name}/${c.size}`),
    ].join("+");
    console.log(
      `[translate] ${anchorLog} -> ${hasCustom ? `custom:${targetCustom.name}` : targetBrand} = ${result.recommended} (${result.confidence}, d=${result.distance})`,
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TranslateError) {
      console.log(`[translate] error ${e.code}`);
      return NextResponse.json({ error: e.code }, { status: 400 });
    }
    throw e;
  }
}
