"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FINAL_DELAY = 500;

interface Props {
  title: string;
  subtitle?: string;
  icon: "create" | "regenerate";
  steps: string[];
  stepDurationMs?: number;
  onComplete: () => void;
}

// ─── 중앙 아이콘 ──────────────────────────────────────────────────────────────

function CenterIcon({ kind }: { kind: "create" | "regenerate" }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Dotlo"
      width={56}
      height={48}
      priority
      style={{
        width: 56,
        height: "auto",
        // regenerate: 천천히 회전하며 재생성 의도 표현
        animation: kind === "regenerate" ? "spinSlow 2.4s linear infinite" : undefined,
      }}
    />
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function LoadingStepper({
  title,
  subtitle = "잠시만 기다려주세요\n최대 30초 정도 걸려요",
  icon,
  steps,
  stepDurationMs = 1500,
  onComplete,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  // 단계 진행
  useEffect(() => {
    if (currentStep >= steps.length) return;
    const t = setTimeout(() => setCurrentStep((s) => s + 1), stepDurationMs);
    return () => clearTimeout(t);
  }, [currentStep, steps.length, stepDurationMs]);

  // 완료 후 onComplete
  useEffect(() => {
    const total = steps.length * stepDurationMs + FINAL_DELAY;
    const t = setTimeout(onComplete, total);
    return () => clearTimeout(t);
  }, [steps.length, stepDurationMs, onComplete]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #E5FBFF 0%, #F4F4FF 60%, #ffffff 100%)" }}
    >
      {/* 헤더 (뒤로가기 placeholder — 페이지에서 useRouter 처리는 생략) */}
      <div className="px-5 pt-12 shrink-0" style={{ height: 60 }} />

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col items-center flex-1 px-8" style={{ paddingTop: 20 }}>

        {/* 로딩 인디케이터 */}
        <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
          <svg
            className="absolute inset-0"
            width="96" height="96" viewBox="0 0 96 96"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle cx="48" cy="48" r="43" fill="none" stroke="#C2F5FF" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="43"
              fill="none"
              stroke="#00E1FF"
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
            <CenterIcon kind={icon} />
          </div>
        </div>

        {/* 제목 */}
        <p style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 28, textAlign: "center" }}>
          {title}
        </p>
        <p
          style={{
            fontSize: 14, color: "#7A858B",
            textAlign: "center",
            marginTop: 8,
            lineHeight: "22px",
            whiteSpace: "pre-line",
          }}
        >
          {subtitle}
        </p>

        {/* 단계 리스트 */}
        <div className="flex flex-col mt-10 w-full max-w-[260px]">
          {steps.map((label, idx) => {
            const isDone   = currentStep > idx;
            const isActive = currentStep === idx;
            const isLast   = idx === steps.length - 1;

            return (
              <div key={label} className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: isDone || isActive ? "#00E1FF" : "#DDE5E8",
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

                  {!isLast && (
                    <div
                      className="transition-colors duration-500"
                      style={{
                        width: 2,
                        height: 32,
                        background: isDone ? "#00E1FF" : isActive ? "#5CE7FF" : "#DDE5E8",
                      }}
                    />
                  )}
                </div>

                <div className="pt-1 pb-6">
                  <p
                    className="transition-colors duration-300"
                    style={{
                      fontSize: 14,
                      fontWeight: isDone || isActive ? 700 : 500,
                      color: isDone || isActive ? "#090738" : "#A1ADB3",
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
        @keyframes spin     { from { transform: rotate(0deg);   } to { transform: rotate(360deg); } }
        @keyframes spinSlow { from { transform: rotate(0deg);   } to { transform: rotate(-360deg);} }
        @keyframes pulse    { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:.5; transform:scale(1.25);} }
        @keyframes checkPop { from { transform: scale(0);} to { transform: scale(1);} }
      `}</style>
    </div>
  );
}
