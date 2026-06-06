"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

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
  /** 하드웨어 키보드/IME가 직접 작성한 최종 값을 통째로 반영 (한글 조합 결과 보존) */
  setValueDirect: (next: string) => void;
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

  const setValueDirect = useCallback((next: string) => {
    setValue(next);
    onChangeRef.current?.(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
  }, []);

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
        setValueDirect,
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
