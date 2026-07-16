"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Link2,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductGrid, type Product, type ProductRow } from "@/components/product-grid";
import productsData from "@/data/products.json";
import { gaEvent } from "@/lib/ga";
import { brands, DIM_LABELS, getBrand, type SizeRow } from "@/lib/sizecharts";
import {
  translate,
  type Anchor,
  type Confidence,
  type CustomSource,
  type TranslateResult,
} from "@/lib/translate";

type ParsedChart = { sizes: SizeRow[]; note: string; sourceUrl: string };

// 시드에 없는 브랜드의 내 옷: 파싱된 실측 행을 직접 앵커로 (Step 1 AI 검색)
type CustomAnchor = { name: string; size: string; row: SizeRow };

// 스펙 원칙: 낮은 적합도를 오류(빨강)처럼 칠하지 않는다 — 라임/노랑/중립 회색 3단
const CONFIDENCE_UI: Record<Confidence, { label: string; className: string }> = {
  high: { label: "신뢰도 높음", className: "bg-match-high text-foreground" },
  mid: { label: "신뢰도 보통", className: "bg-match-mid text-foreground" },
  low: { label: "신뢰도 낮음", className: "bg-match-low text-foreground" },
};

// 적합도: 가중 실측 거리(distance)를 사용자가 읽을 수 있는 %로 변환 (스펙 §13)
function fitPercent(distance: number) {
  return Math.max(45, Math.min(100, Math.round(100 - distance * 12.5)));
}
function fitLabel(pct: number) {
  if (pct >= 90) return { text: "매우 비슷해요", className: "bg-match-high text-foreground" };
  if (pct >= 75) return { text: "비슷한 편이에요", className: "bg-match-mid text-foreground" };
  return { text: "차이가 있어요", className: "bg-match-low text-foreground" };
}

function anchorKey(a: Anchor) {
  return `${a.brandId}::${a.size}`;
}

export function Translator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [customAnchors, setCustomAnchors] = useState<CustomAnchor[]>([]);
  const [browsing, setBrowsing] = useState<string | null>(null);
  const [targetBrand, setTargetBrand] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adopted, setAdopted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  // Step 1 시드 밖 브랜드 블록
  const [c1Open, setC1Open] = useState(false);
  const [c1Name, setC1Name] = useState("");
  const [c1Product, setC1Product] = useState("");
  const [c1Text, setC1Text] = useState("");
  const [c1Parsed, setC1Parsed] = useState<ParsedChart | null>(null);
  const [c1Parsing, setC1Parsing] = useState(false);
  // Step 2 시드 밖 브랜드 블록
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [customText, setCustomText] = useState("");
  const [customParsed, setCustomParsed] = useState<ParsedChart | null>(null);
  const [parsing, setParsing] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalAnchors = anchors.length + customAnchors.length;
  const [gridOpen, setGridOpen] = useState(false);

  const startedRef = useRef(false);
  const mountedAtRef = useRef<number>(0);
  useEffect(() => {
    mountedAtRef.current = Date.now();
    // 공유 URL로 진입하면 같은 결과를 자동으로 다시 보여준다
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    let shared: Anchor[] = [];
    const multi = params.get("a");
    if (multi) {
      shared = multi
        .split(",")
        .map((pair) => {
          const [brandId, size] = pair.split("~");
          return { brandId: brandId ?? "", size: decodeURIComponent(size ?? "") };
        })
        .filter((a) => getBrand(a.brandId)?.sizes.some((s) => s.label === a.size));
    } else {
      const from = params.get("from");
      const size = params.get("size");
      if (from && size && getBrand(from)?.sizes.some((s) => s.label === size)) {
        shared = [{ brandId: from, size }];
      }
    }
    if (shared.length > 0 && to && getBrand(to)) {
      setTimeout(() => {
        setAnchors(shared);
        setTargetBrand(to);
        void submit(shared, to);
      }, 0);
    }
    // 몰 → 너비 딥링크: ?target=<brandId> 로 들어오면 사려는 브랜드를 미리 선택 (docs/mall-integration.md)
    const presetTarget = params.get("target");
    if (shared.length === 0 && presetTarget && getBrand(presetTarget)) {
      setTimeout(() => {
        setTargetBrand(presetTarget);
        gaEvent("mall_referral", { target: presetTarget });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const browsingBrand = browsing ? getBrand(browsing) : undefined;

  // 결과 화면: 전 브랜드 일괄 번역 — 엔진을 클라이언트에서 직접 돌려 적합도순 그리드 (팀 스펙 §11)
  const gridRows = useMemo(() => {
    if (step !== 3 || totalAnchors === 0) return [];
    const customs: CustomSource[] = customAnchors.map((c) => ({
      name: c.name,
      size: c.size,
      row: c.row,
    }));
    return brands
      .filter((b) => !anchors.some((a) => a.brandId === b.id))
      .map((b) => {
        try {
          return translate(anchors, b.id, customs);
        } catch {
          return null;
        }
      })
      .filter((r): r is TranslateResult => r !== null)
      .sort((a, b) => a.distance - b.distance);
  }, [step, anchors, customAnchors, totalAnchors]);

  // 브랜드 적합도 위에 무신사 TOP500 상품을 얹는다 — 브랜드명 정확일치만, 적합도순→순위순
  const productRows = useMemo<ProductRow[]>(() => {
    if (gridRows.length === 0) return [];
    const byName = new Map(gridRows.map((r) => [r.targetBrandName, r]));
    return (productsData as Product[])
      .flatMap((p) => {
        const r = byName.get(p.brand);
        if (!r) return [];
        const pct = fitPercent(r.distance);
        return [
          {
            product: p,
            brandId: r.targetBrandId,
            pct,
            badgeClassName: fitLabel(pct).className,
            recommended: r.recommended,
            chestDelta: r.deltas.find((d) => d.dim === "chest")?.delta ?? null,
            lengthDelta: r.deltas.find((d) => d.dim === "length")?.delta ?? null,
          },
        ];
      })
      .sort((a, b) => b.pct - a.pct || a.product.rank - b.product.rank);
  }, [gridRows]);

  useEffect(() => {
    if (step === 3 && gridRows.length > 0) {
      gaEvent("view_grid", { count: gridRows.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true;
      gaEvent("start_input");
    }
  }

  function addAnchor(brandId: string, size: string) {
    markStarted();
    const next: Anchor = { brandId, size };
    setAnchors((prev) => {
      const withoutSameBrand = prev.filter((a) => a.brandId !== brandId);
      if (withoutSameBrand.length + customAnchors.length >= 5) return prev;
      return [...withoutSameBrand, next];
    });
  }

  function addCustomAnchor(name: string, size: string, row: SizeRow) {
    markStarted();
    setCustomAnchors((prev) => {
      const withoutSame = prev.filter((c) => c.name !== name);
      if (anchors.length + withoutSame.length >= 5) return prev;
      return [...withoutSame, { name, size, row }];
    });
  }

  function removeAnchor(key: string) {
    setAnchors((prev) => prev.filter((a) => anchorKey(a) !== key));
  }

  function removeCustomAnchor(name: string) {
    setCustomAnchors((prev) => prev.filter((c) => c.name !== name));
  }

  async function submit(
    aList: Anchor[] = anchors,
    tb: string | null = targetBrand,
    custom: { name: string; sizes: SizeRow[] } | null = null,
  ) {
    if ((aList.length === 0 && customAnchors.length === 0) || (!tb && !custom)) return;
    setLoading(true);
    setError(null);
    setComment(null);

    // 시드 앵커 + 시드 밖 앵커(실측 행 동봉)를 한 배열로 보낸다
    const payloadAnchors = [
      ...aList,
      ...customAnchors.map((c) => ({ name: c.name, size: c.size, row: c.row })),
    ];
    const translateReq = fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        custom
          ? { anchors: payloadAnchors, targetCustom: custom }
          : { anchors: payloadAnchors, targetBrand: tb },
      ),
    });

    try {
      const res = await translateReq;
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        gaEvent("predict_unavailable", { reason: String(data?.error ?? res.status) });
        setError("이 조합은 아직 번역하지 못해요. 다른 브랜드로 한번 시도해 주세요.");
        return;
      }
      const data: TranslateResult = await res.json();
      setResult(data);
      setStep(3);
      setCopied(false);
      // 결과를 URL로 재현할 수 있게 남긴다 (직접 입력한 표·시드 밖 앵커는 재현이 안 되니 제외)
      if (!custom && tb && customAnchors.length === 0) {
        const a = aList.map((x) => `${x.brandId}~${encodeURIComponent(x.size)}`).join(",");
        window.history.replaceState(null, "", `?a=${a}&to=${tb}#translate`);
      }
      gaEvent("view_result", {
        source_brand: data.sourceBrandId,
        target_brand: data.targetBrandId,
        recommended: data.recommended,
        confidence: data.confidence,
        anchor_count: data.anchorCount,
        elapsed_ms: Date.now() - mountedAtRef.current,
      });

      // AI 핏 코멘트 (실패해도 결과에는 지장 없음)
      fetch("/api/fit-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deltas: data.deltas,
          sourceLabel: data.sourceLabel,
          targetBrandName: data.targetBrandName,
          recommended: data.recommended,
          confidence: data.confidence,
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.comment && setComment(d.comment))
        .catch(() => {});
    } catch {
      gaEvent("predict_unavailable", { reason: "network" });
      setError("네트워크가 잠시 불안정했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchChart(
    mode: "paste" | "search",
    payload: { brandName?: string; productName?: string; text?: string },
  ): Promise<ParsedChart | null> {
    setError(null);
    try {
      const res = await fetch("/api/parse-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...payload }),
      });
      if (!res.ok) {
        gaEvent("predict_unavailable", { reason: `parse-${mode}` });
        setError(
          mode === "search"
            ? "자동으로는 못 찾았어요. 상품 페이지의 사이즈표를 복사해서 붙여넣어 주세요."
            : "사이즈표를 인식하지 못했어요. 실측 표 부분만 복사해서 다시 붙여넣어 주세요.",
        );
        return null;
      }
      return (await res.json()) as ParsedChart;
    } catch {
      setError("네트워크가 잠시 불안정했어요. 다시 시도해 주세요.");
      return null;
    }
  }

  async function parseChart1(mode: "paste" | "search") {
    setC1Parsing(true);
    setC1Parsed(null);
    const parsed = await fetchChart(
      mode,
      mode === "paste"
        ? { text: c1Text }
        : { brandName: c1Name, productName: c1Product },
    );
    if (parsed) setC1Parsed(parsed);
    setC1Parsing(false);
  }

  async function parseChart2(mode: "paste" | "search") {
    setParsing(true);
    setCustomParsed(null);
    const parsed = await fetchChart(
      mode,
      mode === "paste"
        ? { text: customText }
        : { brandName: customName, productName: customProduct },
    );
    if (parsed) setCustomParsed(parsed);
    setParsing(false);
  }

  function repeatQuery() {
    gaEvent("repeat_query", { source_brand: anchors[0]?.brandId ?? customAnchors[0]?.name ?? "" });
    setTargetBrand(null);
    setResult(null);
    setComment(null);
    setAdopted(false);
    setFeedback(null);
    setError(null);
    setCustomOpen(false);
    setCustomName("");
    setCustomProduct("");
    setCustomText("");
    setCustomParsed(null);
    setCopied(false);
    setFilter2("");
    window.history.replaceState(null, "", window.location.pathname + "#translate");
    setStep(2);
  }

  function resetAll() {
    setAnchors([]);
    setCustomAnchors([]);
    setBrowsing(null);
    setTargetBrand(null);
    setResult(null);
    setComment(null);
    setAdopted(false);
    setFeedback(null);
    setError(null);
    setC1Open(false);
    setC1Name("");
    setC1Product("");
    setC1Text("");
    setC1Parsed(null);
    setCustomOpen(false);
    setCustomName("");
    setCustomProduct("");
    setCustomText("");
    setCustomParsed(null);
    setCopied(false);
    setFilter1("");
    setFilter2("");
    window.history.replaceState(null, "", window.location.pathname + "#translate");
    setStep(1);
  }

  return (
    <section id="translate" className="mx-auto w-full max-w-xl px-5 py-10 sm:px-0">
      <div className="rounded-xl border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-evidence">
              {step === 1 && "STEP 1 / 3 · 잘 맞는 옷"}
              {step === 2 && "STEP 2 / 3 · 사려는 옷"}
              {step === 3 && "STEP 3 / 3 · 번역 결과"}
            </p>
            {step > 1 && (
              <button
                type="button"
                onClick={() => (step === 3 ? repeatQuery() : resetAll())}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                {step === 3 ? "다시 고르기" : "처음으로"}
              </button>
            )}
          </div>
          <div className="mt-3 h-1 rounded-full bg-secondary">
            <div
              className="h-1 rounded-full bg-signal transition-[width] duration-[220ms]"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold">
              지금 갖고 있는 옷 중에서 <span className="bg-signal px-1">제일 잘 맞는 반팔티</span>를
              골라주세요
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              여러 벌 고를수록 추천이 정확해져요. 최대 5벌까지 담을 수 있어요.
            </p>

            {totalAnchors > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {anchors.map((a) => (
                  <span
                    key={anchorKey(a)}
                    className="flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    {getBrand(a.brandId)?.name} <span className="font-mono">{a.size}</span>
                    <button
                      type="button"
                      aria-label="선택 해제"
                      onClick={() => removeAnchor(anchorKey(a))}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                ))}
                {customAnchors.map((c) => (
                  <span
                    key={`custom::${c.name}`}
                    className="flex items-center gap-1.5 rounded-full border border-evidence bg-evidence px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    <Sparkles className="size-3" aria-hidden="true" />
                    {c.name} <span className="font-mono">{c.size}</span>
                    <button
                      type="button"
                      aria-label="선택 해제"
                      onClick={() => removeCustomAnchor(c.name)}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative mt-5">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={filter1}
                onChange={(e) => setFilter1(e.target.value)}
                placeholder={`브랜드 검색 (${brands.length}개 지원)`}
                className="pl-9"
              />
            </div>
            <div className="mt-3 grid max-h-56 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {brands
                .filter((b) => b.name.toLowerCase().includes(filter1.trim().toLowerCase()))
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBrowsing(b.id)}
                    className={`rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                      browsing === b.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : anchors.some((a) => a.brandId === b.id)
                          ? "border-primary bg-background"
                          : "bg-background hover:bg-muted"
                    }`}
                  >
                    {b.name}
                    {anchors.some((a) => a.brandId === b.id) && (
                      <Check className="ml-1 inline size-3.5" aria-hidden="true" />
                    )}
                  </button>
                ))}
            </div>

            {browsingBrand && (
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  {browsingBrand.name}에서 입는 사이즈는? (라벨 그대로)
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {browsingBrand.sizes.map((s) => {
                    const selected = anchors.some(
                      (a) => a.brandId === browsingBrand.id && a.size === s.label,
                    );
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => addAnchor(browsingBrand.id, s.label)}
                        className={`rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {s.label}
                        {!selected && <Plus className="ml-1 inline size-3" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-dashed p-4">
              <button
                type="button"
                onClick={() => setC1Open((v) => !v)}
                className="flex w-full items-center gap-1.5 text-sm font-medium text-evidence"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                내 옷 브랜드가 없나요? AI로 사이즈표 가져오기
              </button>
              {c1Open && (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={c1Name}
                      onChange={(e) => setC1Name(e.target.value)}
                      placeholder="브랜드명 (예: 나이키)"
                    />
                    <Input
                      value={c1Product}
                      onChange={(e) => setC1Product(e.target.value)}
                      placeholder="상품명 (선택, 예: 드라이핏 티)"
                    />
                  </div>
                  <Button
                    variant="outline"
                    disabled={!c1Name.trim() || c1Parsing}
                    onClick={() => parseChart1("search")}
                    className="w-full"
                  >
                    {c1Parsing ? "웹에서 찾는 중 (1분쯤 걸려요)" : "자동 검색 (베타)"}
                  </Button>
                  <textarea
                    value={c1Text}
                    onChange={(e) => setC1Text(e.target.value)}
                    rows={3}
                    placeholder="또는 상품 페이지의 실측 사이즈표를 복사해서 붙여넣기"
                    className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                  {c1Text.trim() && !c1Parsed && (
                    <Button
                      variant="outline"
                      disabled={c1Parsing}
                      onClick={() => parseChart1("paste")}
                      className="w-full"
                    >
                      {c1Parsing ? "인식 중..." : "붙여넣은 사이즈표 인식"}
                    </Button>
                  )}
                  {c1Parsed && (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm">
                      <p className="font-medium">
                        {c1Parsed.sizes.length}개 사이즈를 찾았어요. 입는 사이즈를 골라주세요:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c1Parsed.sizes.map((s) => {
                          const name = c1Name.trim() || "직접 입력";
                          const selected = customAnchors.some(
                            (c) => c.name === name && c.size === s.label,
                          );
                          return (
                            <button
                              key={s.label}
                              type="button"
                              onClick={() => addCustomAnchor(name, s.label, s)}
                              className={`rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "bg-background hover:bg-muted"
                              }`}
                            >
                              {s.label}
                              {!selected && <Plus className="ml-1 inline size-3" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                      {c1Parsed.note && (
                        <p className="mt-2 text-xs text-muted-foreground">{c1Parsed.note}</p>
                      )}
                      {c1Parsed.sourceUrl && (
                        <a
                          href={c1Parsed.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block truncate text-xs text-evidence underline"
                        >
                          출처 확인: {c1Parsed.sourceUrl}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-danger/40 bg-danger/5 p-3 text-sm text-danger">
                {error}
              </p>
            )}

            <Button
              className="mt-7 h-11 w-full"
              disabled={totalAnchors === 0}
              onClick={() => setStep(2)}
            >
              {totalAnchors > 0 ? `${totalAnchors}벌로 다음` : "다음"}{" "}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold">
              어느 브랜드 반팔티를 <span className="bg-signal px-1">사려고</span> 하나요?
            </h2>
            <div className="relative mt-5">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={filter2}
                onChange={(e) => setFilter2(e.target.value)}
                placeholder={`브랜드 검색 (${brands.length}개 지원)`}
                className="pl-9"
              />
            </div>
            <div className="mt-3 grid max-h-56 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {brands
                .filter((b) => !anchors.some((a) => a.brandId === b.id))
                .filter((b) => b.name.toLowerCase().includes(filter2.trim().toLowerCase()))
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setTargetBrand(b.id);
                      setCustomOpen(false);
                      setCustomParsed(null);
                    }}
                    className={`rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                      targetBrand === b.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
            </div>

            <div className="mt-4 rounded-lg border border-dashed p-4">
              <button
                type="button"
                onClick={() => {
                  setCustomOpen((v) => !v);
                  if (!customOpen) setTargetBrand(null);
                }}
                className="flex w-full items-center gap-1.5 text-sm font-medium text-evidence"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                찾는 브랜드가 없나요? AI로 사이즈표 가져오기
              </button>
              {customOpen && (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="브랜드명 (예: 유니클로)"
                    />
                    <Input
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="상품명 (선택, 예: 에어리즘 크루넥)"
                    />
                  </div>
                  <Button
                    variant="outline"
                    disabled={!customName.trim() || parsing}
                    onClick={() => parseChart2("search")}
                    className="w-full"
                  >
                    {parsing ? "웹에서 찾는 중 (1분쯤 걸려요)" : "자동 검색 (베타)"}
                  </Button>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={3}
                    placeholder="또는 상품 페이지의 실측 사이즈표를 복사해서 붙여넣기"
                    className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                  {customText.trim() && !customParsed && (
                    <Button variant="outline" disabled={parsing} onClick={() => parseChart2("paste")} className="w-full">
                      {parsing ? "인식 중..." : "붙여넣은 사이즈표 인식"}
                    </Button>
                  )}
                  {customParsed && (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm">
                      <p className="font-medium">
                        {customParsed.sizes.length}개 사이즈를 인식했어요 (
                        {customParsed.sizes.map((s) => s.label).join(" · ")})
                      </p>
                      {customParsed.note && (
                        <p className="mt-1 text-xs text-muted-foreground">{customParsed.note}</p>
                      )}
                      {customParsed.sourceUrl && (
                        <a
                          href={customParsed.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block truncate text-xs text-evidence underline"
                        >
                          출처 확인: {customParsed.sourceUrl}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-danger/40 bg-danger/5 p-3 text-sm text-danger">
                {error}
              </p>
            )}

            <Button
              className="mt-7 h-11 w-full"
              disabled={(!targetBrand && !customParsed) || loading}
              onClick={() =>
                customParsed
                  ? submit(anchors, null, {
                      name: customName.trim() || "직접 입력 브랜드",
                      sizes: customParsed.sizes,
                    })
                  : submit()
              }
            >
              {loading ? "실측 비교 중 (가슴·어깨·총장·소매)..." : "사이즈 번역하기"}
              {!loading && <ArrowRight data-icon="inline-end" />}
            </Button>
          </div>
        )}

        {step === 3 && result && (
          <div>
            <p className="text-sm text-muted-foreground">
              {result.sourceLabel}
              {result.anchorCount > 1 ? ` (${result.anchorCount}벌 평균)` : ""}이 잘 맞는 분께,{" "}
              {result.targetBrandName}에서는
            </p>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-5xl font-semibold tracking-tight">{result.recommended}</p>
              <span
                className={`rounded-sm px-2 py-1 text-xs font-semibold ${CONFIDENCE_UI[result.confidence].className}`}
              >
                {CONFIDENCE_UI[result.confidence].label}
              </span>
            </div>
            {result.runnerUp && result.confidence !== "high" && (
              <p className="mt-2 text-sm text-muted-foreground">
                애매하면 <span className="font-mono">{result.runnerUp}</span>도 함께 고려해 보세요.
              </p>
            )}

            {comment && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-signal-soft p-3 text-sm leading-6">
                <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {comment}
              </p>
            )}

            <div className="mt-5 rounded-lg border bg-muted/40 p-4">
              <p className="eyebrow text-muted-foreground">근거 · 실측 비교 (cm)</p>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-1 font-normal">부위</th>
                    <th className="py-1 font-normal">{result.anchorCount > 1 ? "내 옷 평균" : "내 옷"}</th>
                    <th className="py-1 font-normal">
                      {result.targetBrandName} {result.recommended}
                    </th>
                    <th className="py-1 font-normal">차이</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {result.deltas.map((d) => (
                    <tr key={d.dim} className="border-t border-border/60">
                      <td className="py-1.5 font-sans">{DIM_LABELS[d.dim]}</td>
                      <td className="py-1.5">{d.source}</td>
                      <td className="py-1.5">{d.target}</td>
                      <td
                        className={`py-1.5 ${Math.abs(d.delta) >= 2 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {Math.abs(d.delta) <= 0.5 ? "거의 같음" : d.delta > 0 ? `+${d.delta}` : d.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">기준 상품: {result.targetProduct}</p>
                {result.targetUrl && (
                  <a
                    href={result.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      let host = "";
                      try {
                        host = new URL(result.targetUrl).hostname;
                      } catch {}
                      gaEvent("outbound_click", { target_brand: result.targetBrandId, url_host: host });
                    }}
                    className="flex shrink-0 items-center gap-1 rounded-sm border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    판매처에서 보기 <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {!adopted ? (
                <Button
                  className="h-11 w-full"
                  onClick={() => {
                    setAdopted(true);
                    gaEvent("adopt_size", {
                      target_brand: result.targetBrandId,
                      recommended: result.recommended,
                      confidence: result.confidence,
                    });
                  }}
                >
                  이 사이즈로 살게요 <Check data-icon="inline-end" />
                </Button>
              ) : (
                <p className="rounded-md border border-success/40 bg-success/5 p-3 text-center text-sm text-success">
                  좋은 선택이에요. 입어보시면 결과를 알려주세요!
                </p>
              )}

              <div className="flex gap-2">
                {feedback === null ? (
                  <>
                    <Button
                      variant="outline"
                      className="h-10 flex-1"
                      onClick={() => {
                        setFeedback("correct");
                        gaEvent("feedback_fit", {
                          correct: true,
                          target_brand: result.targetBrandId,
                          recommended: result.recommended,
                        });
                      }}
                    >
                      <Check data-icon="inline-start" /> 맞았어요
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 flex-1"
                      onClick={() => {
                        setFeedback("wrong");
                        gaEvent("feedback_fit", {
                          correct: false,
                          target_brand: result.targetBrandId,
                          recommended: result.recommended,
                        });
                      }}
                    >
                      <X data-icon="inline-start" /> 틀렸어요
                    </Button>
                  </>
                ) : (
                  <p className="w-full text-center text-sm text-muted-foreground">
                    알려주셔서 고마워요. 번역기가 더 정확해지는 데 쓰여요.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" className="h-10 flex-1" onClick={repeatQuery}>
                  <RotateCcw data-icon="inline-start" /> 다른 브랜드도 해보기
                </Button>
                {result.targetBrandId !== "custom" && customAnchors.length === 0 && (
                  <Button
                    variant="ghost"
                    className="h-10 flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href).then(() => setCopied(true));
                    }}
                  >
                    <Link2 data-icon="inline-start" /> {copied ? "복사했어요!" : "결과 링크 복사"}
                  </Button>
                )}
              </div>
            </div>

            {gridRows.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <p className="eyebrow text-muted-foreground">전 브랜드 한눈에 · 적합도순</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  같은 기준 옷으로 {gridRows.length}개 브랜드를 한 번에 번역했어요. 카드를 누르면
                  상세 비교로 바뀝니다.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(gridOpen ? gridRows : gridRows.slice(0, 9)).map((r) => {
                    const pct = fitPercent(r.distance);
                    const fl = fitLabel(pct);
                    const chest = r.deltas.find((d) => d.dim === "chest");
                    return (
                      <button
                        key={r.targetBrandId}
                        type="button"
                        onClick={() => {
                          setTargetBrand(r.targetBrandId);
                          void submit(anchors, r.targetBrandId);
                        }}
                        className={`rounded-md border p-3 text-left transition-colors hover:bg-muted ${
                          r.targetBrandId === result.targetBrandId
                            ? "border-primary bg-background"
                            : "bg-background"
                        }`}
                      >
                        <p className="truncate text-xs font-semibold">{r.targetBrandName}</p>
                        <p className="mt-1 font-mono text-lg leading-none font-semibold">
                          {r.recommended}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-xs px-1.5 py-0.5 text-[0.65rem] font-semibold ${fl.className}`}
                        >
                          {pct}% · {fl.text}
                        </span>
                        {chest && (
                          <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                            가슴{" "}
                            {Math.abs(chest.delta) <= 0.5
                              ? "거의 같음"
                              : `${chest.delta > 0 ? "+" : ""}${chest.delta}cm`}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
                {gridRows.length > 9 && (
                  <Button
                    variant="ghost"
                    className="mt-3 h-10 w-full"
                    onClick={() => setGridOpen((v) => !v)}
                  >
                    {gridOpen ? "접기" : `전체 ${gridRows.length}개 브랜드 보기`}
                  </Button>
                )}
              </div>
            )}

            {productRows.length > 0 && (
              <ProductGrid
                rows={productRows}
                onCompare={(brandId) => {
                  setTargetBrand(brandId);
                  void submit(anchors, brandId);
                }}
              />
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        반팔 티셔츠 기준, {brands.length}개 브랜드의 무신사 실측표를 쓰고 있어요. 계속 늘어납니다.
      </p>
    </section>
  );
}
