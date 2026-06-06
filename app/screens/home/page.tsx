"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronRight } from "lucide-react";
import TripCard from "./components/TripCard";
import SuggestCard from "./components/SuggestCard";
import BottomTabBar from "./components/BottomTabBar";
import { initPlacesData } from "@/lib/places-data";

// ─── 상태바 (Figma: 375x50) ───────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between shrink-0" style={{ height: 50, padding: "0 17px 0 24px" }}>
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 15,
          fontWeight: 700,
          lineHeight: "20px",
          letterSpacing: "-0.5px",
          color: "#111111",
        }}
      >
        9:41
      </span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#111111">
          <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
          <rect x="3.5" y="6" width="2.5" height="5" rx="0.5" />
          <rect x="7" y="3.5" width="2.5" height="7.5" rx="0.5" />
          <rect x="10.5" y="1" width="2.5" height="10" rx="0.5" />
          <rect x="14" y="-1.5" width="2.5" height="12.5" rx="0.5" />
        </svg>
        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#111111">
          <path d="M7.5 2C9.8 2 11.9 3 13.4 4.5l1.3-1.3C12.9 1.2 10.4 0 7.5 0S2.1 1.2.3 3.2L1.6 4.5C3.1 3 5.2 2 7.5 2zm0 4c1.1 0 2 .4 2.8 1.1l1.4-1.4C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7L4.7 7.1C5.5 6.4 6.4 6 7.5 6zm0 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
        {/* Battery */}
        <div className="relative" style={{ width: 24, height: 11 }}>
          <div className="absolute inset-0" style={{ border: "1px solid rgba(17,17,17,0.35)", borderRadius: 2.67 }} />
          <div className="absolute" style={{ left: 1, top: 1, bottom: 1, width: 18, background: "#111111", borderRadius: 1.1 }} />
          <div className="absolute" style={{ right: -2, top: 3.5, width: 1.33, height: 4, background: "rgba(17,17,17,0.4)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── 헤더 (Figma: 318.5x33, 로고 + 검색/알림) ────────────────────────────────

function Header() {
  return (
    <div
      className="flex items-center justify-between shrink-0 mx-auto"
      style={{ width: 318.5, height: 33, marginTop: 6 }}
    >
      {/* 로고 (38x33) */}
      <Image
        src="/images/logo.png"
        alt="Dotlo"
        width={38}
        height={33}
        priority
        style={{ width: 38, height: 33, objectFit: "contain" }}
      />

      {/* 검색 + 알림 (60x24, gap 12) */}
      <div className="flex items-center" style={{ width: 60, height: 24, gap: 12 }}>
        <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <Search size={20} color="#555555" strokeWidth={1.8} />
        </button>
        <button className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <Bell size={20} color="#555555" strokeWidth={1.8} />
          {/* 알림 점 (#6060A0) */}
          <div
            className="absolute"
            style={{ top: 2, right: 2, width: 5, height: 5, background: "#6060A0", borderRadius: "50%" }}
          />
        </button>
      </div>
    </div>
  );
}

// ─── 섹션 헤더 (Figma: Spoqa 500/16) ─────────────────────────────────────────

function SectionHeader({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between" style={{ height: 20 }}>
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 16,
          fontWeight: 500,
          lineHeight: "20px",
          color: "#000000",
        }}
      >
        {title}
      </span>
      {right && (
        <button
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "15px",
            color: "#888888",
          }}
        >
          {right}
        </button>
      )}
    </div>
  );
}

// ─── 히어로 카드 (Figma: 343x169, #80F0FF) ───────────────────────────────────

function HeroCard({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 343,
        height: 169,
        background: "#E6F8FF",
        backgroundImage: "url(/images/banner.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 12,
      }}
    >
      {/* 타이틀 — 좌측 상단 */}
      <h2
        className="absolute"
        style={{
          left: 20,
          top: 22,
          width: 220,
          fontFamily: '"Pretendard", "Spoqa Han Sans Neo"',
          fontSize: 18,
          fontWeight: 700,
          lineHeight: "24px",
          color: "#1A1A1A",
          letterSpacing: "-0.4px",
        }}
      >
        구글맵 저장목록으로
        <br />
        코스를 만들어보세요!
      </h2>

      {/* 코스 만들기 버튼 — 좌측 하단, 네이비 */}
      <button
        onClick={onStart}
        className="absolute inline-flex items-center justify-center transition-opacity active:opacity-80"
        style={{
          left: 20,
          bottom: 22,
          height: 32,
          padding: "0 14px",
          background: "#090738",
          borderRadius: 8,
          gap: 4,
        }}
      >
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "15px",
            color: "#FFFFFF",
          }}
        >
          코스 만들기
        </span>
        <ChevronRight size={14} color="#FFFFFF" strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── 추천 카드 데이터 ────────────────────────────────────────────────────────

const recommendations = [
  {
    id: "hokangs",
    image: "/images/trips/danang.png",
    badge: "호캉스",
    title: "가까운 해외에서\n즐기는 풀빌라",
    subtitle: "다낭, 푸켓, 발리",
    courseCount: 4,
  },
  {
    id: "alps",
    image: "/images/trips/switzerland.png",
    title: "유럽의 알프스를\n만나다",
    subtitle: "스위스, 오스트리아, 슬로베니아",
    courseCount: 4,
  },
  {
    id: "foodie",
    image: "/images/trips/osaka.png",
    title: "현지인 맛집만\n골라가는 도시",
    subtitle: "오사카, 대만, 호치민",
    courseCount: 8,
  },
];

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    initPlacesData();
  }, []);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FEFEFF" }}>

      <StatusBar />
      <Header />

      {/* 스크롤 영역 — Figma: 16px 좌우 패딩, 콘텐츠 사이 18px gap */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 100 }}>
        <div className="flex flex-col" style={{ padding: "32px 16px 0", gap: 18 }}>

          {/* 히어로 카드 */}
          <HeroCard onStart={() => router.push("/screens/step1")} />

          {/* 다가오는 여행 */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <SectionHeader title="다가오는 여행" right="전체보기" />
            <div className="flex flex-col" style={{ gap: 10 }}>
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
                participants={{ type: "single", label: "혼자 여행" }}
                image="/images/trips/dokyo_home.png"
              />
            </div>
          </div>

          {/* 이런 여행 어때요 — 가로 스크롤 */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <SectionHeader title="이런 여행 어때요?" right="더보기" />
            <div
              className="flex overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ gap: 17, marginRight: -16, paddingRight: 16 }}
            >
              {recommendations.map((r) => (
                <SuggestCard key={r.id} {...r} />
              ))}
            </div>
          </div>

          {/* 친구가 공유한 여행 */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <SectionHeader title="친구가 공유한 여행" />
            <TripCard
              title="상하이 여행"
              date="6.17 금 ~ 6.23 목 · 6박 7일"
              dDay="D-50"
              participants={{ type: "single", label: "민지님이 초대했어요" }}
              image="/images/trips/sang_home.png"
            />
          </div>

        </div>
      </div>

      {/* 하단 탭바 (고정 89px) */}
      <BottomTabBar />
    </div>
  );
}
