"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Icon from "@/components/Icon";
import CourseCard from "./components/CourseCard";
import DayTabs from "./components/DayTabs";
import TimelineItem, { type TimelineData } from "./components/TimelineItem";
import { courses, getCourse, TOKYO_CENTER, type CourseId } from "./courses";

const CourseMap = dynamic(() => import("@/components/CourseMap"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse" style={{ height: "100%", background: "#EEF2F4", borderRadius: 24 }} />
  ),
});

const DAYS = ["1일차", "2일차", "3일차", "4일차"];

const SCHEDULE: Record<string, TimelineData[]> = {
  "1일차": [
    {
      time: "10:00",
      icon: "flight",
      category: "비행",
      duration: "2시간 30분",
      title: "인천 > 나리타",
      subtitle: "인천 ICN 09:30 - NRT 12:00",
      transport: { type: "train", text: "스카이라이너 60분 · 우에노 역" },
    },
    {
      time: "13:30",
      icon: "hotel",
      category: "숙소",
      duration: "30분",
      title: "APA 호텔 우에노",
      subtitle: "역 도보 3분",
      transport: { type: "walk", text: "도보 5분 · 400m" },
    },
    {
      time: "14:30",
      icon: "food",
      category: "식사",
      duration: "1시간 30분",
      title: "이치란 라멘 우에노점",
      subtitle: "평균 웨이팅 10분",
    },
  ],
  "2일차": [],
  "3일차": [],
  "4일차": [],
};

const mapCourse = (c: (typeof courses)[number]) => ({
  id: c.id,
  color: c.colorHex,
  markers: c.markers,
});

export default function Step7Page() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<CourseId | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseId>("B");
  const [selectedDay, setSelectedDay] = useState("1일차");

  const detailRef = useRef<HTMLDivElement>(null);

  const currentCourse = getCourse(activeTab);
  const items = SCHEDULE[selectedDay] ?? [];

  const handleExpand = () => {
    if (!selectedId) return;
    setActiveTab(selectedId);
    setShowDetail(true);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden" style={{ background: "#fff" }}>

      {/* ═══ 섹션 1: 비교 뷰 (812px) ═══ */}
      <section className="min-h-[812px] flex flex-col">
        {/* 헤더 */}
        <div className="px-5 pt-12 pb-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
            <Icon name="arrow_back_ios_new" size={22} className="text-night-navy-600" />
          </button>
        </div>

        {/* 타이틀 */}
        <div className="px-5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-blue-100 text-sky-blue-600">
            <Icon name="auto_awesome" size={13} fill />
            <span style={{ fontSize: 11, fontWeight: 700 }}>AI 추천</span>
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 10, lineHeight: "30px" }}>
            코스를 만들었어요
          </h1>
          <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6, lineHeight: "20px" }}>
            3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
          </p>
        </div>

        {/* 큰 지도 */}
        <div className="px-5 mt-5">
          <div className="relative" style={{ height: 380 }}>
            <CourseMap courses={courses.map(mapCourse)} center={TOKYO_CENTER} zoom={11} height="380px" showAll />
            <div
              className="absolute flex flex-col gap-1 px-3 py-2.5 rounded-2xl z-[500]"
              style={{ left: 12, bottom: 12, background: "#fff", boxShadow: "0 2px 8px rgba(9,7,56,0.12)" }}
            >
              {courses.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.colorHex }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#090738" }}>
                    {c.id} {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3개 카드 */}
        <div className="px-5 mt-5 grid grid-cols-3 gap-2">
          {courses.map((c) => {
            const active = selectedId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="flex flex-col items-start text-left p-3 rounded-2xl transition-all"
                style={{
                  background: active ? "#fff" : "#F7F9FA",
                  border: active ? `2px solid ${c.colorHex}` : "2px solid transparent",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.colorHex }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#090738" }}>{c.id}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#090738", marginTop: 6 }}>{c.label}</span>
                <span style={{ fontSize: 11, color: "#7A858B", marginTop: 2, lineHeight: "15px" }}>{c.description}</span>
              </button>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto px-5 pb-8 pt-5">
          <button
            onClick={handleExpand}
            disabled={!selectedId}
            className="w-full h-[52px] rounded-2xl text-base font-semibold transition-all"
            style={{
              background: selectedId ? "#090738" : "#DDE5E8",
              color: selectedId ? "#fff" : "#7A858B",
            }}
          >
            이 코스 선택하기
          </button>
        </div>
      </section>

      {/* ═══ 섹션 2: 상세 뷰 (조건부) ═══ */}
      {showDetail && (
        <section
          ref={detailRef}
          className="min-h-[812px] flex flex-col animate-slide-up"
          style={{ borderTop: "1px solid #EEF2F4" }}
        >
          {/* 타이틀 */}
          <div className="px-5 pt-8">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-blue-100 text-sky-blue-600">
              <Icon name="auto_awesome" size={13} fill />
              <span style={{ fontSize: 11, fontWeight: 700 }}>AI 추천</span>
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 10, lineHeight: "30px" }}>
              선택한 코스 상세
            </h2>
            <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6 }}>
              탭으로 다른 코스도 비교해볼 수 있어요
            </p>
          </div>

          {/* A/B/C 탭 */}
          <div className="px-5 mt-5">
            <div className="flex p-1 rounded-full" style={{ background: "#F7F9FA" }}>
              {courses.map((c) => {
                const active = activeTab === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab(c.id)}
                    className="flex-1 flex items-center justify-center py-2 rounded-full transition-all"
                    style={{
                      background: active ? "#fff" : "transparent",
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#090738" : "#7A858B" }}>
                      {c.id} {c.label.replace(" 코스", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 코스 카드 — 동적 색상 */}
          <div className="px-5 mt-4">
            <CourseCard
              code={currentCourse.code}
              title={currentCourse.title}
              summary={currentCourse.subtitle}
              aiNote={currentCourse.aiNote}
              bgHex={currentCourse.bgHex}
              accentHex={currentCourse.accentHex}
            />
          </div>

          {/* 작은 지도 — 현재 코스만 */}
          <div className="px-5 mt-4" style={{ height: 200 }}>
            <CourseMap
              key={`detail-map-${activeTab}`}
              courses={[mapCourse(currentCourse)]}
              center={[currentCourse.markers[0].lat, currentCourse.markers[0].lng]}
              zoom={12}
              height="200px"
              showAll
            />
          </div>

          {/* 일자별 일정 */}
          <div className="px-5 flex items-center justify-between mt-6 mb-3">
            <span style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}>일자별 일정</span>
            <button className="flex items-center gap-1">
              <span style={{ fontSize: 12, color: "#090738", fontWeight: 500 }}>지도로 보기</span>
              <Icon name="map" size={15} className="text-night-navy-600" />
            </button>
          </div>

          <div className="px-5">
            <DayTabs days={DAYS} selected={selectedDay} onSelect={setSelectedDay} />
          </div>

          <div className="px-5 flex flex-col mt-4">
            {items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p style={{ fontSize: 13, color: "#A1ADB3" }}>준비 중입니다</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <TimelineItem key={idx} data={item} isLast={idx === items.length - 1} />
              ))
            )}
          </div>

          {/* 다시 만들기 */}
          <div className="px-5 mt-5">
            <div className="flex flex-col items-center text-center p-5 rounded-2xl" style={{ background: "#F7F9FA" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>마음에 드는 게 없으신가요?</p>
              <p style={{ fontSize: 12, color: "#7A858B", marginTop: 4 }}>조건을 바꾸거나 다시 만들어볼 수 있어요</p>
              <button
                onClick={() => router.push("/screens/step8")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full mt-3"
                style={{ background: "#fff", border: "1px solid #DDE5E8" }}
              >
                <Icon name="refresh" size={16} className="text-night-navy-600" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#090738" }}>다시 만들기</span>
              </button>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-auto px-5 pb-8 pt-5">
            <button
              onClick={() => router.push("/screens/step9")}
              className="w-full h-[52px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: "#090738" }}
            >
              이 코스 선택하기
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
