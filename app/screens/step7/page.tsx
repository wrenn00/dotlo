"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseId>("B");
  const [selectedDay, setSelectedDay] = useState("1일차");

  const currentCourse = getCourse(activeTab);
  const items = SCHEDULE[selectedDay] ?? [];

  const handleSelect = () => {
    if (!selectedId) return;
    setActiveTab(selectedId);
    setIsPanelOpen(true);
  };

  return (
    <div className="relative h-full overflow-hidden" style={{ background: "#fff" }}>

      {/* ═══ 비교 뷰 ═══ */}
      <div className="h-full overflow-y-auto pb-28">
        {/* 헤더 */}
        <div className="px-5 pt-12 pb-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 타이틀 */}
        <div className="px-5">
          <div className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "#C2F5FF" }}>
            <span style={{ fontSize: 11 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#00A8BF" }}>AI 추천</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 10, lineHeight: "30px" }}>
            코스를 만들었어요
          </h1>
          <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6, lineHeight: "20px" }}>
            3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
          </p>
        </div>

        {/* 큰 지도 (모든 코스) */}
        <div className="px-5 mt-5">
          <div className="relative" style={{ height: 380 }}>
            <CourseMap courses={courses.map(mapCourse)} center={TOKYO_CENTER} zoom={11} height="380px" showAll />

            {/* 범례 */}
            <div
              className="absolute flex flex-col gap-1 px-3 py-2.5 rounded-2xl"
              style={{ left: 12, bottom: 12, background: "#fff", boxShadow: "0 2px 8px rgba(9,7,56,0.12)", zIndex: 1000 }}
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

        {/* 일러스트 */}
        <div className="flex flex-col items-center text-center py-8">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, background: "var(--gradient-ai-glow, #E5FBFF)" }}
          >
            <span style={{ fontSize: 38 }}>🗺️</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#090738", marginTop: 12 }}>코스를 선택해서 비교해 보세요!</p>
          <p style={{ fontSize: 12, color: "#7A858B", marginTop: 4 }}>코스별 위치 동선을 비교하고 장소를 선정해요</p>
        </div>
      </div>

      {/* ═══ 하단 고정 버튼 (패널 닫힘일 때만) ═══ */}
      {!isPanelOpen && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3" style={{ background: "#fff", borderTop: "1px solid #EEF2F4" }}>
          <button
            onClick={handleSelect}
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
      )}

      {/* ═══ 스포트라이트 오버레이 ═══ */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "#000",
          opacity: isPanelOpen ? 0.2 : 0,
          pointerEvents: "none",
        }}
      />

      {/* ═══ 스포트라이트 패널 ═══ */}
      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col rounded-t-3xl"
        style={{
          height: "88%",
          background: "#fff",
          boxShadow: "0 -8px 30px rgba(9,7,56,0.18)",
          transform: isPanelOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
          zIndex: 50,
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <button
            onClick={() => setIsPanelOpen(false)}
            className="rounded-full"
            style={{ width: 40, height: 4, background: "#C2CCD1" }}
            aria-label="패널 닫기"
          />
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mt-2" style={{ background: "#C2F5FF" }}>
            <span style={{ fontSize: 11 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#00A8BF" }}>AI 추천</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 10, lineHeight: "30px" }}>
            코스를 만들었어요
          </h1>
          <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6, lineHeight: "20px" }}>
            3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
          </p>

          {/* A/B/C 탭 */}
          <div className="flex p-1 rounded-full mt-5" style={{ background: "#F7F9FA" }}>
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

          {/* 코스 카드 — 동적 색상 */}
          <div className="mt-4">
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
          <div className="mt-5" style={{ height: 200 }}>
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
          <div className="flex items-center justify-between mt-6 mb-3">
            <span style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}>일자별 일정</span>
            <button className="flex items-center gap-1">
              <span style={{ fontSize: 12, color: "#090738", fontWeight: 500 }}>지도로 보기</span>
              <span style={{ fontSize: 13 }}>🗺️</span>
            </button>
          </div>

          <DayTabs days={DAYS} selected={selectedDay} onSelect={setSelectedDay} />

          <div className="flex flex-col mt-4">
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
          <div className="flex flex-col items-center text-center p-5 rounded-2xl mt-5" style={{ background: "#F7F9FA" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }}>마음에 드는 게 없으신가요?</p>
            <p style={{ fontSize: 12, color: "#7A858B", marginTop: 4 }}>조건을 바꾸거나 다시 만들어볼 수 있어요</p>
            <button
              onClick={() => router.push("/screens/step8")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full mt-3"
              style={{ background: "#fff", border: "1px solid #DDE5E8" }}
            >
              <span style={{ fontSize: 12 }}>🔄</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#090738" }}>다시 만들기</span>
            </button>
          </div>
        </div>

        {/* 패널 하단 버튼 */}
        <div className="px-5 pb-8 pt-3 shrink-0" style={{ background: "#fff", borderTop: "1px solid #EEF2F4" }}>
          <button
            onClick={() => router.push("/screens/step9")}
            className="w-full h-[52px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
            style={{ background: "#090738" }}
          >
            이 코스 선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
