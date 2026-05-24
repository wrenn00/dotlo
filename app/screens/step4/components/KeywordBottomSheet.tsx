"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

const SUGGESTIONS = [
  { icon: "dark_mode",       label: "야경" },
  { icon: "cake",            label: "디저트" },
  { icon: "museum",          label: "박물관" },
  { icon: "history_edu",     label: "역사" },
  { icon: "waves",           label: "바다" },
  { icon: "landscape",       label: "강변" },
  { icon: "theater_comedy",  label: "공연·전시" },
];

const MAX = 3;

interface Props {
  open: boolean;
  initial: string[];
  onClose: () => void;
  onConfirm: (keywords: string[]) => void;
}

export default function KeywordBottomSheet({ open, initial, onClose, onConfirm }: Props) {
  const [local, setLocal] = useState<string[]>(initial);
  const [input, setInput] = useState("");

  function toggle(label: string) {
    setLocal((prev) =>
      prev.includes(label)
        ? prev.filter((k) => k !== label)
        : prev.length < MAX
        ? [...prev, label]
        : prev
    );
  }

  function addInput() {
    const val = input.trim();
    if (!val || local.includes(val) || local.length >= MAX) return;
    setLocal((prev) => [...prev, val]);
    setInput("");
  }

  function remove(label: string) {
    setLocal((prev) => prev.filter((k) => k !== label));
  }

  function handleConfirm() {
    onConfirm(local);
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
          maxHeight: "85%",
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#DDE5E8" }} />
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-2">
          {/* 제목 */}
          <p style={{ fontSize: 20, fontWeight: 700, color: "#090738", marginTop: 8 }}>
            어떤 걸 원하세요?
          </p>
          <p style={{ fontSize: 13, color: "#7A858B", marginTop: 4 }}>
            자유롭게 적어주시면 AI가 반영해요
          </p>

          {/* 선택된 키워드 표시 (있을 때만) */}
          {local.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {local.map((kw) => (
                <div
                  key={kw}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                  style={{ border: "1.5px solid #00E1FF", background: "#E5FBFF" }}
                >
                  <Icon name="star" size={18} fill className="text-sky-blue-500" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#090738", flex: 1 }}>{kw}</span>
                  <button onClick={() => remove(kw)} className="w-6 h-6 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1L1 9" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 입력 바 */}
          <div
            className="flex items-center gap-2 px-4 mt-4"
            style={{ height: 46, background: "#F7F9FA", borderRadius: 12 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#7A858B" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#090738" }}
              placeholder="예: 디저트, 산책, 풍경"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addInput()}
            />
            {input.trim() && (
              <button
                onClick={addInput}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: local.length < MAX ? "#00E1FF" : "#DDE5E8",
                  color: local.length < MAX ? "#fff" : "#7A858B",
                }}
              >
                추가
              </button>
            )}
          </div>

          {/* 추천 섹션 */}
          <p style={{ fontSize: 12, fontWeight: 600, color: "#7A858B", marginTop: 20, marginBottom: 10 }}>
            이런 건 어때요
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(({ icon, label }) => {
              const active = local.includes(label);
              const disabled = !active && local.length >= MAX;
              return (
                <button
                  key={label}
                  onClick={() => !disabled && toggle(label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all"
                  style={{
                    background: active ? "#00E1FF" : "#fff",
                    border: `1.5px solid ${active ? "#00E1FF" : "#DDE5E8"}`,
                    color: active ? "#fff" : disabled ? "#A1ADB3" : "#090738",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <Icon name={icon} size={16} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* 최대 개수 안내 */}
          <p
            className="text-center mt-4"
            style={{ fontSize: 12, color: local.length >= MAX ? "#00E1FF" : "#A1ADB3" }}
          >
            {local.length >= MAX ? "최대 3개를 선택했어요" : "최대 3개까지 추가할 수 있어요"}
          </p>
        </div>

        {/* 완료 버튼 */}
        <div className="px-5 pb-8 pt-3 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
            style={{ background: "#090738" }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}
