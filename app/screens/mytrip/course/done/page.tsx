"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successCheck from "@/public/lottie/success-check.json";

const DAY_PALETTE = [
  { bg: "#E0FBFF", border: "#00A8BF" }, // sky
  { bg: "#EFEFFF", border: "#6B6BCC" }, // lavender
  { bg: "#FFFCE2", border: "#CDB800" }, // yellow
  { bg: "#F5F5F5", border: "#888888" }, // gray
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface SavedCourse {
  id: number | string;
  title: string;
  hashtags?: string;
  region?: string;
  placeCount?: number;
  hours?: string;
  duration?: string;
  image?: string;
  category?: string;
}

interface FinalCombine {
  assignments: Record<number, SavedCourse>;
  startISO: string;
  endISO: string;
  nights: number;
  days: number;
}

// 카테고리별 한 줄 설명
const CATEGORY_TAGLINE: Record<string, string> = {
  미식:    "맛집 탐방으로 시작하는 미식 여행",
  쇼핑:    "쇼핑 거리를 효율적으로 도는 여행",
  야경:    "야경 명소를 따라 걷는 밤 산책 여행",
  휴식:    "공원을 여유롭게 둘러보는 힐링 여행",
  자연:    "공원을 여유롭게 둘러보는 힐링 여행",
  카페:    "분위기 좋은 카페를 즐기는 여행",
  관광:    "랜드마크를 효율적으로 도는 여행",
  역사:    "옛 도쿄 역사를 따라가는 여행",
  박물관:  "다양한 박물관을 둘러보는 여행",
  바다:    "바다와 산책을 함께 즐기는 여행",
  강변:    "강변 산책길을 따라가는 여행",
  디저트:  "달콤한 디저트를 즐기는 여행",
  "공연·전시": "공연과 전시를 즐기는 컬처 여행",
};

function fmtShort(date: Date) {
  return `${date.getMonth() + 1}.${date.getDate()} (${WEEKDAYS[date.getDay()]})`;
}

export default function CourseDonePage() {
  const router = useRouter();
  const [combine, setCombine] = useState<FinalCombine | null>(null);
  const [where, setWhere] = useState("도쿄");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dotlo:final-combine");
      if (raw) setCombine(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    const w = sessionStorage.getItem("dotlo:where");
    if (w) setWhere(w);
  }, []);

  const startDate = combine ? new Date(combine.startISO) : new Date("2026-05-18");
  const endDate = combine ? new Date(combine.endISO) : new Date("2026-05-21");
  const days = combine?.days ?? 4;
  const nights = combine?.nights ?? days - 1;
  const assignments = combine?.assignments ?? {};

  const daySlots = Array.from({ length: days }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div
      className="relative flex flex-col h-full"
      style={{ background: "#FAFBFF" }}
    >
      {/* 본문 */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "70px 20px 24px" }}>
        {/* 체크 Lottie + 타이틀 블록 */}
        <div className="flex flex-col items-center" style={{ marginTop: 40, gap: 12 }}>
          <div style={{ width: 96, height: 96, marginBottom: -8 }}>
            <Lottie animationData={successCheck} loop={false} autoplay />
          </div>
          <h1
            className="text-center"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 22,
              fontWeight: 700,
              lineHeight: "28px",
              color: "#1A1A1A",
              whiteSpace: "pre-line",
            }}
          >
            {`${where} ${nights}박 ${days}일\n여행 코스가 완성되었어요!`}
          </h1>
          <p
            className="text-center"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: "#888888",
              whiteSpace: "pre-line",
            }}
          >
            {"AI가 최적의 동선과 시간을 고려해\n여정을 완성했어요"}
          </p>
        </div>

        {/* 일차별 카드 */}
        <div className="flex flex-col" style={{ marginTop: 36, gap: 12 }}>
          {daySlots.map((date, idx) => {
            const palette = DAY_PALETTE[idx % DAY_PALETTE.length];
            const course = assignments[idx];
            const tagline = course?.category ? CATEGORY_TAGLINE[course.category] ?? "" : "";

            return (
              <div
                key={idx}
                className="relative flex items-center"
                style={{
                  width: "100%",
                  height: 70,
                  background: palette.bg,
                  borderRadius: 8,
                  paddingLeft: 12,
                  gap: 16,
                }}
              >
                {/* 일차 라벨 */}
                <div className="shrink-0 flex flex-col" style={{ width: 47, gap: 6 }}>
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: "#1A1A1A" }}>
                    {idx + 1}일차
                  </span>
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#555555" }}>
                    {fmtShort(date)}
                  </span>
                </div>

                {/* 결과 카드 — 코스가 배치된 경우만 */}
                {course ? (
                  <div
                    className="flex items-center"
                    style={{
                      flex: 1,
                      height: 70,
                      padding: "5px 10px",
                      gap: 10,
                      background: "#FFFFFF",
                      border: `1px solid ${palette.border}`,
                      borderRadius: 8,
                    }}
                  >
                    <div
                      className="shrink-0 relative overflow-hidden"
                      style={{
                        width: 59,
                        height: 59,
                        borderRadius: 4,
                        backgroundImage: course.image ? `url(${course.image})` : undefined,
                        backgroundColor: "#CBCBCB",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="flex flex-col min-w-0" style={{ gap: 6, flex: 1 }}>
                      <span
                        className="truncate"
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 13,
                          fontWeight: 600,
                          lineHeight: "16px",
                          color: "#000000",
                        }}
                      >
                        {course.title}
                      </span>
                      <span
                        className="truncate"
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 10,
                          fontWeight: 500,
                          lineHeight: "13px",
                          color: "#888888",
                        }}
                      >
                        {tagline}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      flex: 1,
                      height: 70,
                      background: "#FFFFFF",
                      border: `1px dashed ${palette.border}`,
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: "15px",
                        color: "#888888",
                      }}
                    >
                      이 날은 자유 일정이에요
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px", background: "transparent" }}>
        <button
          onClick={() => router.push("/screens/mytrip/course/final")}
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
          최종 코스 보기
        </button>
      </div>
    </div>
  );
}
