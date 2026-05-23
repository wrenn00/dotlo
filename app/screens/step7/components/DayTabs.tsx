"use client";

interface Props {
  days: string[];
  selected: string;
  onSelect: (day: string) => void;
}

export default function DayTabs({ days, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {days.map((d) => {
        const active = selected === d;
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className="shrink-0 px-4 py-2 rounded-full transition-colors"
            style={{
              background: active ? "#1A1A1A" : "transparent",
              color: active ? "#fff" : "#9CA3AF",
              border: active ? "none" : "1px solid #E5E7EB",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{d}</span>
          </button>
        );
      })}
    </div>
  );
}
