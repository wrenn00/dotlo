"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlaceImage from "@/components/PlaceImage";
import { usePlaceData } from "@/lib/places-data";

const CATEGORIES = ["전체", "맛집 12", "카페 7", "쇼핑 5", "관광 12"];

const PLACES = [
  {
    id: "1",
    name: "이치란 라멘 도본토리점",
    rating: 4.2, reviews: 5488,
    region: "오사카 · 맛집",
    desc: "편안한 분위기의 돈코츠 라멘식당",
  },
  {
    id: "2",
    name: "EX 카페 교토 아라시야마점",
    rating: 4.6, reviews: 4603,
    region: "교토 · 카페",
    desc: "커피, 차와 예술작품을 즐길 수 있는 조용한 카페",
  },
  {
    id: "3",
    name: "기요미즈데라",
    rating: 4.6, reviews: 69279,
    region: "교토 · 관광",
    desc: "멋진 경관의 역사적인 사원",
  },
  {
    id: "4",
    name: "오카페 교토",
    rating: 4.8, reviews: 1209,
    region: "교토 · 카페",
    desc: "바리스타의 커피와 간식, 아침식사",
  },
  {
    id: "5",
    name: "스시노무사시",
    rating: 4.8, reviews: 1209,
    region: "교토 · 맛집",
    desc: "신선한 재료로 만든 전통 스시",
  },
];


// ─── 장소 카드 (실제 사진 + 실 평점 + dummy fallback) ────────────────────────

interface PlaceRowProps {
  place: typeof PLACES[number];
  isSelected: boolean;
  onToggle: () => void;
}

function PlaceRow({ place, isSelected, onToggle }: PlaceRowProps) {
  const real = usePlaceData(place.name);
  const rating = real?.rating ?? place.rating;
  const reviews = real?.userRatingCount ?? place.reviews;

  return (
    <button
      onClick={onToggle}
      className="flex items-start gap-3 text-left py-3 px-3 rounded-2xl transition-all"
      style={{
        background: isSelected ? "#E5FBFF" : "#fff",
        border: isSelected ? "1.5px solid #00E1FF" : "1.5px solid #DDE5E8",
      }}
    >
      <PlaceImage placeName={place.name} width={52} height={52} />

      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>{place.name}</p>
        <p style={{ fontSize: 11, color: "#7A858B", marginTop: 2 }}>
          ★ {rating} · {reviews.toLocaleString()}개 리뷰
        </p>
        <p style={{ fontSize: 12, color: "#555E63", marginTop: 1 }}>{place.region}</p>
        <p className="truncate" style={{ fontSize: 12, color: "#7A858B", marginTop: 1 }}>{place.desc}</p>
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
  const [selected, setSelected] = useState<Set<string>>(new Set(["1", "2", "3", "4"]));
  const [query, setQuery] = useState("");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === PLACES.length) setSelected(new Set());
    else setSelected(new Set(PLACES.map((p) => p.id)));
  }

  const filtered = PLACES.filter((p) =>
    query ? p.name.includes(query) || p.region.includes(query) : true
  );

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
          구글맵에 47개의 장소를 불러왔어요
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

      {/* 카테고리 필터 */}
      <div className="flex gap-2 px-5 mb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => {
          const active = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                background: active ? "#090738" : "#F7F9FA",
                color: active ? "#fff" : "#555E63",
              }}
            >
              {cat}
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
