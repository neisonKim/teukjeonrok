import type { Metadata } from "next";
import "./globals.css";
import "./archive.css";
import "./reading.css";
import { PageMetrics } from "./analytics-client";
import { siteUrl } from "../lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: { title: "특전록 | 기록으로 만나는 대한민국 특수작전의 역사", description: "KLO·8240부터 오늘의 전문 전력까지. 쉬운 설명과 공개 근거를 함께 읽는 독립 역사 아카이브.", url: "/", siteName: "특전록", locale: "ko_KR", type: "website", images: [{ url: "/assets/share-preview.jpg", width: 1200, height: 630, alt: "특전록 · 기록으로 남은 임무, 사람, 시대" }] },
  twitter: { card: "summary_large_image", images: ["/assets/share-preview.jpg"] },
  title: "특전록 | 기록으로 만나는 대한민국 특수작전의 역사",
  description: "한국전쟁기 유격대부터 오늘날의 특수작전·구조·항공 지원 전력과 국군정보사령부까지. 초보자를 위한 쉬운 설명과 공개 자료의 근거를 함께 읽는 독립 역사 아카이브.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}<PageMetrics/></body>
    </html>
  );
}
