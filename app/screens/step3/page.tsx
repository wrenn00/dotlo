"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

type Selected = "quick" | "custom" | null;

const OPTIONS = [
  {
    key: "quick" as const,
    icon: "bolt",
    title: "빠른 생성",
    lines: [
      "기본 추천 기준으로 바로 코스를 짜드려요",
      "마음에 들면 그대로, 아니면 수정할 수 있어요",
    ],
    badge: null,
  },
  {
    key: "custom" as const,
    icon: "tune",
    title: "직접 생성",
    lines: [
      "목적·취향·일정 밀도·",
      "이동 스타일을 반영해서 더 정확한 코스를 만들어요",
    ],
    badge: "추천",
  },
];

export default function Step3Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Selected>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="px-5 pt-12 pb-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-6">

        {/* 제목 */}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#090738", lineHeight: "34px" }}>
          오사카 여행
          <br />
          어떻게 만들어드릴까요?
        </h1>

        {/* 옵션 카드 */}
        <div className="flex flex-col gap-4 mt-10">
          {OPTIONS.map(({ key, icon, title, lines, badge }) => {
            const active = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="relative flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all"
                style={{
                  background: active ? "#E5FBFF" : "#F7F9FA",
                  border: active ? "2px solid #00E1FF" : "2px solid transparent",
                }}
              >
                {/* 추천 배지 */}
                {badge && (
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full"
                    style={{ background: "#00E1FF" }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{badge}</span>
                  </div>
                )}

                {/* 아이콘 */}
                <Icon name={icon} size={36} className={active ? "text-sky-blue-500" : "text-night-navy-600"} />

                {/* 제목 */}
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: active ? "#00E1FF" : "#090738",
                    marginTop: 14,
                  }}
                >
                  {title}
                </p>

                {/* 부제 */}
                <div className="mt-2">
                  {lines.map((line, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#7A858B", lineHeight: "20px" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* 다음 버튼 — 빠른 생성은 step4/5 건너뛰고 바로 step6으로 */}
        <button
          onClick={() => {
            if (selected === "quick") router.push("/screens/step6");
            else if (selected === "custom") router.push("/screens/step4");
          }}
          disabled={!selected}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-all"
          style={{
            background: selected ? "#090738" : "#DDE5E8",
            color: selected ? "#fff" : "#7A858B",
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
