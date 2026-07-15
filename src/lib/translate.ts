import { getBrand, type DimKey, type SizeRow } from "@/lib/sizecharts";

// 체감 핏 영향 순 가중치. 가슴이 지배적, 소매는 보조 신호.
const WEIGHTS: Record<DimKey, number> = {
  chest: 3,
  shoulder: 2,
  length: 1,
  sleeve: 0.5,
};

const DIMS: DimKey[] = ["chest", "shoulder", "length", "sleeve"];

export type Confidence = "high" | "mid" | "low";

export type DimDelta = {
  dim: DimKey;
  source: number;
  target: number;
  delta: number;
};

export type TranslateResult = {
  sourceBrandId: string;
  sourceBrandName: string;
  sourceSize: string;
  targetBrandId: string;
  targetBrandName: string;
  targetProduct: string;
  targetUrl: string;
  recommended: string;
  runnerUp: string | null;
  confidence: Confidence;
  deltas: DimDelta[];
  comparedDims: number;
  distance: number;
  margin: number;
};

export type TranslateErrorCode =
  | "unknown-source-brand"
  | "unknown-source-size"
  | "unknown-target-brand"
  | "same-brand"
  | "no-comparable-dims";

export class TranslateError extends Error {
  code: TranslateErrorCode;
  constructor(code: TranslateErrorCode) {
    super(code);
    this.code = code;
  }
}

function score(source: SizeRow, target: SizeRow) {
  let weightSum = 0;
  let acc = 0;
  const deltas: DimDelta[] = [];
  for (const dim of DIMS) {
    const s = source[dim];
    const t = target[dim];
    if (s == null || t == null) continue;
    const delta = t - s;
    weightSum += WEIGHTS[dim];
    acc += WEIGHTS[dim] * Math.abs(delta);
    deltas.push({ dim, source: s, target: t, delta: Math.round(delta * 10) / 10 });
  }
  if (weightSum === 0) return null;
  return { distance: acc / weightSum, deltas };
}

function rank(row: SizeRow, targetSizes: SizeRow[]) {
  const scored = targetSizes
    .map((t) => {
      const s = score(row, t);
      return s ? { label: t.label, ...s } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .sort((a, b) => a.distance - b.distance);

  if (scored.length === 0) throw new TranslateError("no-comparable-dims");

  const best = scored[0];
  const second = scored[1] ?? null;
  const margin = second ? second.distance - best.distance : Number.POSITIVE_INFINITY;
  const comparedDims = best.deltas.length;

  // 임계값은 V0 팀원 교차검증에서 보정한다 (experiments/01).
  let confidence: Confidence = "mid";
  if (best.distance <= 0.8 && margin >= 0.5 && comparedDims >= 3) confidence = "high";
  else if (best.distance > 1.8 || comparedDims <= 1 || margin < 0.25) confidence = "low";

  return { best, second, margin, comparedDims, confidence };
}

function sourceRowOf(sourceBrandId: string, sourceSize: string) {
  const src = getBrand(sourceBrandId);
  if (!src) throw new TranslateError("unknown-source-brand");
  const row = src.sizes.find((s) => s.label === sourceSize);
  if (!row) throw new TranslateError("unknown-source-size");
  return { src, row };
}

export function translate(
  sourceBrandId: string,
  sourceSize: string,
  targetBrandId: string,
): TranslateResult {
  const { src, row } = sourceRowOf(sourceBrandId, sourceSize);
  const tgt = getBrand(targetBrandId);
  if (!tgt) throw new TranslateError("unknown-target-brand");
  if (src.id === tgt.id) throw new TranslateError("same-brand");

  const { best, second, margin, comparedDims, confidence } = rank(row, tgt.sizes);

  return {
    sourceBrandId: src.id,
    sourceBrandName: src.name,
    sourceSize: row.label,
    targetBrandId: tgt.id,
    targetBrandName: tgt.name,
    targetProduct: tgt.product,
    targetUrl: tgt.url,
    recommended: best.label,
    runnerUp: second?.label ?? null,
    confidence,
    deltas: best.deltas,
    comparedDims,
    distance: Math.round(best.distance * 100) / 100,
    margin: second ? Math.round(margin * 100) / 100 : -1,
  };
}

// 시드에 없는 브랜드 — LLM이 파싱한 사이즈표를 대상으로 번역 (/api/parse-chart 경유)
export function translateCustom(
  sourceBrandId: string,
  sourceSize: string,
  customName: string,
  customSizes: SizeRow[],
): TranslateResult {
  const { src, row } = sourceRowOf(sourceBrandId, sourceSize);
  const { best, second, margin, comparedDims, confidence } = rank(row, customSizes);

  return {
    sourceBrandId: src.id,
    sourceBrandName: src.name,
    sourceSize: row.label,
    targetBrandId: "custom",
    targetBrandName: customName,
    targetProduct: "사용자 제공 사이즈표",
    targetUrl: "",
    recommended: best.label,
    runnerUp: second?.label ?? null,
    // 사용자/웹 제공 표는 검증 안 된 데이터 — 신뢰도 상한을 '보통'으로 캡
    confidence: confidence === "high" ? "mid" : confidence,
    deltas: best.deltas,
    comparedDims,
    distance: Math.round(best.distance * 100) / 100,
    margin: second ? Math.round(margin * 100) / 100 : -1,
  };
}
