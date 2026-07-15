import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// 본문은 Pretendard(CDN variable), 숫자·라벨은 Space Grotesk — 팀 스펙 타이포 조합
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bootcamp.askewly.com"),
  title: "너비 · 처음 보는 브랜드도 내 사이즈로",
  description:
    "잘 맞는 브랜드와 사이즈만 알려주세요. 처음 사는 브랜드의 사이즈를 실측 데이터와 리뷰 신호로 번역해 드립니다.",
  openGraph: {
    title: "너비 · 사이즈 번역기",
    description: "줄자 없이, 잘 맞는 옷 하나로 다른 브랜드 사이즈를 번역해 드려요.",
    url: "https://bootcamp.askewly.com",
    siteName: "너비",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "ko_KR",
    type: "website",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          precedence="default"
        />
        {children}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
