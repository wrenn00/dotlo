"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search, Bell,
  MapPin, Map as MapIcon, Moon, ShoppingBag, Utensils, Leaf, Landmark,
  Plus, ChevronDown,
} from "lucide-react";
import TripCard from "../home/components/TripCard";
import BottomTabBar from "../home/components/BottomTabBar";

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

function SegmentedTab({ value, onChange }: { value: SegmentKey; onChange: (v: SegmentKey) => void }) {
  const items: { key: SegmentKey; label: string }[] = [
    { key: "mine", label: "내 여행 4" },
    { key: "saved", label: "저장한 코스 7" },
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
  id: number;
  title: string;
  country: string;
  region: string;
  placeCount: number;
  category: string;
  duration: DurationBadge;
  image?: string;
}

const SAVED_COURSES: SavedCourse[] = [
  { id: 1, title: "아름다운 도쿄의 밤", country: "일본", region: "도쿄", placeCount: 9, category: "야경", duration: "단일 코스", image: "/images/where/dokyo.png" },
  { id: 2, title: "도쿄 Flex", country: "일본", region: "도쿄", placeCount: 21, category: "쇼핑", duration: "단일 코스", image: "/images/where/dokyo.png" },
  { id: 3, title: "도쿄 먹방 원정대", country: "일본", region: "도쿄", placeCount: 25, category: "미식", duration: "단일 코스", image: "/images/where/dokyo.png" },
  { id: 4, title: "홋카이도 자연 투어", country: "일본", region: "훗카이도", placeCount: 3, category: "자연", duration: "3박 4일", image: "/images/where/fukuoka.png" },
  { id: 5, title: "푸켓 힐링 바캉스", country: "태국", region: "태국", placeCount: 16, category: "자연", duration: "단일 코스", image: "/images/where/bangkok.png" },
  { id: 6, title: "로마의 휴일", country: "이탈리아", region: "이탈리아", placeCount: 8, category: "역사", duration: "단일 코스", image: "/images/where/paris.png" },
  { id: 7, title: "상하이의 야경", country: "이탈리아", region: "이탈리아", placeCount: 8, category: "야경", duration: "단일 코스", image: "/images/where/shanghai.png" },
];

const COUNTRY_FILTERS = ["전체", "일본", "태국", "이탈리아"];

// ─── 저장한 코스 카드 (159x144 grid item) ────────────────────────────────────

function SavedCourseCard({ course }: { course: SavedCourse }) {
  const isShortDuration = course.duration !== "단일 코스";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 159,
        height: 144,
        borderRadius: 8,
        background: course.image ? `url(${course.image}) center / cover` : "#CBCBCB",
      }}
    >
      {/* 하단 어두운 그라데이션 (제목 가독성) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 159,
          height: 96,
          top: 48,
          left: 0,
          background:
            "linear-gradient(180deg, rgba(62, 62, 62, 0) 0%, rgba(39, 39, 39, 0.365) 19.71%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />

      {/* 우측 상단 기간 배지 */}
      <div
        className="absolute inline-flex items-center justify-center"
        style={{
          top: 6,
          right: 6,
          height: 20,
          padding: "0 10px",
          background: isShortDuration ? "#EFEFFF" : "#E0FBFF",
          borderRadius: 19,
        }}
      >
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "13px",
            color: isShortDuration ? "#6B6BCC" : "#00A8BF",
          }}
        >
          {course.duration}
        </span>
      </div>

      {/* 좌하단 콘텐츠 */}
      <div className="absolute" style={{ left: 10, top: 98, width: 139 }}>
        <p
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "18px",
            color: "#FAFAFA",
          }}
        >
          {course.title}
        </p>
        {/* 메타 행: 지역 / 장소 수 / 카테고리 */}
        <div className="flex items-center" style={{ gap: 7, marginTop: 4 }}>
          <MetaItem Icon={MapPin} label={course.region} />
          <MetaItem Icon={MapIcon} label={`${course.placeCount}곳`} />
          <MetaItem Icon={categoryIcon(course.category)} label={course.category} />
        </div>
      </div>
    </div>
  );
}

function MetaItem({ Icon, label }: { Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string }) {
  return (
    <div className="flex items-center" style={{ gap: 2 }}>
      <Icon size={11} color="#E0E0E0" strokeWidth={1.5} />
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 10,
          fontWeight: 500,
          lineHeight: "13px",
          color: "#E0E0E0",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function categoryIcon(cat: string) {
  if (cat.includes("야경")) return Moon;
  if (cat.includes("쇼핑")) return ShoppingBag;
  if (cat.includes("미식")) return Utensils;
  if (cat.includes("자연")) return Leaf;
  return Landmark; // 역사
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

export default function MyTripPage() {
  const [segment, setSegment] = useState<SegmentKey>("mine");
  const [country, setCountry] = useState("전체");

  const filteredCourses =
    country === "전체" ? SAVED_COURSES : SAVED_COURSES.filter((c) => c.country === country);

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FEFEFF" }}>
      <StatusBar />
      <Header />

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 120 }}>
        <div className="flex flex-col" style={{ padding: "12px 20px 0", gap: 16 }}>
          <SegmentedTab value={segment} onChange={setSegment} />

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
              <CountryFilter value={country} onChange={setCountry} total={SAVED_COURSES.length} />

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
                style={{ gridTemplateColumns: "repeat(2, 159px)", gap: 9, justifyContent: "center" }}
              >
                {filteredCourses.map((c) => (
                  <SavedCourseCard key={c.id} course={c} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAB — 세그먼트별 다른 라벨 */}
      <button
        className="absolute inline-flex items-center justify-center"
        style={{
          right: 17,
          bottom: 113,
          width: segment === "mine" ? 109 : 129,
          height: 44,
          background: "#090738",
          borderRadius: 30,
          gap: 4,
          padding: "0 14px",
          boxShadow: "0 4px 16px rgba(9, 7, 56, 0.25)",
          zIndex: 25,
        }}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={2.2} />
        <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "18px", color: "#FFFFFF" }}>
          {segment === "mine" ? "새 여행" : "코스 조합하기"}
        </span>
      </button>

      <BottomTabBar />
    </div>
  );
}
