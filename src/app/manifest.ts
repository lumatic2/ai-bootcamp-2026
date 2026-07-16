import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "너비 · 사이즈 번역기",
    short_name: "너비",
    description:
      "잘 맞는 브랜드와 사이즈만 알려주세요. 처음 사는 브랜드의 사이즈를 실측 데이터와 리뷰 신호로 번역해 드립니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F6F0",
    theme_color: "#141414",
    lang: "ko",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
