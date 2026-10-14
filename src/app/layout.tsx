import type { Metadata, Viewport } from "next";
import { Diphylleia } from "next/font/google";
import { wedding } from "@/data/wedding";
import { basePath } from "@/lib/asset";
import "./globals.css";

const display = Diphylleia({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.share.title,
  description: wedding.share.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${basePath}/`,
    siteName: wedding.share.title,
    title: wedding.share.title,
    description: wedding.share.description,
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.share.title,
    description: wedding.share.description,
  },
  // 공유 링크가 검색엔진에 노출되지 않도록
  robots: { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf8f1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={display.variable}>
      <head>
        {/* 웹폰트 서버에 미리 연결해서 글꼴이 늦게 바뀌는 시간을 줄임 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* 가비아 흘돋체(한국어 전체)·마음결체(섹션 영문 제목): 글자 범위별로 쪼갠 파일이라 화면에 쓰인 글자만 내려받음 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/GabiaHeuldot/subsets/GabiaHeuldot-dynamic-subset.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/fonts-archive/GabiaMaeumgyeol/subsets/GabiaMaeumgyeol-dynamic-subset.css"
        />
        {/* Pretendard Variable: 약도 글자 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
