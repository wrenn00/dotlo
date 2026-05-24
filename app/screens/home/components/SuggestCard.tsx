"use client";

interface SuggestCardProps {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  courseCount: number;
  /** rgb 트리플 (예: "0, 225, 255") — 카드 상단 그라데이션 색상 */
  gradientRgb?: string;
}

export default function SuggestCard({
  image,
  badge,
  title,
  subtitle,
  courseCount,
  gradientRgb = "0, 225, 255",
}: SuggestCardProps) {
  return (
    <div
      className="relative shrink-0 rounded-3xl overflow-hidden"
      style={{
        width: 264,
        height: 142,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 상단 그라데이션 오버레이 — 작은 카드에 맞춰 더 길게 덮음 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(${gradientRgb}, 0.7) 0%, rgba(${gradientRgb}, 0.2) 60%, transparent 100%)`,
        }}
      />

      {/* 배지 — 우측 상단 */}
      <div
        className="absolute z-10 px-2.5 py-1 rounded-full"
        style={{ top: 12, right: 12, background: "rgba(255,255,255,0.95)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: "#090738" }}>{badge}</span>
      </div>

      {/* 제목 + 부제 — 좌측 상단 */}
      <div className="absolute z-10" style={{ top: 12, left: 12, right: 80 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            lineHeight: "20px",
            whiteSpace: "pre-line",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.95)",
            marginTop: 4,
            textShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 코스 N개 확인하기 — 우측 하단 */}
      <button
        className="absolute z-10 inline-flex items-center gap-0.5 px-3 py-1.5 rounded-full"
        style={{ bottom: 12, right: 12, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.14)" }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#090738" }}>
          코스 {courseCount}개 확인하기
        </span>
        <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
          <path d="M1 1l3 3.5L1 8" stroke="#090738" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
