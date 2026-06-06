"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ChevronLeft, Share2, Bookmark, Sparkles, Star, Footprints,
  Utensils, MountainSnow, ShoppingBag, Coffee, Bath, Cake, Landmark, BookOpen, Waves, Mountain, Drama, Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import tokyoThemes from "@/data/tokyo-themes.json";
import PlaceThumbnail from "@/components/PlaceThumbnail";

const TIMELINE_ICON: Record<string, LucideIcon> = {
  미식: Utensils, 관광: MountainSnow, 쇼핑: ShoppingBag, 카페: Coffee,
  휴식: Bath, 디저트: Cake, 박물관: Landmark, 역사: BookOpen,
  바다: Waves, 강변: Mountain, 야경: Moon, "공연·전시": Drama,
};

const CHIP_BG: Record<string, string> = {
  "#00E1FF": "#F2FDFF",
  "#A5A5FF": "#EFEFFF",
  "#FFE400": "#FFFCE2",
  "#090738": "#EFEFFF",
  "#A0A0C0": "#F2F2F6",
};

// 카테고리별 시간 윈도우 (step7과 동일)
const SCHEDULE_WINDOW: Record<string, [number, number]> = {
  미식: [510, 1260], 관광: [540, 1080], 쇼핑: [600, 1200], 카페: [540, 1140],
  야경: [1020, 1380], 휴식: [570, 1080], 디저트: [600, 1200],
  박물관: [570, 1050], 역사: [540, 1050], 바다: [570, 1080],
  강변: [570, 1170], "공연·전시": [600, 1260],
};

type ThemePlace = { name: string; subRegion: string; rating: number; reviews: number; description: string; image?: string };
const THEMES = tokyoThemes as Record<string, ThemePlace[]>;

function timeAt(label: string, idx: number, count: number) {
  const [s, e] = SCHEDULE_WINDOW[label] ?? [540, 1080];
  const step = count > 1 ? (e - s) / (count - 1) : 0;
  const rounded = Math.round((s + step * idx) / 5) * 5;
  const h = Math.floor(rounded / 60), m = rounded % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const CourseMap = dynamic(() => import("@/components/CourseMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full" style={{ background: "#F2F4F7" }} />,
});

const DAY_TAB_PALETTE = [
  { active: "#090738", chip: "#00E1FF" }, // 1일차
  { active: "#090738", chip: "#A5A5FF" }, // 2일차
  { active: "#090738", chip: "#FFE400" }, // 3일차
  { active: "#090738", chip: "#A0A0C0" }, // 4일차
];

const CATEGORY_COLOR: Record<string, string> = {
  미식: "#00E1FF",
  맛집: "#00E1FF",
  쇼핑: "#FFE400",
  카페: "#FFE400",
  야경: "#A5A5FF",
  휴식: "#090738",
  자연: "#090738",
  관광: "#A0A0C0",
  역사: "#A0A0C0",
  박물관: "#A0A0C0",
  바다: "#00E1FF",
  강변: "#A5A5FF",
  디저트: "#FFE400",
  "공연·전시": "#A5A5FF",
};

interface SavedCourse {
  id: number | string;
  title: string;
  category?: string;
  image?: string;
}

interface FinalCombine {
  assignments: Record<number, SavedCourse>;
  startISO: string;
  endISO: string;
  nights: number;
  days: number;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function fmtRange(start: Date, end: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${WEEKDAYS[d.getDay()]})`;
  return `${fmt(start)} ~ ${fmt(end)}`;
}

export default function FinalCoursePage() {
  const router = useRouter();
  const [combine, setCombine] = useState<FinalCombine | null>(null);
  const [where, setWhere] = useState("도쿄");
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dotlo:final-combine");
      if (raw) setCombine(JSON.parse(raw));
    } catch {/* ignore */}
    const w = sessionStorage.getItem("dotlo:where");
    if (w) setWhere(w);
  }, []);

  const startDate = combine ? new Date(combine.startISO) : new Date("2026-05-18");
  const endDate = combine ? new Date(combine.endISO) : new Date("2026-05-21");
  const days = combine?.days ?? 4;
  const nights = combine?.nights ?? days - 1;
  const assignments = combine?.assignments ?? {};

  // 일자별 코스 → 카테고리별 비율 계산
  const usedCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(assignments).forEach((c) => {
      const cat = c.category ?? "기타";
      counts[cat] = (counts[cat] ?? 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([cat, n]) => ({
      cat,
      count: n,
      percent: Math.round((n / total) * 100),
      color: CATEGORY_COLOR[cat] ?? "#A0A0C0",
    }));
  }, [assignments]);

  // 활성 일차의 코스
  const activeCourse = assignments[activeDay];
  const activeCategory = activeCourse?.category ?? "관광";
  const courseColor = CATEGORY_COLOR[activeCategory] ?? "#A5A5FF";

  // 지도 마커 — 활성 일차 기준 임의의 6개 도쿄 좌표
  const sampleMarkers = useMemo(() => {
    // 결정적이지만 일차마다 완전히 다른 좌표가 나오도록 Mulberry32 시드 사용
    let s = (activeDay * 2654435761 + activeCategory.length * 17 + 1) >>> 0;
    const rand = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    // 도쿄 중심부에서 ±0.018도 (~2km) 범위로 흩기
    return Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      lat: 35.681 + (rand() - 0.5) * 0.036,
      lng: 139.767 + (rand() - 0.5) * 0.036,
      name: `${activeCategory} 스팟 ${i + 1}`,
    }));
  }, [activeDay, activeCategory]);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FAFBFF" }}>
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-between" style={{ padding: "50px 14px 0 14px", height: 86 }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
        <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, color: "#000000" }}>
          최종 여행 일정
        </span>
        <div className="flex items-center" style={{ gap: 12 }}>
          <Share2 size={20} color="#111111" strokeWidth={1.8} />
          <Bookmark size={18} color="#111111" strokeWidth={1.8} />
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "0 20px 24px" }}>
        {/* 타이틀 + 날짜 */}
        <div className="flex flex-col" style={{ marginTop: 20, gap: 6 }}>
          <h1 style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 22, fontWeight: 700, lineHeight: "28px", color: "#1A1A1A" }}>
            {where} {nights}박 {days}일 여행
          </h1>
          <p style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: "#888888" }}>
            {fmtRange(startDate, endDate)} - {nights}박 {days}일
          </p>
        </div>

        {/* AI가 이렇게 짰어요 + 내 취향 반영 카드 */}
        <div
          className="relative"
          style={{ marginTop: 22, height: 220, background: "#FFFFFF", borderRadius: 12, boxShadow: "0 0 6.8px rgba(0,0,0,0.06)" }}
        >
          {/* AI 칩 */}
          <div
            className="absolute flex items-center justify-center"
            style={{ left: 10, top: 10, width: 34, height: 34, background: "#090738", borderRadius: 20 }}
          >
            <Sparkles size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          </div>
          <span
            className="absolute"
            style={{ left: 53, top: 19, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, color: "#000000" }}
          >
            AI가 이렇게 짰어요
          </span>

          {/* bullets */}
          <div className="absolute flex flex-col" style={{ left: 18, top: 53, gap: 9 }}>
            {["맛집 우선으로 점심·저녁 동선 짰어요", "야경 시간대를 일정 마지막에 배치했어요", "숙소 기준으로 동선이 가장 짧아요"].map((t) => (
              <div key={t} className="flex items-center" style={{ gap: 13 }}>
                <div className="shrink-0" style={{ width: 5, height: 5, background: "#A0A0C0", borderRadius: "50%" }} />
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, color: "#666C78" }}>{t}</span>
              </div>
            ))}
          </div>

          {/* 내 취향 반영 */}
          <span className="absolute" style={{ left: 17, top: 130, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, color: "#888E9C" }}>
            내 취향 반영
          </span>
          <span className="absolute" style={{ right: 18, top: 131, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#888E9C" }}>
            총 {Object.values(assignments).length || days}곳 중
          </span>

          {/* 누적 가로 막대 */}
          <div className="absolute flex" style={{ left: 18, right: 18, top: 150, height: 7, borderRadius: 4, overflow: "hidden" }}>
            {(usedCategories.length > 0 ? usedCategories : [{ cat: "관광", percent: 100, color: "#A0A0C0", count: 1 }]).map((p) => (
              <div key={p.cat} style={{ flex: p.percent, background: p.color }} />
            ))}
          </div>

          {/* 범례 2x2 */}
          <div className="absolute grid grid-cols-2" style={{ left: 18, right: 18, top: 168, gap: "11px 41px" }}>
            {(usedCategories.length > 0 ? usedCategories : []).slice(0, 4).map((p) => (
              <div key={p.cat} className="flex items-center" style={{ gap: 8 }}>
                <div className="shrink-0" style={{ width: 8, height: 8, background: p.color, borderRadius: "50%" }} />
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, color: "#535353" }}>{p.cat}</span>
                <span className="ml-auto" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#535353" }}>{p.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 일차 탭 */}
        <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ marginTop: 21, gap: 9 }}>
          {Array.from({ length: days }, (_, i) => {
            const active = activeDay === i;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className="shrink-0 inline-flex items-center justify-center"
                style={{
                  height: 32,
                  padding: "0 16px",
                  background: active ? "#090738" : "#F2F2F6",
                  borderRadius: 20,
                }}
              >
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: active ? "#FFFFFF" : "#2E2E70" }}>
                  {i + 1}일차
                </span>
              </button>
            );
          })}
        </div>

        {/* 지도 영역 */}
        <div
          className="relative overflow-hidden"
          style={{ marginTop: 18, height: 271, background: "#F2F4F7", borderRadius: 12 }}
        >
          <CourseMap
            courses={[{ id: `day-${activeDay}`, color: courseColor, markers: sampleMarkers }]}
            center={[35.681, 139.767]}
            zoom={13}
            height="100%"
            showAll
          />
          {/* 도보 + 대중교통 라벨 */}
          <div
            className="absolute flex flex-col"
            style={{ left: 8, bottom: 8, padding: 10, gap: 3, background: "#FFFFFF", borderRadius: 8, width: 105 }}
          >
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 700, color: "#000000" }}>
              도보 + 대중교통
            </span>
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 8, fontWeight: 400, lineHeight: "10px", color: "#000000" }}>
              이동 부담을 줄인{"\n"}최적의 동선이에요
            </span>
          </div>
        </div>

        {/* 일차별 코스 타임라인 */}
        {(() => {
          const cat = activeCategory;
          const base = THEMES[cat] ?? [];
          const dayPlaces = base.slice(activeDay * 5, activeDay * 5 + 5);
          const Icon = TIMELINE_ICON[cat] ?? Sparkles;
          const chipBg = CHIP_BG[courseColor] ?? "#F2F2F6";
          if (dayPlaces.length === 0) return null;
          return (
            <div className="flex flex-col" style={{ marginTop: 22, gap: 18 }}>
              {dayPlaces.map((p, i) => (
                <div key={`${p.name}-${i}`} className="flex">
                  <div className="shrink-0 flex flex-col items-center" style={{ width: 33 }}>
                    <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#4B5969" }}>
                      {timeAt(cat, i, dayPlaces.length)}
                    </span>
                    <div className="flex items-center justify-center" style={{ marginTop: 3, width: 25, height: 25, background: chipBg, borderRadius: 8 }}>
                      <Icon size={14} color={courseColor} strokeWidth={2} />
                    </div>
                    {i < dayPlaces.length - 1 && (
                      <div className="flex-1 flex flex-col items-center" style={{ marginTop: 4, gap: 4 }}>
                        <div style={{ width: 1, flex: 1, background: "#E6E8EB" }} />
                        <Footprints size={14} color="#A0A0C0" strokeWidth={1.8} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1" style={{ marginLeft: 8 }}>
                    <div className="relative" style={{ padding: 9, background: "#F9FAFB", borderRadius: 8 }}>
                      <div className="flex items-start" style={{ gap: 8 }}>
                        <div className="shrink-0">
                          <PlaceThumbnail src={p.image} alt={p.name} category={cat} size={51} />
                        </div>
                        <div className="flex flex-col min-w-0" style={{ gap: 4, flex: 1 }}>
                          <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
                            {p.name}
                          </span>
                          <div className="flex flex-col" style={{ gap: 2 }}>
                            <div className="flex items-center whitespace-nowrap" style={{ gap: 5 }}>
                              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>
                                {p.subRegion}·{cat}
                              </span>
                              <div className="flex items-center" style={{ gap: 1 }}>
                                <Star size={11} color="#FFE770" fill="#FFE770" strokeWidth={0} />
                                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>
                                  {p.rating}({p.reviews.toLocaleString()})
                                </span>
                              </div>
                            </div>
                            <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>
                              {p.description}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="absolute inline-flex items-center justify-center"
                        style={{ top: 6, right: 6, height: 14, padding: "0 6px", background: chipBg, borderRadius: 4 }}
                      >
                        <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 8, fontWeight: 500, color: courseColor }}>
                          {cat}
                        </span>
                      </div>
                    </div>
                    {i < dayPlaces.length - 1 && (
                      <div className="flex items-center" style={{ marginTop: 4, gap: 4 }}>
                        <Footprints size={13} color="#A0A0C0" strokeWidth={1.8} />
                        <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#767F89" }}>
                          도보 10분 · 800m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* 최종 코스에 저장하기 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 20px 24px" }}>
        <button
          onClick={() => router.push("/screens/mytrip?segment=saved")}
          className="w-full flex items-center justify-center transition-opacity active:opacity-80"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            gap: 10,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          <Sparkles size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          최종 코스에 저장하기
        </button>
      </div>
      {/* dayPalette는 참조만 — 추후 일차별 강조 색에 사용 */}
      <span style={{ display: "none" }}>{DAY_TAB_PALETTE.length}</span>
    </div>
  );
}
