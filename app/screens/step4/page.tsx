"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Utensils, MountainSnow, ShoppingBag, Bath, Coffee, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import KeywordBottomSheet from "./components/KeywordBottomSheet";

const CATEGORIES: { key: string; Icon: LucideIcon; sub: string }[] = [
  { key: "미식", Icon: Utensils,     sub: "맛집·현지 음식" },
  { key: "관광", Icon: MountainSnow, sub: "명소·랜드마크" },
  { key: "쇼핑", Icon: ShoppingBag,  sub: "백화점·기념품샵" },
  { key: "휴식", Icon: Bath,         sub: "공원·온천" },
  { key: "카페", Icon: Coffee,       sub: "분위기 좋은 카페" },
];

export default function Step4Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  function toggleCategory(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const hasCustom = customKeywords.length > 0;
  const totalSelected = selected.size + (hasCustom ? 1 : 0);

  function renderCard(opts: {
    Icon: LucideIcon;
    label: string;
    sub: string;
    active: boolean;
    onClick: () => void;
  }) {
    const { Icon, label, sub, active, onClick } = opts;
    return (
      <button
        onClick={onClick}
        className="relative text-left transition-colors"
        style={{
          height: 97,
          background: active ? "#F4F4FB" : "#FAFAFA",
          border: active ? "1.5px solid #D8D8E9" : "1.5px solid transparent",
          borderRadius: 12,
          padding: "13px 16px 0",
        }}
      >
        <Icon size={24} color="#A0A0C0" strokeWidth={2} />
        <p
          style={{
            marginTop: 9,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#1A1A1A",
          }}
        >
          {label}
        </p>
        <p
          style={{
            marginTop: 3,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 400,
            lineHeight: "13px",
            color: "#555555",
          }}
        >
          {sub}
        </p>
      </button>
    );
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 제목 + 부제 */}
      <div className="shrink-0 flex flex-col" style={{ padding: "0 21px", marginTop: 49, gap: 6 }}>
        <h1
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
          }}
        >
          이번 여행에서 가장 중요하게 생각하는 것은 무엇인가요?
        </h1>
        <p
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "18px",
            color: "#888888",
          }}
        >
          여러 개 고를 수 있어요
        </p>
      </div>

      {/* 카테고리 2x3 그리드 — 카드 159x97 #FAFAFA radius 12 */}
      <div
        className="grid grid-cols-2 shrink-0"
        style={{ padding: "0 26px", marginTop: 25, gap: 8, gridAutoRows: 97 }}
      >
        {CATEGORIES.map(({ key, Icon, sub }) =>
          renderCard({
            Icon,
            label: key,
            sub,
            active: selected.has(key),
            onClick: () => toggleCategory(key),
          }),
        )}
        {/* 직접 추가 */}
        {renderCard({
          Icon: Plus,
          label: "직접 추가",
          sub: hasCustom ? `${customKeywords.length}개 추가됨` : "원하는 키워드 입력",
          active: hasCustom,
          onClick: () => setSheetOpen(true),
        })}
      </div>

      <div className="flex-1" />

      {/* 다음 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={() => router.push("/screens/step5")}
          disabled={totalSelected === 0}
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
          다음
        </button>
      </div>

      <KeywordBottomSheet
        open={sheetOpen}
        initial={customKeywords}
        onClose={() => setSheetOpen(false)}
        onConfirm={(kws) => setCustomKeywords(kws)}
      />
    </div>
  );
}
