"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search, Bell,
  MapPin, Map as MapIcon,
  Plus, ChevronDown, Clock,
} from "lucide-react";
import TripCard from "../home/components/TripCard";
import BottomTabBar from "../home/components/BottomTabBar";
import WhenBottomSheet from "../step1/components/WhenBottomSheet";

type SegmentKey = "mine" | "saved";

// ─── 상태바 ──────────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-center justify-between shrink-0" style={{ height: 50, padding: "0 17px 0 24px" }}>
      <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 15, fontWeight: 700, lineHeight: "20px", letterSpacing: "-0.5px", color: "#111111" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#111111">
          <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
          <rect x="3.5" y="6" width="2.5" height="5" rx="0.5" />
          <rect x="7" y="3.5" width="2.5" height="7.5" rx="0.5" />
          <rect x="10.5" y="1" width="2.5" height="10" rx="0.5" />
          <rect x="14" y="-1.5" width="2.5" height="12.5" rx="0.5" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#111111">
          <path d="M7.5 2C9.8 2 11.9 3 13.4 4.5l1.3-1.3C12.9 1.2 10.4 0 7.5 0S2.1 1.2.3 3.2L1.6 4.5C3.1 3 5.2 2 7.5 2zm0 4c1.1 0 2 .4 2.8 1.1l1.4-1.4C10.6 4.6 9.1 4 7.5 4S4.4 4.6 3.3 5.7L4.7 7.1C5.5 6.4 6.4 6 7.5 6zm0 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
        <div className="relative" style={{ width: 24, height: 11 }}>
          <div className="absolute inset-0" style={{ border: "1px solid rgba(17,17,17,0.35)", borderRadius: 2.67 }} />
          <div className="absolute" style={{ left: 1, top: 1, bottom: 1, width: 18, background: "#111111", borderRadius: 1.1 }} />
          <div className="absolute" style={{ right: -2, top: 3.5, width: 1.33, height: 4, background: "rgba(17,17,17,0.4)" }} />
        </div>
      </div>
    </div>
  );
}

// ─── 헤더 ────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex items-center justify-between shrink-0 mx-auto" style={{ width: 318.5, height: 33, marginTop: 6 }}>
      <Image src="/images/logo.png" alt="Dotlo" width={38} height={33} priority style={{ width: 38, height: 33, objectFit: "contain" }} />
      <div className="flex items-center" style={{ width: 60, height: 24, gap: 12 }}>
        <button className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <Search size={20} color="#555555" strokeWidth={1.8} />
        </button>
        <button className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <Bell size={20} color="#555555" strokeWidth={1.8} />
          <div className="absolute" style={{ top: 2, right: 2, width: 5, height: 5, background: "#6060A0", borderRadius: "50%" }} />
        </button>
      </div>
    </div>
  );
}

// ─── 세그먼트 탭 ─────────────────────────────────────────────────────────────

function SegmentedTab({ value, onChange, savedCount }: { value: SegmentKey; onChange: (v: SegmentKey) => void; savedCount: number }) {
  const items: { key: SegmentKey; label: string }[] = [
    { key: "mine", label: "최종 코스 4" },
    { key: "saved", label: `저장한 코스 ${savedCount}` },
  ];
  return (
    <div className="relative flex items-center mx-auto" style={{ width: 334, height: 40, background: "#F5F5F5", borderRadius: 12, padding: 3 }}>
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="flex-1 flex items-center justify-center"
            style={{
              height: 34,
              background: active ? "#FFFFFF" : "transparent",
              borderRadius: 8,
              boxShadow: active ? "0 0 4px rgba(0, 0, 0, 0.09)" : "none",
              transition: "background 200ms",
            }}
          >
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: active ? "#1A1A1A" : "#555555" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── 데이터: 내 여행 ──────────────────────────────────────────────────────────

const MINE_TRIPS = [
  { id: "osaka", title: "오사카 여행", date: "4.17 금 ~ 4.23 목 · 4박 5일", dDay: "D-7", participants: { type: "avatars" as const, count: 3, label: "3명 함께" }, image: "/images/trips/osaka_home.png" },
  { id: "tokyo", title: "도쿄 여행", date: "5.17 금 ~ 4.23 목 · 6박 7일", dDay: "D-30", participants: { type: "single" as const, label: "혼자 여행" }, image: "/images/trips/dokyo_home.png" },
  { id: "shanghai", title: "상하이 여행", date: "6.17 금 ~ 6.23 목 · 6박 7일", dDay: "D-50", participants: { type: "single" as const, label: "민지님이 초대했어요" }, image: "/images/trips/sang_home.png" },
  { id: "bangkok", title: "방콕 여행", date: "6.27 금 ~ 7.3 목 · 6박 7일", dDay: "D-60", participants: { type: "single" as const, label: "민지님이 초대했어요" }, image: "/images/where/bangkok.png" },
];

// ─── 데이터: 저장한 코스 ─────────────────────────────────────────────────────

type DurationBadge = "단일 코스" | "3박 4일";

interface SavedCourse {
  id: number | string;
  title: string;
  country: string;
  region: string;
  placeCount: number;
  category: string;
  duration: DurationBadge | string;
  hashtags?: string;
  hours?: string;
  image?: string;
}

const SAVED_COURSES: SavedCourse[] = [
  { id: 1, title: "아름다운 도쿄의 밤",   country: "일본",     region: "도쿄",    placeCount: 9,  category: "야경", duration: "단일 코스", hashtags: "#야경 #감성 #시부야",       hours: "8시간",  image: "/images/where/dokyo.png" },
  { id: 2, title: "도쿄 Flex",           country: "일본",     region: "도쿄",    placeCount: 21, category: "쇼핑", duration: "단일 코스", hashtags: "#쇼핑 #하라주쿠 #오모테산도", hours: "9시간",  image: "/images/where/dokyo.png" },
  { id: 3, title: "도쿄 먹방 원정대",     country: "일본",     region: "도쿄",    placeCount: 25, category: "미식", duration: "단일 코스", hashtags: "#맛집 #라멘 #스시",          hours: "10시간", image: "/images/where/dokyo.png" },
  { id: 4, title: "홋카이도 자연 투어",   country: "일본",     region: "훗카이도", placeCount: 3,  category: "자연", duration: "3박 4일",   hashtags: "#자연 #힐링 #온천",          hours: "3박 4일",image: "/images/where/fukuoka.png" },
  { id: 5, title: "푸켓 힐링 바캉스",     country: "태국",     region: "태국",    placeCount: 16, category: "자연", duration: "단일 코스", hashtags: "#휴식 #자연 #관광",          hours: "7시간",  image: "/images/where/bangkok.png" },
  { id: 6, title: "로마의 휴일",         country: "이탈리아", region: "이탈리아", placeCount: 8,  category: "역사", duration: "단일 코스", hashtags: "#역사 #문화 #관광",          hours: "5시간",  image: "/images/where/paris.png" },
  { id: 7, title: "상하이의 야경",       country: "이탈리아", region: "이탈리아", placeCount: 8,  category: "야경", duration: "단일 코스", hashtags: "#야경 #감성 #와이탄",        hours: "6시간",  image: "/images/where/shanghai.png" },
];

const COUNTRY_FILTERS = ["전체", "일본", "태국", "이탈리아"];

// ─── 저장한 코스 카드 (166x196 — image 144 + meta 52) ────────────────────────

function SavedCourseCard({ course }: { course: SavedCourse }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/screens/mytrip/course?id=${encodeURIComponent(String(course.id))}`)}
      className="text-left active:opacity-90 transition-opacity"
      style={{ width: 166, borderRadius: 8, overflow: "hidden", background: "#FFFFFF" }}
    >
      {/* 이미지 영역 166x144 */}
      <div
        className="relative"
        style={{
          width: 166,
          height: 144,
          background: course.image ? `url(${course.image}) center / cover` : "#CBCBCB",
        }}
      >
        {/* 어두운 그라데이션 (제목 가독성) */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0, right: 0, top: 48, height: 96,
            background:
              "linear-gradient(180deg, rgba(62,62,62,0) 0%, rgba(39,39,39,0.365) 19.71%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* 좌하단 — 제목만 (배지 제거, Figma v2 스펙) */}
        <p
          className="absolute line-clamp-2"
          style={{
            left: 10,
            right: 10,
            top: 73,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "18px",
            color: "#FAFAFA",
            textAlign: "center",
          }}
        >
          {course.title}
        </p>
      </div>

      {/* 메타 영역 166x52 #F9FAFB */}
      <div className="relative" style={{ width: 166, height: 52, background: "#F9FAFB" }}>
        {/* 해시태그 */}
        <span
          className="absolute truncate"
          style={{
            left: 9, top: 9, right: 9,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "13px",
            color: "#2E2E70",
            display: "block",
          }}
        >
          {course.hashtags ?? `#${course.category}`}
        </span>

        {/* 메타 행 — 지역 / 장소 / 시간 */}
        <div className="absolute flex items-center" style={{ left: 9, top: 29, right: 9, gap: 4 }}>
          <MetaItem Icon={MapPin} label={course.region} />
          <MetaItem Icon={MapIcon} label={`장소 ${course.placeCount}개`} />
          <MetaItem Icon={Clock} label={course.hours ?? "-"} />
        </div>
      </div>
    </button>
  );
}

function MetaItem({ Icon, label }: { Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string }) {
  return (
    <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
      <Icon size={11} color="#555555" strokeWidth={1.6} />
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 10,
          fontWeight: 500,
          lineHeight: "13px",
          color: "#555555",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── 국가 필터 칩 ────────────────────────────────────────────────────────────

function CountryFilter({ value, onChange, total }: { value: string; onChange: (v: string) => void; total: number }) {
  return (
    <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ gap: 10 }}>
      {COUNTRY_FILTERS.map((c) => {
        const active = value === c;
        const label = c === "전체" ? `전체 ${total}` : c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="shrink-0 inline-flex items-center justify-center"
            style={{
              height: 32,
              padding: "0 18px",
              background: active ? "#090738" : "#F2F2F6",
              borderRadius: 20,
            }}
          >
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: active ? "#FFFFFF" : "#2E2E70",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

function MyTripContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSegment: SegmentKey = searchParams.get("segment") === "saved" ? "saved" : "mine";
  const [segment, _setSegment] = useState<SegmentKey>(initialSegment);

  // 탭 변경 시 URL도 함께 업데이트 — 상세 화면에서 뒤로가기 시 같은 탭에 머물도록
  const setSegment = (key: SegmentKey) => {
    _setSegment(key);
    const next = key === "saved" ? "/screens/mytrip?segment=saved" : "/screens/mytrip";
    router.replace(next);
  };
  const [country, setCountry] = useState("전체");
  const [userCourses, setUserCourses] = useState<SavedCourse[]>([]);
  const [whenSheetOpen, setWhenSheetOpen] = useState(false);

  // step7에서 저장한 코스를 sessionStorage에서 읽어와 목록 맨 앞에 prepend
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dotlo:saved-courses");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setUserCourses(parsed as SavedCourse[]);
    } catch {
      /* 무시 */
    }
  }, [segment]); // 탭 전환할 때마다 새로 읽기

  const allCourses: SavedCourse[] = [...userCourses, ...SAVED_COURSES];
  const filteredCourses =
    country === "전체" ? allCourses : allCourses.filter((c) => c.country === country);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FEFEFF" }}>
      <StatusBar />
      <Header />

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 120 }}>
        <div className="flex flex-col" style={{ padding: "12px 20px 0", gap: 16 }}>
          <SegmentedTab value={segment} onChange={setSegment} savedCount={allCourses.length} />

          {segment === "mine" ? (
            // ── 내 여행 ──
            <div className="flex flex-col" style={{ gap: 13 }}>
              {MINE_TRIPS.map((t) => (
                <TripCard
                  key={t.id}
                  title={t.title}
                  date={t.date}
                  dDay={t.dDay}
                  participants={t.participants}
                  image={t.image}
                />
              ))}
            </div>
          ) : (
            // ── 저장한 코스 ──
            <>
              <CountryFilter value={country} onChange={setCountry} total={allCourses.length} />

              {/* 헤더 행 */}
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "21px", color: "#333333" }}>
                  {filteredCourses.length}개의 코스
                </span>
                <button className="flex items-center" style={{ gap: 2 }}>
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#888888" }}>
                    최근 저장순
                  </span>
                  <ChevronDown size={14} color="#888888" strokeWidth={1.6} />
                </button>
              </div>

              {/* 2-column grid */}
              <div
                className="grid"
                style={{ gridTemplateColumns: "repeat(2, 166px)", gap: 8, justifyContent: "center" }}
              >
                {filteredCourses.map((c) => (
                  <SavedCourseCard key={c.id} course={c} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAB — 세그먼트별 다른 라벨, saved 탭에서 누르면 날짜 시트 오픈 */}
      <button
        onClick={() => {
          if (segment === "saved") setWhenSheetOpen(true);
        }}
        className="absolute inline-flex items-center justify-center whitespace-nowrap"
        style={{
          right: 17,
          bottom: 113,
          height: 44,
          background: "#090738",
          borderRadius: 30,
          gap: 4,
          padding: "0 16px",
          boxShadow: "0 4px 16px rgba(9, 7, 56, 0.25)",
          zIndex: 25,
        }}
      >
        <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
        <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "18px", color: "#FFFFFF" }}>
          {segment === "mine" ? "새 여행" : "최종 코스 만들기"}
        </span>
      </button>

      <BottomTabBar />

      {/* 언제 떠나시나요? 바텀시트 — 코스 조합하기 진입점 */}
      <WhenBottomSheet
        open={whenSheetOpen}
        onClose={() => setWhenSheetOpen(false)}
        onSelect={(sel) => {
          setWhenSheetOpen(false);
          if (!sel.start || !sel.end) return;
          const fmt = (d: { year: number; month: number; day: number }) =>
            `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
          router.push(`/screens/mytrip/course/build?start=${fmt(sel.start)}&end=${fmt(sel.end)}`);
        }}
      />
    </div>
  );
}

export default function MyTripPage() {
  return (
    <Suspense fallback={<div className="h-full" style={{ background: "#FEFEFF" }} />}>
      <MyTripContent />
    </Suspense>
  );
}
