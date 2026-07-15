"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageSquareQuote, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { gaEvent } from "@/lib/ga";
import { brands, DIM_LABELS, getBrand } from "@/lib/sizecharts";
import type { Confidence, TranslateResult } from "@/lib/translate";

type Mining = {
  larger: number;
  fit: number;
  smaller: number;
  quotes: { text: string; signal: string }[];
};

const CONFIDENCE_UI: Record<Confidence, { label: string; className: string }> = {
  high: { label: "신뢰도 높음", className: "bg-success text-primary-foreground" },
  mid: { label: "신뢰도 보통", className: "bg-warning text-primary-foreground" },
  low: { label: "신뢰도 낮음", className: "bg-danger text-primary-foreground" },
};

const SIGNAL_LABEL: Record<string, string> = {
  larger: "크게 나와요",
  fit: "정사이즈",
  smaller: "작게 나와요",
};

export function Translator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sourceBrand, setSourceBrand] = useState<string | null>(null);
  const [sourceSize, setSourceSize] = useState<string | null>(null);
  const [targetBrand, setTargetBrand] = useState<string | null>(null);
  const [reviews, setReviews] = useState("");
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [mining, setMining] = useState<Mining | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adopted, setAdopted] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const startedRef = useRef(false);
  const mountedAtRef = useRef<number>(0);
  useEffect(() => {
    mountedAtRef.current = Date.now();
    // 공유 URL(?from=&size=&to=)로 진입 시 동일 결과 자동 재생
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const size = params.get("size");
    const to = params.get("to");
    if (from && size && to && getBrand(from)?.sizes.some((s) => s.label === size) && getBrand(to)) {
      setTimeout(() => {
        setSourceBrand(from);
        setSourceSize(size);
        setTargetBrand(to);
        void submit(from, size, to, "");
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const source = sourceBrand ? getBrand(sourceBrand) : undefined;

  function pickSourceBrand(id: string) {
    if (!startedRef.current) {
      startedRef.current = true;
      gaEvent("start_input");
    }
    setSourceBrand(id);
    setSourceSize(null);
  }

  async function submit(
    sb: string | null = sourceBrand,
    ss: string | null = sourceSize,
    tb: string | null = targetBrand,
    reviewText: string = reviews,
  ) {
    if (!sb || !ss || !tb) return;
    setLoading(true);
    setError(null);
    setMining(null);

    const translateReq = fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceBrand: sb, sourceSize: ss, targetBrand: tb }),
    });
    const miningReq = reviewText.trim()
      ? fetch("/api/mine-reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews: reviewText }),
        })
      : null;

    try {
      const res = await translateReq;
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        gaEvent("predict_unavailable", { reason: String(data?.error ?? res.status) });
        setError("이 조합은 아직 번역할 수 없어요. 다른 브랜드로 시도해 주세요.");
        return;
      }
      const data: TranslateResult = await res.json();
      setResult(data);
      setStep(3);
      // 결과를 URL로 재현·공유 가능하게 (카톡 공유 → 동일 결과 자동 재생)
      const qs = new URLSearchParams({ from: sb, size: ss, to: tb }).toString();
      window.history.replaceState(null, "", `?${qs}#translate`);
      gaEvent("view_result", {
        source_brand: data.sourceBrandId,
        target_brand: data.targetBrandId,
        recommended: data.recommended,
        confidence: data.confidence,
        elapsed_ms: Date.now() - mountedAtRef.current,
      });

      if (miningReq) {
        const mres = await miningReq;
        if (mres.ok) setMining(await mres.json());
      }
    } catch {
      gaEvent("predict_unavailable", { reason: "network" });
      setError("네트워크 오류가 났어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  function repeatQuery() {
    gaEvent("repeat_query", { source_brand: sourceBrand ?? "" });
    setTargetBrand(null);
    setReviews("");
    setResult(null);
    setMining(null);
    setAdopted(false);
    setFeedback(null);
    setError(null);
    setStep(2);
  }

  function resetAll() {
    setSourceBrand(null);
    setSourceSize(null);
    setTargetBrand(null);
    setReviews("");
    setResult(null);
    setMining(null);
    setAdopted(false);
    setFeedback(null);
    setError(null);
    setStep(1);
  }

  return (
    <section id="translate" className="mx-auto w-full max-w-xl px-5 py-10 sm:px-0">
      <div className="rounded-xl border bg-card p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <p className="eyebrow text-evidence">
            {step === 1 && "STEP 1 / 3 — 잘 맞는 옷"}
            {step === 2 && "STEP 2 / 3 — 사려는 옷"}
            {step === 3 && "STEP 3 / 3 — 번역 결과"}
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

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold">
              지금 갖고 있는 옷 중, <span className="text-evidence">제일 잘 맞는 반팔티</span>는
              어느 브랜드인가요?
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => pickSourceBrand(b.id)}
                  className={`rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                    sourceBrand === b.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {source && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">그 옷 사이즈는? (라벨 그대로)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {source.sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSourceSize(s.label)}
                      className={`rounded-md border px-3.5 py-2 font-mono text-sm transition-colors ${
                        sourceSize === s.label
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="mt-7 h-11 w-full"
              disabled={!sourceBrand || !sourceSize}
              onClick={() => setStep(2)}
            >
              다음 <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold">
              어느 브랜드 반팔티를 <span className="text-evidence">사려고</span> 하나요?
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {brands
                .filter((b) => b.id !== sourceBrand)
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setTargetBrand(b.id)}
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

            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                사려는 상품의 리뷰가 있다면 붙여넣어 주세요.{" "}
                <span className="text-xs">(선택 — AI가 &ldquo;크게/작게 나와요&rdquo; 신호를 찾아드려요)</span>
              </p>
              <textarea
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                rows={4}
                placeholder="리뷰 텍스트 붙여넣기 (선택)"
                className="mt-2 w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-danger/40 bg-danger/5 p-3 text-sm text-danger">
                {error}
              </p>
            )}

            <Button
              className="mt-7 h-11 w-full"
              disabled={!targetBrand || loading}
              onClick={() => submit()}
            >
              {loading ? "번역 중..." : "사이즈 번역하기"}
              {!loading && <ArrowRight data-icon="inline-end" />}
            </Button>
          </div>
        )}

        {step === 3 && result && (
          <div>
            <p className="text-sm text-muted-foreground">
              {result.sourceBrandName} <span className="font-mono">{result.sourceSize}</span>
              이 잘 맞는 분께, {result.targetBrandName}에서는
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
                애매하면 <span className="font-mono">{result.runnerUp}</span>도 후보예요.
              </p>
            )}

            <div className="mt-6 rounded-lg border bg-muted/40 p-4">
              <p className="eyebrow text-muted-foreground">근거 1 — 실측 비교 (cm)</p>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-1 font-normal">부위</th>
                    <th className="py-1 font-normal">내 옷</th>
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
                        className={`py-1.5 ${Math.abs(d.delta) >= 2 ? "text-danger" : "text-muted-foreground"}`}
                      >
                        {d.delta > 0 ? `+${d.delta}` : d.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-muted-foreground">
                기준 상품: {result.targetProduct}
              </p>
            </div>

            {mining && (mining.larger + mining.fit + mining.smaller > 0 || mining.quotes.length > 0) && (
              <div className="mt-4 rounded-lg border bg-muted/40 p-4">
                <p className="eyebrow flex items-center gap-1.5 text-muted-foreground">
                  <MessageSquareQuote className="size-3.5" aria-hidden="true" />
                  근거 2 — 리뷰 핏 신호 (AI 추출)
                </p>
                <p className="mt-3 font-mono text-sm">
                  크게 {mining.larger} · 정사이즈 {mining.fit} · 작게 {mining.smaller}
                </p>
                {mining.quotes.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {mining.quotes.map((q) => (
                      <li key={q.text} className="text-sm text-muted-foreground">
                        &ldquo;{q.text}&rdquo;
                        <span className="ml-1.5 text-xs text-evidence">
                          {SIGNAL_LABEL[q.signal] ?? q.signal}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

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
                  좋은 선택! 입어보시면 결과를 알려주세요.
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
                    피드백 감사합니다 — 번역기가 더 정확해지는 데 쓰여요.
                  </p>
                )}
              </div>

              <Button variant="ghost" className="h-10 w-full" onClick={repeatQuery}>
                <RotateCcw data-icon="inline-start" /> 다른 브랜드도 해보기
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        지원: 반팔 티셔츠 · {brands.length}개 브랜드 (무신사 실측표 기준) — 계속 늘어나요
      </p>
    </section>
  );
}
