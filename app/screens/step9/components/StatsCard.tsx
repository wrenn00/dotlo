"use client";

interface Stat {
  label: string;
  value: string;
}

interface Props {
  city: string;
  dateRange: string;
  stats: Stat[];
}

export default function StatsCard({ city, dateRange, stats }: Props) {
  return (
    <div
      className="flex flex-col p-5 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #5CE7FF 0%, #00E1FF 100%)",
      }}
    >
      {/* 헤더 */}
      <p style={{ fontSize: 22, fontWeight: 700, color: "#090738" }}>{city}</p>
      <p style={{ fontSize: 12, color: "#00A8BF", marginTop: 4, fontWeight: 500 }}>{dateRange}</p>

      {/* 통계 박스 3개 */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.55)" }}
          >
            <span style={{ fontSize: 11, color: "#00A8BF", fontWeight: 500 }}>{s.label}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#090738", marginTop: 4 }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
