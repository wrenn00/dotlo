"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "카테고리별 장소 분석",
  "이동 동선 계산 중...",
  "코스 분석",
  "일정 생성",
] as const;

const STEP_INTERVAL = 1500;
const FINAL_DELAY = 500;

export default function Step6Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) return;
    const t = setTimeout(() => setCurrentStep((s) => s + 1), STEP_INTERVAL);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    const total = STEPS.length * STEP_INTERVAL + FINAL_DELAY;
    const t = setTimeout(() => router.push("/screens/step7"), total);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #E6FAF8 0%, #F0FDFA 50%, #ffffff 100%)" }}
    >
      {/* 헤더 */}
      <div className="px-5 pt-12 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 중앙 콘텐츠 — 살짝 위쪽 */}
      <div className="flex flex-col items-center flex-1 px-8" style={{ paddingTop: 60 }}>

        {/* 로딩 인디케이터 */}
        <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
          <svg
            className="absolute inset-0"
            width="96" height="96" viewBox="0 0 96 96"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle cx="48" cy="48" r="43" fill="none" stroke="#CCF5EE" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="43"
              fill="none"
              stroke="#22D3CC"
              strokeWidth="4"
              strokeDasharray="70 200"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="flex items-center justify-center"
            style={{
              width: 72, height: 72,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 4px 18px rgba(34,211,204,0.18)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2l3 8 8 1-6 6 2 9-7-4-7 4 2-9-6-6 8-1 3-8z" fill="#22D3CC" />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <p style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginTop: 28 }}>
          코스를 만들고 있어요
        </p>
        <p style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginTop: 8, lineHeight: "22px" }}>
          잠시만 기다려주세요{"\n"}최대 30초 정도 걸려요
        </p>

        {/* 진행 단계 리스트 */}
        <div className="flex flex-col mt-10 w-full max-w-[260px]">
          {STEPS.map((label, idx) => {
            const isDone   = currentStep > idx;
            const isActive = currentStep === idx;
            const isLast   = idx === STEPS.length - 1;

            return (
              <div key={label} className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center shrink-0">
                  {/* 원형 아이콘 */}
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: isDone || isActive ? "#22D3CC" : "#E5E7EB",
                    }}
                  >
                    {isDone && (
                      <svg
                        width="12" height="9" viewBox="0 0 12 9" fill="none"
                        style={{ animation: "checkPop 220ms ease-out" }}
                      >
                        <path d="M1 4.5L4.5 8 11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isActive && (
                      <div
                        style={{
                          width: 8, height: 8,
                          borderRadius: "50%",
                          background: "#fff",
                          animation: "pulse 1s ease-in-out infinite",
                        }}
                      />
                    )}
                  </div>

                  {/* 연결선 */}
                  {!isLast && (
                    <div
                      className="transition-colors duration-500"
                      style={{
                        width: 2,
                        height: 32,
                        background: isDone ? "#22D3CC" : isActive ? "#99F6E4" : "#E5E7EB",
                      }}
                    />
                  )}
                </div>

                {/* 라벨 */}
                <div className="pt-1 pb-6">
                  <p
                    className="transition-colors duration-300"
                    style={{
                      fontSize: 14,
                      fontWeight: isDone || isActive ? 700 : 500,
                      color: isDone || isActive ? "#1A1A1A" : "#C4C7CF",
                    }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.25); }
        }
        @keyframes checkPop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
