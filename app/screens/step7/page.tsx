"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, Map as MapIcon, RotateCcw, ChevronDown, Star, Footprints, Bookmark } from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import { buildCourses, getCourse, type Course, type CourseId } from "./courses";
import tokyoThemes from "@/data/tokyo-themes.json";

const AUTOPLAY_INTERVAL_MS = 1600;

// 카테고리별 시간 슬롯 + 이동 안내 — 첫 4개 장소에 차례로 매핑
const SLOTS: Record<string, { time: string; next?: string }[]> = {
  미식:      [{ time: "11:00", next: "도보 10분 · 800m" }, { time: "13:30", next: "지하철 15분 · 4km" }, { time: "16:00", next: "도보 6분 · 500m" }, { time: "19:00" }],
  관광:      [{ time: "10:00", next: "지하철 12분 · 3km" }, { time: "13:00", next: "도보 18분 · 1.4km" }, { time: "15:30", next: "지하철 10분 · 3km" }, { time: "17:00" }],
  쇼핑:      [{ time: "10:00", next: "지하철 8분 · 2km" }, { time: "13:00", next: "도보 12분 · 1km" }, { time: "15:30", next: "지하철 10분 · 3km" }, { time: "18:00" }],
  카페:      [{ time: "10:00", next: "도보 15분 · 1km" }, { time: "13:00", next: "지하철 12분 · 4km" }, { time: "16:00", next: "지하철 10분 · 3km" }, { time: "18:00" }],
  야경:      [{ time: "18:00", next: "도보 10분 · 800m" }, { time: "19:30", next: "지하철 15분 · 4km" }, { time: "21:00", next: "도보 6분 · 500m" }, { time: "22:30" }],
  휴식:      [{ time: "10:30", next: "도보 20분 · 1.6km" }, { time: "13:30", next: "지하철 25분 · 8km" }, { time: "15:30", next: "도보 14분 · 1km" }, { time: "17:30" }],
  디저트:    [{ time: "11:00", next: "도보 10분 · 800m" }, { time: "14:00", next: "지하철 12분 · 4km" }, { time: "16:30", next: "도보 9분 · 700m" }, { time: "19:00" }],
  박물관:    [{ time: "10:00", next: "도보 8분 · 600m" }, { time: "12:30", next: "지하철 12분 · 4km" }, { time: "14:30", next: "도보 10분 · 800m" }, { time: "16:30" }],
  역사:      [{ time: "10:00", next: "지하철 10분 · 3km" }, { time: "12:00", next: "도보 15분 · 1.2km" }, { time: "14:30", next: "지하철 12분 · 4km" }, { time: "16:30" }],
  바다:      [{ time: "10:30", next: "도보 15분 · 1.2km" }, { time: "13:00", next: "버스 18분 · 5km" }, { time: "15:30", next: "도보 12분 · 1km" }, { time: "17:30" }],
  강변:      [{ time: "10:30", next: "도보 20분 · 1.6km" }, { time: "14:00", next: "지하철 10분 · 3km" }, { time: "16:30", next: "도보 18분 · 1.4km" }, { time: "18:30" }],
  "공연·전시": [{ time: "11:00", next: "지하철 12분 · 4km" }, { time: "14:00", next: "도보 10분 · 800m" }, { time: "16:00", next: "지하철 8분 · 2km" }, { time: "18:00" }],
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

type ThemePlace = { name: string; subRegion: string; rating: number; reviews: number; description: string };
const THEMES = tokyoThemes as Record<string, ThemePlace[]>;

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

// 미리 정의된 4-슬롯 뒤로는 1.5시간 간격으로 시간을 자동 생성
function makeSlots(label: string, count: number): { time: string; next?: string }[] {
  const base = SLOTS[label] ?? SLOTS["관광"];
  if (count <= base.length) return base.slice(0, count);

  const slots: { time: string; next?: string }[] = base.map((s, i) =>
    // 마지막 base 슬롯은 next가 없으니 채워줘서 연결선이 끊기지 않게
    i === base.length - 1 && !s.next ? { ...s, next: "도보 8분 · 600m" } : s,
  );

  const [h0, m0] = base[base.length - 1].time.split(":").map(Number);
  let totalMin = h0 * 60 + m0;
  for (let i = base.length; i < count; i++) {
    totalMin += 90; // 1시간 30분 간격
    const h = Math.min(23, Math.floor(totalMin / 60));
    const m = totalMin % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const isLast = i === count - 1;
    const transit = i % 2 === 0 ? "도보 12분 · 1km" : "지하철 10분 · 3km";
    slots.push({ time, next: isLast ? undefined : transit });
  }
  return slots;
}

function timelineFor(label: string): TimelineEntry[] {
  const places = THEMES[label];
  if (!places || places.length === 0) {
    return [
      { time: "10:00", title: `${label} 추천 장소 1`, region: "도쿄", category: label, rating: 4.5, reviews: 1200, description: `${label} 우선 동선의 첫 스팟`, image: "/images/places/default.jpg", tag: label, next: "도보 10분 · 800m" },
      { time: "13:00", title: `${label} 추천 장소 2`, region: "도쿄", category: label, rating: 4.4, reviews: 900,  description: `${label} 흐름을 이어가는 곳`,  image: "/images/places/default.jpg", tag: label, next: "지하철 12분 · 3km" },
      { time: "16:00", title: `${label} 추천 장소 3`, region: "도쿄", category: label, rating: 4.6, reviews: 1500, description: `${label}의 핵심 스팟`,         image: "/images/places/default.jpg", tag: label },
    ];
  }
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
    image: "/images/places/default.jpg",
    tag: display,
    next: slots[i].next,
  }));
}

const mapCourse = (c: Course) => ({
  id: c.id,
  color: c.colorHex,
  markers: c.markers,
});

const DEFAULT_LABELS = ["미식", "야경", "쇼핑"];

export default function Step7Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(() => buildCourses(DEFAULT_LABELS));
  const [activeTab, setActiveTab] = useState<CourseId>("A");
  const [autoPlaying, setAutoPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
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
    setActiveTab(fullCycle[0]);
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx >= fullCycle.length) {
        setAutoPlaying(false);
        clearInterval(timer);
        return;
      }
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
    setActiveTab(id);
  }

  const course = getCourse(activeTab, courses);
  const items = timelineFor(course.categoryKey);
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

        {/* 자동/수동 탭 전환에 따라 코스 콘텐츠가 부드럽게 페이드 */}
        <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
        {/* 히어로 카드 — 344x271 + 하단 정보 영역 */}
        <div className="flex flex-col" style={{ marginTop: 14, gap: 11 }}>
          {/* 지도 영역 */}
          <div
            className="relative overflow-hidden"
            style={{
              height: 271,
              background: course.bgHex,
              borderRadius: 12,
            }}
          >
            <CourseMap
              courses={[mapCourse(course)]}
              center={[course.markers[0].lat, course.markers[0].lng]}
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
                  {course.subtitle}
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

        {/* 코스 헤더 — "코스" + 지도로 보기 */}
        <div className="flex items-center justify-between" style={{ marginTop: 22 }}>
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
          <button className="flex items-center" style={{ gap: 4 }}>
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "15px",
                color: "#888888",
              }}
            >
              지도로 보기
            </span>
            <MapIcon size={14} color="#888888" strokeWidth={1.8} />
          </button>
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
                  <Sparkles size={14} color={course.colorHex} fill={course.colorHex} strokeWidth={0} />
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
          onClick={() => setSavedModalOpen(true)}
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
