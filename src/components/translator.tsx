"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Plus, Ruler, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductGrid, type Product as ProductChartItem, type ProductRow } from "@/components/product-grid";
import productChartsData from "@/data/product-charts.json";
import { gaEvent } from "@/lib/ga";
import { brands, getBrand, type Brand, type DimKey, type SizeRow } from "@/lib/sizecharts";
import { translateToRows, type Anchor, type CustomSource, type FitPref } from "@/lib/translate";

type ParsedChart = { sizes: SizeRow[]; note: string; sourceUrl: string };

// 시드에 없는 브랜드/상품의 내 옷: 실측 행을 직접 앵커로 쓴다.
// url이 있으면 결과 그리드에서 같은 상품을 제외하는 데, brandId가 있으면 브랜드 선택 UI 체크 표시에 쓴다.
type CustomAnchor = { name: string; size: string; row: SizeRow; url?: string; brandId?: string };

const products = productChartsData.products as ProductChartItem[];

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

// 핏 해석 선택 UI (팀 제안 2026-07-16): 그리드 위 2줄 세그먼트, 선택 즉시 재계산.
type FitKind = "same" | "loose" | "slim";
type FocusKind = DimKey | "all";

const FIT_OPTIONS: { key: FitKind; label: string }[] = [
  { key: "same", label: "지금 핏 그대로" },
  { key: "loose", label: "조금 더 여유롭게" },
  { key: "slim", label: "조금 더 슬림하게" },
];

const FOCUS_OPTIONS: { key: FocusKind; label: string }[] = [
  { key: "all", label: "전체 균형" },
  { key: "chest", label: "가슴" },
  { key: "shoulder", label: "어깨" },
  { key: "length", label: "총장" },
  { key: "sleeve", label: "소매" },
];

// 선택한 상품이 시드의 대표 상품(브랜드 실측표 그 자체)인지 — 맞으면 기존 Anchor 경로를 쓴다
function isSeedRepresentative(p: ProductChartItem, b: Brand) {
  return p.brandId === b.id && p.url === b.url;
}

export function Translator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [customAnchors, setCustomAnchors] = useState<CustomAnchor[]>([]);
  const [browsing, setBrowsing] = useState<string | null>(null);
  const [browsingProduct, setBrowsingProduct] = useState<ProductChartItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter1, setFilter1] = useState("");
  const [search2, setSearch2] = useState("");
  // Step 1 시드 밖 브랜드 블록 (AI 검색/붙여넣기)
  const [c1Open, setC1Open] = useState(false);
  const [c1Name, setC1Name] = useState("");
  const [c1Product, setC1Product] = useState("");
  const [c1Text, setC1Text] = useState("");
  const [c1Parsed, setC1Parsed] = useState<ParsedChart | null>(null);
  const [c1Parsing, setC1Parsing] = useState(false);
  const [c1Mode, setC1Mode] = useState<"search" | "paste">("paste");
  // Step 1 실측 치수 직접 입력 블록
  const [mOpen, setMOpen] = useState(false);
  const [mLength, setMLength] = useState("");
  const [mShoulder, setMShoulder] = useState("");
  const [mChest, setMChest] = useState("");
  const [mSleeve, setMSleeve] = useState("");
  // 핏 해석 선택 (기본: 지금 핏 그대로 · 전체 균형)
  const [fitPref, setFitPref] = useState<FitKind>("same");
  const [focusDim, setFocusDim] = useState<FocusKind>("all");

  const totalAnchors = anchors.length + customAnchors.length;

  const startedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const searchFiredRef = useRef(false);

  useEffect(() => {
    // 공유 URL로 진입하면 같은 앵커를 복원해 바로 결과 화면으로 보낸다
    const params = new URLSearchParams(window.location.search);
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
      // 구버전 단일 앵커 파라미터(from/size) — &to는 더 이상 안 쓰지만 파싱은 무시하고 넘어간다
      const from = params.get("from");
      const size = params.get("size");
      if (from && size && getBrand(from)?.sizes.some((s) => s.label === size)) {
        shared = [{ brandId: from, size }];
      }
    }
    if (shared.length > 0) {
      setTimeout(() => {
        setAnchors(shared);
        setStep(2);
      }, 0);
    }
    // 몰 → 너비 딥링크: ?target=<brandId> 로 들어오면 검색창에 사려는 브랜드를 미리 채운다
    const presetTarget = params.get("target");
    if (presetTarget && getBrand(presetTarget)) {
      setTimeout(() => {
        setSearch2(getBrand(presetTarget)!.name);
        gaEvent("mall_referral", { target: presetTarget });
      }, 0);
    }
  }, []);

  // 앵커가 바뀔 때마다 URL을 동기화한다 (시드 밖 앵커가 섞이면 재현 불가하니 제외)
  useEffect(() => {
    if (step !== 2) return;
    if (customAnchors.length === 0 && anchors.length > 0) {
      const a = anchors.map((x) => `${x.brandId}~${encodeURIComponent(x.size)}`).join(",");
      window.history.replaceState(null, "", `?a=${a}#translate`);
    } else {
      window.history.replaceState(null, "", window.location.pathname + "#translate");
    }
  }, [step, anchors, customAnchors]);

  const browsingBrand = browsing ? getBrand(browsing) : undefined;
  const browsingProducts = useMemo(() => {
    if (!browsingBrand) return [];
    return products.filter((p) => p.brand === browsingBrand.name);
  }, [browsingBrand]);

  // 앵커로 쓴 상품은 결과 그리드에서 제외한다 (동일 url)
  const usedProductUrls = useMemo(() => {
    const set = new Set<string>();
    for (const a of anchors) {
      const b = getBrand(a.brandId);
      if (b?.url) set.add(b.url);
    }
    for (const c of customAnchors) {
      if (c.url) set.add(c.url);
    }
    return set;
  }, [anchors, customAnchors]);

  // 결과: 전 상품을 클라이언트에서 일괄 번역해 적합도순으로 늘어놓는다 (팀 스펙 §11 확장)
  const fittedRows = useMemo(() => {
    if (step !== 2 || totalAnchors === 0) return [];
    const customs: CustomSource[] = customAnchors.map((c) => ({
      name: c.name,
      size: c.size,
      row: c.row,
    }));
    const opts: FitPref = { fit: fitPref, focus: focusDim };
    return products
      .filter((p) => !usedProductUrls.has(p.url))
      .map((p) => {
        try {
          const fit = translateToRows(anchors, customs, p.sizes, opts);
          const pct = fitPercent(fit.distance);
          const row: ProductRow = { product: p, pct, badgeClassName: fitLabel(pct).className, fit };
          return row;
        } catch {
          return null;
        }
      })
      .filter((r): r is ProductRow => r !== null)
      .sort((a, b) => a.fit.distance - b.fit.distance);
  }, [step, anchors, customAnchors, usedProductUrls, totalAnchors, fitPref, focusDim]);

  const filteredRows = useMemo(() => {
    const q = search2.trim().toLowerCase();
    if (!q) return fittedRows;
    return fittedRows.filter(
      (r) => r.product.brand.toLowerCase().includes(q) || r.product.name.toLowerCase().includes(q),
    );
  }, [fittedRows, search2]);

  const anchorSummaryLabel = useMemo(() => {
    const parts = [
      ...anchors.map((a) => `${getBrand(a.brandId)?.name ?? a.brandId} ${a.size}`),
      ...customAnchors.map((c) => `${c.name} ${c.size}`),
    ];
    return parts.join(" + ");
  }, [anchors, customAnchors]);

  useEffect(() => {
    if (step === 2) {
      gaEvent("view_result", {
        elapsed_ms:
          startedAtRef.current === null
            ? 0
            : Math.max(0, Math.round(window.performance.now() - startedAtRef.current)),
      });
      gaEvent("view_grid", { count: fittedRows.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step === 2 && totalAnchors > 0 && fittedRows.length === 0) {
      gaEvent("predict_unavailable", { reason: "no-comparable-products" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, fittedRows.length]);

  function markStarted(startedAt: number) {
    if (!startedRef.current) {
      startedRef.current = true;
      startedAtRef.current = startedAt;
      gaEvent("start_input");
    }
  }

  function addAnchor(brandId: string, size: string, startedAt: number) {
    markStarted(startedAt);
    const next: Anchor = { brandId, size };
    setAnchors((prev) => {
      const withoutSameBrand = prev.filter((a) => a.brandId !== brandId);
      if (withoutSameBrand.length + customAnchors.length >= 5) return prev;
      return [...withoutSameBrand, next];
    });
  }

  function addCustomAnchor(
    name: string,
    size: string,
    row: SizeRow,
    startedAt: number,
    url?: string,
    brandId?: string,
    via?: "search" | "paste" | "manual",
    product?: string,
  ) {
    markStarted(startedAt);
    setCustomAnchors((prev) => {
      const withoutSame = prev.filter((c) => c.name !== name);
      if (anchors.length + withoutSame.length >= 5) return prev;
      return [...withoutSame, { name, size, row, url, brandId }];
    });
    // AI 발굴 데이터 축적 (팀 제안 2026-07-16): 실패해도 UX에 영향 없어야 하므로 fire-and-forget.
    if (via) {
      fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: name, product: product ?? "", sourceUrl: url ?? "", via, sizes: [row] }),
      }).catch(() => {});
    }
  }

  function removeAnchor(key: string) {
    setAnchors((prev) => prev.filter((a) => anchorKey(a) !== key));
  }

  function removeCustomAnchor(name: string) {
    setCustomAnchors((prev) => prev.filter((c) => c.name !== name));
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
    setC1Mode(mode);
    const parsed = await fetchChart(
      mode,
      mode === "paste" ? { text: c1Text } : { brandName: c1Name, productName: c1Product },
    );
    if (parsed) setC1Parsed(parsed);
    setC1Parsing(false);
  }

  const isManualValid =
    mChest.trim() !== "" &&
    mLength.trim() !== "" &&
    Number.isFinite(parseFloat(mChest)) &&
    Number.isFinite(parseFloat(mLength));

  function addManualAnchor(startedAt: number) {
    if (!isManualValid) return;
    const row: SizeRow = {
      label: "실측",
      length: parseFloat(mLength),
      shoulder: mShoulder.trim() ? parseFloat(mShoulder) : null,
      chest: parseFloat(mChest),
      sleeve: mSleeve.trim() ? parseFloat(mSleeve) : null,
    };
    addCustomAnchor("직접 입력", "실측", row, startedAt, undefined, undefined, "manual");
    setMOpen(false);
    setMLength("");
    setMShoulder("");
    setMChest("");
    setMSleeve("");
  }

  function handleSearchChange(v: string) {
    if (!searchFiredRef.current && v.trim() !== "") {
      searchFiredRef.current = true;
      gaEvent("repeat_query", { via: "search" });
    }
    setSearch2(v);
  }

  function handleFitPrefChange(fit: FitKind) {
    setFitPref(fit);
    gaEvent("repeat_query", { via: "fit-pref", fit, focus: focusDim });
  }

  function handleFocusDimChange(focus: FocusKind) {
    setFocusDim(focus);
    gaEvent("repeat_query", { via: "fit-pref", fit: fitPref, focus });
  }

  return (
    <section id="translate" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div>
        <div className="mx-auto mb-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-evidence">
              {step === 1 && "STEP 1 / 2 · 잘 맞는 옷"}
              {step === 2 && "STEP 2 / 2 · 결과"}
            </p>
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                기준 옷 바꾸기
              </button>
            )}
          </div>
          <div className="mt-3 h-1 rounded-full bg-secondary">
            <div
              className="h-1 rounded-full bg-signal transition-[width] duration-[220ms]"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="mx-auto max-w-2xl">
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
                    onClick={() => {
                      setBrowsing(b.id);
                      setBrowsingProduct(null);
                    }}
                    className={`pressable rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                      browsing === b.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : anchors.some((a) => a.brandId === b.id) ||
                            customAnchors.some((c) => c.brandId === b.id)
                          ? "border-primary bg-background"
                          : "bg-background hover:bg-muted"
                    }`}
                  >
                    {b.name}
                    {(anchors.some((a) => a.brandId === b.id) ||
                      customAnchors.some((c) => c.brandId === b.id)) && (
                      <Check className="ml-1 inline size-3.5" aria-hidden="true" />
                    )}
                  </button>
                ))}
            </div>

            {browsingBrand && browsingProducts.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  {browsingBrand.name}에서 어떤 상품을 갖고 있나요?
                </p>
                <div className="mt-2 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                  {browsingProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setBrowsingProduct(p)}
                      className={`pressable overflow-hidden rounded-md border text-left transition-colors ${
                        browsingProduct?.id === p.id
                          ? "border-primary bg-background"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <div className="relative aspect-[4/5] bg-muted">
                        {p.image && (
                          <Image src={p.image} alt={p.name} fill sizes="120px" className="object-cover" />
                        )}
                      </div>
                      <p className="truncate p-1.5 text-[0.65rem]">{p.name}</p>
                    </button>
                  ))}
                </div>

                {browsingProduct && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">입는 사이즈는? (라벨 그대로)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {browsingProduct.sizes.map((s) => {
                        const seedRep = isSeedRepresentative(browsingProduct, browsingBrand);
                        const selected = seedRep
                          ? anchors.some((a) => a.brandId === browsingBrand.id && a.size === s.label)
                          : customAnchors.some(
                              (c) => c.url === browsingProduct.url && c.size === s.label,
                            );
                        return (
                          <button
                            key={s.label}
                            type="button"
                            onClick={(event) =>
                              seedRep
                                ? addAnchor(browsingBrand.id, s.label, event.timeStamp)
                                : addCustomAnchor(
                                    `${browsingBrand.name} ${browsingProduct.name.slice(0, 20)}`,
                                    s.label,
                                    s,
                                    event.timeStamp,
                                    browsingProduct.url,
                                    browsingBrand.id,
                                  )
                            }
                            className={`pressable rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
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
              </div>
            )}

            {browsingBrand && browsingProducts.length === 0 && (
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
                        onClick={(event) => addAnchor(browsingBrand.id, s.label, event.timeStamp)}
                        className={`pressable rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
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
                className="pressable flex w-full items-center gap-1.5 rounded-md text-sm font-medium text-evidence"
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
                    className="pressable w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-primary"
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
                              onClick={(event) =>
                                addCustomAnchor(
                                  name,
                                  s.label,
                                  s,
                                  event.timeStamp,
                                  c1Parsed.sourceUrl || undefined,
                                  undefined,
                                  c1Mode,
                                  c1Product.trim() || undefined,
                                )
                              }
                              className={`pressable rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
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

            <div className="mt-4 rounded-lg border border-dashed p-4">
              <button
                type="button"
                onClick={() => setMOpen((v) => !v)}
                className="pressable flex w-full items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground"
              >
                <Ruler className="size-4" aria-hidden="true" />
                줄자 없이 어려우면? 실측 치수로 직접 입력
              </button>
              {mOpen && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-muted-foreground">
                      총장(cm)
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={mLength}
                        onChange={(e) => setMLength(e.target.value)}
                        className="mt-1"
                      />
                    </label>
                    <label className="block text-xs text-muted-foreground">
                      어깨너비(cm)
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={mShoulder}
                        onChange={(e) => setMShoulder(e.target.value)}
                        className="mt-1"
                      />
                    </label>
                    <label className="block text-xs text-muted-foreground">
                      가슴단면(cm) · 둘레÷2
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={mChest}
                        onChange={(e) => setMChest(e.target.value)}
                        className="mt-1"
                      />
                    </label>
                    <label className="block text-xs text-muted-foreground">
                      소매길이(cm)
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={mSleeve}
                        onChange={(e) => setMSleeve(e.target.value)}
                        className="mt-1"
                      />
                    </label>
                  </div>
                  <Button
                    variant="outline"
                    disabled={!isManualValid}
                    onClick={(event) => addManualAnchor(event.timeStamp)}
                    className="w-full"
                  >
                    <Plus className="mr-1 size-3.5" aria-hidden="true" /> 이 치수로 추가
                  </Button>
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
              결과 보기 <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">『{anchorSummaryLabel}』</span>이 잘
                맞는 분께
              </p>
            </div>

            <div className="relative mt-4">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search2}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="브랜드·상품명 검색 (예: 나이키, 드라이핏)"
                className="pl-9"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              적합도와 추천 사이즈는 각 상품의 실측표 기준이에요.
            </p>

            <div className="mt-3 rounded-md border bg-card p-4">
              <p className="eyebrow text-evidence">추천 조건 설정</p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-muted-foreground">원하는 핏</p>
                <div className="flex flex-wrap gap-1.5">
                  {FIT_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => handleFitPrefChange(o.key)}
                      className={`rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        fitPref === o.key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-muted-foreground">중요하게 볼 치수</p>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => handleFocusDimChange(o.key)}
                      className={`rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        focusDim === o.key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredRows.length > 0 ? (
              <ProductGrid rows={filteredRows} />
            ) : fittedRows.length === 0 ? (
              <p className="mt-6 rounded-md border border-danger/40 bg-danger/5 p-4 text-center text-sm text-danger">
                이 조합으로는 아직 비교할 실측 상품을 찾지 못했어요. 다른 옷을 앵커로 추가해 보세요.
              </p>
            ) : (
              <p className="mt-6 rounded-md border p-4 text-center text-sm text-muted-foreground">
                &lsquo;{search2}&rsquo;와 일치하는 상품이 없어요. 다른 검색어로 시도해 보세요.
              </p>
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
