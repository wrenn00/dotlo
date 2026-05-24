"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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

const PLACES = [
  { id: 1, name: "도톤보리",     sub: "오사카 미나미",   coords: [34.6687, 135.5026] as [number, number] },
  { id: 2, name: "고노하나구",   sub: "오사카 고노하나", coords: [34.6845, 135.4438] as [number, number] },
  { id: 3, name: "신주쿠",       sub: "도쿄 신주쿠구",   coords: [35.6896, 139.7006] as [number, number] },
  { id: 4, name: "시부야",       sub: "도쿄 시부야구",   coords: [35.6595, 139.7004] as [number, number] },
];

export default function StayPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/screens/step1")}
          style={{ fontSize: 14, color: "#7A858B", fontWeight: 500 }}
        >
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5">

        {/* 선택사항 배지 */}
        <div
          className="self-start px-3 py-1 rounded-full mb-4"
          style={{ background: "#E5FBFF" }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#00E1FF" }}>선택사항</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", lineHeight: "30px" }}>
          어디서 머무시나요?
        </h1>
        <p style={{ fontSize: 14, color: "#7A858B", marginTop: 8, lineHeight: "20px" }}>
          숙소를 알려주시면 가까운 곳부터 코스를 짜드려요
        </p>

        {/* 검색바 */}
        <div
          className="flex items-center gap-2 px-4 mt-6"
          style={{ height: 48, background: "#F7F9FA", borderRadius: 14 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#7A858B" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, color: "#090738" }}
            placeholder="호텔 이름 또는 주소"
          />
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

        {/* 자주 머무는 지역 */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#7A858B", marginTop: 24, marginBottom: 4 }}>
          자주 머무는 지역
        </p>

        <div className="flex flex-col">
          {PLACES.map((place, idx) => (
            <button
              key={place.id}
              onClick={() => setSelected(place.id)}
              className="flex items-center gap-3 py-3 text-left transition-colors"
              style={{ borderBottom: idx < PLACES.length - 1 ? "1px solid #DDE5E8" : "none" }}
            >
              {/* 썸네일 */}
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
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={() => router.push("/screens/step1")}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#090738" }}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
