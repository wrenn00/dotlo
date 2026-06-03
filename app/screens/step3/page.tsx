"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Zap, MapPin, Heart } from "lucide-react";

type Selected = "quick" | "custom" | null;

export default function Step3Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Selected>(null);

  function handleNext() {
    if (selected === "quick") router.push("/screens/step6");
    else if (selected === "custom") router.push("/screens/step4");
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px", paddingBottom: 24 }}>

        {/* 제목 */}
        <h1
          style={{
            marginTop: 49,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
            whiteSpace: "pre-line",
          }}
        >
          도쿄 여행{"\n"}어떻게 만들어드릴까요?
        </h1>

        {/* 옵션 카드 2개 — 335x145 #FAFAFA radius 12, gap 11 */}
        <div className="flex flex-col" style={{ gap: 11, marginTop: 56 }}>

          {/* 카드 1: 바로 추천받기 */}
          <button
            onClick={() => setSelected("quick")}
            className="relative w-full transition-colors"
            style={{
              height: 145,
              background: selected === "quick" ? "#F4F4FB" : "#FAFAFA",
              border: selected === "quick" ? "1.5px solid #D8D8E9" : "1.5px solid transparent",
              borderRadius: 12,
            }}
          >
            {/* 번개 아이콘 35x35 중앙 상단 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: "50%", top: 23, transform: "translateX(-50%)", width: 35, height: 35 }}
            >
              <Zap size={32} color="#A0A0C0" fill="#A0A0C0" strokeWidth={0} />
            </div>
            {/* 타이틀 */}
            <p
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 65,
                textAlign: "center",
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "20px",
                color: "#1A1A1A",
              }}
            >
              바로 추천받기
            </p>
            {/* 설명 */}
            <p
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 92,
                textAlign: "center",
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "15px",
                color: "#555555",
                whiteSpace: "pre-line",
              }}
            >
              원하는 취향의 코스를 추천해드려요{"\n"}쉽고 빠르게 코스를 선택해보세요
            </p>
          </button>

          {/* 카드 2: 맞춤 코스 생성하기 (추천 배지) */}
          <button
            onClick={() => setSelected("custom")}
            className="relative w-full transition-colors"
            style={{
              height: 145,
              background: selected === "custom" ? "#F4F4FB" : "#FAFAFA",
              border: selected === "custom" ? "1.5px solid #D8D8E9" : "1.5px solid transparent",
              borderRadius: 12,
            }}
          >
            {/* 추천 배지 — 43x23 #2E2E70 radius 20, top 8 right 8 */}
            <div
              className="absolute inline-flex items-center justify-center"
              style={{
                top: 8,
                right: 8,
                width: 43,
                height: 23,
                background: "#2E2E70",
                borderRadius: 20,
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
                추천
              </span>
            </div>

            {/* 핀+하트 아이콘 30x30 중앙 상단 */}
            <div
              className="absolute"
              style={{ left: "50%", top: 25, transform: "translateX(-50%)", width: 30, height: 30 }}
            >
              <MapPin size={30} color="#A0A0C0" strokeWidth={1.8} />
              <Heart
                size={10}
                color="#A0A0C0"
                fill="#A0A0C0"
                strokeWidth={0}
                style={{ position: "absolute", left: 10, top: 7 }}
              />
            </div>

            {/* 타이틀 */}
            <p
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 65,
                textAlign: "center",
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "20px",
                color: "#1A1A1A",
              }}
            >
              맞춤 코스 생성하기
            </p>
            {/* 설명 */}
            <p
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: 92,
                textAlign: "center",
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "15px",
                color: "#555555",
                whiteSpace: "pre-line",
              }}
            >
              취향을 자유롭게 조합해보세요.{"\n"}나만의 코스를 직접 만들 수 있어요
            </p>
          </button>
        </div>
      </div>

      {/* 다음 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full transition-opacity disabled:opacity-40"
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
          다음
        </button>
      </div>
    </div>
  );
}
