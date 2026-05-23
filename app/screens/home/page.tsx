"use client";

import { useRouter } from "next/navigation";
import TripCard from "./components/TripCard";
import SuggestCard from "./components/SuggestCard";
import BottomTabBar from "./components/BottomTabBar";

// ─── Figma 색상 (figma-home-slim.json 기반) ───────────────────────────────────
// mintMain    rgb(28,204,176)  #1CCCB0  — 메인 배너
// mintAlt     rgb(94,213,194)  #5ED5C2  — 로고, 활성 탭, 풀빌라 카드
// mintBadge   rgb(227,250,243) #E3FAF3  — D-day 배지 배경
// mintText    rgb(41,204,178)  #29CCB2  — D-day 텍스트
// gray        rgb(136,143,156) #888F9C  — 보조 텍스트
// avatar      rgb(184,189,194) #B8BDC2  — 회색 placeholder
// blue        rgb(77,163,252)  #4DA3FC  — 미식 카드
// blueBadgeBg rgb(237,247,255) #EDF7FF
// pageBg      rgb(252,252,252) #FCFCFC
// btnTextDark rgb(35,59,54)    #233B36  — "코스 만들기" 글씨

// ─── 상단 상태바 ──────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 shrink-0" style={{ background: "#fff" }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 2C9.8 2 11.8 3 13.2 4.6L14.5 3.2C12.7 1.2 10.2 0 7.5 0S2.3 1.2.5 3.2L1.8 4.6C3.2 3 5.2 2 7.5 2zm0 4c1.1 0 2.1.4 2.8 1.1L11.7 5.7C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7l1.4 1.4C5.4 6.4 6.4 6 7.5 6zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#111" />
        </svg>
        <div className="w-6 h-3 rounded-sm border border-[#111] flex items-center px-0.5">
          <div className="h-2 w-4 rounded-sm" style={{ background: "#111" }} />
        </div>
      </div>
    </div>
  );
}

// ─── dotlo 로고 + 검색·알림 ───────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex items-center justify-between px-5 py-2 shrink-0">
      {/* dotlo 로고 (다이아몬드 + 텍스트) */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center"
          style={{
            width: 28, height: 28,
            background: "linear-gradient(135deg, #5ED5C2 0%, #1CCCB0 100%)",
            borderRadius: 7,
          }}
        >
          <div
            style={{
              width: 12, height: 12,
              background: "#fff",
              transform: "rotate(45deg)",
              borderRadius: 2,
            }}
          />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#5ED5C2", letterSpacing: -0.5 }}>
          dotlo
        </span>
      </div>

      {/* 검색 + 알림 */}
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#6B7280" strokeWidth="1.8" />
            <path d="M12.5 12.5L17 17" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
              d="M2 8a6 6 0 0112 0v5l2 2H0l2-2V8z"
              stroke="#6B7280"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M6 18a2 2 0 004 0" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div
            className="absolute"
            style={{ top: 8, right: 7, width: 6, height: 6, background: "#5ED5C2", borderRadius: "50%", border: "1.5px solid #fff" }}
          />
        </button>
      </div>
    </div>
  );
}

// ─── 메인 배너 ────────────────────────────────────────────────────────────────

function MainBanner({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col p-5 mx-5 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #1CCCB0 0%, #0D9488 100%)",
        minHeight: 169,
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: "22px" }}>
        저장한 장소로{"\n"}코스 자동 생성하기
      </p>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
        저장한 장소를 취향에 맞게 일정으로 짜드려요
      </p>

      <button
        onClick={onStart}
        className="self-start mt-auto flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{ background: "#fff" }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: "#233B36" }}>코스 만들기</span>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M1 1l4 4-4 4" stroke="#A8A8A9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 우측 별 장식 */}
      <Sparkle size={64} top={20} right={20} opacity={0.45} />
      <Sparkle size={34} top={90} right={70} opacity={0.55} />
    </div>
  );
}

function Sparkle({ size, top, right, opacity }: { size: number; top: number; right: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="absolute"
      style={{ top, right, opacity }}
    >
      <path
        d="M12 0c.5 5 4 8.5 9 9-5 .5-8.5 4-9 9-.5-5-4-8.5-9-9 5-.5 8.5-4 9-9z"
        fill="#fff"
      />
    </svg>
  );
}

// ─── 섹션 헤더 ────────────────────────────────────────────────────────────────

function SectionHeader({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between px-5 mt-6 mb-3">
      <span style={{ fontSize: 16, fontWeight: 600, color: "#141414" }}>{title}</span>
      {right && <span style={{ fontSize: 12, color: "#888F9C", fontWeight: 500 }}>{right}</span>}
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FCFCFC" }}>

      <StatusBar />
      <Header />

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* 메인 배너 */}
        <MainBanner onStart={() => router.push("/screens/step1")} />

        {/* 다가오는 여행 */}
        <SectionHeader title="다가오는 여행" right="전체보기" />
        <div className="flex flex-col gap-2 px-5">
          <TripCard
            title="오사카 여행"
            date="4.17 금 ~ 4.23 목 · 4박 5일"
            dDay="D-7"
            participants={{ type: "avatars", count: 3, label: "3명 함께" }}
          />
          <TripCard
            title="도쿄 여행"
            date="5.17 금 ~ 4.23 목 · 6박 7일"
            dDay="D-30"
            participants={{ type: "single", icon: "👤", label: "혼자 여행" }}
          />
        </div>

        {/* 이런 여행 어때요 (가로 스크롤) */}
        <SectionHeader title="이런 여행 어때요?" right="더보기" />
        <div className="flex gap-3 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <SuggestCard
            background="#4DA3FC"
            badgeBg="#EDF7FF"
            badgeText="#2563EB"
            badgeLabel="미식 여행"
            title={"현지인 맛집만\n골라가는 도시"}
            subtitle="오사카, 대만, 호치민"
            buttonLabel="코스 8개 확인하기"
            buttonTextColor="#2563EB"
          />
          <SuggestCard
            background="#5ED5C2"
            badgeBg="#E3FAF3"
            badgeText="#0F766E"
            badgeLabel="호캉스"
            title={"가까운 해외에서\n즐기는 풀빌라"}
            subtitle="다낭, 푸켓, 발리"
            buttonLabel="코스 4개 확인하기"
            buttonTextColor="#0F766E"
          />
        </div>

        {/* 친구가 공유한 여행 */}
        <SectionHeader title="친구가 공유한 여행" />
        <div className="px-5">
          <TripCard
            title="상하이 여행"
            date="6.17 금 ~ 6.23 목 · 6박 7일"
            dDay="D-50"
            participants={{ type: "single", icon: "👤", label: "민지님이 초대했어요" }}
          />
        </div>
      </div>

      {/* 하단 탭바 (고정) */}
      <BottomTabBar />
    </div>
  );
}
