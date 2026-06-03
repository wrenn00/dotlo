"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import successCheck from "@/public/lottie/success-check.json";

const FINAL_DELAY = 500;

interface Props {
  title: string;
  subtitle?: string;
  icon: "create" | "regenerate";
  steps: string[];
  /** 각 단계별 액티브/완료 색상. 길이가 steps와 다르면 인덱스 % length로 순환. */
  stepColors?: string[];
  stepDurationMs?: number;
  onComplete: () => void;
  completeMessage?: string;
  completeSubMessage?: string;
  completeDelayMs?: number;
}

const DEFAULT_STEP_COLORS = ["#00E1FF", "#FFE400", "#A5A5FF", "#A0A0C0"];

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
  stepColors = DEFAULT_STEP_COLORS,
  stepDurationMs = 1500,
  onComplete,
  completeMessage = "코스를 만들었어요!",
  completeSubMessage = "잠시 후 결과를 보여드릴게요",
  completeDelayMs = 1800,
}: Props) {
  const colorAt = (i: number) => stepColors[i % stepColors.length];
  const [currentStep, setCurrentStep] = useState(0);
  const [stage, setStage] = useState<"loading" | "complete">("loading");

  // 단계 진행
  useEffect(() => {
    if (stage !== "loading") return;
    if (currentStep >= steps.length) return;
    const t = setTimeout(() => setCurrentStep((s) => s + 1), stepDurationMs);
    return () => clearTimeout(t);
  }, [currentStep, steps.length, stepDurationMs, stage]);

  // 모든 단계 완료 → 완료 Lottie 단계로
  useEffect(() => {
    const total = steps.length * stepDurationMs + FINAL_DELAY;
    const t = setTimeout(() => setStage("complete"), total);
    return () => clearTimeout(t);
  }, [steps.length, stepDurationMs]);

  // 완료 Lottie 잠깐 보여준 뒤 다음 화면
  useEffect(() => {
    if (stage !== "complete") return;
    const t = setTimeout(onComplete, completeDelayMs);
    return () => clearTimeout(t);
  }, [stage, completeDelayMs, onComplete]);

  const bgStyle = { background: "linear-gradient(180deg, #EFEFFF 0%, #F4F4FF 60%, #ffffff 100%)" };

  // 완료 단계 — 체크 Lottie
  if (stage === "complete") {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8" style={bgStyle}>
        <div
          className="flex flex-col items-center"
          style={{ animation: "fadeScale 400ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div style={{ width: 128, height: 128 }}>
            <Lottie animationData={successCheck} loop={false} autoplay />
          </div>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 8 }}>{completeMessage}</p>
          <p style={{ fontSize: 14, color: "#7A858B", marginTop: 8 }}>{completeSubMessage}</p>
        </div>
        <style>{`@keyframes fadeScale { from { opacity:0; transform:scale(0.92);} to { opacity:1; transform:scale(1);} }`}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={bgStyle}>
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
            <circle cx="48" cy="48" r="43" fill="none" stroke="#EFEFFF" strokeWidth="4" />
            <circle
              cx="48" cy="48" r="43"
              fill="none"
              stroke="#6060A0"
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
              boxShadow: "0 4px 18px rgba(96, 96, 160, 0.18)",
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

        {/* 단계 리스트 — 각 단계별 고유 색상 */}
        <div className="flex flex-col mt-10 w-full max-w-[260px]">
          {steps.map((label, idx) => {
            const isDone   = currentStep > idx;
            const isActive = currentStep === idx;
            const isLast   = idx === steps.length - 1;
            const stepColor = colorAt(idx);
            const nextColor = colorAt(idx + 1);

            return (
              <div key={label} className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: isDone || isActive ? stepColor : "#E6E8EB",
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
                        background: isDone ? nextColor : "#E6E8EB",
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
                      color: isDone || isActive ? "#1A1A1A" : "#A0A0C0",
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
