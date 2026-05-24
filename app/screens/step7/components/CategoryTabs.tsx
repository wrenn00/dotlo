"use client";

export interface Category {
  id: string;
  label: string;
}

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: Props) {
  return (
    <div
      className="flex p-1 rounded-full"
      style={{ background: "#F7F9FA" }}
    >
      {categories.map((c) => {
        const active = selected === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all"
            style={{
              background: active ? "#fff" : "transparent",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#090738" : "#7A858B" }}>
              {c.id} {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
