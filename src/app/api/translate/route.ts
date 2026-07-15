import { NextResponse } from "next/server";

import { translate, TranslateError } from "@/lib/translate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const sourceBrand = typeof body?.sourceBrand === "string" ? body.sourceBrand : "";
  const sourceSize = typeof body?.sourceSize === "string" ? body.sourceSize : "";
  const targetBrand = typeof body?.targetBrand === "string" ? body.targetBrand : "";

  if (!sourceBrand || !sourceSize || !targetBrand) {
    return NextResponse.json({ error: "missing-fields" }, { status: 400 });
  }

  try {
    const result = translate(sourceBrand, sourceSize, targetBrand);
    console.log(
      `[translate] ${sourceBrand}/${sourceSize} -> ${targetBrand} = ${result.recommended} (${result.confidence}, d=${result.distance})`,
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof TranslateError) {
      console.log(`[translate] error ${e.code}: ${sourceBrand}/${sourceSize} -> ${targetBrand}`);
      return NextResponse.json({ error: e.code }, { status: 400 });
    }
    throw e;
  }
}
