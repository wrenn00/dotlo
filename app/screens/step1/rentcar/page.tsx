"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  {
    key: "rent",
    label: "렌트해요",
    desc: "먼 곳도 자유롭게 다닐 수 있게 코스를 짜드려요",
    icon: (
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
        <path d="M4 8l2.5-5h11L20 8M2 8h20v7a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="13" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="13" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "transit",
    label: "대중교통으로 다닐게요",
    desc: "지하철·버스 동선에 맞춰 도심 위주로 짜드려요",
    icon: (
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <rect x="2" y="1" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 8h16M7 1v14M13 1v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 18l-2 3M14 18l2 3M6 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "undecided",
    label: "아직 정하지 않았어요",
    desc: "기본값(대중교통)으로 코스를 만들고 나중에 바꿀 수 있어요",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 8.5C8.5 7.12 9.62 6 11 6s2.5 1.12 2.5 2.5c0 1.5-1.5 2-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="15.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
] as const;

type OptionKey = (typeof OPTIONS)[number]["key"];

export default function RentcarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<OptionKey>("rent");

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/screens/step1")}
          style={{ fontSize: 14, color: "#7A858B", fontWeight: 500 }}
        >
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5">

        {/* 배지 */}
        <div
          className="self-start px-3 py-1 rounded-full mb-4"
          style={{ background: "#E5FBFF" }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#00E1FF" }}>선택사항</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", lineHeight: "30px" }}>
          차 빌려서 다니실 건가요?
        </h1>
        <p style={{ fontSize: 14, color: "#7A858B", marginTop: 8, lineHeight: "20px" }}>
          이동 방식에 따라 동선과 코스가 달라져요
        </p>

        {/* 옵션 카드 3개 */}
        <div className="flex flex-col gap-3 mt-8">
          {OPTIONS.map(({ key, label, desc, icon }) => {
            const active = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="flex items-center gap-4 text-left transition-all"
                style={{
                  padding: "16px",
                  borderRadius: 16,
                  background: active ? "#E5FBFF" : "#F7F9FA",
                  border: active ? "1.5px solid #00E1FF" : "1.5px solid transparent",
                }}
              >
                {/* 아이콘 */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 44, height: 44,
                    borderRadius: 12,
                    background: active ? "#E5FBFF" : "#DDE5E8",
                    color: active ? "#00E1FF" : "#7A858B",
                  }}
                >
                  {icon}
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}>{label}</p>
                  <p style={{ fontSize: 12, color: "#7A858B", marginTop: 3, lineHeight: "16px" }}>{desc}</p>
                </div>

                {/* 체크 원형 */}
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 22, height: 22,
                    borderRadius: "50%",
                    background: active ? "#00E1FF" : "transparent",
                    border: active ? "none" : "1.5px solid #A1ADB3",
                  }}
                >
                  {active && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4.5L4.5 8 11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={() => router.back()}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#090738" }}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
