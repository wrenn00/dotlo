"use client";

import { useState } from "react";
import { ProgressBar, StepNavigation } from "@/components/StepNavigation";

// ─── Figma 원본 색상 (figma-slim.json fills → hex 변환) ──────────────────────
// textDark  : r:0.216 g:0.235 b:0.243  → #373C3E
// textMid   : r:0.533 g:0.557 b:0.612  → #888E9C
// textLight : r:0.400 g:0.424 b:0.471  → #666B78
// chipBg    : r:0.974 g:0.977 b:0.984  → #F8F9FB
// iconBg    : r:0.906 g:0.918 b:0.937  → #E7EAEF
// badgeBg   : r:0.886 g:0.984 b:0.953  → #E2FBF3
// badgeText : r:0.219 g:0.775 b:0.687  → #38C6AF
// arrowGray : r:0.658 g:0.659 b:0.661  → #A8A8A9

// ─── 칩 컴포넌트 (어디로 / 언제부터 / 누구와) ────────────────────────────────
// Figma: 각 Frame 높이 47px, bg #F8F9FB, text 18px w:500 color #888E9C

function Chip({ label, hasCalendar }: { label: string; hasCalendar?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-4 shrink-0"
      style={{
        height: 47,
        background: "#F8F9FB",
        borderRadius: 12,
      }}
    >
      {hasCalendar && (
        // 달력 아이콘 placeholder — Figma Vector (18×20)
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <rect x="1" y="3" width="16" height="16" rx="2" stroke="#888E9C" strokeWidth="1.4" />
          <path d="M1 8h16M6 1v4M12 1v4" stroke="#888E9C" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      <span
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "#888E9C",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── 옵션 카드 (숙소 / 렌터카) ────────────────────────────────────────────────
// Figma: Frame 333×70, bg #F8F9FB, radius 16
// 아이콘 영역: Frame 35×35, bg #E7EAEF, radius 10
// 뱃지: Frame 39×17, HORIZONTAL, gap:10, padding:10, bg #E2FBF3, radius 999

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;           // 16px w:500 #000
  subtitle: string;        // 12px w:400 #666B78
  selected: boolean;
  onToggle: () => void;
}

function OptionCard({ icon, title, subtitle, selected, onToggle }: OptionCardProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left transition-all"
      style={{
        width: 333,
        minHeight: 70,
        background: "#F8F9FB",
        borderRadius: 16,
        padding: "0 16px",
        border: selected ? "1.5px solid #38C6AF" : "1.5px solid transparent",
      }}
    >
      {/* 아이콘 영역 — Figma Frame 35×35 bg #E7EAEF */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: 35, height: 35, background: "#E7EAEF", borderRadius: 10 }}
      >
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col flex-1 min-w-0">
        <span style={{ fontSize: 16, fontWeight: 500, color: "#000000", lineHeight: "20px" }}>
          {title}
        </span>
        <span style={{ fontSize: 12, fontWeight: 400, color: "#666B78", lineHeight: "15px", marginTop: 3 }}>
          {subtitle}
        </span>
      </div>

      {/* 선택 뱃지 or 화살표 */}
      {selected ? (
        // Figma: Frame 39×17 HORIZONTAL gap:10 padding:10 bg #E2FBF3 radius 999
        // text "선택" 10px w:500 color #38C6AF
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            height: 17,
            padding: "0 10px",
            background: "#E2FBF3",
            borderRadius: 999,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 500, color: "#38C6AF" }}>선택</span>
        </div>
      ) : (
        // Figma: Vector 7×13 color #A8A8A9
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" className="shrink-0">
          <path
            d="M1 1l5 5.5L1 12"
            stroke="#A8A8A9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

// ─── 아이콘 SVG ───────────────────────────────────────────────────────────────
// Figma Vector 실제 경로를 단순화한 placeholder

function HotelIcon() {
  // Figma: Vector 22×15 color #373C3E (숙소)
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
      <path
        d="M2 13V4a1 1 0 011-1h16a1 1 0 011 1v9M0 14h22M8 14V9h3v5M11 14V9h3v5"
        stroke="#373C3E"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarIcon() {
  // Figma: Vector 18×16 color #888E9C (렌터카)
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
      <path
        d="M3 6.5l2-4h8l2 4M1 6.5h16v6a1 1 0 01-1 1H2a1 1 0 01-1-1v-6z"
        stroke="#888E9C"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4.5" cy="10" r="1" fill="#888E9C" />
      <circle cx="13.5" cy="10" r="1" fill="#888E9C" />
    </svg>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function ScreenStep1() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    hotel: false,
    car: false,
  });

  function toggle(key: string) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* ── 상단 진행 바 (유지) ── */}
      <ProgressBar current={1} />

      {/* ── 콘텐츠 영역 ── */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 pt-6 pb-2">

        {/* "이번 여행은" — Figma: 20px w:700 color #373C3E */}
        <p style={{ fontSize: 20, fontWeight: 700, color: "#373C3E", lineHeight: "25px" }}>
          이번 여행은
        </p>

        {/* 칩 행 — 어디로 / 언제부터 / 누구와 */}
        {/* Figma: 각 Frame 47px 높이, 가로 배치, gap ~8px */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <Chip label="어디로" />
          <Chip label="언제부터" hasCalendar />
          <Chip label="누구와" />
        </div>

        {/* "떠날거에요" — Figma: 20px w:700 color #373C3E */}
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#373C3E",
            lineHeight: "25px",
            marginTop: 12,
          }}
        >
          떠날거에요
        </p>

        {/* 부제 — Figma: 257×16, 13px w:500 color #888E9C */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#888E9C",
            lineHeight: "16px",
            marginTop: 12,
          }}
        >
          몇 가지 질문에 답하면 맞춤 코스를 추천해드려요
        </p>

        {/* 옵션 카드 목록 — Figma: 두 카드 세로 배치, gap ~10px, mt ~80px */}
        <div className="flex flex-col gap-3 mt-auto pt-10">
          <OptionCard
            icon={<HotelIcon />}
            title="숙소 위치 추가하기"
            subtitle="동선이 더 정확해져요"
            selected={selected.hotel}
            onToggle={() => toggle("hotel")}
          />
          <OptionCard
            icon={<CarIcon />}
            title="렌터카 이용 여부"
            subtitle="렌트 여부에 따라 동선이 달라져요"
            selected={selected.car}
            onToggle={() => toggle("car")}
          />
        </div>
      </div>

      {/* ── 하단 네비게이션 (유지) ── */}
      <StepNavigation current={1} hidePrev={true} />
    </div>
  );
}
