import { NextResponse } from "next/server";

import { translate, translateCustom, TranslateError, type Anchor } from "@/lib/translate";
import type { SizeRow } from "@/lib/sizecharts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // anchors 배열(다중 앵커) 또는 legacy 단일 sourceBrand/sourceSize
  let anchors: Anchor[] = [];
  if (Array.isArray(body?.anchors)) {
    anchors = body.anchors
      .filter(
        (a: unknown): a is { brandId: string; size: string } =>
          typeof (a as Anchor)?.brandId === "string" && typeof (a as Anchor)?.size === "string",
      )
      .slice(0, 5);
  } else if (typeof body?.sourceBrand === "string" && typeof body?.sourceSize === "string") {
    anchors = [{ brandId: body.sourceBrand, size: body.sourceSize }];
  }

  const targetBrand = typeof body?.targetBrand === "string" ? body.targetBrand : "";
  const targetCustom = body?.targetCustom as { name?: string; sizes?: SizeRow[] } | undefined;
  const hasCustom =
    !!targetCustom && typeof targetCustom.name === "string" && Array.isArray(targetCustom.sizes);

  if (anchors.length === 0 || (!targetBrand && !hasCustom)) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  try {
    const result = hasCustom
      ? translateCustom(anchors, targetCustom.name!.slice(0, 40), targetCustom.sizes!)
      : translate(anchors, targetBrand);
    console.log(
      `[translate] ${anchors.map((a) => `${a.brandId}/${a.size}`).join("+")} -> ${hasCustom ? `custom:${targetCustom.name}` : targetBrand} = ${result.recommended} (${result.confidence}, d=${result.distance})`,
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
