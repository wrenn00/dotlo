"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatsCard from "./components/StatsCard";
import AIAnalysisBox, { type TasteItem } from "./components/AIAnalysisBox";
import DayTabs from "../step7/components/DayTabs";
import TimelineItem, { type TimelineData } from "../step7/components/TimelineItem";

// ─── 데이터 ──────────────────────────────────────────────────────────────────

const COURSE = {
  title: "여유로운 오사카 한바퀴",
  subtitle: "일정을 자유롭게 수정할 수 있어요",
  city: "도쿄",
  dateRange: "2026.04.17 금 ~ 04.23 목 6박 7일",
  stats: [
    { label: "총 장소",   value: "16 곳"  },
    { label: "예상 이동", value: "3.2 km" },
    { label: "예상 비용", value: "90 만"  },
  ],
  aiBullets: [
    "맛집 우선으로 점심·저녁 동선 짰어요",
    "야경 시간대를 일정 마지막에 배치했어요",
    "숙소 기준으로 동선이 가장 짧아요",
  ],
  taste: [
    { label: "카페", percent: 40, color: "#5EEAD4" },
    { label: "맛집", percent: 25, color: "#22D3CC" },
    { label: "관광", percent: 20, color: "#374151" },
    { label: "야경", percent: 15, color: "#1F2937" },
  ] as TasteItem[],
  totalPlaces: 16,
};

const DAYS = ["1일차", "2일차", "3일차", "4일차"];

const DAY_HEADER: Record<string, string> = {
  "1일차": "4월 17일 금요일",
  "2일차": "4월 18일 토요일",
  "3일차": "4월 19일 일요일",
  "4일차": "4월 20일 월요일",
};

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

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function Step9Page() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState("1일차");

  const items = SCHEDULE[selectedDay] ?? [];

  function handleAdd() {
    alert("여행에 추가되었습니다!");
    router.push("/");
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="4" cy="9" r="2" stroke="#6B7280" strokeWidth="1.5" />
              <circle cx="14" cy="4" r="2" stroke="#6B7280" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="2" stroke="#6B7280" strokeWidth="1.5" />
              <path d="M5.5 8L12.5 5M5.5 10L12.5 13" stroke="#6B7280" strokeWidth="1.5" />
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center">
            <svg width="18" height="4" viewBox="0 0 18 4" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="#6B7280" />
              <circle cx="9" cy="2" r="1.5" fill="#6B7280" />
              <circle cx="16" cy="2" r="1.5" fill="#6B7280" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-2">

        {/* 선택한 코스 배지 */}
        <div
          className="self-start flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{ background: "#CCFBF1" }}
        >
          <span style={{ fontSize: 11 }}>✨</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0F766E" }}>선택한 코스</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 10 }}>
          {COURSE.title}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>{COURSE.subtitle}</p>

        {/* 통계 카드 */}
        <div className="mt-5">
          <StatsCard
            city={COURSE.city}
            dateRange={COURSE.dateRange}
            stats={COURSE.stats}
          />
        </div>

        {/* AI 분석 */}
        <div className="mt-4">
          <AIAnalysisBox
            bullets={COURSE.aiBullets}
            totalPlaces={COURSE.totalPlaces}
            taste={COURSE.taste}
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

        {/* 일차 헤더 + 수정 */}
        <div className="flex items-center justify-between mt-4 mb-3">
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{selectedDay}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{DAY_HEADER[selectedDay]}</span>
          </div>
          <button className="flex items-center gap-1">
            <span style={{ fontSize: 12, color: "#6B7280" }}>코스 수정</span>
            <span style={{ fontSize: 12 }}>✏️</span>
          </button>
        </div>

        {/* 타임라인 */}
        <div className="flex flex-col">
          {items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p style={{ fontSize: 13, color: "#C4C7CF" }}>준비 중입니다</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="relative">
                <TimelineItem data={item} isLast={idx === items.length - 1} />
                {/* 우측 더보기 (TimelineItem 카드 위에 absolute) */}
                <button
                  className="absolute w-6 h-6 flex items-center justify-center"
                  style={{ top: 24, right: 12 }}
                >
                  <svg width="14" height="3" viewBox="0 0 14 3" fill="none">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="#9CA3AF" />
                    <circle cx="7" cy="1.5" r="1.5" fill="#9CA3AF" />
                    <circle cx="12.5" cy="1.5" r="1.5" fill="#9CA3AF" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="px-5 pb-8 pt-3 shrink-0" style={{ background: "#fff" }}>
        <button
          onClick={handleAdd}
          className="w-full h-[56px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#0F172A" }}
        >
          내 여행에 추가하기
        </button>
      </div>
    </div>
  );
}
