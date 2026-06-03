"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=일
}

function fmt(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${year}년 ${month + 1}월 ${day}일 ${dayNames[d.getDay()]}`;
}

interface WhenSelection {
  start: { year: number; month: number; day: number } | null;
  end: { year: number; month: number; day: number } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (sel: WhenSelection) => void;
  initial?: WhenSelection;
}

export default function WhenBottomSheet({ open, onClose, onSelect, initial }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [sel, setSel] = useState<WhenSelection>(
    initial ?? { start: null, end: null }
  );
  // picking: 'start' | 'end'
  const [picking, setPicking] = useState<"start" | "end">("start");

  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth);

  function toNum(d: { year: number; month: number; day: number }) {
    return d.year * 10000 + d.month * 100 + d.day;
  }

  function handleDay(day: number) {
    const clicked = { year: viewYear, month: viewMonth, day };
    if (picking === "start") {
      setSel({ start: clicked, end: null });
      setPicking("end");
    } else {
      if (sel.start && toNum(clicked) < toNum(sel.start)) {
        setSel({ start: clicked, end: null });
        setPicking("end");
      } else {
        setSel((prev) => ({ ...prev, end: clicked }));
        setPicking("start");
      }
    }
  }

  function isStart(day: number) {
    return sel.start?.year === viewYear && sel.start?.month === viewMonth && sel.start?.day === day;
  }
  function isEnd(day: number) {
    return sel.end?.year === viewYear && sel.end?.month === viewMonth && sel.end?.day === day;
  }
  function inRange(day: number) {
    if (!sel.start || !sel.end) return false;
    const n = toNum({ year: viewYear, month: viewMonth, day });
    return n > toNum(sel.start) && n < toNum(sel.end);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function handleConfirm() {
    onSelect(sel);
    onClose();
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

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
          background: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          border: "1px solid #F1F1F1",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* 핸들 — Figma 40x4 #A7A7A7 */}
        <div className="flex justify-center" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, background: "#A7A7A7", borderRadius: 40 }} />
        </div>

        {/* 헤더 — 제목 20/700 + 부제 13/500 + X */}
        <div className="flex items-start justify-between" style={{ padding: "13px 17px 0" }}>
          <div className="flex flex-col" style={{ gap: 4 }}>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 20,
                fontWeight: 700,
                lineHeight: "30px",
                color: "#1A1A1A",
              }}
            >
              언제 떠나시나요?
            </p>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "16px",
                color: "#888888",
              }}
            >
              출발일과 도착일을 선택해주세요
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center" style={{ width: 32, height: 32, marginTop: -4 }}>
            <X size={20} color="#555555" strokeWidth={2} />
          </button>
        </div>

        {/* 날짜 박스 2개 — Figma: 162x67, #FAFAFA, border 1.5px #D8D8E9, radius 10 */}
        <div className="flex" style={{ padding: "27px 21px 0", gap: 9 }}>
          {(["start", "end"] as const).map((type) => {
            const val = type === "start" ? sel.start : sel.end;
            const label = type === "start" ? "출발일" : "도착일";
            const active = picking === type;
            return (
              <button
                key={type}
                onClick={() => setPicking(type)}
                className="relative flex-1 text-left"
                style={{
                  height: 67,
                  background: "#FAFAFA",
                  border: active ? "1.5px solid #2E2E70" : "1.5px solid #D8D8E9",
                  borderRadius: 10,
                }}
              >
                <span
                  className="absolute"
                  style={{
                    left: 13,
                    top: 11,
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: "15px",
                    color: "#555555",
                  }}
                >
                  {label}
                </span>
                <span
                  className="absolute"
                  style={{
                    left: 13,
                    top: 34,
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: "19px",
                    color: val ? "#1A1A1A" : "#A8A8A9",
                  }}
                >
                  {val ? fmt(val.year, val.month, val.day) : "선택해주세요"}
                </span>
              </button>
            );
          })}
        </div>

        {/* 캘린더 헤더 (Figma: chevron 좌우 + "2026년 5월" 16/700 #0A1E38) */}
        <div className="flex items-center justify-between" style={{ padding: "32px 24px 0" }}>
          <button onClick={prevMonth} className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <ChevronLeft size={20} color="#1A1A1A" strokeWidth={2} />
          </button>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "20px",
              color: "#0A1E38",
            }}
          >
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button onClick={nextMonth} className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <ChevronRight size={20} color="#1A1A1A" strokeWidth={2} />
          </button>
        </div>

        {/* 요일 헤더 — Figma: 일 #FF4C7A / 월~금 #888E9C / 토 #0070AE */}
        <div className="grid grid-cols-7" style={{ padding: "26px 24px 0" }}>
          {DAYS.map((d, i) => (
            <div key={d} className="flex items-center justify-center">
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: i === 0 ? "#FF4C7A" : i === 6 ? "#0070AE" : "#888E9C",
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 — Figma: 선택 32x32 #2E2E70 원 + 범위 lavender bar #D8D8E9 */}
        <div className="grid grid-cols-7" style={{ padding: "12px 24px 0" }}>
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} style={{ height: 43 }} />;
            const start = isStart(day);
            const end = isEnd(day);
            const range = inRange(day);
            const isRangeStart = start && sel.end;
            const isRangeEnd = end && sel.start;

            return (
              <div
                key={day}
                className="relative flex items-center justify-center"
                style={{ height: 43 }}
              >
                {/* 범위 라벤더 바 */}
                {range && <div className="absolute" style={{ left: 0, right: 0, top: 5, height: 32, background: "#D8D8E9" }} />}
                {isRangeStart && (
                  <div className="absolute" style={{ left: "50%", right: 0, top: 5, height: 32, background: "#D8D8E9" }} />
                )}
                {isRangeEnd && (
                  <div className="absolute" style={{ left: 0, right: "50%", top: 5, height: 32, background: "#D8D8E9" }} />
                )}

                {/* 날짜 셀 */}
                <button
                  onClick={() => handleDay(day)}
                  className="relative flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: start || end ? "#2E2E70" : "transparent",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Spoqa Han Sans Neo"',
                      fontSize: 13,
                      fontWeight: 500,
                      lineHeight: "16px",
                      color: start || end ? "#FFFFFF" : "#0A1E38",
                    }}
                  >
                    {day}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 완료 버튼 — Figma: 330x50 #090738 radius 12 */}
        <div className="flex justify-center" style={{ padding: "32px 22px 31px" }}>
          <button
            onClick={handleConfirm}
            disabled={!sel.start || !sel.end}
            className="w-full transition-opacity disabled:opacity-40"
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
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}
