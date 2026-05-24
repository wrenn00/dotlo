"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TripCard from "./components/TripCard";
import SuggestCard from "./components/SuggestCard";
import BottomTabBar from "./components/BottomTabBar";
import { initPlacesData } from "@/lib/places-data";

// ─── Figma 색상 (figma-home-slim.json 기반) ───────────────────────────────────
// mintMain    rgb(28,204,176)  #00E1FF  — 메인 배너
// mintAlt     rgb(94,213,194)  #5CE7FF  — 로고, 활성 탭, 풀빌라 카드
// mintBadge   rgb(227,250,243) #E5FBFF  — D-day 배지 배경
// mintText    rgb(41,204,178)  #00E1FF  — D-day 텍스트
// gray        rgb(136,143,156) #7A858B  — 보조 텍스트
// avatar      rgb(184,189,194) #A1ADB3  — 회색 placeholder
// blue        rgb(77,163,252)  #29E3FF  — 미식 카드
// blueBadgeBg rgb(237,247,255) #E5FBFF
// pageBg      rgb(252,252,252) #F7F9FA
// btnTextDark rgb(35,59,54)    #090738  — "코스 만들기" 글씨

// ─── 상단 상태바 ──────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 shrink-0" style={{ background: "#fff" }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 2C9.8 2 11.8 3 13.2 4.6L14.5 3.2C12.7 1.2 10.2 0 7.5 0S2.3 1.2.5 3.2L1.8 4.6C3.2 3 5.2 2 7.5 2zm0 4c1.1 0 2.1.4 2.8 1.1L11.7 5.7C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7l1.4 1.4C5.4 6.4 6.4 6 7.5 6zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#090738" />
        </svg>
        <div className="w-6 h-3 rounded-sm border border-[#090738] flex items-center px-0.5">
          <div className="h-2 w-4 rounded-sm" style={{ background: "#090738" }} />
        </div>
      </div>
    </div>
  );
}

// ─── dotlo 로고 + 검색·알림 ───────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex items-center justify-between px-5 py-3 shrink-0">
      {/* dotlo 로고 (이미지만) */}
      <Image
        src="/images/logo.png"
        alt="Dotlo"
        width={32}
        height={28}
        priority
        style={{ width: 32, height: "auto" }}
      />

      {/* 검색 + 알림 */}
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="#555E63" strokeWidth="1.8" />
            <path d="M14 14L18.5 18.5" stroke="#555E63" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className="relative flex items-center justify-center">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path
              d="M3 9a6 6 0 0112 0v5l1.5 2H1.5L3 14V9z"
              stroke="#555E63"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M7 18a2 2 0 004 0" stroke="#555E63" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div
            className="absolute"
            style={{ top: 1, right: 0, width: 6, height: 6, background: "#00E1FF", borderRadius: "50%", border: "1.5px solid #fff" }}
          />
        </button>
      </div>
    </div>
  );
}

// ─── 메인 배너 ────────────────────────────────────────────────────────────────

function MainBanner({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-5">
      <div
        className="relative overflow-hidden rounded-3xl bg-sky-blue-500 text-white p-5"
        style={{
          aspectRatio: "2 / 1",
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-xl font-bold leading-tight">
          저장한 장소로<br />
          코스 자동 생성하기
        </h2>
        <p className="text-sm mt-2 opacity-90">
          저장한 장소를 취향에 맞게 일정으로 짜드려요
        </p>
        <button
          onClick={onStart}
          className="mt-5 inline-flex items-center gap-1 px-4 py-2 bg-white text-night-navy-600 text-sm font-bold rounded-full"
        >
          코스 만들기 <span>›</span>
        </button>
      </div>
    </div>
  );
}

// ─── 섹션 헤더 ────────────────────────────────────────────────────────────────

function SectionHeader({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between px-5 mt-7 mb-3">
      <span style={{ fontSize: 16, fontWeight: 700, color: "#090738" }}>{title}</span>
      {right && (
        <button style={{ fontSize: 13, color: "#7A858B", fontWeight: 500 }}>{right}</button>
      )}
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  // 백그라운드에서 장소 데이터 미리 로드 (앱 첫 진입 시 1회)
  useEffect(() => {
    initPlacesData();
  }, []);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#F7F9FA" }}>

      <StatusBar />
      <Header />

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-20">

        {/* 메인 배너 */}
        <MainBanner onStart={() => router.push("/screens/step1")} />

        {/* 다가오는 여행 */}
        <SectionHeader title="다가오는 여행" right="전체보기" />
        <div className="flex flex-col gap-2.5 px-5">
          <TripCard
            title="오사카 여행"
            date="4.17 금 ~ 4.23 목 · 4박 5일"
            dDay="D-7"
            participants={{ type: "avatars", count: 3, label: "3명 함께" }}
            image="/images/trips/osaka_home.png"
          />
          <TripCard
            title="도쿄 여행"
            date="5.17 금 ~ 4.23 목 · 6박 7일"
            dDay="D-30"
            participants={{ type: "single", icon: "person", label: "혼자 여행" }}
            image="/images/trips/dokyo_home.png"
          />
        </div>

        {/* 이런 여행 어때요 (가로 스크롤) */}
        <SectionHeader title="이런 여행 어때요?" right="더보기" />
        <div className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-5 pb-1">
          <SuggestCard
            image="/images/trips/osaka.png"
            badge="미식 여행"
            title={"현지인 맛집만\n골라가는 도시"}
            subtitle="오사카, 대만, 호치민"
            courseCount={8}
          />
          <SuggestCard
            image="/images/trips/danang.png"
            badge="호캉스"
            title={"가까운 해외에서\n즐기는 풀빌라"}
            subtitle="다낭, 푸켓, 발리"
            courseCount={4}
          />
        </div>

        {/* 친구가 공유한 여행 */}
        <SectionHeader title="친구가 공유한 여행" />
        <div className="px-5">
          <TripCard
            title="상하이 여행"
            date="6.17 금 ~ 6.23 목 · 6박 7일"
            dDay="D-50"
            participants={{ type: "single", icon: "person_add", label: "민지님이 초대했어요" }}
            image="/images/trips/sang_home.png"
          />
        </div>
      </div>

      {/* 하단 탭바 (고정) */}
      <BottomTabBar />
    </div>
  );
}
