"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── 색상 (Figma 원본 → hex 변환) ────────────────────────────────────────────
const c = {
  bg:          "#FFFFFF",
  textDark:    "#373C3E",   // r:0.216 g:0.235 b:0.243
  textMid:     "#888E9C",   // r:0.533 g:0.557 b:0.612
  textLight:   "#666B78",   // r:0.400 g:0.424 b:0.471
  chipBg:      "#F8F9FB",   // r:0.974 g:0.977 b:0.984
  chipText:    "#888E9C",
  iconBg:      "#E7EAEF",   // r:0.906 g:0.918 b:0.937
  badgeBg:     "#E2FBF3",   // r:0.886 g:0.984 b:0.953
  badgeText:   "#38C6AF",   // r:0.219 g:0.775 b:0.687
  btnBg:       "#373C3E",
  btnText:     "#FFFFFF",
  cardBg:      "#F8F9FB",
  arrowIcon:   "#A8ACBA",   // r:0.658 g:0.659 b:0.661
} as const;

// ─── 하위 컴포넌트 ─────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 h-11" style={{ background: c.bg }}>
      <span className="text-[15px] font-bold" style={{ color: "#111" }}>9:41</span>
      <div className="flex items-center gap-1">
        {/* 심볼 placeholder */}
        <div className="w-4 h-3 rounded-sm border border-current opacity-70" style={{ color: "#111" }} />
        <div className="w-4 h-3 opacity-70" style={{ color: "#111" }}>
          <svg viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2C9.8 2 11.8 3 13.2 4.6L14.5 3.2C12.7 1.2 10.2 0 7.5 0S2.3 1.2.5 3.2L1.8 4.6C3.2 3 5.2 2 7.5 2zm0 4c1.1 0 2.1.4 2.8 1.1L11.7 5.7C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7l1.4 1.4C5.4 6.4 6.4 6 7.5 6zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" /></svg>
        </div>
        <div className="w-6 h-3 rounded-sm border border-current flex items-center px-0.5 opacity-70" style={{ color: "#111" }}>
          <div className="h-2 w-4 rounded-sm" style={{ background: "#111" }} />
        </div>
      </div>
    </div>
  );
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
}

function OptionCard({ icon, title, subtitle, selected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all"
      style={{ background: c.cardBg, border: selected ? `1.5px solid ${c.badgeText}` : "1.5px solid transparent" }}
    >
      {/* 아이콘 영역 */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.iconBg }}>
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-medium leading-tight" style={{ color: c.textDark }}>{title}</p>
        <p className="text-[12px] mt-0.5" style={{ color: c.textLight }}>{subtitle}</p>
      </div>

      {/* 선택 뱃지 / 화살표 */}
      {selected ? (
        <span
          className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: c.badgeBg, color: c.badgeText }}
        >
          선택
        </span>
      ) : (
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" className="shrink-0">
          <path d="M1 1l5 5.5L1 12" stroke={c.arrowIcon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── 아이콘 (placeholder SVG) ─────────────────────────────────────────────────

const HotelIcon = () => (
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
    <path d="M2 13V2a1 1 0 011-1h16a1 1 0 011 1v11M0 14h22M8 14V9h6v5" stroke={c.textDark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
    <path d="M3 6l2-4h8l2 4M1 6h16v6H1V6zM4 12v2M14 12v2M4 9h1M13 9h1" stroke={c.textMid} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function Step1Page() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="relative flex flex-col min-h-screen max-w-[375px] mx-auto overflow-hidden" style={{ background: c.bg }}>

      {/* 상태바 */}
      <StatusBar />

      {/* 상단 내비 */}
      <div className="relative flex items-center px-5 pt-2 pb-1 h-9">
        <button
          aria-label="뒤로"
          className="w-9 h-9 flex items-center justify-center"
          onClick={() => router.back()}
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke={c.textDark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-8 gap-0">

        {/* 제목 줄 — "이번 여행은" */}
        <p className="text-[20px] font-bold leading-snug" style={{ color: c.textDark }}>
          이번 여행은
        </p>

        {/* 칩 행 — 어디로 / 언제부터 / 누구와 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {["어디로", "언제부터", "누구와"].map((label) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-4 h-[47px] rounded-full"
              style={{ background: c.chipBg }}
            >
              {label === "언제부터" && (
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <rect x="1" y="3" width="16" height="16" rx="2" stroke={c.chipText} strokeWidth="1.4" />
                  <path d="M1 8h16M6 1v4M12 1v4" stroke={c.chipText} strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
              <span className="text-[18px] font-medium" style={{ color: c.chipText }}>{label}</span>
            </div>
          ))}
        </div>

        {/* "떠날거에요" */}
        <p className="text-[20px] font-bold mt-3" style={{ color: c.textDark }}>
          떠날거에요
        </p>

        {/* 부제 */}
        <p className="text-[13px] font-medium mt-3 leading-relaxed" style={{ color: c.textMid }}>
          몇 가지 질문에 답하면 맞춤 코스를 추천해드려요
        </p>

        {/* 옵션 카드 목록 */}
        <div className="flex flex-col gap-3 mt-6">
          <OptionCard
            icon={<HotelIcon />}
            title="숙소 위치 추가하기"
            subtitle="동선이 더 정확해져요"
            selected={selectedCards.has("hotel")}
            onClick={() => toggle("hotel")}
          />
          <OptionCard
            icon={<CarIcon />}
            title="렌터카 이용 여부"
            subtitle="렌트 여부에 따라 동선이 달라져요"
            selected={selectedCards.has("car")}
            onClick={() => toggle("car")}
          />
        </div>

        {/* 여백 채우기 */}
        <div className="flex-1" />

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col gap-3 pt-4">
          {/* 다음 버튼 */}
          <button
            className="w-full h-[50px] rounded-2xl text-[16px] font-medium transition-opacity active:opacity-80"
            style={{ background: c.btnBg, color: c.btnText }}
            onClick={() => router.push("/home")}
          >
            다음
          </button>

          {/* 회원가입 하기 */}
          <button
            className="w-full h-[50px] rounded-2xl text-[15px] font-bold text-center transition-opacity active:opacity-70"
            style={{ color: c.textDark, background: "transparent" }}
          >
            회원가입 하기
          </button>
        </div>
      </div>

      {/* 홈 인디케이터 */}
      <div className="flex justify-center pb-2 pt-1">
        <div className="w-[134px] h-[5px] rounded-full" style={{ background: "#000" }} />
      </div>
    </div>
  );
}
