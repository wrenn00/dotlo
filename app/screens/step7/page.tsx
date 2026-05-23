"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryTabs from "./components/CategoryTabs";
import CourseCard from "./components/CourseCard";
import DayTabs from "./components/DayTabs";
import TimelineItem, { type TimelineData } from "./components/TimelineItem";

const CATEGORIES = [
  { id: "A", label: "미식" },
  { id: "B", label: "야경" },
  { id: "C", label: "쇼핑" },
];

const COURSE_INFO = {
  code: "B코스",
  title: "여유로운\n도쿄 한바퀴",
  summary: "하루 평균 4곳 · 휴식 시간 충분",
  aiNote: "야경 시간대를 마지막에 배치했고\n숙소를 기준으로 가까운 최적의 코스를 생성했어요",
};

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

export default function Step7Page() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState("B");
  const [selectedDay, setSelectedDay] = useState("1일차");
  const [expanded, setExpanded] = useState(false);

  const items = SCHEDULE[selectedDay] ?? [];

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="px-5 pt-12 pb-2 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-2">

        {/* AI 배지 */}
        <div
          className="self-start flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "#CCFBF1" }}
        >
          <span style={{ fontSize: 11 }}>✨</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0F766E" }}>AI 추천</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 10, lineHeight: "30px" }}>
          코스를 만들었어요
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, lineHeight: "20px" }}>
          3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
        </p>

        {/* 카테고리 탭 */}
        <div className="mt-5">
          <CategoryTabs
            categories={CATEGORIES}
            selected={selectedCat}
            onSelect={setSelectedCat}
          />
        </div>

        {/* 코스 카드 */}
        <div className="mt-4">
          <CourseCard
            code={COURSE_INFO.code}
            title={COURSE_INFO.title}
            summary={COURSE_INFO.summary}
            aiNote={COURSE_INFO.aiNote}
          />
        </div>

        {/* 일자별 일정 헤더 */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>일자별 일정</span>
          <button className="flex items-center gap-1">
            <span style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 500 }}>지도로 보기</span>
            <span style={{ fontSize: 13 }}>🗺️</span>
          </button>
        </div>

        {/* 일차 탭 */}
        <DayTabs days={DAYS} selected={selectedDay} onSelect={setSelectedDay} />

        {/* 타임라인 */}
        <div className="flex flex-col mt-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p style={{ fontSize: 13, color: "#C4C7CF" }}>준비 중입니다</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <TimelineItem key={idx} data={item} isLast={idx === items.length - 1} />
            ))
          )}
        </div>

        {/* 전체 일정 보기 */}
        {items.length > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full py-3 rounded-2xl mt-3 transition-colors"
            style={{ border: "1px solid #E5E7EB", background: "#fff" }}
          >
            <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
              전체 일정 보기 {expanded ? "⌃" : "⌄"}
            </span>
          </button>
        )}

        {/* 마음에 드는 게 없으신가요 */}
        <div
          className="flex flex-col items-center text-center p-5 rounded-2xl mt-5"
          style={{ background: "#F5F5F7" }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
            마음에 드는 게 없으신가요?
          </p>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
            조건을 바꾸거나 다시 만들어볼 수 있어요
          </p>
          <button
            onClick={() => router.push("/screens/step8")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full mt-3"
            style={{ background: "#fff", border: "1px solid #E5E7EB" }}
          >
            <span style={{ fontSize: 12 }}>🔄</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>다시 만들기</span>
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-8 pt-3 shrink-0" style={{ background: "#fff" }}>
        <button
          onClick={() => router.push("/screens/step9")}
          className="w-full h-[52px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#0F172A" }}
        >
          이 코스 선택하기
        </button>
      </div>
    </div>
  );
}
