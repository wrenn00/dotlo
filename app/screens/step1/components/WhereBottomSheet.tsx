"use client";

import { useState } from "react";

const RECENT = ["교토", "바르셀로나", "도쿄"];

const POPULAR = [
  { city: "도쿄", desc: "일본 · 동아시아" },
  { city: "오사카", desc: "일본 · 동아시아" },
  { city: "다낭", desc: "베트남 · 동남아" },
  { city: "방콕", desc: "태국 · 동남아" },
  { city: "상하이", desc: "중국 · 동아시아" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

export default function WhereBottomSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? POPULAR.filter((p) => p.city.includes(query) || p.desc.includes(query))
    : POPULAR;

  function handleSelect(city: string) {
    onSelect(city);
    onClose();
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 40,
        }}
        onClick={onClose}
      />

      {/* 시트 */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          maxHeight: "75%",
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "#E0E0E0" }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3">
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
            어디로 떠나시나요?
          </span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 검색바 */}
        <div className="px-5 pb-3">
          <div
            className="flex items-center gap-2 px-4"
            style={{ height: 44, background: "#F5F5F7", borderRadius: 12 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#1A1A1A" }}
              placeholder="도시 또는 국가"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6">
          {/* 최근 검색 */}
          {!query && (
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>
                최근 검색
              </p>
              <div className="flex gap-2 flex-wrap">
                {RECENT.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: "#F5F5F7", color: "#1A1A1A" }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 인기 여행지 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>
                인기 여행지
              </p>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "#E2FBF3", color: "#38C6AF" }}
              >
                실시간
              </span>
            </div>
            <div className="flex flex-col">
              {filtered.map((item, idx) => (
                <button
                  key={item.city}
                  onClick={() => handleSelect(item.city)}
                  className="flex items-center gap-3 py-3 text-left"
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #F0F0F0" : "none" }}
                >
                  {/* 이미지 placeholder */}
                  <div
                    className="shrink-0 rounded-xl"
                    style={{ width: 44, height: 44, background: "#E5E7EB" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{item.city}</p>
                    <p style={{ fontSize: 12, color: "#9CA3AF" }}>{item.desc}</p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0"
                    style={{ color: "#38C6AF" }}
                  >
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
