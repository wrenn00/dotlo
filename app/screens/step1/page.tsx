"use client";

import { useState } from "react";
import { ProgressBar, StepNavigation } from "@/components/StepNavigation";
import WhereBottomSheet from "./components/WhereBottomSheet";
import WhenBottomSheet from "./components/WhenBottomSheet";
import WhoBottomSheet, { type WhoSelection } from "./components/WhoBottomSheet";

// ─── 타입 ──────────────────────────────────────────────────────────────────────

type Sheet = "where" | "when" | "who" | null;

interface WhenSel {
  start: { year: number; month: number; day: number } | null;
  end: { year: number; month: number; day: number } | null;
}

interface Selections {
  where: string;
  when: WhenSel;
  who: WhoSelection | null;
}

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────────

function fmtWhen(when: WhenSel): string {
  if (!when.start) return "";
  const s = `${when.start.month + 1}/${when.start.day}`;
  const e = when.end ? ` ~ ${when.end.month + 1}/${when.end.day}` : "";
  return s + e;
}

// ─── 칩 컴포넌트 ───────────────────────────────────────────────────────────────

interface ChipProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}

function SelectChip({ icon, label, value, onClick }: ChipProps) {
  const hasValue = !!value;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left transition-all"
      style={{
        height: 56,
        background: hasValue ? "#F0FDFB" : "#F5F5F7",
        borderRadius: 16,
        padding: "0 16px",
        border: hasValue ? "1.5px solid #38C6AF" : "1.5px solid transparent",
      }}
    >
      {/* 아이콘 */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 32,
          height: 32,
          background: hasValue ? "#E2FBF3" : "#E5E7EB",
          borderRadius: 10,
        }}
      >
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        {hasValue ? (
          <>
            <p style={{ fontSize: 11, color: "#38C6AF", fontWeight: 600 }}>{label}</p>
            <p
              className="truncate"
              style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 1 }}
            >
              {value}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 15, fontWeight: 500, color: "#9CA3AF" }}>{label}</p>
        )}
      </div>

      {/* 화살표 */}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="shrink-0">
        <path
          d="M1 1l5 5-5 5"
          stroke={hasValue ? "#38C6AF" : "#C4C7CF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ─── 옵션 카드 ─────────────────────────────────────────────────────────────────

interface CardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onToggle: () => void;
}

function OptionCard({ icon, title, subtitle, selected, onToggle }: CardProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left transition-all"
      style={{
        minHeight: 70,
        background: "#F8F9FB",
        borderRadius: 16,
        padding: "0 16px",
        border: selected ? "1.5px solid #38C6AF" : "1.5px solid transparent",
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: 35, height: 35, background: "#E7EAEF", borderRadius: 10 }}
      >
        {icon}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span style={{ fontSize: 16, fontWeight: 500, color: "#000", lineHeight: "20px" }}>
          {title}
        </span>
        <span style={{ fontSize: 12, color: "#666B78", lineHeight: "15px", marginTop: 3 }}>
          {subtitle}
        </span>
      </div>
      {selected ? (
        <div
          className="flex items-center justify-center shrink-0"
          style={{ height: 17, padding: "0 10px", background: "#E2FBF3", borderRadius: 999 }}
        >
          <span style={{ fontSize: 10, fontWeight: 500, color: "#38C6AF" }}>선택</span>
        </div>
      ) : (
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" className="shrink-0">
          <path d="M1 1l5 5.5L1 12" stroke="#A8A8A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── 아이콘 ────────────────────────────────────────────────────────────────────

const PinIcon = () => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
    <path d="M7 1C4.24 1 2 3.24 2 6c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke="#9CA3AF" strokeWidth="1.4" />
    <circle cx="7" cy="6" r="1.5" stroke="#9CA3AF" strokeWidth="1.4" />
  </svg>
);

const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="12" rx="2" stroke="#9CA3AF" strokeWidth="1.4" />
    <path d="M1 7h14M5 1v4M11 1v4" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <circle cx="6" cy="4" r="3" stroke="#9CA3AF" strokeWidth="1.4" />
    <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="13" cy="4" r="2.5" stroke="#9CA3AF" strokeWidth="1.4" />
    <path d="M13 9c1.93 0 3.5 1.57 3.5 3.5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const HotelIcon = () => (
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
    <path d="M2 13V4a1 1 0 011-1h16a1 1 0 011 1v9M0 14h22M8 14V9h3v5M11 14V9h3v5" stroke="#373C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
    <path d="M3 6.5l2-4h8l2 4M1 6.5h16v6a1 1 0 01-1 1H2a1 1 0 01-1-1v-6z" stroke="#888E9C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4.5" cy="10" r="1" fill="#888E9C" />
    <circle cx="13.5" cy="10" r="1" fill="#888E9C" />
  </svg>
);

// ─── 메인 ──────────────────────────────────────────────────────────────────────

export default function ScreenStep1() {
  const [openSheet, setOpenSheet] = useState<Sheet>(null);
  const [cards, setCards] = useState({ hotel: false, car: false });
  const [sel, setSel] = useState<Selections>({
    where: "",
    when: { start: null, end: null },
    who: null,
  });

  function toggleCard(key: "hotel" | "car") {
    setCards((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    // 모바일 프레임 내부이므로 absolute로 바텀시트 배치 가능
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* ── 진행바 ── */}
      <ProgressBar current={1} />

      {/* ── 콘텐츠 ── */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5 pt-5 pb-2">

        {/* "이번 여행은" */}
        <p style={{ fontSize: 20, fontWeight: 700, color: "#373C3E", lineHeight: "25px" }}>
          이번 여행은
        </p>

        {/* 칩 3개 */}
        <div className="flex flex-col gap-2.5 mt-4">
          <SelectChip
            icon={<PinIcon />}
            label="어디로"
            value={sel.where || undefined}
            onClick={() => setOpenSheet("where")}
          />
          <SelectChip
            icon={<CalIcon />}
            label="언제부터"
            value={fmtWhen(sel.when) || undefined}
            onClick={() => setOpenSheet("when")}
          />
          <SelectChip
            icon={<PeopleIcon />}
            label="누구와"
            value={sel.who ? `${sel.who.type} · ${sel.who.count}명` : undefined}
            onClick={() => setOpenSheet("who")}
          />
        </div>

        {/* "떠날거에요" */}
        <p style={{ fontSize: 20, fontWeight: 700, color: "#373C3E", lineHeight: "25px", marginTop: 16 }}>
          떠날거에요
        </p>

        {/* 부제 */}
        <p style={{ fontSize: 13, fontWeight: 500, color: "#888E9C", lineHeight: "16px", marginTop: 10 }}>
          몇 가지 질문에 답하면 맞춤 코스를 추천해드려요
        </p>

        {/* 옵션 카드 */}
        <div className="flex flex-col gap-3 mt-auto pt-8">
          <OptionCard
            icon={<CarIcon />}
            title="렌터카 이용 여부"
            subtitle="렌트 여부에 따라 동선이 달라져요"
            selected={cards.car}
            onToggle={() => toggleCard("car")}
          />
          <OptionCard
            icon={<HotelIcon />}
            title="숙소 위치 추가하기"
            subtitle="동선이 더 정확해져요"
            selected={cards.hotel}
            onToggle={() => toggleCard("hotel")}
          />
        </div>
      </div>

      {/* ── 하단 네비 ── */}
      <StepNavigation current={1} hidePrev={true} />

      {/* ── 바텀시트 3종 ── */}
      <WhereBottomSheet
        open={openSheet === "where"}
        onClose={() => setOpenSheet(null)}
        onSelect={(city) => setSel((p) => ({ ...p, where: city }))}
      />
      <WhenBottomSheet
        open={openSheet === "when"}
        onClose={() => setOpenSheet(null)}
        onSelect={(when) => setSel((p) => ({ ...p, when }))}
        initial={sel.when}
      />
      <WhoBottomSheet
        open={openSheet === "who"}
        onClose={() => setOpenSheet(null)}
        onSelect={(who) => setSel((p) => ({ ...p, who }))}
        initial={sel.who ?? undefined}
      />
    </div>
  );
}
