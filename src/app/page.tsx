import {
  ArrowDown,
  ArrowRight,
  Box,
  ChartNoAxesColumnIncreasing,
  Check,
  CircleDot,
  Database,
  Lightbulb,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const loop = [
  {
    label: "Idea",
    title: "가설",
    description: "누가, 어떤 상황에서, 무엇 때문에 어려운지 반증 가능하게 적습니다.",
    icon: Lightbulb,
  },
  {
    label: "Build",
    title: "만들기",
    description: "학습에 필요한 최소 surface만 골라 가장 작은 실험을 만듭니다.",
    icon: Box,
  },
  {
    label: "Product",
    title: "제품",
    description: "사용자가 직접 만지고 행동할 수 있는 형태로 전달합니다.",
    icon: CircleDot,
  },
  {
    label: "Measure",
    title: "측정",
    description: "Build 전에 합의한 metric과 판정 기준으로 관찰합니다.",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: "Data",
    title: "데이터",
    description: "raw data, 표본, 누락과 한계를 해석과 분리해 남깁니다.",
    icon: Database,
  },
  {
    label: "Learn",
    title: "학습",
    description: "가설을 판단하고 keep, change, stop과 다음 가설을 결정합니다.",
    icon: ArrowRight,
  },
];

const readyItems = [
  "문제 후보와 근거를 모으는 45분 킥오프",
  "측정 기준을 Build 전에 정하는 3일 플레이북",
  "Next.js · Tailwind v4 · shadcn/ui 실행 환경",
  "lint 가능한 임시 DESIGN.md와 evidence 계약",
];

export default function Home() {
  return (
    <main>
      <header className="border-b bg-card">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              3D
            </span>
            <div>
              <p className="text-sm font-semibold">AI Bootcamp Workbench</p>
              <p className="font-mono text-[0.65rem] text-muted-foreground">2026 · EVIDENCE LOOP</p>
            </div>
          </div>
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            Foundation ready
          </span>
        </div>
      </header>

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5 text-evidence">Hypothesis-driven product sprint</p>
            <h1 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
              아이디어보다,
              <br />
              <span className="text-muted-foreground">어떻게 배웠는지</span>를 만든다.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              문제를 고른 근거부터 가설, 제품, 측정 데이터, 다음 결정까지. 3일 동안 팀의 판단을
              하나의 재현 가능한 evidence chain으로 연결합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="h-10 px-4" size="lg" nativeButton={false} render={<a href="#kickoff" />}>
                첫 45분 시작하기
                <ArrowDown data-icon="inline-end" />
              </Button>
              <Button className="h-10 px-4" size="lg" variant="outline" nativeButton={false} render={<a href="#loop" />}>
                전체 루프 보기
              </Button>
            </div>
          </div>

          <aside className="rounded-xl border bg-muted p-5 sm:p-6" aria-label="현재 준비 상태">
            <p className="eyebrow text-muted-foreground">Before the team arrives</p>
            <ul className="mt-5 space-y-4">
              {readyItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="loop" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3 text-evidence">The loop</p>
          <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">모든 단계가 다음 판단의 근거가 됩니다.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            기능을 만든 것으로 끝내지 않습니다. 데이터가 없으면 측정 전이고, 다음 결정이 없으면 학습 전입니다.
          </p>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {loop.map(({ label, title, description, icon: Icon }, index) => (
            <li key={label} className="group min-h-56 bg-card p-6 transition-colors hover:bg-muted/60">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-lg border bg-background text-evidence">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="eyebrow mt-8 text-muted-foreground">{label}</p>
              <h3 className="mt-1 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="kickoff" className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="eyebrow text-primary-foreground/60">Next action</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">팀이 모이면, 코딩보다 먼저.</h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              ["01", "문제 후보", "사실과 해석을 분리해 최대 두 개"],
              ["02", "첫 가설", "한 번의 관찰로 틀릴 수 있게"],
              ["03", "측정 계약", "metric과 판정 기준을 Build 전에"],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-lg border border-white/15 bg-white/5 p-4">
                <p className="font-mono text-xs text-white/50">{number}</p>
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-white/65">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>AI Vibe Coding Bootcamp · 3-day evidence loop</p>
        <p className="font-mono">HYPOTHESIS → BUILD → MEASURE → LEARN</p>
      </footer>
    </main>
  );
}
