import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.msscdn.net" },
      { protocol: "https", hostname: "image.musinsa.com" },
      // 나이키 상품 이미지 출처 (croket 셀러 페이지 og:image) — 미등록 시 next/image가 런타임 크래시
      { protocol: "https", hostname: "before-images-item.croketglobal.net" },
    ],
  },
};

export default nextConfig;
