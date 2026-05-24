import type { Metadata } from "next";
import "./globals.css";
import TouchCursor from "@/components/TouchCursor";

export const metadata: Metadata = {
  title: "dotlo prototype",
  description: "Interactive mobile prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Spoqa Han Sans Neo — jsDelivr CDN */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@01ff0283e4f36e159ebfe2b6e575d1d16cf42d4f/Subset/SpoqaHanSansNeo/SpoqaHanSansNeo.css"
        />
        {/* Material Symbols Rounded — 가변 폰트 (opsz/wght/FILL/GRAD) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200"
        />
      </head>
      <body className="h-full bg-[#1a1a1a] flex items-center justify-center">
        {/* 글래스 터치 인디케이터 (데스크톱만) */}
        <TouchCursor />

        {/* 모바일 프레임 — 375×812 고정, 폰처럼 보이게 */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            width: 375,
            height: 812,
            borderRadius: 44,
            boxShadow:
              "0 0 0 10px #2a2a2a, 0 30px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
