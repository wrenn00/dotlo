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
        width: 288,
        height: 224,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 상단 그라데이션 오버레이 — 글자 가독성 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(${gradientRgb}, 0.7) 0%, rgba(${gradientRgb}, 0.3) 40%, transparent 70%)`,
        }}
      />

      {/* 배지 — 우측 상단 */}
      <div
        className="absolute z-10 px-3 py-1.5 rounded-full"
        style={{ top: 16, right: 16, background: "rgba(255,255,255,0.95)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#090738" }}>{badge}</span>
      </div>

      {/* 제목 + 부제 — 좌측 상단 */}
      <div className="absolute z-10" style={{ top: 16, left: 16, right: 96 }}>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            lineHeight: "26px",
            whiteSpace: "pre-line",
            textShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.95)",
            marginTop: 6,
            textShadow: "0 1px 2px rgba(0,0,0,0.18)",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 코스 N개 확인하기 — 우측 하단 */}
      <button
        className="absolute z-10 inline-flex items-center gap-1 px-4 py-2 rounded-full"
        style={{ bottom: 16, right: 16, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#090738" }}>
          코스 {courseCount}개 확인하기
        </span>
        <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
          <path d="M1 1l3 3.5L1 8" stroke="#090738" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
