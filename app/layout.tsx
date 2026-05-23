import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TouchCursor from "@/components/TouchCursor";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "dotlo prototype",
  description: "Interactive mobile prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
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
