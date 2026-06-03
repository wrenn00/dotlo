"use client";

import { useState } from "react";
import Image from "next/image";
import TripCard from "../home/components/TripCard";
import BottomTabBar from "../home/components/BottomTabBar";

type SegmentKey = "final" | "saved";

// ─── 상태바 (Figma 그대로) ───────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between shrink-0" style={{ height: 50, padding: "0 17px 0 24px" }}>
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 15,
          fontWeight: 700,
          lineHeight: "20px",
          letterSpacing: "-0.5px",
          color: "#111111",
        }}
      >
        9:41
      </span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#111111">
          <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
          <rect x="3.5" y="6" width="2.5" height="5" rx="0.5" />
          <rect x="7" y="3.5" width="2.5" height="7.5" rx="0.5" />
          <rect x="10.5" y="1" width="2.5" height="10" rx="0.5" />
          <rect x="14" y="-1.5" width="2.5" height="12.5" rx="0.5" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#111111">
          <path d="M7.5 2C9.8 2 11.9 3 13.4 4.5l1.3-1.3C12.9 1.2 10.4 0 7.5 0S2.1 1.2.3 3.2L1.6 4.5C3.1 3 5.2 2 7.5 2zm0 4c1.1 0 2 .4 2.8 1.1l1.4-1.4C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7L4.7 7.1C5.5 6.4 6.4 6 7.5 6zm0 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
        <div className="relative" style={{ width: 24, height: 11 }}>
          <div className="absolute inset-0" style={{ border: "1px solid rgba(17,17,17,0.35)", borderRadius: 2.67 }} />
          <div className="absolute" style={{ left: 1, top: 1, bottom: 1, width: 18, background: "#111111", borderRadius: 1.1 }} />
          <div className="absolute" style={{ right: -2, top: 3.5, width: 1.33, height: 4, background: "rgba(17,17,17,0.4)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── 헤더 (로고 + 검색·알림) ────────────────────────────────────────────────

function Header() {
  return (
    <div
      className="flex items-center justify-between shrink-0 mx-auto"
      style={{ width: 318.5, height: 33, marginTop: 6 }}
    >
      <Image
        src="/images/logo.png"
        alt="Dotlo"
        width={38}
        height={33}
        priority
        style={{ width: 38, height: 33, objectFit: "contain" }}
      />
      <div className="flex items-center" style={{ width: 60, height: 24, gap: 12 }}>
        <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="#555555" strokeWidth="1.8" />
            <path d="M14 14L18.5 18.5" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path d="M3 10a7 7 0 0114 0v6l1.5 2H1.5L3 16v-6z" stroke="#555555" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M8 19a2 2 0 004 0" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div
            className="absolute"
            style={{ top: 2, right: 2, width: 5, height: 5, background: "#6060A0", borderRadius: "50%" }}
          />
        </button>
      </div>
    </div>
  );
}

// ─── 세그먼트 탭 (Figma: 334x40, #F5F5F5, 활성 163x34 흰색 shadow) ──────────

function SegmentedTab({ value, onChange }: { value: SegmentKey; onChange: (v: SegmentKey) => void }) {
  const items: { key: SegmentKey; label: string }[] = [
    { key: "final", label: "최종 코스 4" },
    { key: "saved", label: "저장한 코스 7" },
  ];
  return (
    <div
      className="relative flex items-center mx-auto"
      style={{ width: 334, height: 40, background: "#F5F5F5", borderRadius: 12, padding: 3 }}
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="flex-1 flex items-center justify-center"
            style={{
              height: 34,
              background: active ? "#FFFFFF" : "transparent",
              borderRadius: 8,
              boxShadow: active ? "0 0 4px rgba(0, 0, 0, 0.09)" : "none",
              transition: "background 200ms",
            }}
          >
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
                color: active ? "#1A1A1A" : "#555555",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── 데이터 ──────────────────────────────────────────────────────────────────

const FINAL_TRIPS = [
  { id: "osaka", title: "오사카 여행", date: "4.17 금 ~ 4.23 목 · 4박 5일", dDay: "D-7", participants: { type: "avatars" as const, count: 3, label: "3명 함께" }, image: "/images/trips/osaka_home.png" },
  { id: "tokyo", title: "도쿄 여행", date: "5.17 금 ~ 4.23 목 · 6박 7일", dDay: "D-30", participants: { type: "single" as const, label: "혼자 여행" }, image: "/images/trips/dokyo_home.png" },
  { id: "shanghai", title: "상하이 여행", date: "6.17 금 ~ 6.23 목 · 6박 7일", dDay: "D-50", participants: { type: "single" as const, label: "민지님이 초대했어요" }, image: "/images/trips/sang_home.png" },
  { id: "bangkok", title: "방콕 여행", date: "6.27 금 ~ 7.3 목 · 6박 7일", dDay: "D-60", participants: { type: "single" as const, label: "민지님이 초대했어요" }, image: "/images/where/bangkok.png" },
];

const SAVED_TRIPS: typeof FINAL_TRIPS = []; // 저장한 코스 — 데이터 없음

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function MyTripPage() {
  const [segment, setSegment] = useState<SegmentKey>("final");
  const trips = segment === "final" ? FINAL_TRIPS : SAVED_TRIPS;

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FEFEFF" }}>
      <StatusBar />
      <Header />

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 120 }}>
        <div className="flex flex-col" style={{ padding: "12px 20px 0", gap: 16 }}>
          <SegmentedTab value={segment} onChange={setSegment} />

          {/* 카드 리스트 */}
          <div className="flex flex-col" style={{ gap: 13 }}>
            {trips.length > 0 ? (
              trips.map((t) => (
                <TripCard
                  key={t.id}
                  title={t.title}
                  date={t.date}
                  dDay={t.dDay}
                  participants={t.participants}
                  image={t.image}
                />
              ))
            ) : (
              <div className="flex items-center justify-center" style={{ height: 200 }}>
                <p style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 13, color: "#888888" }}>
                  저장한 코스가 없어요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 새 여행 FAB (Figma: 109×44, #090738, radius 30, position 우측 하단) */}
      <button
        className="absolute inline-flex items-center justify-center"
        style={{
          right: 17,
          bottom: 113, // 탭바(89) + 24px 여백
          width: 109,
          height: 44,
          background: "#090738",
          borderRadius: 30,
          gap: 4,
          padding: "0 14px",
          boxShadow: "0 4px 16px rgba(9, 7, 56, 0.25)",
          zIndex: 25,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "18px",
            color: "#FFFFFF",
          }}
        >
          새 여행
        </span>
      </button>

      <BottomTabBar />
    </div>
  );
}
