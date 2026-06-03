"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search, Clock } from "lucide-react";
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
          background: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          border: "1px solid #F1F1F1",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          maxHeight: "82%",
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* 핸들 (Figma: 40x4 #A7A7A7 radius 40) */}
        <div className="flex justify-center" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, background: "#A7A7A7", borderRadius: 40 }} />
        </div>

        {/* 헤더 (Figma: title 20px 700 #1A1A1A, X 32x32 #555) */}
        <div className="flex items-center justify-between" style={{ padding: "16px 17px 0" }}>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 20,
              fontWeight: 700,
              lineHeight: "30px",
              color: "#1A1A1A",
            }}
          >
            어디로 떠나시나요?
          </span>
          <button onClick={handleClose} className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <X size={20} color="#555555" strokeWidth={2} />
          </button>
        </div>

        {/* 검색바 (Figma: 340x44, #FAFAFA, radius 8, gap 10, padding 8/15) */}
        <div style={{ padding: "17px 17px 0" }}>
          <div
            onClick={focusSearch}
            className="flex items-center cursor-pointer"
            style={{ height: 44, padding: "0 15px", gap: 10, background: "#FAFAFA", borderRadius: 8 }}
          >
            <Search size={20} color="#888888" strokeWidth={1.8} />
            <div className="flex-1 flex items-center min-w-0">
              {query ? (
                <span
                  className="truncate"
                  style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}
                >
                  {query}
                </span>
              ) : (
                <span
                  style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "#888888" }}
                >
                  도시 또는 국가
                </span>
              )}
              {isFocused && (
                <span className="ml-0.5 animate-pulse" style={{ width: 2, height: 18, background: "#2E2E70" }} />
              )}
            </div>
            {query && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery("");
                }}
                className="shrink-0 flex items-center justify-center"
                style={{ width: 18, height: 18, borderRadius: "50%", background: "#A8A8A9" }}
                aria-label="검색어 지우기"
              >
                <X size={11} color="#FFFFFF" strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1" style={{ padding: "0 17px 24px" }}>
          {/* 최근검색 — Figma: 12px 500 #888 + 작은 칩 (시계 + 도시) */}
          {!trimmed && (
            <div style={{ marginTop: 23 }}>
              <p
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "15px",
                  color: "#888888",
                  marginBottom: 10,
                }}
              >
                최근검색
              </p>
              <div className="flex items-center" style={{ gap: 7 }}>
                {RECENT.map((city) => (
                  <button
                    key={city}
                    onClick={() => setQuery(city)}
                    className="inline-flex items-center"
                    style={{
                      height: 24,
                      padding: "0 10px",
                      gap: 4,
                      background: "#FAFAFA",
                      borderRadius: 8,
                    }}
                  >
                    <Clock size={12} color="#888888" strokeWidth={1.6} />
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: "15px",
                        color: "#555555",
                      }}
                    >
                      {city}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: trimmed ? 8 : 24 }}>
            {/* 섹션 헤더 — Figma: 14px 700 #333 (실시간 배지 제거됨) */}
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "21px",
                color: "#333333",
                marginBottom: 16,
              }}
            >
              {trimmed ? "검색 결과" : "인기 여행지"}
            </p>

            {/* 결과 또는 빈 상태 — Figma: 행 간 gap 20, 보더 없음 */}
            {filtered.length > 0 ? (
              <div className="flex flex-col" style={{ gap: 20 }}>
                {filtered.map((item, idx) => (
                  <button
                    key={`${item.city}-${idx}`}
                    onClick={() => handleSelect(item.city)}
                    className="flex items-center text-left"
                    style={{ gap: 14, height: 51 }}
                  >
                    {/* 1. 순위 숫자 — 좌측 네이비 filled circle 23x23 (인기 모드만) */}
                    {!trimmed && (
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: 23,
                          height: 23,
                          background: "#2E2E70",
                          borderRadius: "50%",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"Spoqa Han Sans Neo"',
                            fontSize: 12,
                            fontWeight: 500,
                            lineHeight: "15px",
                            color: "#FFFFFF",
                          }}
                        >
                          {idx + 1}
                        </span>
                      </div>
                    )}

                    {/* 2. 도시 이미지 51x51 radius 10 */}
                    <div
                      className="shrink-0 overflow-hidden relative"
                      style={{ width: 51, height: 51, background: "#B8BCC3", borderRadius: 10 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.city}
                        fill
                        className="object-cover"
                        sizes="51px"
                      />
                    </div>

                    {/* 3. 도시 정보 (Figma: title 16/700 #1A1A1A, sub 12/500 #888) */}
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 16,
                          fontWeight: 700,
                          lineHeight: "24px",
                          color: "#1A1A1A",
                        }}
                      >
                        {item.city}
                      </p>
                      <p
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: "18px",
                          color: "#888888",
                        }}
                      >
                        {item.country} · {item.region}
                      </p>
                    </div>
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
