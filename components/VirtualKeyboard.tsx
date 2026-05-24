"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useKeyboard } from "./KeyboardProvider";

// 한국어 2벌식 (자모 단순 입력 — 조합 없음)
const koLayout: string[][] = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
  ["shift", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", "backspace"],
];

// 영문 QWERTY
const enLayout: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

export default function VirtualKeyboard() {
  const { isOpen, language, appendChar, deleteChar, close, toggleLanguage } = useKeyboard();
  const layout = language === "ko" ? koLayout : enLayout;

  const handleKey = (key: string) => {
    if (key === "shift") return; // 시각용
    if (key === "backspace") {
      deleteChar();
      return;
    }
    appendChar(key);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute left-0 right-0 z-50 px-1 pt-2 pb-2"
          style={{ bottom: 0, background: "#D1D4DA" }}
        >
          <div className="flex flex-col gap-1.5">
            {layout.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-1">
                {row.map((key) => {
                  const isSpecial = key === "shift" || key === "backspace";
                  const label = key === "shift" ? "⇧" : key === "backspace" ? "⌫" : key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className={`h-10 rounded-md font-medium active:opacity-70 transition-opacity ${
                        isSpecial ? "px-3" : "flex-1"
                      }`}
                      style={{
                        background: isSpecial ? "#ADB3BC" : "#fff",
                        color: "#090738",
                        fontSize: 16,
                        minWidth: isSpecial ? 44 : 30,
                        maxWidth: isSpecial ? undefined : 36,
                        boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* 하단: 한/영, 스페이스, 완료 */}
            <div className="flex gap-1 mt-1">
              <button
                onClick={toggleLanguage}
                className="h-10 rounded-md px-3 font-medium"
                style={{ background: "#ADB3BC", color: "#090738", fontSize: 12, boxShadow: "0 1px 0 rgba(0,0,0,0.18)" }}
              >
                {language === "ko" ? "한/영" : "ENG"}
              </button>
              <button
                onClick={() => appendChar(" ")}
                className="h-10 rounded-md flex-1 font-medium"
                style={{ background: "#fff", color: "#090738", fontSize: 14, boxShadow: "0 1px 0 rgba(0,0,0,0.18)" }}
              >
                space
              </button>
              <button
                onClick={close}
                className="h-10 rounded-md px-4 font-semibold"
                style={{ background: "#00E1FF", color: "#fff", fontSize: 14, boxShadow: "0 1px 0 rgba(0,0,0,0.18)" }}
              >
                완료
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
