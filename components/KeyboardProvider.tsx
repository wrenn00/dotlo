"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Language = "ko" | "en";

interface KeyboardContextType {
  isOpen: boolean;
  value: string;
  inputId: string | null;
  language: Language;
  open: (id: string, initialValue: string, onChange: (val: string) => void) => void;
  close: () => void;
  appendChar: (char: string) => void;
  deleteChar: () => void;
  toggleLanguage: () => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [inputId, setInputId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ko");

  // 콜백은 ref에 보관 — state로 두면 setOnChange가 작동 안 함(함수형 업데이트로 오인됨)
  const onChangeRef = useRef<((val: string) => void) | null>(null);

  const open = useCallback((id: string, initialValue: string, onChange: (val: string) => void) => {
    onChangeRef.current = onChange;
    setInputId(id);
    setValue(initialValue);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInputId(null);
    onChangeRef.current = null;
  }, []);

  const appendChar = useCallback((char: string) => {
    setValue((prev) => {
      const next = prev + char;
      onChangeRef.current?.(next);
      return next;
    });
  }, []);

  const deleteChar = useCallback(() => {
    setValue((prev) => {
      const next = prev.slice(0, -1);
      onChangeRef.current?.(next);
      return next;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
  }, []);

  // 데스크톱 하드웨어 키보드도 입력 가능하게 — 가상 키보드가 열려있는 동안만 활성
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      // 폼 요소에 포커스가 잡혀있다면 그쪽에 양보
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(false);
        setInputId(null);
        onChangeRef.current = null;
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setValue((prev) => {
          const next = prev.slice(0, -1);
          onChangeRef.current?.(next);
          return next;
        });
        return;
      }
      // 한 글자 길이의 출력 가능한 문자만 (조합형 한글 포함)
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const char = e.key;
        setValue((prev) => {
          const next = prev + char;
          onChangeRef.current?.(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <KeyboardContext.Provider
      value={{
        isOpen,
        value,
        inputId,
        language,
        open,
        close,
        appendChar,
        deleteChar,
        toggleLanguage,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard must be used within KeyboardProvider");
  return ctx;
}
