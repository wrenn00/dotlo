"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Star, Check } from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import { useKeyboard } from "@/components/KeyboardProvider";
import places from "@/data/places.json";

type Place = (typeof places)[number];

const tokyoPlaces: Place[] = places.filter((p) => p.city === "tokyo");

const INPUT_ID = "select-search";

const CHIP_CATEGORIES = ["맛집", "카페", "쇼핑", "관광", "야경"] as const;
const COUNTS: Record<string, number> = CHIP_CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat]: tokyoPlaces.filter((p) => p.category === cat).length }),
  {} as Record<string, number>,
);

// ─── 장소 카드 ────────────────────────────────────────────────────────────────

interface PlaceRowProps {
  place: Place;
  isSelected: boolean;
  onToggle: () => void;
}

function PlaceRow({ place, isSelected, onToggle }: PlaceRowProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-start justify-between w-full text-left"
      style={{ height: 51, gap: 110 }}
    >
      <div className="flex items-start" style={{ gap: 8 }}>
        {/* 썸네일 51x51 #A5A5A5 radius 8 */}
        <div className="shrink-0">
          <PlaceThumbnail src={place.image} alt={place.name} category={place.category} size={51} />
        </div>

        {/* 텍스트 블록 136x50 */}
        <div className="flex flex-col" style={{ width: 136, gap: 4 }}>
          <span
            className="truncate"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              color: "#1A1A1A",
            }}
          >
            {place.name}
          </span>
          <div className="flex flex-col" style={{ gap: 2 }}>
            {/* 메타 행: 지역·카테고리 + 별점 */}
            <div className="flex items-center" style={{ gap: 5 }}>
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: "13px",
                  color: "#555555",
                }}
              >
                {place.region}·{place.category}
              </span>
              <div className="flex items-center" style={{ gap: 1 }}>
                <Star size={11} color="#FFE770" fill="#FFE770" strokeWidth={0} />
                <span
                  style={{
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: "13px",
                    color: "#555555",
                  }}
                >
                  {place.rating}({place.reviews.toLocaleString()})
                </span>
              </div>
            </div>
            {/* 설명 */}
            <span
              className="truncate"
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 10,
                fontWeight: 500,
                lineHeight: "13px",
                color: "#555555",
              }}
            >
              {place.description}
            </span>
          </div>
        </div>
      </div>

      {/* 체크 박스 28x28 */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: isSelected ? "#2E2E70" : "#FFFFFF",
          border: isSelected ? "none" : "1px solid #E6E8EB",
          marginTop: 12,
        }}
      >
        {isSelected && <Check size={16} color="#FFFFFF" strokeWidth={2.6} />}
      </div>
    </button>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function Step2SelectPage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState("전체");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const { open: openKeyboard, close: closeKeyboard, isOpen: kbOpen, inputId } = useKeyboard();

  const isFocused = kbOpen && inputId === INPUT_ID;

  function handleBack() {
    closeKeyboard();
    router.back();
  }

  function handleNext() {
    closeKeyboard();
    router.push("/screens/step3");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = tokyoPlaces.filter((p) => {
    if (activeCat !== "전체" && p.category !== activeCat) return false;
    if (query && !(p.name.includes(query) || p.region.includes(query))) return false;
    return true;
  });

  function toggleAll() {
    const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={handleBack} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 제목 + 부제 */}
      <div className="shrink-0 flex flex-col" style={{ padding: "0 21px", marginTop: 18, gap: 6 }}>
        <h1
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
          }}
        >
          꼭 가고 싶은 장소를 선택해주세요
        </h1>
        <p
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#888888",
          }}
        >
          선택한 장소를 우선 반영해 코스를 만들어요
        </p>
      </div>

      {/* 검색바 — 330x44 #FAFAFA radius 8 */}
      <div className="shrink-0" style={{ padding: "0 22px", marginTop: 18 }}>
        <div
          onClick={() => openKeyboard(INPUT_ID, query, setQuery)}
          className="flex items-center cursor-pointer"
          style={{
            height: 44,
            padding: "0 15px",
            gap: 10,
            background: "#FAFAFA",
            borderRadius: 8,
          }}
        >
          <Search size={24} color="#888888" strokeWidth={1.8} />
          <div className="flex-1 flex items-center min-w-0">
            {query ? (
              <span
                className="truncate"
                style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}
              >
                {query}
              </span>
            ) : (
              <span
                style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "#888888" }}
              >
                장소 이름으로 검색
              </span>
            )}
            {isFocused && (
              <span className="ml-0.5 animate-pulse" style={{ width: 2, height: 18, background: "#2E2E70" }} />
            )}
          </div>
        </div>
      </div>

      {/* 카테고리 칩 — h32 radius 20 */}
      <div
        className="shrink-0 flex gap-2.5 overflow-x-auto scrollbar-hide"
        style={{ padding: "0 22px", marginTop: 14 }}
      >
        {[
          { key: "전체", label: "전체" },
          ...CHIP_CATEGORIES.map((c) => ({ key: c, label: `${c} ${COUNTS[c]}` })),
        ].map(({ key, label }) => {
          const active = activeCat === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCat(key)}
              className="shrink-0 whitespace-nowrap flex items-center justify-center"
              style={{
                height: 32,
                padding: "0 14px",
                background: active ? "#090738" : "#F2F2F6",
                borderRadius: 20,
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: active ? 14 : 12,
                fontWeight: 500,
                lineHeight: active ? "18px" : "15px",
                color: active ? "#FFFFFF" : "#2E2E70",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 전체선택 / 선택수 */}
      <div
        className="shrink-0 flex items-center justify-between"
        style={{ padding: "0 22px", marginTop: 17 }}
      >
        <button
          onClick={toggleAll}
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "#888E9C",
          }}
        >
          전체 선택
        </button>
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "15px",
            color: "#888888",
          }}
        >
          {selected.size}개 선택
        </span>
      </div>

      {/* 장소 리스트 — gap 16 */}
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{ padding: "10px 22px 16px", gap: 16 }}
      >
        {filtered.map((p) => (
          <PlaceRow
            key={p.id}
            place={p}
            isSelected={selected.has(p.id)}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>

      {/* 다음 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "15px 22px 31px", background: "#FFFFFF" }}>
        <button
          onClick={handleNext}
          disabled={selected.size === 0}
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
    </div>
  );
}
