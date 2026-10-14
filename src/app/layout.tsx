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
      <body>{children}</body>
    </html>
  );
}
