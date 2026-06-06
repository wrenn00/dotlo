"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronLeft, Sparkles, Map as MapIcon, RotateCcw, ChevronDown, Star, Footprints, Bookmark,
  Utensils, MountainSnow, ShoppingBag, Bath, Coffee, Cake, Landmark, BookOpen, Waves, Mountain, Drama, Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TIMELINE_ICON: Record<string, LucideIcon> = {
  미식: Utensils,
  관광: MountainSnow,
  쇼핑: ShoppingBag,
  카페: Coffee,
  휴식: Bath,
  디저트: Cake,
  박물관: Landmark,
  역사: BookOpen,
  바다: Waves,
  강변: Mountain,
  야경: Moon,
  "공연·전시": Drama,
};
import PlaceThumbnail from "@/components/PlaceThumbnail";
import { buildCourses, getCourse, type Course, type CourseId } from "./courses";
import tokyoThemes from "@/data/tokyo-themes.json";

const AUTOPLAY_INTERVAL_MS = 1600;

// 가로 슬라이드 — direction(1=forward / -1=backward)에 따라 enter/exit 방향이 바뀜
const slideVariants: Variants = {
  initial: (dir: 1 | -1) => ({ opacity: 0, x: dir * 40 }),
  animate: { opacity: 1, x: 0 },
  exit:    (dir: 1 | -1) => ({ opacity: 0, x: dir * -40 }),
};

// 카테고리별 시간 슬롯 + 이동 안내 — 첫 4개 장소에 차례로 매핑
// 카테고리별 영업 시간대 — [시작시(분), 종료시(분)]. 전체 장소 수만큼 이 구간 안에 균등 분포.
const SCHEDULE_WINDOW: Record<string, [number, number]> = {
  미식:      [8 * 60 + 30, 21 * 60],      // 08:30 ~ 21:00
  관광:      [9 * 60,      18 * 60],      // 09:00 ~ 18:00
  쇼핑:      [10 * 60,     20 * 60],      // 10:00 ~ 20:00
  카페:      [9 * 60,      19 * 60],      // 09:00 ~ 19:00
  야경:      [17 * 60,     23 * 60],      // 17:00 ~ 23:00
  휴식:      [9 * 60 + 30, 18 * 60],      // 09:30 ~ 18:00
  디저트:    [10 * 60,     20 * 60],      // 10:00 ~ 20:00
  박물관:    [9 * 60 + 30, 17 * 60 + 30], // 09:30 ~ 17:30
  역사:      [9 * 60,      17 * 60 + 30], // 09:00 ~ 17:30
  바다:      [9 * 60 + 30, 18 * 60],      // 09:30 ~ 18:00
  강변:      [9 * 60 + 30, 19 * 60 + 30], // 09:30 ~ 19:30
  "공연·전시": [10 * 60,    21 * 60],      // 10:00 ~ 21:00
};

// 표시용 카테고리 라벨 (미식 → 맛집)
const DISPLAY_CATEGORY: Record<string, string> = {
  미식: "맛집",
  관광: "관광",
  쇼핑: "쇼핑",
  카페: "카페",
  야경: "야경",
  휴식: "휴식",
  디저트: "디저트",
  박물관: "박물관",
  역사: "역사",
  바다: "바다",
  강변: "강변",
  "공연·전시": "전시",
};

type ThemePlace = { name: string; subRegion: string; rating: number; reviews: number; description: string; image?: string };
const THEMES = tokyoThemes as Record<string, ThemePlace[]>;

// Mulberry32 — 시드를 받아 결정적으로 카드 순서를 섞기 위함
function shuffledBy<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed | 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const CourseMap = dynamic(() => import("@/components/CourseMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full" style={{ background: "rgba(255,255,255,0.2)" }} />,
});

interface TimelineEntry {
  time: string;
  title: string;
  region: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  tag: string;
  next?: string;
}

// 카테고리 시간대를 N개 장소에 균등 분포 + 5분 단위로 반올림
function makeSlots(label: string, count: number): { time: string; next?: string }[] {
  if (count <= 0) return [];
  const [startMin, endMin] = SCHEDULE_WINDOW[label] ?? SCHEDULE_WINDOW["관광"];
  const step = count > 1 ? (endMin - startMin) / (count - 1) : 0;

  const slots: { time: string; next?: string }[] = [];
  for (let i = 0; i < count; i++) {
    const raw = startMin + step * i;
    const rounded = Math.round(raw / 5) * 5; // 5분 단위로 깔끔하게
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const isLast = i === count - 1;
    // 이동 수단은 보폭/거리에 맞춰 4가지를 반복
    const transit = ["도보 10분 · 800m", "지하철 12분 · 4km", "도보 15분 · 1km", "지하철 10분 · 3km"][i % 4];
    slots.push({ time, next: isLast ? undefined : transit });
  }
  return slots;
}

function timelineFor(label: string, shuffleSeed = 0): TimelineEntry[] {
  const base = THEMES[label];
  if (!base || base.length === 0) {
    return [
      { time: "10:00", title: `${label} 추천 장소 1`, region: "도쿄", category: label, rating: 4.5, reviews: 1200, description: `${label} 우선 동선의 첫 스팟`, image: "/images/places/default.jpg", tag: label, next: "도보 10분 · 800m" },
      { time: "13:00", title: `${label} 추천 장소 2`, region: "도쿄", category: label, rating: 4.4, reviews: 900,  description: `${label} 흐름을 이어가는 곳`,  image: "/images/places/default.jpg", tag: label, next: "지하철 12분 · 3km" },
      { time: "16:00", title: `${label} 추천 장소 3`, region: "도쿄", category: label, rating: 4.6, reviews: 1500, description: `${label}의 핵심 스팟`,         image: "/images/places/default.jpg", tag: label },
    ];
  }
  // 라벨별 시드를 살짝 분리해서 탭마다 다른 순서가 되게 한다
  const labelHash = Array.from(label).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = shuffleSeed > 0 ? shuffledBy(base, shuffleSeed + labelHash * 31) : base;
  // 매번 5~6개만 랜덤으로 노출 (시드 + 라벨에 따라 결정)
  const pickCount = Math.min(shuffled.length, 5 + ((shuffleSeed + labelHash) % 2 === 0 ? 0 : 1));
  const places = shuffled.slice(0, pickCount);
  const slots = makeSlots(label, places.length);
  const display = DISPLAY_CATEGORY[label] ?? label;
  return places.map((p, i) => ({
    time: slots[i].time,
    title: p.name,
    region: `도쿄·${p.subRegion}`,
    category: display,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
    image: p.image ?? "/images/places/default.jpg",
    tag: display,
    next: slots[i].next,
  }));
}

// subRegion 이름 → 도쿄 좌표 매핑. 누락 시 fallback으로 도쿄역 근방을 약간 흩어 배치.
const SUBREGION_COORDS: Record<string, [number, number]> = {
  신주쿠: [35.6896, 139.7006],
  시부야: [35.6595, 139.7004],
  하라주쿠: [35.6702, 139.7027],
  오모테산도: [35.6664, 139.7136],
  아오야마: [35.6664, 139.7298],
  롯폰기: [35.6627, 139.7314],
  긴자: [35.6717, 139.7644],
  마루노우치: [35.6814, 139.7661],
  치요다: [35.6940, 139.7536],
  분쿄: [35.7081, 139.7522],
  간다: [35.6924, 139.7706],
  우에노: [35.7141, 139.7774],
  아사쿠사: [35.7148, 139.7967],
  오시아게: [35.7100, 139.8107],
  스미다: [35.7106, 139.7960],
  료고쿠: [35.6961, 139.7937],
  미나토: [35.6586, 139.7454],
  시오도메: [35.6655, 139.7589],
  츠키지: [35.6655, 139.7708],
  도요스: [35.6553, 139.7977],
  오다이바: [35.6300, 139.7800],
  카사이: [35.6383, 139.8503],
  시나가와: [35.6284, 139.7387],
  와카스: [35.6235, 139.8198],
  아리아케: [35.6328, 139.7910],
  오이: [35.5915, 139.7430],
  하루미: [35.6504, 139.7842],
  코토: [35.6700, 139.8174],
  츄오: [35.6735, 139.7720],
  에비스: [35.6465, 139.7100],
  나카메구로: [35.6435, 139.6986],
  토미가야: [35.6699, 139.6886],
  요요기: [35.6830, 139.7022],
  키치조지: [35.7022, 139.5803],
  메구로: [35.6432, 139.6986],
  세타가야: [35.6432, 139.6534],
  히가시야마: [35.6478, 139.7037],
  교바시: [35.6770, 139.7700],
  미타카: [35.7020, 139.5599],
  아카사카: [35.6736, 139.7370],
  아키하바라: [35.7022, 139.7741],
  아자부다이: [35.6620, 139.7405],
  하카타: [35.6920, 139.7000],
  하츠다이: [35.6789, 139.6837],
  이케부쿠로: [35.7295, 139.7109],
  니혼바시: [35.6839, 139.7745],
  다이토: [35.7141, 139.7774],
  우라야스: [35.6504, 139.8857],
  오쿠보: [35.7010, 139.6989],
  츠키시마: [35.6663, 139.7855],
  기요스미: [35.6800, 139.8000],
  야나카: [35.7290, 139.7700],
  가구라자카: [35.7035, 139.7384],
};

function coordsFor(subRegion: string, idx: number): [number, number] {
  const hit = SUBREGION_COORDS[subRegion];
  if (hit) return hit;
  // fallback — 도쿄역 근방 0.02도 격자로 살짝 흩기
  return [35.681 + ((idx * 13) % 7) * 0.004 - 0.012, 139.767 + ((idx * 17) % 7) * 0.004 - 0.012];
}

const DEFAULT_LABELS = ["미식", "야경", "쇼핑"];

export default function Step7Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(() => buildCourses(DEFAULT_LABELS));
  const [activeTab, setActiveTab] = useState<CourseId>("A");
  const [tabDirection, setTabDirection] = useState<1 | -1>(1); // +1 forward, -1 backward
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  // 페이지 마운트마다 새 시드 — step8/재생성 거쳐 돌아오면 코스 순서가 새로 섞임
  const [shuffleSeed] = useState(() => (Math.floor(Math.random() * 0x7fffffff) | 0) + 1);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<Record<CourseId, HTMLButtonElement | null>>({ A: null, B: null, C: null });
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // step5(우선순위) 또는 step4(키워드) → 코스 탭 1~3개 구성
  useEffect(() => {
    try {
      const priorityRaw = sessionStorage.getItem("dotlo:step5-priority");
      const keywordsRaw = sessionStorage.getItem("dotlo:step4-keywords");
      const labels: string[] = priorityRaw
        ? JSON.parse(priorityRaw)
        : keywordsRaw
        ? JSON.parse(keywordsRaw)
        : [];
      if (Array.isArray(labels) && labels.length > 0) {
        const next = buildCourses(labels);
        if (next.length > 0) {
          setCourses(next);
          setActiveTab(next[0].id);
        }
      }
    } catch {
      /* fall back to defaults */
    }
  }, []);

  // 자동 사이클: 첫 탭 → 끝 탭 → 첫 탭, 한 바퀴 돌고 정지
  // 탭이 1개면 사이클 자체를 건너뛰고 즉시 정지
  useEffect(() => {
    if (!autoPlaying) return;
    if (courses.length <= 1) {
      setAutoPlaying(false);
      return;
    }
    const sequence = courses.map((c) => c.id);
    const fullCycle = [...sequence, sequence[0]];
    setTabDirection(1);
    setActiveTab(fullCycle[0]);
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx >= fullCycle.length) {
        setAutoPlaying(false);
        clearInterval(timer);
        return;
      }
      setTabDirection(1); // 자동 사이클은 항상 정방향(오른쪽)으로 슬라이드
      setActiveTab(fullCycle[idx]);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoPlaying, courses]);

  // 액티브 탭 위치 추적 → 인디케이터 부드럽게 이동
  useEffect(() => {
    const btn = tabBtnRefs.current[activeTab];
    const wrap = tabsRef.current;
    if (!btn || !wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({ left: btnRect.left - wrapRect.left, width: btnRect.width });
  }, [activeTab, courses]);

  function handleTabClick(id: CourseId) {
    setAutoPlaying(false);
    // 현재 위치 대비 다음 탭이 오른쪽이면 +1, 왼쪽이면 -1
    const cur = courses.findIndex((c) => c.id === activeTab);
    const next = courses.findIndex((c) => c.id === id);
    if (next !== cur && cur >= 0 && next >= 0) {
      setTabDirection(next > cur ? 1 : -1);
    }
    setActiveTab(id);
  }

  const course = getCourse(activeTab, courses);
  const items = timelineFor(course.categoryKey, shuffleSeed);
  const visibleItems = expanded ? items : items.slice(0, 4);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px 24px" }}>

        {/* AI 추천 칩 + 제목 블록 */}
        <div className="flex flex-col" style={{ marginTop: 12, gap: 10 }}>
          <div
            className="inline-flex items-center self-start"
            style={{
              height: 28,
              padding: "0 10px 0 7px",
              gap: 6,
              background: "#F2F2F6",
              borderRadius: 27,
            }}
          >
            <Sparkles size={16} color="#6060A0" fill="#6060A0" strokeWidth={0} />
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#6060A0",
              }}
            >
              AI 추천
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 6 }}>
            <h1
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: "28px",
                color: "#373C3E",
              }}
            >
              코스를 만들었어요
            </h1>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#888E9C",
              }}
            >
              3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
            </p>
          </div>
        </div>

        {/* 탭 셀렉터 — 340x40 #F8F9FB radius 12, 액티브 표시는 슬라이드 인디케이터 */}
        <div
          ref={tabsRef}
          className="relative flex items-center"
          style={{
            marginTop: 16,
            height: 40,
            padding: 3,
            background: "#F8F9FB",
            borderRadius: 12,
          }}
        >
          {/* 슬라이드 인디케이터 */}
          {indicator && (
            <motion.div
              layout
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "absolute",
                top: 3,
                height: 34,
                background: "#FFFFFF",
                boxShadow: "0 0 4px rgba(0,0,0,0.09)",
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />
          )}
          {courses.map((c) => (
            <button
              key={c.id}
              ref={(el) => {
                tabBtnRefs.current[c.id] = el;
              }}
              onClick={() => handleTabClick(c.id)}
              className="relative flex-1 flex items-center justify-center"
              style={{
                height: 34,
                background: "transparent",
                borderRadius: 8,
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
                color: "#666C78",
              }}
            >
              {c.id} {c.label.replace(" 코스", "")}
            </button>
          ))}
        </div>

        {/* 자동/수동 탭 전환에 따라 코스 콘텐츠가 가로 슬라이드 — 상단 인디케이터와 같은 방향 */}
        <AnimatePresence mode="wait" custom={tabDirection}>
        <motion.div
          key={activeTab}
          custom={tabDirection}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
        >
        {/* 히어로 카드 — 344x271 + 하단 정보 영역 */}
        <div className="flex flex-col" style={{ marginTop: 14, gap: 11 }}>
          {/* 지도 영역 — 모서리 라벤더/시안 누수 방지를 위해 타일 톤(#F2F4F7)으로 통일 */}
          <div
            className="relative overflow-hidden"
            style={{
              height: 271,
              background: "#F2F4F7",
              borderRadius: 12,
            }}
          >
            <CourseMap
              courses={[{
                id: course.id,
                color: course.colorHex,
                markers: items.map((it, i) => {
                  const sub = it.region.split("·").slice(-1)[0];
                  const [lat, lng] = coordsFor(sub, i);
                  return { number: i + 1, lat, lng, name: it.title, description: it.description };
                }),
              }]}
              center={(() => {
                const sub = items[0]?.region.split("·").slice(-1)[0] ?? "";
                const [lat, lng] = items[0] ? coordsFor(sub, 0) : [35.681, 139.767];
                return [lat, lng];
              })()}
              zoom={12}
              height="100%"
              showAll
            />
          </div>

          {/* 코스 정보 카드 — course color bg with white text */}
          <div
            className="relative overflow-hidden"
            style={{
              padding: "13px 14px",
              background: course.colorHex,
              borderRadius: 12,
            }}
          >
            <div className="flex items-start" style={{ gap: 8 }}>
              {/* 코스 칩 — 58x24 코스별 chipBg radius 18 */}
              <div
                className="inline-flex items-center justify-center"
                style={{
                  height: 24,
                  padding: "0 10px",
                  background: course.chipBgHex,
                  borderRadius: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "18px",
                    color: course.accentHex,
                  }}
                >
                  {course.id} 코스
                </span>
              </div>
              <div className="flex flex-col" style={{ gap: 4, flex: 1 }}>
                <p
                  style={{
                    fontFamily: '"Pretendard", "Spoqa Han Sans Neo"',
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: "21px",
                    color: "#FFFFFF",
                    whiteSpace: "pre-line",
                  }}
                >
                  {course.title}
                </p>
                <p
                  style={{
                    fontFamily: '"Pretendard", "Spoqa Han Sans Neo"',
                    fontSize: 10,
                    fontWeight: 400,
                    lineHeight: "12px",
                    color: "#333333",
                  }}
                >
                  {`하루 평균 ${items.length}곳 · 휴식 시간 충분`}
                </p>
              </div>
            </div>

            {/* AI 노트 박스 */}
            <div
              className="flex items-start"
              style={{
                marginTop: 18,
                padding: "10px 12px 10px 32px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 12,
                position: "relative",
              }}
            >
              <Sparkles
                size={16}
                color="#F6F6FF"
                fill="#F6F6FF"
                strokeWidth={0}
                style={{ position: "absolute", left: 10, top: 12 }}
              />
              <p
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: "13px",
                  color: "#333333",
                  whiteSpace: "pre-line",
                }}
              >
                {course.aiNote}
              </p>
            </div>
          </div>
        </div>

        {/* 코스 헤더 */}
        <div className="flex items-center" style={{ marginTop: 22 }}>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "21px",
              color: "#363636",
            }}
          >
            코스
          </span>
        </div>

        {/* 타임라인 리스트 */}
        <div className="flex flex-col" style={{ marginTop: 12, gap: 18 }}>
          {visibleItems.map((item, idx) => (
            <div key={`${item.title}-${idx}`} className="flex">
              {/* 좌측: 시간 + 아이콘 + 라인 */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 33 }}>
                <span
                  style={{
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: "13px",
                    color: "#4B5969",
                  }}
                >
                  {item.time}
                </span>
                <div
                  className="flex items-center justify-center"
                  style={{
                    marginTop: 3,
                    width: 25,
                    height: 25,
                    background: course.chipBgHex,
                    borderRadius: 8,
                  }}
                >
                  {(() => {
                    const Icon = TIMELINE_ICON[course.categoryKey] ?? Sparkles;
                    return <Icon size={14} color={course.colorHex} strokeWidth={2} />;
                  })()}
                </div>
                {idx < visibleItems.length - 1 && (
                  <div className="flex-1 flex flex-col items-center" style={{ marginTop: 4, gap: 4 }}>
                    <div style={{ width: 1, flex: 1, background: "#E6E8EB" }} />
                    {item.next && (
                      <Footprints size={14} color="#A0A0C0" strokeWidth={1.8} />
                    )}
                  </div>
                )}
              </div>

              {/* 우측: 카드 + 이동 안내 */}
              <div className="flex-1" style={{ marginLeft: 8 }}>
                <div
                  className="relative"
                  style={{
                    padding: 9,
                    background: "#F9FAFB",
                    borderRadius: 8,
                  }}
                >
                  <div className="flex items-start" style={{ gap: 8 }}>
                    <div className="shrink-0">
                      <PlaceThumbnail src={item.image} alt={item.title} category={item.category} size={51} />
                    </div>
                    <div className="flex flex-col min-w-0" style={{ gap: 4, flex: 1 }}>
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
                        {item.title}
                      </span>
                      <div className="flex flex-col" style={{ gap: 2 }}>
                        <div className="flex items-center whitespace-nowrap" style={{ gap: 5 }}>
                          <span
                            style={{
                              fontFamily: '"Spoqa Han Sans Neo"',
                              fontSize: 10,
                              fontWeight: 500,
                              lineHeight: "13px",
                              color: "#555555",
                            }}
                          >
                            {item.region.split("·").slice(-1)[0]}·{item.category}
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
                              {item.rating}({item.reviews.toLocaleString()})
                            </span>
                          </div>
                        </div>
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
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 우상단 태그 칩 */}
                  <div
                    className="absolute inline-flex items-center justify-center"
                    style={{
                      top: 6,
                      right: 6,
                      height: 14,
                      padding: "0 6px",
                      background: course.chipBgHex,
                      borderRadius: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 8,
                        fontWeight: 500,
                        lineHeight: "10px",
                        color: course.colorHex,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
                {item.next && (
                  <div className="flex items-center" style={{ marginTop: 4, gap: 4 }}>
                    <Footprints size={13} color="#A0A0C0" strokeWidth={1.8} />
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 10,
                        fontWeight: 500,
                        lineHeight: "13px",
                        color: "#767F89",
                      }}
                    >
                      {item.next}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 전체 일정 보기 버튼 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center w-full"
          style={{
            marginTop: 14,
            height: 50,
            background: "#FFFFFF",
            border: "1px solid #E6E8EB",
            borderRadius: 12,
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.5px",
              color: "#949494",
            }}
          >
            {expanded ? "간략히 보기" : "전체 일정 보기"}
          </span>
          <ChevronDown
            size={14}
            color="#949494"
            strokeWidth={2}
            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
          />
        </button>

        </motion.div>
        </AnimatePresence>

        {/* 마음에 드는 게 없으신가요? 카드 */}
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: 12,
            padding: "22px 16px",
            background: "#F9FAFB",
            borderRadius: 8,
            gap: 13,
          }}
        >
          <div className="flex flex-col items-center" style={{ gap: 6 }}>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                color: "#1A1A1A",
              }}
            >
              마음에 드는 게 없으신가요?
            </p>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
                color: "#555555",
              }}
            >
              조건을 바꾸거나 다시 만들어볼 수 있어요
            </p>
          </div>
          <button
            onClick={() => router.push("/screens/step8")}
            className="flex items-center justify-center"
            style={{
              height: 32,
              padding: "0 12px",
              background: "#FFFFFF",
              border: "1px solid #F5F5F5",
              borderRadius: 8,
              gap: 5,
            }}
          >
            <RotateCcw size={14} color="#4B5969" strokeWidth={1.8} />
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
                color: "#4B5969",
              }}
            >
              다시 만들기
            </span>
          </button>
        </div>
      </div>

      {/* 이 코스 저장하기 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px", background: "#FFFFFF" }}>
        <button
          onClick={() => {
            // 사용자가 저장한 코스 → mytrip 저장함에 누적
            try {
              const raw = sessionStorage.getItem("dotlo:saved-courses");
              const list: Array<Record<string, unknown>> = raw ? JSON.parse(raw) : [];
              const placeCount = (THEMES[course.categoryKey]?.length ?? 4);
              const entry = {
                id: `saved-${Date.now()}`,
                title: course.title,
                country: "일본",
                region: "도쿄",
                placeCount,
                category: DISPLAY_CATEGORY[course.categoryKey] ?? course.categoryKey,
                duration: "단일 코스",
                image: "/images/where/dokyo.png",
                savedAt: Date.now(),
              };
              // 동일 카테고리 중복 저장 방지
              const exists = list.some((c) => (c as { categoryKey?: string }).categoryKey === course.categoryKey);
              const next = exists ? list : [{ ...entry, categoryKey: course.categoryKey }, ...list];
              sessionStorage.setItem("dotlo:saved-courses", JSON.stringify(next));
            } catch {
              /* sessionStorage 사용 불가 시 그냥 모달만 띄움 */
            }
            setSavedModalOpen(true);
          }}
          className="w-full transition-opacity active:opacity-80"
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
          이 코스 저장하기
        </button>
      </div>

      {/* 저장 완료 모달 — 단순 조건부 렌더 + CSS 트랜지션으로 안정성 우선 */}
      {savedModalOpen && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            animation: "savedFadeIn 200ms ease-out both",
          }}
          onClick={() => setSavedModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 339,
              background: "#FFFFFF",
              borderRadius: 26,
              padding: "26px 16px 18px",
              animation: "savedPopIn 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
                {/* 아이콘 + 텍스트 */}
                <div className="flex flex-col items-center" style={{ gap: 18 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 60, height: 60, background: "#F2F2F6", borderRadius: 92 }}
                  >
                    <Bookmark size={30} color="#6060A0" fill="#6060A0" strokeWidth={0} />
                  </div>
                  <div className="flex flex-col items-center" style={{ gap: 6 }}>
                    <p
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: "24px",
                        color: "#373C3E",
                        textAlign: "center",
                      }}
                    >
                      보관함에 저장했어요
                    </p>
                    <p
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: "18px",
                        letterSpacing: "-0.3px",
                        color: "#888E9C",
                        textAlign: "center",
                      }}
                    >
                      보관함에서 언제든 다시 볼 수 있어요
                    </p>
                  </div>
                </div>

                {/* 버튼 2개 */}
                <div className="flex" style={{ marginTop: 22, gap: 10 }}>
                  <button
                    onClick={() => setSavedModalOpen(false)}
                    className="transition-opacity active:opacity-80"
                    style={{
                      flex: 1,
                      height: 48,
                      background: "#FFFFFF",
                      border: "1px solid #F2F2F6",
                      borderRadius: 14,
                      fontFamily: '"Spoqa Han Sans Neo"',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "18px",
                      letterSpacing: "-0.3px",
                      color: "#1A1A1A",
                    }}
                  >
                    계속 둘러보기
                  </button>
                  <button
                    onClick={() => {
                      setSavedModalOpen(false);
                      router.push("/screens/mytrip?segment=saved");
                    }}
                    className="transition-opacity active:opacity-80"
                    style={{
                      flex: 1,
                      height: 48,
                      background: "#090738",
                      borderRadius: 14,
                      fontFamily: '"Spoqa Han Sans Neo"',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "18px",
                      letterSpacing: "-0.3px",
                      color: "#FFFFFF",
                    }}
                  >
                    보관함 보기
                  </button>
                </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes savedFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes savedPopIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
