"use client";

import { useState } from "react";

const TYPES = [
  { key: "혼자", emoji: "🧍" },
  { key: "친구", emoji: "👥" },
  { key: "연인", emoji: "💑" },
  { key: "가족", emoji: "👨‍👩‍👧" },
] as const;

type TravelType = (typeof TYPES)[number]["key"];

export interface WhoSelection {
  type: TravelType;
  count: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (sel: WhoSelection) => void;
  initial?: WhoSelection;
}

export default function WhoBottomSheet({ open, onClose, onSelect, initial }: Props) {
  const [type, setType] = useState<TravelType>(initial?.type ?? "친구");
  const [count, setCount] = useState(initial?.count ?? 2);

  function handleConfirm() {
    onSelect({ type, count });
    onClose();
  }

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
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>누구와 떠나시나요?</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>동행자에 맞춰 코스가 달라져요</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 2×2 그리드 */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          {TYPES.map(({ key, emoji }) => {
            const selected = type === key;
            return (
              <button
                key={key}
                onClick={() => setType(key)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl transition-all"
                style={{
                  height: 90,
                  background: selected ? "#F0FDFB" : "#F5F5F7",
                  border: selected ? "2px solid #38C6AF" : "2px solid transparent",
                }}
              >
                <span style={{ fontSize: 28 }}>{emoji}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: selected ? 700 : 500,
                    color: selected ? "#38C6AF" : "#1A1A1A",
                  }}
                >
                  {key}
                </span>
              </button>
            );
          })}
        </div>

        {/* 인원 조절 */}
        <div className="px-5 pb-4">
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>
            총 인원
          </p>
          <div className="flex items-center justify-center gap-8">
            {/* 감소 */}
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity active:opacity-60"
              style={{ background: "#F5F5F7" }}
            >
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                <path d="M1 1h12" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* 숫자 */}
            <div className="flex items-baseline gap-1.5">
              <span style={{ fontSize: 40, fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>
                {count}
              </span>
              <span style={{ fontSize: 16, fontWeight: 500, color: "#9CA3AF" }}>명</span>
            </div>

            {/* 증가 */}
            <button
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity active:opacity-60"
              style={{ background: "#F5F5F7" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="px-5 pb-8 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
            style={{ background: "#1A1A1A" }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}
