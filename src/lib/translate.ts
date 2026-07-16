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
  sourceLabel: string;
  anchorCount: number;
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

function score(source: SizeRow, target: SizeRow, weights: Record<DimKey, number> = WEIGHTS) {
  let weightSum = 0;
  let acc = 0;
  const deltas: DimDelta[] = [];
  for (const dim of DIMS) {
    const s = source[dim];
    const t = target[dim];
    if (s == null || t == null) continue;
    const delta = t - s;
    weightSum += weights[dim];
    acc += weights[dim] * Math.abs(delta);
    deltas.push({ dim, source: s, target: t, delta: Math.round(delta * 10) / 10 });
  }
  if (weightSum === 0) return null;
  return { distance: acc / weightSum, deltas };
}

function rank(
  row: SizeRow,
  targetSizes: SizeRow[],
  multiAnchor = false,
  weights: Record<DimKey, number> = WEIGHTS,
) {
  const scored = targetSizes
    .map((t) => {
      const s = score(row, t, weights);
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
  // 앵커 2벌 이상이면 평균 벡터가 개별 상품 편차를 상쇄하므로 임계를 완화한다.
  const hiDist = multiAnchor ? 0.9 : 0.8;
  const hiMargin = multiAnchor ? 0.4 : 0.5;
  let confidence: Confidence = "mid";
  if (best.distance <= hiDist && margin >= hiMargin && comparedDims >= 3) confidence = "high";
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

export type Anchor = { brandId: string; size: string };

// 시드에 없는 브랜드의 내 옷: 파싱된 실측 행을 직접 앵커로 쓴다 (Step 1 AI 검색, 2026-07-15)
export type CustomSource = { name: string; size: string; row: SizeRow };

// 앵커 여러 벌 → 치수별 평균 벡터. 앵커가 많을수록 개별 상품 편차가 상쇄된다 (팀 제안 2026-07-15).
function meanRow(
  anchors: Anchor[],
  customs: CustomSource[] = [],
): { row: SizeRow; label: string; first: Anchor | null; total: number } {
  const resolved = anchors.map((a) => sourceRowOf(a.brandId, a.size));
  const rows: SizeRow[] = [...resolved.map((r) => r.row), ...customs.map((c) => c.row)];
  if (rows.length === 0) throw new TranslateError("unknown-source-brand");
  const dims: DimKey[] = ["chest", "shoulder", "length", "sleeve"];
  const row: SizeRow = { label: "내 옷 평균", length: null, shoulder: null, chest: null, sleeve: null };
  for (const dim of dims) {
    const vals = rows.map((r) => r[dim]).filter((v): v is number => v != null);
    if (vals.length > 0) {
      row[dim] = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    }
  }
  const label = [
    ...resolved.map((r) => `${r.src.name} ${r.row.label}`),
    ...customs.map((c) => `${c.name} ${c.size}`),
  ].join(" + ");
  return { row, label, first: anchors[0] ?? null, total: rows.length };
}

export function translate(
  anchors: Anchor[],
  targetBrandId: string,
  customs: CustomSource[] = [],
): TranslateResult {
  const tgt = getBrand(targetBrandId);
  if (!tgt) throw new TranslateError("unknown-target-brand");
  if (anchors.some((a) => a.brandId === tgt.id)) throw new TranslateError("same-brand");
  const { row, label, first, total } = meanRow(anchors, customs);

  const { best, second, margin, comparedDims, confidence } = rank(row, tgt.sizes, total >= 2);

  return {
    sourceBrandId: first?.brandId ?? "custom",
    sourceBrandName: first ? getBrand(first.brandId)!.name : customs[0].name,
    sourceSize: first?.size ?? customs[0].size,
    sourceLabel: label,
    anchorCount: total,
    targetBrandId: tgt.id,
    targetBrandName: tgt.name,
    targetProduct: tgt.product,
    targetUrl: tgt.url,
    recommended: best.label,
    runnerUp: second?.label ?? null,
    // 시드 밖 앵커(웹·사용자 제공 실측)가 섞이면 신뢰도 상한을 '보통'으로 캡
    confidence: customs.length > 0 && confidence === "high" ? "mid" : confidence,
    deltas: best.deltas,
    comparedDims,
    distance: Math.round(best.distance * 100) / 100,
    margin: second ? Math.round(margin * 100) / 100 : -1,
  };
}

// 상품 단위 번역 — 임의의 실측 행 집합(상품 1개의 사이즈표)을 대상으로 앵커 평균을 매칭한다.
// 2스텝 리빌드(팀 피드백 2026-07-16): 결과 그리드가 브랜드 대리값 대신 상품별 실측으로 적합도를 계산할 때 사용.
export type RowFit = {
  recommended: string;
  runnerUp: string | null;
  confidence: Confidence;
  deltas: DimDelta[];
  comparedDims: number;
  distance: number;
  margin: number;
};

// 핏 해석 (팀 제안 2026-07-16): 핏 방향으로 목표 벡터를 조정하고, 중요 부위 가중치를 증폭한다.
export type FitPref = { fit?: "same" | "loose" | "slim"; focus?: DimKey | "all" };

const FIT_RATIOS: Record<"same" | "loose" | "slim", Record<DimKey, number>> = {
  same: { shoulder: 1, chest: 1, length: 1, sleeve: 1 },
  loose: { shoulder: 1.01, chest: 1.02, length: 1.02, sleeve: 1.01 },
  slim: { shoulder: 0.99, chest: 0.98, length: 0.99, sleeve: 0.99 },
};

function adjustRow(row: SizeRow, fit: "same" | "loose" | "slim"): SizeRow {
  const ratios = FIT_RATIOS[fit];
  const adjusted: SizeRow = { ...row };
  for (const dim of DIMS) {
    const v = row[dim];
    adjusted[dim] = v == null ? null : Math.round(v * ratios[dim] * 10) / 10;
  }
  return adjusted;
}

function focusWeights(focus?: DimKey | "all"): Record<DimKey, number> {
  if (!focus || focus === "all") return WEIGHTS;
  return { ...WEIGHTS, [focus]: WEIGHTS[focus] * 3 };
}

export function translateToRows(
  anchors: Anchor[],
  customs: CustomSource[],
  targetSizes: SizeRow[],
  opts?: FitPref,
): RowFit {
  const { row, total } = meanRow(anchors, customs);
  const fitKind = opts?.fit ?? "same";
  const weights = focusWeights(opts?.focus);
  const goalRow = fitKind === "same" ? row : adjustRow(row, fitKind);
  const { best, second, margin, comparedDims, confidence } = rank(
    goalRow,
    targetSizes,
    total >= 2,
    weights,
  );
  // 표시용 delta는 조정된 목표가 아니라 원본 "내 옷" 벡터 기준으로 재계산한다 —
  // 비교 표 헤더가 "내 옷"이므로 조정값 대비 delta를 보여주면 실제 치수 차이를 왜곡해 보여주게 된다.
  const target = targetSizes.find((t) => t.label === best.label);
  const deltas = target ? (score(row, target, weights)?.deltas ?? best.deltas) : best.deltas;
  return {
    recommended: best.label,
    runnerUp: second?.label ?? null,
    // 시드 밖 앵커가 섞이면 신뢰도 상한 '보통' 캡 (기존 규칙 유지)
    confidence: customs.length > 0 && confidence === "high" ? "mid" : confidence,
    deltas,
    comparedDims,
    distance: Math.round(best.distance * 100) / 100,
    margin: second ? Math.round(margin * 100) / 100 : -1,
  };
}

// 시드에 없는 브랜드는 LLM이 파싱한 사이즈표를 대상으로 번역한다 (/api/parse-chart 경유)
export function translateCustom(
  anchors: Anchor[],
  customName: string,
  customSizes: SizeRow[],
  customs: CustomSource[] = [],
): TranslateResult {
  const { row, label, first, total } = meanRow(anchors, customs);
  const { best, second, margin, comparedDims, confidence } = rank(row, customSizes, total >= 2);

  return {
    sourceBrandId: first?.brandId ?? "custom",
    sourceBrandName: first ? getBrand(first.brandId)!.name : customs[0].name,
    sourceSize: first?.size ?? customs[0].size,
    sourceLabel: label,
    anchorCount: total,
    targetBrandId: "custom",
    targetBrandName: customName,
    targetProduct: "사용자 제공 사이즈표",
    targetUrl: "",
    recommended: best.label,
    runnerUp: second?.label ?? null,
    // 사용자·웹 제공 표는 검증 안 된 데이터라 신뢰도 상한을 '보통'으로 캡
    confidence: confidence === "high" ? "mid" : confidence,
    deltas: best.deltas,
    comparedDims,
    distance: Math.round(best.distance * 100) / 100,
    margin: second ? Math.round(margin * 100) / 100 : -1,
  };
}
