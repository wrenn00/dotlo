"use client";

interface SuggestCardProps {
  background: string;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonTextColor: string;
}

export default function SuggestCard({
  background,
  badgeBg,
  badgeText,
  badgeLabel,
  title,
  subtitle,
  buttonLabel,
  buttonTextColor,
}: SuggestCardProps) {
  return (
    <div
      className="shrink-0 flex flex-col justify-between p-4 rounded-2xl"
      style={{ width: 240, height: 152, background }}
    >
      {/* 상단: 배지 + 제목 + 부제 */}
      <div className="flex flex-col gap-1.5">
        <div
          className="self-start px-2 py-0.5 rounded-full"
          style={{ background: badgeBg }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: badgeText }}>
            {badgeLabel}
          </span>
        </div>
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            lineHeight: "21px",
            marginTop: 4,
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>{subtitle}</p>
      </div>

      {/* 하단 버튼 */}
      <button
        className="self-start flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{ background: "#fff" }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: buttonTextColor }}>
          {buttonLabel}
        </span>
        <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
          <path
            d="M1 1l3 3.5L1 8"
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
