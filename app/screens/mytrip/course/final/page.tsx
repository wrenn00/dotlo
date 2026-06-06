"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ChevronLeft, Share2, Bookmark, Sparkles, Star, Footprints,
  Utensils, MountainSnow, ShoppingBag, Coffee, Bath, Cake, Landmark, BookOpen, Waves, Mountain, Drama, Moon,
  Pencil, RefreshCw,
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

// 카테고리별 한 줄 설명 (done 페이지와 동일)
const CATEGORY_TAGLINE: Record<string, string> = {
  미식:    "현지인 맛집 중심으로 구성했어요",
  쇼핑:    "쇼핑 거리를 효율적으로 도는 여행",
  야경:    "야경 명소를 따라 걷는 밤 산책",
  휴식:    "공원을 여유롭게 둘러보는 힐링",
  자연:    "자연 속에서 즐기는 여유로운 코스",
  카페:    "분위기 좋은 카페를 즐기는 코스",
  관광:    "랜드마크를 효율적으로 도는 코스",
  역사:    "옛 도쿄 역사를 따라가는 코스",
  박물관:  "다양한 박물관을 둘러보는 코스",
  바다:    "바다와 산책을 함께 즐기는 코스",
  강변:    "강변 산책길을 따라가는 코스",
  디저트:  "달콤한 디저트를 즐기는 코스",
  "공연·전시": "공연과 전시를 즐기는 코스",
};

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
  // 동네별 좌표 — step7과 동일 (도쿄 주요 지역)
  const SUBREGION_COORDS: Record<string, [number, number]> = {
    신주쿠: [35.6896, 139.7006], 시부야: [35.6595, 139.7004], 하라주쿠: [35.6702, 139.7027],
    오모테산도: [35.6664, 139.7136], 아오야마: [35.6664, 139.7298], 롯폰기: [35.6627, 139.7314],
    긴자: [35.6717, 139.7644], 마루노우치: [35.6814, 139.7661], 치요다: [35.6940, 139.7536],
    분쿄: [35.7081, 139.7522], 간다: [35.6924, 139.7706], 우에노: [35.7141, 139.7774],
    아사쿠사: [35.7148, 139.7967], 오시아게: [35.7100, 139.8107], 스미다: [35.7106, 139.7960],
    료고쿠: [35.6961, 139.7937], 미나토: [35.6586, 139.7454], 시오도메: [35.6655, 139.7589],
    츠키지: [35.6655, 139.7708], 도요스: [35.6553, 139.7977], 오다이바: [35.6300, 139.7800],
    카사이: [35.6383, 139.8503], 시나가와: [35.6284, 139.7387], 와카스: [35.6235, 139.8198],
    아리아케: [35.6328, 139.7910], 오이: [35.5915, 139.7430], 하루미: [35.6504, 139.7842],
    코토: [35.6700, 139.8174], 츄오: [35.6735, 139.7720], 에비스: [35.6465, 139.7100],
    나카메구로: [35.6435, 139.6986], 토미가야: [35.6699, 139.6886], 요요기: [35.6830, 139.7022],
    키치조지: [35.7022, 139.5803], 메구로: [35.6432, 139.6986], 세타가야: [35.6432, 139.6534],
    히가시야마: [35.6478, 139.7037], 교바시: [35.6770, 139.7700], 미타카: [35.7020, 139.5599],
    아카사카: [35.6736, 139.7370], 아키하바라: [35.7022, 139.7741], 아자부다이: [35.6620, 139.7405],
    하카타: [35.6920, 139.7000], 하츠다이: [35.6789, 139.6837], 이케부쿠로: [35.7295, 139.7109],
    니혼바시: [35.6839, 139.7745], 다이토: [35.7141, 139.7774], 우라야스: [35.6504, 139.8857],
    오쿠보: [35.7010, 139.6989], 츠키시마: [35.6663, 139.7855], 기요스미: [35.6800, 139.8000],
    야나카: [35.7290, 139.7700], 가구라자카: [35.7035, 139.7384],
  };

  // 활성 일차의 타임라인 (THEMES에서 5개 추출) — 지도 마커는 이 순서를 그대로 따름 (1=가장 이른 시간)
  // 카테고리별로 10개 정도뿐이라 activeDay로 슬라이스하면 3일차 이후가 비는 문제를 막기 위해
  // (activeDay × 2)부터 5개씩 잘라 항상 결과가 나오도록 함. 데이터가 부족하면 앞에서 채움.
  const dayPlacesForMap = useMemo(() => {
    const base = THEMES[activeCategory] ?? [];
    if (base.length === 0) return [];
    const offset = (activeDay * 2) % Math.max(1, base.length);
    const picked: typeof base = [];
    for (let i = 0; i < 5 && i < base.length; i++) {
      picked.push(base[(offset + i) % base.length]);
    }
    return picked;
  }, [activeCategory, activeDay]);

  const sampleMarkers = useMemo(() => {
    return dayPlacesForMap.map((p, i) => {
      const hit = SUBREGION_COORDS[p.subRegion];
      const lat = hit?.[0] ?? 35.681 + ((i * 13) % 7) * 0.004 - 0.012;
      const lng = hit?.[1] ?? 139.767 + ((i * 17) % 7) * 0.004 - 0.012;
      return {
        number: i + 1,
        lat,
        lng,
        name: p.name,
        description: p.description,
      };
    });
  // SUBREGION_COORDS는 모듈 스코프가 아니라 컴포넌트 안에서 재할당되지 않으므로 deps 불필요
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayPlacesForMap]);

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

        {/* AI 카드 (라이트 #FAFAFA — 라벤더 칩) */}
        <div
          style={{
            marginTop: 22,
            background: "#FAFAFA",
            borderRadius: 12,
            padding: "10px 18px 18px 18px",
          }}
        >
          <div className="flex items-center" style={{ gap: 9 }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 34, height: 34, background: "#EFEFFF", borderRadius: 20 }}
            >
              <Sparkles size={18} color="#B8B8FF" fill="#B8B8FF" strokeWidth={0} />
            </div>
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, color: "#333333" }}>
              AI가 이렇게 짰어요
            </span>
          </div>
          <div className="flex flex-col" style={{ marginTop: 14, gap: 10 }}>
            {["맛집 우선으로 점심·저녁 동선 짰어요", "야경 시간대를 일정 마지막에 배치했어요", "숙소 기준으로 동선이 가장 짧아요"].map((t) => (
              <div key={t} className="flex items-center" style={{ gap: 13 }}>
                <div className="shrink-0" style={{ width: 5, height: 5, background: "#A0A0C0", borderRadius: "50%" }} />
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, color: "#888888" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 내 취향 반영 카드 (라이트 #FAFAFA) */}
        <div
          style={{
            marginTop: 12,
            background: "#FAFAFA",
            borderRadius: 12,
            padding: "17px 18px 18px 18px",
          }}
        >
          <div className="flex items-baseline justify-between">
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, color: "#000000" }}>
              내 취향 반영
            </span>
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#888E9C" }}>
              총 {Object.values(assignments).length || days}곳 중
            </span>
          </div>
          {/* 누적 가로 막대 */}
          <div className="flex" style={{ marginTop: 16, height: 7, borderRadius: 4, overflow: "hidden" }}>
            {(usedCategories.length > 0 ? usedCategories : [{ cat: "관광", percent: 100, color: "#A0A0C0", count: 1 }]).map((p) => (
              <div key={p.cat} style={{ flex: p.percent, background: p.color }} />
            ))}
          </div>
          {/* 범례 2x2 */}
          <div className="grid grid-cols-2" style={{ marginTop: 18, gap: "11px 41px" }}>
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

        {/* 코스 타이틀 카드 — 지도 아래 (캐릭터 + 시안 톤) */}
        <div
          className="relative overflow-hidden"
          style={{
            marginTop: 14,
            height: 90,
            borderRadius: 12,
            background: CHIP_BG[courseColor] ?? "#F2FDFF",
          }}
        >
          {/* 캐릭터 — 우측 */}
          <div
            className="absolute"
            style={{
              right: 8,
              top: 4,
              width: 100,
              height: 82,
              backgroundImage: "url(/images/cheer.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right center",
              pointerEvents: "none",
            }}
          />
          <div className="absolute flex items-start" style={{ left: 14, top: 14, right: 110, gap: 8 }}>
            {/* 일차 칩 */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ height: 24, padding: "0 12px", background: "#FFFFFF", borderRadius: 17 }}
            >
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: courseColor }}>
                {activeDay + 1}일차
              </span>
            </div>
            {/* 코스 이름 + 태그라인 */}
            <div className="flex flex-col min-w-0" style={{ gap: 4 }}>
              <span
                className="truncate"
                style={{ fontFamily: '"Pretendard", "Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 700, lineHeight: "20px", color: courseColor }}
              >
                {activeCourse?.title ?? `${activeDay + 1}일차 코스`}
              </span>
              <span
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  fontFamily: '"Pretendard", "Spoqa Han Sans Neo"',
                  fontSize: 10,
                  fontWeight: 400,
                  lineHeight: "14px",
                  color: "#555555",
                }}
              >
                {CATEGORY_TAGLINE[activeCategory] ?? "AI가 추천하는 코스"}
              </span>
            </div>
          </div>
        </div>

        {/* 일차별 코스 타임라인 */}
        {(() => {
          const cat = activeCategory;
          // dayPlacesForMap과 동일한 순서로 — 지도 마커 번호와 카드 순서가 일치하도록
          const dayPlaces = dayPlacesForMap;
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

      {/* 하단 액션 영역 — 일정 수정 / 다시 만들기 보조 + 내 여행에 저장하기 메인 */}
      <div className="shrink-0 flex flex-col" style={{ padding: "0 20px 24px", gap: 10 }}>
        {/* 보조 버튼 2개 (좌우 분할) */}
        <div className="flex" style={{ gap: 10 }}>
          {[
            { Icon: Pencil, label: "일정 수정" },
            { Icon: RefreshCw, label: "다시 만들기" },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              className="flex-1 flex items-center justify-center transition-opacity active:opacity-80"
              style={{
                height: 44,
                background: "#FFFFFF",
                border: "1.5px solid #E0E0E0",
                borderRadius: 30,
                gap: 6,
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#555555",
              }}
            >
              <Icon size={16} color="#555555" strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* 메인 — 내 여행에 저장하기 */}
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
          내 여행에 저장하기
        </button>
      </div>
      {/* dayPalette는 참조만 — 추후 일차별 강조 색에 사용 */}
      <span style={{ display: "none" }}>{DAY_TAB_PALETTE.length}</span>
    </div>
  );
}
