"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLACES = [
  { id: 1, name: "도톤보리", sub: "오사카 미나미" },
  { id: 2, name: "고노하나구", sub: "오사카 고노하나" },
  { id: 3, name: "신주쿠", sub: "도쿄 신주쿠구" },
  { id: 4, name: "시부야", sub: "도쿄 시부야구" },
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
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/screens/step1")}
          style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 500 }}
        >
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5">

        {/* 선택사항 배지 */}
        <div
          className="self-start px-3 py-1 rounded-full mb-4"
          style={{ background: "#E2FBF3" }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#38C6AF" }}>선택사항</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", lineHeight: "30px" }}>
          어디서 머무시나요?
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8, lineHeight: "20px" }}>
          숙소를 알려주시면 가까운 곳부터 코스를 짜드려요
        </p>

        {/* 검색바 */}
        <div
          className="flex items-center gap-2 px-4 mt-6"
          style={{ height: 48, background: "#F5F5F7", borderRadius: 14 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, color: "#1A1A1A" }}
            placeholder="호텔 이름 또는 주소"
          />
        </div>

        {/* 지도 placeholder */}
        <div
          className="flex items-center justify-center mt-4 relative overflow-hidden"
          style={{ height: 200, background: "#E5E7EB", borderRadius: 16 }}
        >
          {/* 격자 라인 */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full" style={{ height: 1, background: "#9CA3AF", top: `${(i + 1) * 20}%` }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute h-full" style={{ width: 1, background: "#9CA3AF", left: `${(i + 1) * 20}%` }} />
            ))}
          </div>
          {/* 핀 */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex items-center justify-center"
              style={{ width: 40, height: 40, background: "#38C6AF", borderRadius: "50%", boxShadow: "0 4px 12px rgba(56,198,175,0.4)" }}
            >
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path d="M9 1C5.13 1 2 4.13 2 8c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" />
                <circle cx="9" cy="8" r="2.5" fill="#38C6AF" />
              </svg>
            </div>
            <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>지도 미리보기</span>
          </div>
        </div>

        {/* 자주 머무는 지역 */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginTop: 24, marginBottom: 4 }}>
          자주 머무는 지역
        </p>

        <div className="flex flex-col">
          {PLACES.map((place, idx) => (
            <button
              key={place.id}
              onClick={() => setSelected(place.id)}
              className="flex items-center gap-3 py-3 text-left transition-colors"
              style={{ borderBottom: idx < PLACES.length - 1 ? "1px solid #F0F0F0" : "none" }}
            >
              {/* 썸네일 */}
              <div
                className="shrink-0 rounded-xl flex items-center justify-center"
                style={{
                  width: 48, height: 48,
                  background: selected === place.id ? "#E2FBF3" : "#E5E7EB",
                  border: selected === place.id ? "1.5px solid #38C6AF" : "1.5px solid transparent",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1C6.24 1 4 3.24 4 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"
                    stroke={selected === place.id ? "#38C6AF" : "#9CA3AF"} strokeWidth="1.4" />
                  <circle cx="9" cy="6" r="1.5" stroke={selected === place.id ? "#38C6AF" : "#9CA3AF"} strokeWidth="1.4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{place.name}</p>
                <p style={{ fontSize: 12, color: "#9CA3AF" }}>{place.sub}</p>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="shrink-0">
                <path d="M1 1l5 5-5 5" stroke={selected === place.id ? "#38C6AF" : "#C4C7CF"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
          style={{ background: "#1A1A1A" }}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
