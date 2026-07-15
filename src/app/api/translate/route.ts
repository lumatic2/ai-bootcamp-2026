import { NextResponse } from "next/server";

import { translate, translateCustom, TranslateError } from "@/lib/translate";
import type { SizeRow } from "@/lib/sizecharts";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const sourceBrand = typeof body?.sourceBrand === "string" ? body.sourceBrand : "";
  const sourceSize = typeof body?.sourceSize === "string" ? body.sourceSize : "";
  const targetBrand = typeof body?.targetBrand === "string" ? body.targetBrand : "";
  const targetCustom = body?.targetCustom as { name?: string; sizes?: SizeRow[] } | undefined;

  const hasCustom =
    !!targetCustom && typeof targetCustom.name === "string" && Array.isArray(targetCustom.sizes);

  if (!sourceBrand || !sourceSize || (!targetBrand && !hasCustom)) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  try {
    const result = hasCustom
      ? translateCustom(sourceBrand, sourceSize, targetCustom.name!.slice(0, 40), targetCustom.sizes!)
      : translate(sourceBrand, sourceSize, targetBrand);
    console.log(
      `[translate] ${sourceBrand}/${sourceSize} -> ${hasCustom ? `custom:${targetCustom.name}` : targetBrand} = ${result.recommended} (${result.confidence}, d=${result.distance})`,
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TranslateError) {
      console.log(`[translate] error ${e.code}: ${sourceBrand}/${sourceSize}`);
      return NextResponse.json({ error: e.code }, { status: 400 });
    }
    throw e;
  }
}
