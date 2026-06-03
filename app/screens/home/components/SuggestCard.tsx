"use client";

import { ChevronRight } from "lucide-react";

interface SuggestCardProps {
  image?: string;
  badge?: string;
  title: string;
  subtitle: string;
  courseCount: number;
  bgColor?: string;
}

export default function SuggestCard({
  image,
  badge,
  title,
  subtitle,
  courseCount,
  bgColor = "#5ED6C3",
}: SuggestCardProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: 264,
        height: 142,
        background: bgColor,
        borderRadius: 12,
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 상단 어두운 그라데이션 (가독성 — Figma 사양 그대로) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 270,
          height: 91,
          left: -3,
          top: 0,
          background:
            "linear-gradient(180deg, rgba(43, 43, 43, 0.62) 0%, rgba(91, 87, 87, 0.4464) 71.15%, rgba(135, 135, 135, 0) 100%)",
        }}
      />

      {/* 제목 */}
      <p
        className="absolute"
        style={{
          left: 13,
          top: 9,
          width: 107,
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 16,
          fontWeight: 700,
          lineHeight: "20px",
          color: "#FFFFFF",
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </p>

      {/* 부제 */}
      <p
        className="absolute"
        style={{
          left: 13,
          top: 53,
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 10,
          fontWeight: 400,
          lineHeight: "13px",
          color: "#FFFFFF",
        }}
      >
        {subtitle}
      </p>

      {/* 우측 상단 배지 (호캉스 등) */}
      {badge && (
        <div
          className="absolute inline-flex items-center justify-center"
          style={{
            top: 9,
            right: 9,
            height: 19,
            padding: "0 10px",
            background: "#E0FBFF",
            borderRadius: 10,
          }}
        >
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 10,
              fontWeight: 500,
              lineHeight: "13px",
              color: "#007A8A",
            }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* "코스 N개 확인하기" 버튼 — 우측 하단 */}
      <button
        className="absolute inline-flex items-center"
        style={{
          left: 148,
          top: 110,
          width: 107,
          height: 23,
          padding: "0 10px",
          background: "#FFFFFF",
          borderRadius: 8,
          gap: 7,
        }}
      >
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "13px",
            color: "#5B5F67",
          }}
        >
          코스 {courseCount}개 확인하기
        </span>
        <ChevronRight size={12} color="#A8A8A9" strokeWidth={1.8} />
      </button>
    </div>
  );
}
