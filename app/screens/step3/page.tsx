"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Selected = "custom" | "quick" | null;

export default function Step3Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Selected>(null);
  const [where, setWhere] = useState("도쿄");

  useEffect(() => {
    const saved = sessionStorage.getItem("dotlo:where");
    if (saved) setWhere(saved);
  }, []);

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
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px 24px" }}>
        {/* 제목 — 지역명만 cyan */}
        <h1
          style={{
            marginTop: 49,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
          }}
        >
          <span style={{ color: "#00E1FF" }}>{where}</span> 여행
          <br />
          어떻게 만들어드릴까요?
        </h1>

        {/* 옵션 카드 2개 */}
        <div className="flex flex-col" style={{ marginTop: 56, gap: 11 }}>
          {/* 카드 1: 맞춤 코스 생성하기 — cyan #00E1FF + 추천 navy 배지 + 01.png */}
          <button
            type="button"
            onClick={() => setSelected("custom")}
            className="relative w-full overflow-hidden text-left transition-transform active:scale-[0.99]"
            style={{
              height: 145,
              background: "#00E1FF",
              borderRadius: 12,
              boxShadow: selected === "custom" ? "0 0 0 2px #2E2E70 inset" : "none",
            }}
          >
            {/* 배경 일러스트 — 우측 (blue.png 원본 비율 유지) */}
            <div
              className="absolute"
              style={{
                right: 4,
                top: 0,
                bottom: 0,
                width: 160,
                backgroundImage: "url(/images/blue.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                pointerEvents: "none",
              }}
            />
            {/* 텍스트 블록 */}
            <div className="absolute flex flex-col" style={{ left: 20, top: 31, gap: 6, width: 170 }}>
              {/* 추천 배지 */}
              <div
                className="inline-flex items-center justify-center"
                style={{
                  alignSelf: "flex-start",
                  height: 19,
                  padding: "0 8px",
                  background: "#2E2E70",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#FFFFFF" }}>
                  추천
                </span>
              </div>
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: "25px",
                  color: "#000000",
                }}
              >
                맞춤 코스 생성하기
              </span>
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 11,
                  fontWeight: 400,
                  lineHeight: "130%",
                  color: "#555555",
                  whiteSpace: "pre-line",
                }}
              >
                {"취향을 자유롭게 조합해보세요.\n나만의 코스를 직접 만들 수 있어요"}
              </span>
            </div>
          </button>

          {/* 카드 2: 바로 추천받기 — 프로토타입에서는 비활성 (클릭해도 동작 없음) */}
          <div
            aria-disabled="true"
            className="relative w-full overflow-hidden text-left"
            style={{
              height: 145,
              background: "#FFF9C2",
              borderRadius: 12,
              cursor: "default",
            }}
          >
            {/* 배경 일러스트 — 우측 (yellow.png 원본 비율 유지) */}
            <div
              className="absolute"
              style={{
                right: 4,
                top: 0,
                bottom: 0,
                width: 170,
                backgroundImage: "url(/images/yellow.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right center",
                pointerEvents: "none",
              }}
            />
            {/* 텍스트 블록 */}
            <div className="absolute flex flex-col" style={{ left: 20, top: 31, gap: 6, width: 170 }}>
              {/* 기본 배지 */}
              <div
                className="inline-flex items-center justify-center"
                style={{
                  alignSelf: "flex-start",
                  height: 19,
                  padding: "0 8px",
                  background: "#D8D8E9",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#333333" }}>
                  기본
                </span>
              </div>
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: "25px",
                  color: "#333333",
                }}
              >
                바로 추천받기
              </span>
              <span
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 11,
                  fontWeight: 400,
                  lineHeight: "130%",
                  color: "#555555",
                  whiteSpace: "pre-line",
                }}
              >
                {"원하는 취향의 코스를 추천해드려요\n쉽고 빠르게 코스를 선택해보세요"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
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
