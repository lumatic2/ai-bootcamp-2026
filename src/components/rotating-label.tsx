"use client";

import { useEffect, useState } from "react";

// 같은 몸에 브랜드마다 다른 이름이 붙는다는 걸 헤드라인에서 그대로 보여준다.
const LABELS = ["M", "95", "L", "100", "XL", "66"];

export function RotatingLabel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % LABELS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-grid w-[3.4ch] place-items-center overflow-hidden align-baseline font-mono shadow-[inset_0_-0.16em_0_0_var(--signal)]">
      <span key={index} className="animate-label-swap inline-block">
        {LABELS[index]}
      </span>
    </span>
  );
}
