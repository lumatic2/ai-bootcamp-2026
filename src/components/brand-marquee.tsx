import { brands } from "@/lib/sizecharts";

// 지원 브랜드 48개가 검정 밴드 위를 잔잔히 흐른다. 장식이 아니라 "지원 범위" 설명.
export function BrandMarquee() {
  const names = brands.map((b) => b.name);
  return (
    <div className="marquee-mask overflow-hidden py-3.5" aria-label={`지원 브랜드 ${names.length}개`}>
      <div className="animate-marquee flex w-max items-center gap-8">
        {[...names, ...names].map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= names.length}
            className="text-sm whitespace-nowrap text-primary-foreground/75"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
