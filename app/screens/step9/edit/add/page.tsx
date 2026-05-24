"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlaceImage from "@/components/PlaceImage";
import Icon from "@/components/Icon";

// ─── 데이터 ──────────────────────────────────────────────────────────────────

const DAYS = ["1일차", "2일차", "3일차", "4일차"];

const MAIN_TABS = [
  { id: "my",     label: "내 장소" },
  { id: "search", label: "검색" },
  { id: "ai",     label: "AI 추천" },
] as const;

type MainTab = (typeof MAIN_TABS)[number]["id"];

const CATEGORIES = ["전체", "맛집 12", "카페 7", "쇼핑 5", "관광 12"];

const MY_PLACES = [
  { id: "p1", name: "이치란 라멘 도본토리점",    category: "오사카·맛집", rating: 4.2, reviews: 5488,  desc: "편안한 분위기의 돈코츠 라멘식당" },
  { id: "p2", name: "EX 카페 교토 아라시야마점", category: "교토·카페",   rating: 4.6, reviews: 4603,  desc: "커피, 차와 예술작품을 즐길 수 있는 조용한 카페" },
  { id: "p3", name: "기요미즈데라",              category: "교토·관광",   rating: 4.6, reviews: 69279, desc: "멋진 경관의 역사적인 사원" },
  { id: "p4", name: "오카페 교토",               category: "교토·카페",   rating: 4.8, reviews: 1209,  desc: "바리스타의 커피와 간식, 아침식사" },
  { id: "p5", name: "스시노무사시",              category: "교토·맛집",   rating: 4.8, reviews: 1209,  desc: "편안한 카운터 주문형 초밥 레스토랑" },
  { id: "p6", name: "도톤보리 구로후네 야메무라점", category: "오사카·맛집", rating: 4.8, reviews: 1209, desc: "민물장어요리전문식당" },
];

const RECENT_QUERIES = ["교토 카페", "이치란", "오사카 야경", "아라시야마"];

const POPULAR_PLACES = [
  { id: "s1", rank: 1, name: "후시미 이나리 신사",  category: "교토·관광",   rating: 4.5 },
  { id: "s2", rank: 2, name: "오사카 성",            category: "오사카·관광", rating: 4.4 },
  { id: "s3", rank: 3, name: "해유관",               category: "오사카·관광", rating: 4.5 },
  { id: "s4", rank: 4, name: "우메다 스카이빌딩",   category: "오사카·관광", rating: 4.3 },
];

// ─── 체크박스 ────────────────────────────────────────────────────────────────

function CheckCircle({ active }: { active: boolean }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 22, height: 22, borderRadius: "50%",
        background: active ? "#00E1FF" : "transparent",
        border: active ? "none" : "1.5px solid #A1ADB3",
      }}
    >
      {active && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function AddPlacePage() {
  const router = useRouter();

  const [selectedDay, setSelectedDay] = useState("1일차");
  const [activeTab, setActiveTab] = useState<MainTab>("my");
  const [activeCat, setActiveCat] = useState("전체");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(RECENT_QUERIES);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    router.back();
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#090738" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#090738" }}>장소 추가</span>
        <div className="w-9" />
      </div>

      {/* 일차 탭 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-5 pb-3 shrink-0">
        {DAYS.map((d) => {
          const active = selectedDay === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full transition-colors"
              style={{
                background: active ? "#090738" : "transparent",
                color: active ? "#fff" : "#7A858B",
                border: active ? "none" : "1px solid #DDE5E8",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{d}</span>
            </button>
          );
        })}
      </div>

      {/* 메인 탭 (내 장소 / 검색 / AI 추천) */}
      <div className="flex shrink-0" style={{ borderBottom: "1px solid #DDE5E8" }}>
        {MAIN_TABS.map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 py-3 relative"
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#090738" : "#7A858B",
                }}
              >
                {label}
              </span>
              {active && (
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{ width: "40%", height: 2, background: "#090738" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">

        {/* ── 내 장소 탭 ── */}
        {activeTab === "my" && (
          <div className="flex flex-col">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-5 py-3">
              {CATEGORIES.map((cat) => {
                const active = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full"
                    style={{
                      background: active ? "#090738" : "#F7F9FA",
                      color: active ? "#fff" : "#555E63",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* 정렬 라벨 */}
            <div className="flex items-center px-5 pb-2">
              <span style={{ fontSize: 12, color: "#7A858B" }}>추가일순</span>
            </div>

            {/* 장소 리스트 */}
            <div className="flex flex-col gap-2 px-5 pb-4">
              {MY_PLACES.map((p) => {
                const isSel = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className="flex items-start gap-3 text-left py-3 px-3 rounded-2xl transition-all"
                    style={{
                      background: isSel ? "#E5FBFF" : "#fff",
                      border: isSel ? "1.5px solid #00E1FF" : "1.5px solid #DDE5E8",
                    }}
                  >
                    <PlaceImage placeName={p.name} width={48} height={48} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>{p.name}</p>
                      <p className="flex items-center gap-1" style={{ fontSize: 11, color: "#7A858B", marginTop: 2 }}>
                        <Icon name="star" size={13} fill className="text-star-yellow-500" />
                        {p.rating} · {p.reviews.toLocaleString()}개 리뷰
                      </p>
                      <p style={{ fontSize: 11, color: "#555E63", marginTop: 1 }}>{p.category}</p>
                      <p className="truncate" style={{ fontSize: 11, color: "#7A858B", marginTop: 1 }}>
                        {p.desc}
                      </p>
                    </div>
                    <div style={{ marginTop: 2 }}>
                      <CheckCircle active={isSel} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 검색 탭 ── */}
        {activeTab === "search" && (
          <div className="flex flex-col">
            {/* 검색바 */}
            <div className="px-5 pt-3 pb-2">
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

            {/* 최근 검색 */}
            {recents.length > 0 && (
              <div className="px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#7A858B" }}>최근 검색</span>
                  <button onClick={() => setRecents([])} style={{ fontSize: 11, color: "#7A858B" }}>
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recents.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      className="px-3 py-1.5 rounded-full"
                      style={{ background: "#F7F9FA" }}
                    >
                      <span style={{ fontSize: 12, color: "#090738", fontWeight: 500 }}>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 장소 */}
            <div className="px-5 pb-4">
              <p style={{ fontSize: 13, fontWeight: 700, color: "#090738", marginTop: 6, marginBottom: 10 }}>
                오사카에서 다들 추가해요
              </p>
              <div className="flex flex-col gap-2">
                {POPULAR_PLACES.map((p) => {
                  const isSel = selected.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(p.id)}
                      className="flex items-center gap-3 text-left py-3 px-3 rounded-2xl transition-all"
                      style={{
                        background: isSel ? "#E5FBFF" : "#fff",
                        border: isSel ? "1.5px solid #00E1FF" : "1.5px solid #DDE5E8",
                      }}
                    >
                      <span
                        className="shrink-0 w-6 text-center"
                        style={{ fontSize: 18, fontWeight: 700, color: "#A1ADB3" }}
                      >
                        {p.rank}
                      </span>
                      <PlaceImage placeName={p.name} width={44} height={44} />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: "#555E63", marginTop: 2 }}>{p.category}</p>
                        <p className="flex items-center gap-1" style={{ fontSize: 11, color: "#7A858B", marginTop: 1 }}>
                          <Icon name="star" size={12} fill className="text-star-yellow-500" />
                          {p.rating}
                        </p>
                      </div>
                      <CheckCircle active={isSel} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── AI 추천 탭 ── */}
        {activeTab === "ai" && (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <Icon name="auto_awesome" size={44} fill className="text-sky-blue-500" />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#090738", marginTop: 12 }}>
              AI 추천 콘텐츠 준비 중
            </p>
            <p style={{ fontSize: 12, color: "#7A858B", marginTop: 6, textAlign: "center" }}>
              곧 맞춤형 추천 장소를 제공해드릴 예정이에요
            </p>
          </div>
        )}
      </div>

      {/* 하단 영역 */}
      <div className="shrink-0 px-5 pb-6 pt-3" style={{ background: "#fff", borderTop: "1px solid #DDE5E8" }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 13, color: "#555E63", fontWeight: 500 }}>선택한 장소</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#00E1FF" }}>{selected.size}곳</span>
        </div>
        <button
          onClick={handleConfirm}
          disabled={selected.size === 0}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-all"
          style={{
            background: selected.size > 0 ? "#090738" : "#DDE5E8",
            color: selected.size > 0 ? "#fff" : "#7A858B",
          }}
        >
          {selected.size > 0 ? `${selected.size}곳 일정에 추가` : "장소를 선택하세요"}
        </button>
      </div>
    </div>
  );
}
