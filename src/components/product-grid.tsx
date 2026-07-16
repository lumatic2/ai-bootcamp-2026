"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { gaEvent } from "@/lib/ga";

// 무신사 TOP500 수집분 (src/data/products.json) — 시드 브랜드와 이름이 일치하는 상품만 노출
export type Product = {
  rank: number;
  name: string;
  brand: string;
  price: number;
  listPrice: number | null;
  discountPct: number | null;
  image: string;
  url: string;
};

export type ProductRow = {
  product: Product;
  brandId: string;
  pct: number;
  badgeClassName: string;
  recommended: string;
  chestDelta: number | null;
  lengthDelta: number | null;
};

function deltaText(v: number | null) {
  if (v === null) return "—";
  if (Math.abs(v) <= 0.5) return "거의 같음";
  return `${v > 0 ? "+" : ""}${v}cm`;
}

export function ProductGrid({
  rows,
  onCompare,
}: {
  rows: ProductRow[];
  onCompare: (brandId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const shown = open ? rows : rows.slice(0, 12);

  return (
    <div className="mt-8 border-t pt-6">
      <p className="eyebrow text-muted-foreground">이 기준으로 살 수 있는 옷 · 적합도순</p>
      <p className="mt-1 text-xs text-muted-foreground">
        적합도와 추천 사이즈는 각 브랜드의 대표 실측표 기준이에요. 상품별 실측은 판매처에서 한
        번 더 확인하세요.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
        {shown.map(({ product: p, brandId, pct, badgeClassName, recommended, chestDelta, lengthDelta }) => (
          <div key={p.url} className="overflow-hidden rounded-md border bg-background">
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
                추천 {recommended}
              </span>
            </div>
            <div className="p-2.5">
              <p className="truncate text-[0.7rem] text-muted-foreground">{p.brand}</p>
              <p className="truncate text-xs font-semibold">{p.name}</p>
              <p className="mt-1 text-sm font-semibold">
                {p.price.toLocaleString()}원{" "}
                {p.discountPct !== null && p.discountPct > 0 && (
                  <span className="text-[0.7rem] font-normal text-muted-foreground">
                    {p.discountPct}%↓
                  </span>
                )}
              </p>
              <p className="mt-1 truncate text-[0.7rem] text-muted-foreground">
                가슴 {deltaText(chestDelta)} · 총장 {deltaText(lengthDelta)}
              </p>
              <div className="mt-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onCompare(brandId)}
                  className="flex-1 rounded-sm border bg-card px-2 py-1.5 text-[0.7rem] font-medium whitespace-nowrap hover:bg-muted"
                >
                  상세비교
                </button>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    let host = "";
                    try {
                      host = new URL(p.url).hostname;
                    } catch {}
                    gaEvent("outbound_click", { target_brand: brandId, url_host: host });
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-sm border bg-card px-2 py-1.5 text-[0.7rem] font-medium whitespace-nowrap hover:bg-muted"
                >
                  판매처 <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rows.length > 12 && (
        <Button variant="ghost" className="mt-3 h-10 w-full" onClick={() => setOpen((v) => !v)}>
          {open ? "접기" : `전체 ${rows.length}개 상품 보기`}
        </Button>
      )}
    </div>
  );
}
