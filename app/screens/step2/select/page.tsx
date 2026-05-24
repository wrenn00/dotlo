"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import Icon from "@/components/Icon";
import places from "@/data/places.json";

type Place = (typeof places)[number];

const tokyoPlaces: Place[] = places.filter((p) => p.city === "tokyo");

// 칩에 노출할 카테고리 (숙소 제외) + 동적 카운트
const CHIP_CATEGORIES = ["맛집", "카페", "쇼핑", "관광", "야경"] as const;
const COUNTS: Record<string, number> = CHIP_CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat]: tokyoPlaces.filter((p) => p.category === cat).length }),
  {} as Record<string, number>
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
      className="flex items-start gap-3 text-left py-3 px-3 rounded-2xl transition-all shadow-card"
      style={{
        background: isSelected ? "#E5FBFF" : "#fff",
        border: isSelected ? "1.5px solid #00E1FF" : "none",
      }}
    >
      <PlaceThumbnail src={place.image} alt={place.name} category={place.category} size={52} />

      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>{place.name}</p>
        <p className="flex items-center gap-1" style={{ fontSize: 11, color: "#7A858B", marginTop: 2 }}>
          <Icon name="star" size={13} fill className="text-star-yellow-500" />
          {place.rating} · {place.reviews.toLocaleString()}개 리뷰
        </p>
        <p style={{ fontSize: 12, color: "#555E63", marginTop: 1 }}>
          {place.region} · {place.category}
        </p>
        <p className="truncate" style={{ fontSize: 12, color: "#7A858B", marginTop: 1 }}>{place.description}</p>
      </div>

      <div
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 22, height: 22, borderRadius: "50%",
          background: isSelected ? "#00E1FF" : "transparent",
          border: isSelected ? "none" : "1.5px solid #A1ADB3",
          marginTop: 2,
        }}
      >
        {isSelected && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
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
    const allSelected = filtered.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center px-5 pt-12 pb-2">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 제목 */}
      <div className="px-5 mb-4">
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#090738", lineHeight: "28px" }}>
          꼭 가고싶은 장소를{"\n"}선택해주세요
        </h1>
        <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6 }}>
          구글맵에 {tokyoPlaces.length}개의 장소를 불러왔어요
        </p>
      </div>

      {/* 검색바 */}
      <div className="px-5 mb-3">
        <div
          className="flex items-center gap-2 px-4"
          style={{ height: 44, background: "#F7F9FA", borderRadius: 12 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#7A858B" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="#7A858B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#090738" }}
            placeholder="장소 이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 카테고리 필터 — 가로 스크롤 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-5 pb-2 mb-1">
        {[`전체 ${tokyoPlaces.length}`, ...CHIP_CATEGORIES.map((c) => `${c} ${COUNTS[c]}`)].map((label) => {
          const key = label.split(" ")[0];
          const active = activeCat === key;
          return (
            <button
              key={label}
              onClick={() => setActiveCat(key)}
              className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                background: active ? "#090738" : "#F7F9FA",
                color: active ? "#fff" : "#555E63",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 전체선택 / 선택수 */}
      <div className="flex items-center justify-between px-5 mb-2">
        <button onClick={toggleAll} style={{ fontSize: 13, color: "#555E63", fontWeight: 500 }}>
          전체 선택
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#00E1FF" }}>
          {selected.size}개 선택
        </span>
      </div>

      {/* 장소 리스트 */}
      <div className="flex flex-col gap-2.5 px-5 overflow-y-auto flex-1 pb-2">
        {filtered.map((p) => (
          <PlaceRow
            key={p.id}
            place={p}
            isSelected={selected.has(p.id)}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>

      {/* 하단 */}
      <div className="px-5 pb-8 pt-3 flex flex-col gap-2">
        {/* 알림 박스 */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: "#F7F9FA" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{ width: 28, height: 28, background: "#00E1FF", borderRadius: "50%" }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{selected.size}</span>
            </div>
            <span style={{ fontSize: 13, color: "#090738", fontWeight: 500 }}>
              선택한 장소로 코스를 짤게요
            </span>
          </div>
          <button style={{ fontSize: 13, color: "#00E1FF", fontWeight: 600 }}>미리보기</button>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => router.push("/screens/step3")}
          disabled={selected.size === 0}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-40"
          style={{ background: "#090738" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
