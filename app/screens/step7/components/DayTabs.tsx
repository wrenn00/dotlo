"use client";

interface Props {
  days: string[];
  selected: string;
  onSelect: (day: string) => void;
}

export default function DayTabs({ days, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1">
      {days.map((d) => {
        const active = selected === d;
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full transition-colors"
            style={{
              background: active ? "#090738" : "transparent",
              color: active ? "#fff" : "#7A858B",
              border: active ? "none" : "1px solid #DDE5E8",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{d}</span>
          </button>
        );
      })}
    </div>
  );
}
