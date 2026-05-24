"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeyboard } from "@/components/KeyboardProvider";

const INPUT_ID = "where-search";

const RECENT = ["교토", "바르셀로나", "도쿄"];

const POPULAR = [
  { city: "도쿄",     country: "일본",     region: "동아시아", image: "/images/where/dokyo.png" },
  { city: "오사카",   country: "일본",     region: "동아시아", image: "/images/where/osaka.png" },
  { city: "다낭",     country: "베트남",   region: "동남아",   image: "/images/where/danang.png" },
  { city: "방콕",     country: "태국",     region: "동남아",   image: "/images/where/bangkok.png" },
  { city: "상하이",   country: "중국",     region: "동아시아", image: "/images/where/shanghai.png" },
  { city: "교토",     country: "일본",     region: "동아시아", image: "/images/where/kyoto.png" },
  { city: "후쿠오카", country: "일본",     region: "동아시아", image: "/images/where/fukuoka.png" },
  { city: "싱가포르", country: "싱가포르", region: "동남아",   image: "/images/where/singapore.png" },
  { city: "파리",     country: "프랑스",   region: "유럽",     image: "/images/where/paris.png" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (city: string, placeId?: string) => void;
}

export default function WhereBottomSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const { open: openKeyboard, close: closeKeyboard, isOpen: kbOpen, inputId } = useKeyboard();

  const trimmed = query.trim();
  const filtered = trimmed
    ? POPULAR.filter((p) => {
        const q = trimmed.toLowerCase();
        return (
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q)
        );
      })
    : POPULAR;

  function handleSelect(city: string) {
    onSelect(city);
    setQuery("");
    closeKeyboard();
    onClose();
  }

  function handleClose() {
    closeKeyboard();
    onClose();
  }

  function focusSearch() {
    openKeyboard(INPUT_ID, query, setQuery);
  }

  const isFocused = kbOpen && inputId === INPUT_ID;

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
        onClick={handleClose}
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
          <div className="w-10 h-1 rounded-full" style={{ background: "#DDE5E8" }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3">
          <span style={{ fontSize: 18, fontWeight: 700, color: "#090738" }}>
            어디로 떠나시나요?
          </span>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#090738" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 검색바 — 가상 키보드 트리거 */}
        <div className="px-5 pb-3">
          <div
            onClick={focusSearch}
            className="flex items-center gap-2 px-4 cursor-pointer"
            style={{
              height: 44,
              background: "#F7F9FA",
              borderRadius: 12,
              outline: isFocused ? "2px solid #00E1FF" : "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#7A858B" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="flex-1 flex items-center min-w-0">
              {query ? (
                <span className="truncate" style={{ fontSize: 14, color: "#090738" }}>
                  {query}
                </span>
              ) : (
                <span style={{ fontSize: 14, color: "#A1ADB3" }}>도시 또는 국가</span>
              )}
              {isFocused && (
                <span
                  className="ml-0.5 animate-pulse"
                  style={{ width: 2, height: 16, background: "#00E1FF" }}
                />
              )}
            </div>
            {query && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery("");
                }}
                className="shrink-0 flex items-center justify-center"
                style={{ width: 18, height: 18, borderRadius: "50%", background: "#A1ADB3" }}
                aria-label="검색어 지우기"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1l6 6M7 1L1 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6">
          {/* 검색 중이 아닐 때만 최근 검색 표시 */}
          {!trimmed && (
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: "#7A858B" }}>
                최근 검색
              </p>
              <div className="flex gap-2 flex-wrap">
                {RECENT.map((city) => (
                  <button
                    key={city}
                    onClick={() => setQuery(city)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: "#F7F9FA", color: "#090738" }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: "#7A858B" }}>
                {trimmed ? "검색 결과" : "인기 여행지"}
              </p>
              {!trimmed && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "#E5FBFF", color: "#00E1FF" }}
                >
                  실시간
                </span>
              )}
            </div>

            {/* 결과 또는 빈 상태 */}
            {filtered.length > 0 ? (
              <div className="flex flex-col">
                {filtered.map((item, idx) => (
                  <button
                    key={`${item.city}-${idx}`}
                    onClick={() => handleSelect(item.city)}
                    className="flex items-center gap-3 py-3 text-left"
                    style={{
                      borderBottom:
                        idx < filtered.length - 1 ? "1px solid #DDE5E8" : "none",
                    }}
                  >
                    <div
                      className="shrink-0 rounded-xl overflow-hidden relative"
                      style={{ width: 48, height: 48, background: "#DDE5E8" }}
                    >
                      <Image
                        src={item.image}
                        alt={item.city}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}>
                        {item.city}
                      </p>
                      <p style={{ fontSize: 12, color: "#7A858B" }}>
                        {item.country} · {item.region}
                      </p>
                    </div>
                    {!trimmed && (
                      <span
                        className="text-sm font-bold shrink-0"
                        style={{ color: "#00E1FF" }}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p style={{ fontSize: 13, color: "#7A858B" }}>
                  &lsquo;{trimmed}&rsquo;에 대한 검색 결과가 없어요
                </p>
                <button
                  onClick={() => handleSelect(trimmed)}
                  className="mt-3 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: "#E5FBFF", color: "#00A8BF" }}
                >
                  &lsquo;{trimmed}&rsquo;로 직접 추가하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
