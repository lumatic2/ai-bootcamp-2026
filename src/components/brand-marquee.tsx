import { brands } from "@/lib/sizecharts";

// 지원 브랜드 48개가 히어로 아래를 잔잔히 흐른다. 말이 아니라 눈으로 보이는 커버리지.
export function BrandMarquee() {
  const names = brands.map((b) => b.name);
  return (
    <div className="marquee-mask overflow-hidden py-5" aria-label={`지원 브랜드 ${names.length}개`}>
      <div className="animate-marquee flex w-max items-center gap-8">
        {[...names, ...names].map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= names.length}
            className="text-sm whitespace-nowrap text-muted-foreground/70"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
