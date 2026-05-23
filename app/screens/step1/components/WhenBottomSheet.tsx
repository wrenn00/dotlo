"use client";

import { useState } from "react";

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
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "#E0E0E0" }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>언제 떠나시나요?</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>출발일과 도착일을 선택해주세요</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 날짜 박스 2개 */}
        <div className="flex gap-3 px-5 py-3">
          {(["start", "end"] as const).map((type) => {
            const val = type === "start" ? sel.start : sel.end;
            const label = type === "start" ? "출발일" : "도착일";
            const active = picking === type;
            return (
              <button
                key={type}
                onClick={() => setPicking(type)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-2xl"
                style={{
                  border: active ? "1.5px solid #38C6AF" : "1.5px solid #E5E7EB",
                  background: active ? "#F0FDFB" : "#fff",
                }}
              >
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: val ? "#1A1A1A" : "#D1D5DB", marginTop: 2 }}>
                  {val ? `${val.month + 1}월 ${val.day}일` : "선택"}
                </span>
              </button>
            );
          })}
        </div>

        {/* 캘린더 헤더 */}
        <div className="flex items-center justify-between px-5 py-2">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M7 1L1 7l6 6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center">
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-3">
          {DAYS.map((d, i) => (
            <div key={d} className="flex items-center justify-center py-1">
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: i === 0 ? "#EF4444" : i === 6 ? "#3B82F6" : "#9CA3AF",
                }}
              >
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 px-3 pb-2">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const start = isStart(day);
            const end = isEnd(day);
            const range = inRange(day);
            const col = idx % 7;
            const isRangeStart = start && sel.end;
            const isRangeEnd = end;

            return (
              <div
                key={day}
                className="relative flex items-center justify-center"
                style={{ height: 40 }}
              >
                {/* 범위 배경 (좌우 절반) */}
                {range && (
                  <div
                    className="absolute inset-0"
                    style={{ background: "#E2FBF3" }}
                  />
                )}
                {isRangeStart && (
                  <div
                    className="absolute top-0 bottom-0 right-0"
                    style={{ left: "50%", background: "#E2FBF3" }}
                  />
                )}
                {isRangeEnd && (
                  <div
                    className="absolute top-0 bottom-0 left-0"
                    style={{ right: "50%", background: "#E2FBF3" }}
                  />
                )}

                {/* 날짜 원형 */}
                <button
                  onClick={() => handleDay(day)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{
                    background: start || end ? "#38C6AF" : "transparent",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: start || end ? 700 : 400,
                      color:
                        start || end
                          ? "#fff"
                          : col === 0
                          ? "#EF4444"
                          : col === 6
                          ? "#3B82F6"
                          : "#1A1A1A",
                    }}
                  >
                    {day}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 날짜 텍스트 표시 */}
        {(sel.start || sel.end) && (
          <div className="px-5 py-2 flex gap-2 justify-center">
            {sel.start && (
              <span style={{ fontSize: 12, color: "#38C6AF", fontWeight: 600 }}>
                {fmt(sel.start.year, sel.start.month, sel.start.day)}
              </span>
            )}
            {sel.start && sel.end && (
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>→</span>
            )}
            {sel.end && (
              <span style={{ fontSize: 12, color: "#38C6AF", fontWeight: 600 }}>
                {fmt(sel.end.year, sel.end.month, sel.end.day)}
              </span>
            )}
          </div>
        )}

        {/* 완료 버튼 */}
        <div className="px-5 pb-8 pt-2">
          <button
            onClick={handleConfirm}
            disabled={!sel.start || !sel.end}
            className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#1A1A1A" }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}
