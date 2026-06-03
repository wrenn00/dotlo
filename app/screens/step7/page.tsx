"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronLeft, Sparkles, Map as MapIcon, RotateCcw, ChevronDown, Star, Footprints } from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import { courses, getCourse, type CourseId } from "./courses";

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

const TIMELINE: Record<CourseId, TimelineEntry[]> = {
  A: [
    { time: "11:00", title: "츠키지 시장 스시다이", region: "도쿄·츠키지", category: "맛집", rating: 4.5, reviews: 9200, description: "새벽부터 줄 서는 스시 명가", image: "/images/places/default.jpg", tag: "맛집", next: "도보 10분 · 800m" },
    { time: "13:30", title: "이치란 라멘 시부야", region: "도쿄·시부야", category: "맛집", rating: 4.3, reviews: 8900, description: "혼자서도 편한 1인 라멘 부스", image: "/images/places/default.jpg", tag: "맛집", next: "지하철 15분 · 4km" },
    { time: "16:00", title: "긴자 큐베이", region: "도쿄·긴자", category: "맛집", rating: 4.7, reviews: 980, description: "오마카세 스시의 정수", image: "/images/places/default.jpg", tag: "맛집", next: "도보 6분 · 500m" },
    { time: "19:00", title: "함바그 비프 키친", region: "도쿄·시부야", category: "맛집", rating: 4.5, reviews: 4500, description: "치즈 듬뿍 일본식 함바그", image: "/images/places/default.jpg", tag: "맛집" },
  ],
  B: [
    { time: "18:00", title: "시부야 스카이", region: "도쿄·시부야", category: "야경", rating: 4.6, reviews: 5488, description: "360도 도시 전경 전망대", image: "/images/places/default.jpg", tag: "야경", next: "도보 10분 · 800m" },
    { time: "19:30", title: "롯폰기 힐스 전망대", region: "도쿄·롯폰기", category: "야경", rating: 4.5, reviews: 12000, description: "도쿄타워가 보이는 야경 명소", image: "/images/places/default.jpg", tag: "야경", next: "지하철 15분 · 4km" },
    { time: "21:00", title: "도쿄타워", region: "도쿄·미나토", category: "야경", rating: 4.6, reviews: 35000, description: "도쿄의 상징, 조명 든 333m 타워", image: "/images/places/default.jpg", tag: "야경", next: "도보 6분 · 500m" },
    { time: "22:30", title: "오다이바 레인보우 브릿지", region: "도쿄·오다이바", category: "야경", rating: 4.4, reviews: 32000, description: "야경 끝판왕 강변 산책", image: "/images/places/default.jpg", tag: "야경" },
  ],
  C: [
    { time: "10:00", title: "신주쿠 이세탄", region: "도쿄·신주쿠", category: "쇼핑", rating: 4.5, reviews: 15000, description: "도쿄 No.1 백화점", image: "/images/places/default.jpg", tag: "쇼핑", next: "지하철 8분 · 2km" },
    { time: "13:00", title: "시부야 109", region: "도쿄·시부야", category: "쇼핑", rating: 4.3, reviews: 22000, description: "트렌드 패션 1번지", image: "/images/places/default.jpg", tag: "쇼핑", next: "도보 12분 · 1km" },
    { time: "15:30", title: "오모테산도 거리", region: "도쿄·오모테산도", category: "쇼핑", rating: 4.6, reviews: 18000, description: "하이엔드 부티크 스트리트", image: "/images/places/default.jpg", tag: "쇼핑", next: "지하철 10분 · 3km" },
    { time: "18:00", title: "긴자 식스", region: "도쿄·긴자", category: "쇼핑", rating: 4.6, reviews: 8500, description: "프리미엄 럭셔리 몰", image: "/images/places/default.jpg", tag: "쇼핑" },
  ],
};

const mapCourse = (c: (typeof courses)[number]) => ({
  id: c.id,
  color: c.colorHex,
  markers: c.markers,
});

export default function Step7Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CourseId>("B");
  const [expanded, setExpanded] = useState(false);

  const course = getCourse(activeTab);
  const items = TIMELINE[activeTab];
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

        {/* 탭 셀렉터 — 340x40 #F8F9FB radius 12 */}
        <div
          className="relative flex items-center"
          style={{
            marginTop: 16,
            height: 40,
            padding: 3,
            background: "#F8F9FB",
            borderRadius: 12,
          }}
        >
          {courses.map((c) => {
            const active = activeTab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className="flex-1 flex items-center justify-center transition-all"
                style={{
                  height: 34,
                  background: active ? "#FFFFFF" : "transparent",
                  boxShadow: active ? "0 0 4px rgba(0,0,0,0.09)" : "none",
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
            );
          })}
        </div>

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
              {/* 코스 칩 — 58x24 #EFEFFF radius 18 */}
              <div
                className="inline-flex items-center justify-center"
                style={{
                  height: 24,
                  padding: "0 10px",
                  background: "#EFEFFF",
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
                    background: "#EFEFFF",
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
                      background: "#EFEFFF",
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
