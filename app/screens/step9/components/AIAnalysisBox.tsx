"use client";

export interface TasteItem {
  label: string;
  percent: number;
  color: string; // hex
}

interface Props {
  bullets: string[];
  totalPlaces: number;
  taste: TasteItem[];
}

export default function AIAnalysisBox({ bullets, totalPlaces, taste }: Props) {
  return (
    <div
      className="flex flex-col p-4 rounded-2xl"
      style={{ background: "#F7F9FA" }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center"
          style={{ width: 24, height: 24, borderRadius: "50%", background: "#00E1FF" }}
        >
          <span style={{ fontSize: 12 }}>✨</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>
          AI가 이렇게 짰어요
        </span>
      </div>

      {/* 불릿 리스트 */}
      <div className="flex flex-col gap-2 mt-3">
        {bullets.map((b, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div
              className="shrink-0 mt-1.5"
              style={{ width: 4, height: 4, borderRadius: "50%", background: "#00E1FF" }}
            />
            <p style={{ fontSize: 13, color: "#090738", lineHeight: "20px" }}>{b}</p>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="h-px my-4" style={{ background: "#DDE5E8" }} />

      {/* 취향 라벨 */}
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 12, fontWeight: 600, color: "#555E63" }}>내 취향 반영</span>
        <span style={{ fontSize: 11, color: "#7A858B" }}>총 {totalPlaces}곳 중</span>
      </div>

      {/* 막대 차트 */}
      <div
        className="flex overflow-hidden rounded-full"
        style={{ height: 10, background: "#DDE5E8" }}
      >
        {taste.map((t) => (
          <div
            key={t.label}
            style={{ width: `${t.percent}%`, background: t.color }}
          />
        ))}
      </div>

      {/* 범례 */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {taste.map((t) => (
          <div key={t.label} className="flex items-center gap-1.5">
            <div
              style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }}
            />
            <span style={{ fontSize: 12, color: "#555E63", fontWeight: 500 }}>
              {t.label} {t.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
