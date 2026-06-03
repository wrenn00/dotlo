"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Users, HeartHandshake, Minus, Plus } from "lucide-react";

const TYPES = [
  { key: "혼자", Icon: User },
  { key: "친구", Icon: Users },
  { key: "연인", Icon: HeartHandshake },
  { key: "가족", Icon: Users },
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
  const [count, setCount] = useState(initial?.count ?? 4);

  // 혼자=1, 연인=2 고정. 친구/가족은 카운터 노출
  const showCounter = type === "친구" || type === "가족";

  function handleSelectType(next: TravelType) {
    setType(next);
    if (next === "혼자") setCount(1);
    else if (next === "연인") setCount(2);
  }

  function handleConfirm() {
    onSelect({ type, count });
    onClose();
  }

  const canDecrease = count > 1;

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
        {/* 핸들 */}
        <div className="flex justify-center" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, background: "#A7A7A7", borderRadius: 40 }} />
        </div>

        {/* 헤더 */}
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
              누구와 떠나시나요?
            </p>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#888888",
              }}
            >
              동행자에 맞춰 코스가 달라져요
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center" style={{ width: 32, height: 32, marginTop: -4 }}>
            <X size={20} color="#555555" strokeWidth={2} />
          </button>
        </div>

        {/* 2×2 카드 그리드 — Figma: 162x106, gap 9 가로 6 세로 */}
        <div
          className="grid"
          style={{ padding: "27px 21px 0", gridTemplateColumns: "162px 162px", columnGap: 9, rowGap: 6 }}
        >
          {TYPES.map(({ key, Icon }) => {
            const selected = type === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectType(key)}
                className="relative"
                style={{
                  height: 106,
                  background: selected ? "#F9FAFB" : "#FAFAFA",
                  border: selected ? "1.5px solid #D8D8E9" : "1.5px solid transparent",
                  borderRadius: 10,
                }}
              >
                {/* 아이콘 */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{ left: 0, right: 0, top: 22, height: 43 }}
                >
                  <Icon size={36} color={selected ? "#6B6BCC" : "#A0A0C0"} strokeWidth={selected ? 2.4 : 2} />
                </div>
                {/* 라벨 */}
                <span
                  className="absolute"
                  style={{
                    left: 0,
                    right: 0,
                    top: 76,
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: "19px",
                    color: "#333333",
                    textAlign: "center",
                  }}
                >
                  {key}
                </span>
              </button>
            );
          })}
        </div>

        {/* "총 인원" + 카운터 — 친구/가족 선택 시에만 노출, 쫀득 springy 애니메이션 */}
        <AnimatePresence initial={false}>
          {showCounter && (
            <motion.div
              key="counter"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: "spring", stiffness: 280, damping: 26, mass: 0.9 },
                opacity: { duration: 0.2, ease: "easeOut" },
              }}
              style={{ overflow: "hidden" }}
            >
              <p
                style={{
                  padding: "33px 21px 12px",
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: "21px",
                  color: "#333333",
                }}
              >
                총 인원
              </p>

              <div style={{ padding: "0 21px" }}>
                <div
                  className="relative flex items-center"
                  style={{ height: 58, background: "#FAFAFA", borderRadius: 10, padding: "0 17px" }}
                >
                  <button
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    disabled={!canDecrease}
                    className="flex items-center justify-center"
                    style={{
                      width: 25,
                      height: 25,
                      background: "#D8D8E9",
                      borderRadius: "50%",
                      opacity: canDecrease ? 1 : 0.6,
                    }}
                  >
                    <Minus size={14} color="#FFFFFF" strokeWidth={2.6} />
                  </button>

                  <div className="flex-1 flex items-baseline justify-center" style={{ gap: 4 }}>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 26,
                        fontWeight: 700,
                        lineHeight: "33px",
                        color: "#1A1A1A",
                      }}
                    >
                      {count}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: "20px",
                        color: "#555555",
                      }}
                    >
                      명
                    </span>
                  </div>

                  <button
                    onClick={() => setCount((c) => Math.min(20, c + 1))}
                    className="flex items-center justify-center"
                    style={{ width: 24, height: 24, background: "#090738", borderRadius: "50%" }}
                  >
                    <Plus size={14} color="#FFFFFF" strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택 완료 — Figma: 330x50 #090738 radius 12 */}
        <div className="flex justify-center" style={{ padding: "47px 22px 31px" }}>
          <button
            onClick={handleConfirm}
            className="w-full transition-opacity active:opacity-80"
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
