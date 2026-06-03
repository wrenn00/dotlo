"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Calendar, User, Plane, Car, BedDouble } from "lucide-react";
import WhereBottomSheet from "./components/WhereBottomSheet";
import WhenBottomSheet from "./components/WhenBottomSheet";
import WhoBottomSheet, { type WhoSelection } from "./components/WhoBottomSheet";

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

function fmtWhen(when: WhenSel): string {
  if (!when.start) return "";
  const s = `${when.start.month + 1}/${when.start.day}`;
  const e = when.end ? ` ~ ${when.end.month + 1}/${when.end.day}` : "";
  return s + e;
}

// ─── 칩 (Figma: 47h, #FAFAFA, shadow, radius 8) ──────────────────────────────

interface ChipProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}

function SelectChip({ icon, label, value, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center self-start"
      style={{
        height: 47,
        padding: "0 16px",
        gap: 10,
        background: "#FAFAFA",
        borderRadius: 8,
        boxShadow: "0 0 6.8px rgba(0, 0, 0, 0.08)",
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 18,
          fontWeight: 500,
          lineHeight: "23px",
          color: "#555555",
        }}
      >
        {value || label}
      </span>
    </button>
  );
}

// ─── 옵션 카드 (Figma: 343x70, #FAFAFA, 컬러 원 35x35) ────────────────────────

interface OptionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function OptionCard({ icon, iconBg, title, subtitle, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full"
      style={{ height: 70, background: "#FAFAFA", borderRadius: 12 }}
    >
      {/* 컬러 원 아이콘 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 13, top: 18, width: 35, height: 35, background: iconBg, borderRadius: "50%" }}
      >
        {icon}
      </div>

      {/* 제목 + 선택 배지 */}
      <div className="absolute flex items-center" style={{ left: 58, top: 17, gap: 8 }}>
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#1A1A1A",
          }}
        >
          {title}
        </span>
        <span
          className="inline-flex items-center justify-center"
          style={{
            height: 17,
            padding: "0 7px",
            background: "#F2F2F6",
            borderRadius: 8,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "13px",
            color: "#2E2E70",
          }}
        >
          선택
        </span>
      </div>

      {/* 부제 */}
      <span
        className="absolute"
        style={{
          left: 58,
          top: 41,
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "15px",
          color: "#555555",
        }}
      >
        {subtitle}
      </span>

      {/* 우측 chevron */}
      <div className="absolute flex items-center justify-center" style={{ right: 11, top: 21, width: 27, height: 27 }}>
        <ChevronRight size={18} color="#A8A8A9" strokeWidth={1.8} />
      </div>
    </button>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function ScreenStep1() {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<Sheet>(null);
  const [sel, setSel] = useState<Selections>({
    where: "",
    when: { start: null, end: null },
    who: null,
  });

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더: 뒤로가기 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 px-5 pt-3">

        {/* "이번 여행은" 제목 */}
        <h1
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 20,
            fontWeight: 700,
            lineHeight: "25px",
            color: "#1A1A1A",
          }}
        >
          이번 여행은
        </h1>

        {/* 칩 컬럼 + "떠날거에요" */}
        <div className="flex flex-col mt-5" style={{ gap: 15 }}>
          <SelectChip
            icon={<MapPin size={20} color="#555555" strokeWidth={1.8} />}
            label="어디로"
            value={sel.where || undefined}
            onClick={() => setOpenSheet("where")}
          />
          <SelectChip
            icon={<Calendar size={20} color="#555555" strokeWidth={1.8} />}
            label="언제부터"
            value={fmtWhen(sel.when) || undefined}
            onClick={() => setOpenSheet("when")}
          />
          <div className="flex items-center" style={{ gap: 14 }}>
            <SelectChip
              icon={<User size={20} color="#555555" strokeWidth={1.8} />}
              label="누구와"
              value={sel.who ? `${sel.who.type} · ${sel.who.count}명` : undefined}
              onClick={() => setOpenSheet("who")}
            />
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 20,
                fontWeight: 700,
                lineHeight: "25px",
                color: "#1A1A1A",
              }}
            >
              떠날거에요
            </span>
          </div>
        </div>

        {/* 부제 */}
        <p
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "16px",
            color: "#888888",
            marginTop: 16,
          }}
        >
          몇 가지 질문에 답하면 맞춤 코스를 추천해드려요
        </p>

        {/* 옵션 카드 3개 — 하단 정렬 */}
        <div className="flex flex-col mt-auto" style={{ gap: 10, paddingBottom: 16 }}>
          <OptionCard
            icon={<Plane size={20} color="#00E1FF" strokeWidth={2} fill="#00E1FF" />}
            iconBg="#E0FBFF"
            title="항공권 정보"
            subtitle="도착 출발 시간에 맞춰 일정을 짜드려요"
            onClick={() => router.push("/screens/step1/flight")}
          />
          <OptionCard
            icon={<Car size={20} color="#FFE400" strokeWidth={2} fill="#FFE400" />}
            iconBg="#FFF9C2"
            title="렌터카 이용 여부"
            subtitle="렌트 여부에 따라 동선이 달라져요"
            onClick={() => router.push("/screens/step1/rentcar")}
          />
          <OptionCard
            icon={<BedDouble size={20} color="#A5A5FF" strokeWidth={2} />}
            iconBg="#EFEFFF"
            title="숙소 위치 추가하기"
            subtitle="동선이 더 정확해져요"
            onClick={() => router.push("/screens/step1/stay")}
          />
        </div>
      </div>

      {/* 다음 버튼 (Figma: 330x50, #090738, radius 12) */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={() => router.push("/screens/step2")}
          className="w-full"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          다음
        </button>
      </div>

      {/* 바텀시트 3종 */}
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
