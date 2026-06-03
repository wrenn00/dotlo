"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Zap, SlidersHorizontal, Check } from "lucide-react";

type Selected = "quick" | "custom" | null;

const OPTIONS = [
  {
    key: "quick" as const,
    Icon: Zap,
    title: "빠른 생성",
    description: "기본 추천 기준으로 바로 코스를 짜드려요\n마음에 들면 그대로, 아니면 수정할 수 있어요",
    badge: null,
  },
  {
    key: "custom" as const,
    Icon: SlidersHorizontal,
    title: "직접 생성",
    description: "목적·취향·일정 밀도·이동 스타일을 반영해서\n더 정확한 코스를 만들어요",
    badge: "추천",
  },
];

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
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px", paddingBottom: 110 }}>

        {/* 제목 */}
        <h1
          style={{
            marginTop: 18,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
            whiteSpace: "pre-line",
          }}
        >
          오사카 여행{"\n"}어떻게 만들어드릴까요?
        </h1>

        {/* 옵션 카드 2개 */}
        <div className="flex flex-col" style={{ gap: 14, marginTop: 30 }}>
          {OPTIONS.map((opt) => {
            const active = selected === opt.key;
            const Icon = opt.Icon;
            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                className="relative w-full text-left"
                style={{
                  height: 94,
                  background: "#FAFAFA",
                  border: active ? "2px solid #D8D8E9" : "2px solid transparent",
                  borderRadius: 12,
                }}
              >
                {/* 좌측: 컬러 원 + 텍스트 */}
                <div className="absolute flex items-center" style={{ left: 13, top: 19, gap: 11, right: 56 }}>
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: 35, height: 35, background: "#F2F2F6", borderRadius: "50%" }}
                  >
                    <Icon size={20} color="#2E2E70" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col" style={{ gap: 4, flex: 1 }}>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 16,
                          fontWeight: 500,
                          lineHeight: "20px",
                          color: "#1A1A1A",
                        }}
                      >
                        {opt.title}
                      </span>
                      {opt.badge && (
                        <span
                          className="inline-flex items-center justify-center"
                          style={{
                            height: 17,
                            padding: "0 7px",
                            background: "#2E2E70",
                            borderRadius: 8,
                            fontFamily: '"Spoqa Han Sans Neo"',
                            fontSize: 10,
                            fontWeight: 500,
                            lineHeight: "13px",
                            color: "#FFFFFF",
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: "16px",
                        color: "#555555",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {opt.description}
                    </span>
                  </div>
                </div>

                {/* 우측 선택 표시 */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{ right: 12, top: "calc(50% - 14px)", width: 28, height: 28 }}
                >
                  {active ? (
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 28, height: 28, background: "#2E2E70", borderRadius: "50%" }}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        background: "#F2F2F6",
                        border: "1px solid #D8D8E9",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
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
