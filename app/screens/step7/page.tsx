"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, Map as MapIcon, RotateCcw, ChevronDown, Star, Footprints } from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import { buildCourses, getCourse, type Course, type CourseId } from "./courses";

const AUTOPLAY_INTERVAL_MS = 1600;

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

// 카테고리별 타임라인 — step4에서 선택한 카테고리에 매칭
const TIMELINE_BY_CATEGORY: Record<string, TimelineEntry[]> = {
  미식: [
    { time: "11:00", title: "츠키지 시장 스시다이", region: "도쿄·츠키지", category: "맛집", rating: 4.5, reviews: 9200, description: "새벽부터 줄 서는 스시 명가", image: "/images/places/default.jpg", tag: "맛집", next: "도보 10분 · 800m" },
    { time: "13:30", title: "이치란 라멘 시부야", region: "도쿄·시부야", category: "맛집", rating: 4.3, reviews: 8900, description: "혼자서도 편한 1인 라멘 부스", image: "/images/places/default.jpg", tag: "맛집", next: "지하철 15분 · 4km" },
    { time: "16:00", title: "긴자 큐베이", region: "도쿄·긴자", category: "맛집", rating: 4.7, reviews: 980, description: "오마카세 스시의 정수", image: "/images/places/default.jpg", tag: "맛집", next: "도보 6분 · 500m" },
    { time: "19:00", title: "함바그 비프 키친", region: "도쿄·시부야", category: "맛집", rating: 4.5, reviews: 4500, description: "치즈 듬뿍 일본식 함바그", image: "/images/places/default.jpg", tag: "맛집" },
  ],
  야경: [
    { time: "18:00", title: "시부야 스카이", region: "도쿄·시부야", category: "야경", rating: 4.6, reviews: 5488, description: "360도 도시 전경 전망대", image: "/images/places/default.jpg", tag: "야경", next: "도보 10분 · 800m" },
    { time: "19:30", title: "롯폰기 힐스 전망대", region: "도쿄·롯폰기", category: "야경", rating: 4.5, reviews: 12000, description: "도쿄타워가 보이는 야경 명소", image: "/images/places/default.jpg", tag: "야경", next: "지하철 15분 · 4km" },
    { time: "21:00", title: "도쿄타워", region: "도쿄·미나토", category: "야경", rating: 4.6, reviews: 35000, description: "도쿄의 상징, 조명 든 333m 타워", image: "/images/places/default.jpg", tag: "야경", next: "도보 6분 · 500m" },
    { time: "22:30", title: "오다이바 레인보우 브릿지", region: "도쿄·오다이바", category: "야경", rating: 4.4, reviews: 32000, description: "야경 끝판왕 강변 산책", image: "/images/places/default.jpg", tag: "야경" },
  ],
  쇼핑: [
    { time: "10:00", title: "신주쿠 이세탄", region: "도쿄·신주쿠", category: "쇼핑", rating: 4.5, reviews: 15000, description: "도쿄 No.1 백화점", image: "/images/places/default.jpg", tag: "쇼핑", next: "지하철 8분 · 2km" },
    { time: "13:00", title: "시부야 109", region: "도쿄·시부야", category: "쇼핑", rating: 4.3, reviews: 22000, description: "트렌드 패션 1번지", image: "/images/places/default.jpg", tag: "쇼핑", next: "도보 12분 · 1km" },
    { time: "15:30", title: "오모테산도 거리", region: "도쿄·오모테산도", category: "쇼핑", rating: 4.6, reviews: 18000, description: "하이엔드 부티크 스트리트", image: "/images/places/default.jpg", tag: "쇼핑", next: "지하철 10분 · 3km" },
    { time: "18:00", title: "긴자 식스", region: "도쿄·긴자", category: "쇼핑", rating: 4.6, reviews: 8500, description: "프리미엄 럭셔리 몰", image: "/images/places/default.jpg", tag: "쇼핑" },
  ],
  관광: [
    { time: "10:00", title: "센소지", region: "도쿄·아사쿠사", category: "관광", rating: 4.5, reviews: 120000, description: "도쿄에서 가장 오래된 사찰", image: "/images/places/default.jpg", tag: "관광", next: "지하철 12분 · 3km" },
    { time: "13:00", title: "도쿄 스카이트리", region: "도쿄·스미다", category: "관광", rating: 4.6, reviews: 92000, description: "634m 도쿄 랜드마크 전망대", image: "/images/places/default.jpg", tag: "관광", next: "지하철 25분 · 8km" },
    { time: "16:00", title: "메이지 신궁", region: "도쿄·시부야", category: "관광", rating: 4.5, reviews: 85000, description: "도심 속 거대한 신사와 숲", image: "/images/places/default.jpg", tag: "관광" },
  ],
  휴식: [
    { time: "10:30", title: "신주쿠 교엔", region: "도쿄·신주쿠", category: "휴식", rating: 4.6, reviews: 28000, description: "도심 속 광활한 정원", image: "/images/places/default.jpg", tag: "휴식", next: "도보 20분 · 1.6km" },
    { time: "14:00", title: "우에노 공원", region: "도쿄·다이토", category: "휴식", rating: 4.3, reviews: 42000, description: "벚꽃 명소와 박물관 산책", image: "/images/places/default.jpg", tag: "휴식", next: "지하철 30분 · 12km" },
    { time: "18:00", title: "오다이바 해변공원", region: "도쿄·미나토", category: "휴식", rating: 4.3, reviews: 32000, description: "레인보우 브릿지 뷰가 보이는 인공해변", image: "/images/places/default.jpg", tag: "휴식" },
  ],
  카페: [
    { time: "10:00", title: "블루보틀 아오야마", region: "도쿄·아오야마", category: "카페", rating: 4.4, reviews: 5800, description: "미니멀한 일본 1호점", image: "/images/places/default.jpg", tag: "카페", next: "도보 15분 · 1km" },
    { time: "13:00", title: "카페 르 카페", region: "도쿄·다이칸야마", category: "카페", rating: 4.5, reviews: 3200, description: "책과 함께하는 조용한 북카페", image: "/images/places/default.jpg", tag: "카페", next: "지하철 12분 · 4km" },
    { time: "16:00", title: "스타벅스 리저브 로스터리", region: "도쿄·나카메구로", category: "카페", rating: 4.6, reviews: 22000, description: "세계에서 가장 큰 스타벅스", image: "/images/places/default.jpg", tag: "카페", next: "지하철 10분 · 3km" },
    { time: "18:00", title: "오니버스 시부야", region: "도쿄·시부야", category: "카페", rating: 4.5, reviews: 4100, description: "드립 커피 핫플", image: "/images/places/default.jpg", tag: "카페" },
  ],
};

function timelineFor(label: string): TimelineEntry[] {
  return (
    TIMELINE_BY_CATEGORY[label] ?? [
      { time: "10:00", title: `${label} 추천 장소 1`, region: "도쿄", category: label, rating: 4.5, reviews: 1200, description: `${label} 우선 동선의 첫 스팟`, image: "/images/places/default.jpg", tag: label, next: "도보 10분 · 800m" },
      { time: "13:00", title: `${label} 추천 장소 2`, region: "도쿄", category: label, rating: 4.4, reviews: 900,  description: `${label} 흐름을 이어가는 곳`,  image: "/images/places/default.jpg", tag: label, next: "지하철 12분 · 3km" },
      { time: "16:00", title: `${label} 추천 장소 3`, region: "도쿄", category: label, rating: 4.6, reviews: 1500, description: `${label}의 핵심 스팟`,         image: "/images/places/default.jpg", tag: label },
    ]
  );
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
          onClick={() => router.push("/screens/step9")}
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
    </div>
  );
}
