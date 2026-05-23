"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KeywordBottomSheet from "./components/KeywordBottomSheet";

const CATEGORIES = [
  { key: "미식",  emoji: "🍴", sub: "맛집 · 현지 음식" },
  { key: "관광",  emoji: "🏛️", sub: "명소 · 랜드마크" },
  { key: "쇼핑",  emoji: "🛍️", sub: "백화점 · 기념품샵" },
  { key: "휴식",  emoji: "♨️", sub: "공원 · 온천" },
  { key: "카페",  emoji: "☕", sub: "분위기 좋은 카페" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function Step4Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<CategoryKey>>(new Set());
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  function toggleCategory(key: CategoryKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function removeKeyword(kw: string) {
    setCustomKeywords((prev) => prev.filter((k) => k !== kw));
  }

  const hasCustom = customKeywords.length > 0;
  const totalSelected = selected.size + (hasCustom ? 1 : 0);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="px-5 pt-12 pb-2 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 제목 */}
      <div className="px-5 pb-4 shrink-0">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", lineHeight: "32px" }}>
          어떤 카테고리에{"\n"}관심 있으세요?
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>여러 개 고를 수 있어요</p>
      </div>

      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-2 gap-3 px-5 shrink-0">
        {/* 일반 카테고리 5개 */}
        {CATEGORIES.map(({ key, emoji, sub }) => {
          const active = selected.has(key);
          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className="relative flex flex-col items-center justify-center py-6 rounded-2xl transition-all"
              style={{
                background: active ? "#F0FDFB" : "#F5F5F7",
                border: active ? "2px solid #38C6AF" : "2px solid transparent",
                minHeight: 120,
              }}
            >
              {/* 체크 */}
              {active && (
                <div
                  className="absolute top-2.5 right-2.5 flex items-center justify-center"
                  style={{ width: 20, height: 20, background: "#38C6AF", borderRadius: "50%" }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <span style={{ fontSize: 32 }}>{emoji}</span>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 8 }}>{key}</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{sub}</p>
            </button>
          );
        })}

        {/* 직접 추가 카드 */}
        <button
          onClick={() => setSheetOpen(true)}
          className="relative flex flex-col items-center justify-center py-6 rounded-2xl transition-all"
          style={{
            background: hasCustom ? "#F0FDFB" : "#F5F5F7",
            border: hasCustom ? "2px solid #38C6AF" : "2px solid transparent",
            minHeight: 120,
          }}
        >
          {hasCustom && (
            <div
              className="absolute top-2.5 right-2.5 flex items-center justify-center"
              style={{ width: 20, height: 20, background: "#38C6AF", borderRadius: "50%" }}
            >
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <span style={{ fontSize: 32 }}>➕</span>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 8 }}>
            {hasCustom ? `${customKeywords.length}개 추가됨` : "직접 추가"}
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
            {hasCustom ? "탭해서 수정" : "원하는 키워드 입력"}
          </p>
        </button>
      </div>

      {/* 직접 추가 키워드 칩 */}
      {hasCustom && (
        <div className="px-5 mt-4 shrink-0">
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>내가 추가</p>
          <div className="flex flex-wrap gap-2">
            {customKeywords.map((kw) => (
              <div
                key={kw}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full"
                style={{ background: "#E2FBF3", border: "1px solid #38C6AF" }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "#38C6AF" }}>{kw}</span>
                <button
                  onClick={() => removeKeyword(kw)}
                  className="flex items-center justify-center w-4 h-4"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 1l6 6M7 1L1 7" stroke="#38C6AF" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* 다음 버튼 */}
      <div className="px-5 pb-8 pt-4 shrink-0">
        <button
          onClick={() => router.push("/screens/step5")}
          disabled={totalSelected === 0}
          className="w-full h-[50px] rounded-2xl text-base font-semibold transition-all"
          style={{
            background: totalSelected > 0 ? "#1A1A1A" : "#E5E7EB",
            color: totalSelected > 0 ? "#fff" : "#9CA3AF",
          }}
        >
          다음
        </button>
      </div>

      {/* 바텀시트 */}
      <KeywordBottomSheet
        open={sheetOpen}
        initial={customKeywords}
        onClose={() => setSheetOpen(false)}
        onConfirm={(kws) => setCustomKeywords(kws)}
      />
    </div>
  );
}
