"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, ExternalLink, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { gaEvent } from "@/lib/ga";
import { DIM_LABELS, type SizeRow } from "@/lib/sizecharts";
import type { RowFit } from "@/lib/translate";

// 상품별 실측 차트 (src/data/product-charts.json) — 2스텝 리빌드(2026-07-16)에서
// 브랜드 대표값 대신 상품 단위로 적합도를 계산해 이 그리드가 결과 화면의 메인이 된다.
export type Product = {
  id: string;
  brandId: string | null;
  brand: string;
  name: string;
  url: string;
  image: string | null;
  price: number | null;
  sizes: SizeRow[];
};

export type ProductRow = {
  product: Product;
  pct: number;
  badgeClassName: string;
  fit: RowFit;
};

type SortKey = "fit" | "priceAsc" | "priceDesc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "fit", label: "적합도순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
];

export function ProductGrid({ rows }: { rows: ProductRow[] }) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("fit");
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "hit" | "miss">>({});
  const sorted =
    sort === "fit"
      ? rows
      : [...rows].sort((a, b) => {
          // 가격 없는 상품은 정렬 뒤로
          if (a.product.price === null) return 1;
          if (b.product.price === null) return -1;
          return sort === "priceAsc"
            ? a.product.price - b.product.price
            : b.product.price - a.product.price;
        });
  const shown = open ? sorted : sorted.slice(0, 12);

  return (
    <div className="mt-5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSort(s.key)}
            className={`rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              sort === s.key
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
        {shown.map(({ product: p, pct, badgeClassName, fit }) => {
          const expanded = expandedUrl === p.url;
          const feedback = feedbackMap[p.url] ?? null;
          return (
            <div key={p.url} className="overflow-hidden rounded-md border bg-background">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  let host = "";
                  try {
                    host = new URL(p.url).hostname;
                  } catch {}
                  const target = p.brandId ?? p.brand;
                  gaEvent("outbound_click", { target_brand: target, url_host: host });
                  gaEvent("adopt_size", {
                    via: "card",
                    target_brand: target,
                    recommended: fit.recommended,
                    confidence: fit.confidence,
                  });
                }}
                className="block"
              >
                <div className="relative aspect-[4/5] bg-muted">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:744px) 33vw, 50vw"
                      className="object-cover"
                    />
                  )}
                  <span
                    className={`absolute top-1.5 left-1.5 rounded-xs px-1.5 py-0.5 text-[0.65rem] font-semibold ${badgeClassName}`}
                  >
                    {pct}%
                  </span>
                  <span className="absolute top-1.5 right-1.5 rounded-xs bg-primary px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-primary-foreground">
                    추천 {fit.recommended}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[0.7rem] text-muted-foreground">{p.brand}</p>
                  <p className="truncate text-xs font-semibold">{p.name}</p>
                  {p.price !== null && (
                    <p className="mt-1 text-sm font-semibold">{p.price.toLocaleString()}원</p>
                  )}
                </div>
              </a>
              <div className="px-2.5 pb-2.5">
                <button
                  type="button"
                  onClick={() => setExpandedUrl(expanded ? null : p.url)}
                  className="flex w-full items-center justify-center gap-1 rounded-sm border bg-card px-2 py-1.5 text-[0.7rem] font-medium hover:bg-muted"
                >
                  비교{" "}
                  <ChevronDown
                    className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {expanded && (
                <div className="border-t bg-muted/40 p-2.5">
                  <table className="w-full text-[0.7rem]">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="py-1 font-normal">부위</th>
                        <th className="py-1 font-normal">내 옷</th>
                        <th className="py-1 font-normal">이 상품</th>
                        <th className="py-1 font-normal">차이</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {fit.deltas.map((d) => (
                        <tr key={d.dim} className="border-t border-border/60">
                          <td className="py-1 font-sans">{DIM_LABELS[d.dim]}</td>
                          <td className="py-1">{d.source}</td>
                          <td className="py-1">{d.target}</td>
                          <td
                            className={`py-1 ${Math.abs(d.delta) >= 2 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                          >
                            {Math.abs(d.delta) <= 0.5 ? "거의 같음" : d.delta > 0 ? `+${d.delta}` : d.delta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 flex gap-1.5">
                    {feedback === null ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackMap((m) => ({ ...m, [p.url]: "hit" }));
                            gaEvent("feedback_fit", { fit: "hit", brand: p.brand, product: p.name });
                          }}
                          className="flex flex-1 items-center justify-center gap-1 rounded-sm border bg-card px-2 py-1.5 text-[0.7rem] font-medium hover:bg-muted"
                        >
                          <Check className="size-3" aria-hidden="true" /> 맞았어요
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFeedbackMap((m) => ({ ...m, [p.url]: "miss" }));
                            gaEvent("feedback_fit", { fit: "miss", brand: p.brand, product: p.name });
                          }}
                          className="flex flex-1 items-center justify-center gap-1 rounded-sm border bg-card px-2 py-1.5 text-[0.7rem] font-medium hover:bg-muted"
                        >
                          <X className="size-3" aria-hidden="true" /> 틀렸어요
                        </button>
                      </>
                    ) : (
                      <p className="w-full text-center text-[0.7rem] text-muted-foreground">
                        알려주셔서 고마워요. 번역기가 더 정확해지는 데 쓰여요.
                      </p>
                    )}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center justify-center gap-1 text-[0.7rem] text-evidence underline"
                  >
                    판매처에서 보기 <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {rows.length > 12 && (
        <Button variant="ghost" className="mt-3 h-10 w-full" onClick={() => setOpen((v) => !v)}>
          {open ? "접기" : `전체 ${rows.length}개 보기`}
        </Button>
      )}
    </div>
  );
}
