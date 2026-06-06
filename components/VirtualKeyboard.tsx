"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete } from "lucide-react";
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

const KEY_FONT = '"Spoqa Han Sans Neo", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';

export default function VirtualKeyboard() {
  const { isOpen, value, language, appendChar, deleteChar, close, toggleLanguage, setValueDirect } = useKeyboard();
  const layout = language === "ko" ? koLayout : enLayout;
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // 시트가 열리면 숨겨둔 input에 포커스 — OS IME가 한글 조합을 처리하고
  // 최종 값을 onChange로 전달해줘 자모가 음절로 합쳐진 상태로 들어옴
  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => hiddenInputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

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
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          className="absolute left-0 right-0 z-50"
          style={{
            bottom: 0,
            background: "#D1D5DB",
            paddingTop: 8,
            paddingBottom: 10,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {/* 화면에서 안 보이지만 포커스를 잡고 IME 입력을 받아 한글 조합을 수행 */}
          <input
            ref={hiddenInputRef}
            value={value}
            onChange={(e) => setValueDirect(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter") {
                e.preventDefault();
                close();
              }
            }}
            aria-hidden
            tabIndex={-1}
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            style={{
              position: "absolute",
              left: -9999,
              top: 0,
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: "none",
              border: "none",
              padding: 0,
              margin: 0,
              outline: "none",
              background: "transparent",
            }}
          />

          <div className="flex flex-col" style={{ gap: 8 }}>
            {layout.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center" style={{ gap: 5 }}>
                {row.map((key) => {
                  const isShift = key === "shift";
                  const isBackspace = key === "backspace";
                  const isSpecial = isShift || isBackspace;
                  return (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className={`flex items-center justify-center active:opacity-70 transition-opacity ${
                        isSpecial ? "" : "flex-1"
                      }`}
                      style={{
                        height: 42,
                        background: isSpecial ? "#A8AFBA" : "#FFFFFF",
                        color: "#1A1A1A",
                        fontFamily: KEY_FONT,
                        fontSize: 18,
                        fontWeight: 400,
                        borderRadius: 5,
                        boxShadow: "0 1px 0 rgba(0,0,0,0.28)",
                        minWidth: isSpecial ? 42 : 30,
                        maxWidth: isSpecial ? undefined : 36,
                        padding: isSpecial ? "0 10px" : 0,
                      }}
                    >
                      {isShift ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2L2 8h3v6h6V8h3L8 2z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                      ) : isBackspace ? (
                        <Delete size={18} color="#1A1A1A" strokeWidth={1.6} />
                      ) : (
                        key
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* 하단: 한/영, 스페이스, 완료 */}
            <div className="flex" style={{ gap: 5 }}>
              <button
                onClick={toggleLanguage}
                className="active:opacity-70 transition-opacity"
                style={{
                  height: 42,
                  width: 64,
                  background: "#A8AFBA",
                  color: "#1A1A1A",
                  fontFamily: KEY_FONT,
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 5,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.28)",
                }}
              >
                {language === "ko" ? "한/영" : "ENG"}
              </button>
              <button
                onClick={() => appendChar(" ")}
                className="flex-1 active:opacity-70 transition-opacity"
                style={{
                  height: 42,
                  background: "#FFFFFF",
                  color: "#1A1A1A",
                  fontFamily: KEY_FONT,
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 5,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.28)",
                }}
              >
                space
              </button>
              <button
                onClick={close}
                className="active:opacity-80 transition-opacity"
                style={{
                  height: 42,
                  width: 64,
                  background: "#090738",
                  color: "#FFFFFF",
                  fontFamily: KEY_FONT,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.3px",
                  borderRadius: 5,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.28)",
                }}
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
