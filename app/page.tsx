"use client";

import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col h-full items-center justify-center gap-8 px-8"
      style={{ background: "#FFFFFF" }}
    >
      {/* 로고 */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "#373C3E" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="9" stroke="white" strokeWidth="2" />
            <path d="M14 10v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-[24px] font-bold" style={{ color: "#373C3E" }}>
          dotlo
        </h1>
        <p className="text-[14px] text-center leading-relaxed" style={{ color: "#888E9C" }}>
          여행 코스 추천 프로토타입
        </p>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={() => router.push("/screens/step1")}
        className="w-full max-w-[280px] h-[52px] rounded-2xl text-[16px] font-semibold text-white transition-opacity active:opacity-80"
        style={{ background: "#373C3E" }}
      >
        프로토타입 시작하기
      </button>

      <p className="text-[12px]" style={{ color: "#C4C7CF" }}>
        STEP 1 — 9
      </p>
    </div>
  );
}
