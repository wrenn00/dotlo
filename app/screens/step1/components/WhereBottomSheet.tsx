"use client";

import { useEffect, useRef, useState } from "react";

const RECENT = ["교토", "바르셀로나", "도쿄"];

const POPULAR = [
  { city: "도쿄", desc: "일본 · 동아시아" },
  { city: "오사카", desc: "일본 · 동아시아" },
  { city: "다낭", desc: "베트남 · 동남아" },
  { city: "방콕", desc: "태국 · 동남아" },
  { city: "상하이", desc: "중국 · 동아시아" },
];

interface Prediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (city: string, placeId?: string) => void;
}

const DEBOUNCE_MS = 300;

export default function WhereBottomSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // debounce + abort
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setPredictions([]);
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      // 이전 요청 취소
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
        setPredictions(data.predictions ?? []);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "검색 실패");
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(city: string, placeId?: string) {
    onSelect(city, placeId);
    setQuery("");
    setPredictions([]);
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
          <div className="w-10 h-1 rounded-full" style={{ background: "#DDE5E8" }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3">
          <span style={{ fontSize: 18, fontWeight: 700, color: "#090738" }}>
            어디로 떠나시나요?
          </span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#090738" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 검색바 */}
        <div className="px-5 pb-3">
          <div
            className="flex items-center gap-2 px-4"
            style={{ height: 44, background: "#F7F9FA", borderRadius: 12 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#7A858B" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#090738" }}
              placeholder="도시 또는 국가"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && (
              <div
                className="shrink-0"
                style={{
                  width: 14, height: 14,
                  border: "2px solid #DDE5E8",
                  borderTopColor: "#00E1FF",
                  borderRadius: "50%",
                  animation: "whereSpin 0.7s linear infinite",
                }}
              />
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-6">
          {/* ── 검색 모드: Google Places 결과 ── */}
          {query.trim() ? (
            <div>
              {error && (
                <p style={{ fontSize: 12, color: "#EF4444", padding: "12px 0" }}>
                  {error}
                </p>
              )}
              {!error && !loading && predictions.length === 0 && (
                <p style={{ fontSize: 13, color: "#7A858B", padding: "12px 0" }}>
                  검색 결과가 없습니다
                </p>
              )}
              <div className="flex flex-col">
                {predictions.map((p, idx) => (
                  <button
                    key={p.placeId}
                    onClick={() => handleSelect(p.mainText, p.placeId)}
                    className="flex items-center gap-3 py-3 text-left"
                    style={{
                      borderBottom:
                        idx < predictions.length - 1 ? "1px solid #DDE5E8" : "none",
                    }}
                  >
                    <div
                      className="shrink-0 rounded-xl flex items-center justify-center"
                      style={{ width: 44, height: 44, background: "#E5FBFF" }}
                    >
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                        <path
                          d="M9 1C5.13 1 2 4.13 2 8c0 6 7 13 7 13s7-7 7-13c0-3.87-3.13-7-7-7z"
                          stroke="#00E1FF"
                          strokeWidth="1.5"
                        />
                        <circle cx="9" cy="8" r="2.5" stroke="#00E1FF" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}
                      >
                        {p.mainText}
                      </p>
                      {p.secondaryText && (
                        <p
                          className="truncate"
                          style={{ fontSize: 12, color: "#7A858B" }}
                        >
                          {p.secondaryText}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* ── 빈 검색: 최근 + 인기 ── */}
              <div className="mb-5">
                <p className="text-xs font-semibold mb-2" style={{ color: "#7A858B" }}>
                  최근 검색
                </p>
                <div className="flex gap-2 flex-wrap">
                  {RECENT.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelect(city)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: "#F7F9FA", color: "#090738" }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: "#7A858B" }}>
                    인기 여행지
                  </p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#E5FBFF", color: "#00E1FF" }}
                  >
                    실시간
                  </span>
                </div>
                <div className="flex flex-col">
                  {POPULAR.map((item, idx) => (
                    <button
                      key={item.city}
                      onClick={() => handleSelect(item.city)}
                      className="flex items-center gap-3 py-3 text-left"
                      style={{
                        borderBottom:
                          idx < POPULAR.length - 1 ? "1px solid #DDE5E8" : "none",
                      }}
                    >
                      <div
                        className="shrink-0 rounded-xl"
                        style={{ width: 44, height: 44, background: "#DDE5E8" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}>
                          {item.city}
                        </p>
                        <p style={{ fontSize: 12, color: "#7A858B" }}>{item.desc}</p>
                      </div>
                      <span
                        className="text-sm font-bold shrink-0"
                        style={{ color: "#00E1FF" }}
                      >
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes whereSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}
