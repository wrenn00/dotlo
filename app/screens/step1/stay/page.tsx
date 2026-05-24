"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useKeyboard } from "@/components/KeyboardProvider";

// Leaflet은 SSR 불가 → dynamic import
const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div
      className="mt-4 animate-pulse"
      style={{ height: 200, background: "#DDE5E8", borderRadius: 16 }}
    />
  ),
});

const INPUT_ID = "stay-search";

const PLACES = [
  { id: 1, name: "도톤보리",   sub: "오사카 미나미",   coords: [34.6687, 135.5026] as [number, number] },
  { id: 2, name: "고노하나구", sub: "오사카 고노하나", coords: [34.6845, 135.4438] as [number, number] },
  { id: 3, name: "신주쿠",     sub: "도쿄 신주쿠구",   coords: [35.6896, 139.7006] as [number, number] },
  { id: 4, name: "아사쿠사",   sub: "도쿄 다이토구",   coords: [35.7148, 139.7967] as [number, number] },
  { id: 5, name: "시부야",     sub: "도쿄 시부야구",   coords: [35.6595, 139.7004] as [number, number] },
  { id: 6, name: "교토역",     sub: "교토 시모교쿠",   coords: [34.9858, 135.7585] as [number, number] },
];

export default function StayPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const { open: openKeyboard, close: closeKeyboard, isOpen: kbOpen, inputId } = useKeyboard();

  const trimmed = query.trim();
  const filtered = trimmed
    ? PLACES.filter((p) => {
        const q = trimmed.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q);
      })
    : PLACES;

  const isFocused = kbOpen && inputId === INPUT_ID;

  function focusSearch() {
    openKeyboard(INPUT_ID, query, setQuery);
  }

  function handleBack() {
    closeKeyboard();
    router.back();
  }

  function handleConfirm() {
    closeKeyboard();
    router.push("/screens/step1");
  }

  function handleSelect(id: number) {
    setSelected(id);
    closeKeyboard();
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={handleBack} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button onClick={handleConfirm} style={{ fontSize: 14, color: "#7A858B", fontWeight: 500 }}>
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5">

        {/* 선택사항 배지 */}
        <div className="self-start px-3 py-1 rounded-full mb-4" style={{ background: "#E5FBFF" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#00E1FF" }}>선택사항</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", lineHeight: "30px" }}>
          어디서 머무시나요?
        </h1>
        <p style={{ fontSize: 14, color: "#7A858B", marginTop: 8, lineHeight: "20px" }}>
          숙소를 알려주시면 가까운 곳부터 코스를 짜드려요
        </p>

        {/* 검색바 — WhereBottomSheet와 동일한 디자인 + 가상 키보드 */}
        <div
          onClick={focusSearch}
          className="flex items-center gap-2 px-4 mt-6 cursor-pointer"
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
              <span style={{ fontSize: 14, color: "#A1ADB3" }}>호텔 이름 또는 주소</span>
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

        {/* 지도 (Leaflet + OpenStreetMap) */}
        <div className="mt-4">
          <MiniMap
            center={[34.6687, 135.5026]}
            zoom={11}
            markers={PLACES.map((p) => ({ position: p.coords, label: `${p.name} — ${p.sub}` }))}
            height={200}
          />
        </div>

        {/* 자주 머무는 지역 / 검색 결과 */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#7A858B", marginTop: 24, marginBottom: 4 }}>
          {trimmed ? "검색 결과" : "자주 머무는 지역"}
        </p>

        {filtered.length > 0 ? (
          <div className="flex flex-col">
            {filtered.map((place, idx) => (
              <button
                key={place.id}
                onClick={() => handleSelect(place.id)}
                className="flex items-center gap-3 py-3 text-left transition-colors"
                style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #DDE5E8" : "none" }}
              >
                <div
                  className="shrink-0 rounded-xl flex items-center justify-center"
                  style={{
                    width: 48, height: 48,
                    background: selected === place.id ? "#E5FBFF" : "#DDE5E8",
                    border: selected === place.id ? "1.5px solid #00E1FF" : "1.5px solid transparent",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1C6.24 1 4 3.24 4 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"
                      stroke={selected === place.id ? "#00E1FF" : "#7A858B"} strokeWidth="1.4" />
                    <circle cx="9" cy="6" r="1.5" stroke={selected === place.id ? "#00E1FF" : "#7A858B"} strokeWidth="1.4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}>{place.name}</p>
                  <p style={{ fontSize: 12, color: "#7A858B" }}>{place.sub}</p>
                </div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="shrink-0">
                  <path d="M1 1l5 5-5 5" stroke={selected === place.id ? "#00E1FF" : "#A1ADB3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p style={{ fontSize: 13, color: "#7A858B" }}>
              &lsquo;{trimmed}&rsquo;에 대한 검색 결과가 없어요
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "#E5FBFF", color: "#00A8BF" }}
            >
              &lsquo;{trimmed}&rsquo;로 직접 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={handleConfirm}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#090738" }}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
