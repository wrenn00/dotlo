"use client";

interface SuggestCardProps {
  background: string;     // hex
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;     // "호캉스" 등
  title: string;          // 2줄 가능
  subtitle: string;       // "다낭, 푸켓, 발리"
  buttonLabel: string;    // "코스 4개 확인하기"
  buttonTextColor: string;
}

export default function SuggestCard({
  background, badgeBg, badgeText, badgeLabel, title, subtitle, buttonLabel, buttonTextColor,
}: SuggestCardProps) {
  return (
    <div
      className="shrink-0 flex flex-col justify-between p-4 rounded-2xl"
      style={{ width: 264, height: 133, background }}
    >
      {/* 상단: 배지 + 제목 + 부제 */}
      <div className="flex flex-col gap-1">
        <div
          className="self-start px-2 py-0.5 rounded-full"
          style={{ background: badgeBg }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: badgeText }}>{badgeLabel}</span>
        </div>
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            lineHeight: "20px",
            marginTop: 4,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}>{subtitle}</p>
      </div>

      {/* 하단 버튼 */}
      <button
        className="self-start flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{ background: "#fff" }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: buttonTextColor }}>
          {buttonLabel}
        </span>
        <svg width="6" height="9" viewBox="0 0 6 9" fill="none">
          <path
            d="M1 1l4 3.5L1 8"
            stroke={buttonTextColor}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
