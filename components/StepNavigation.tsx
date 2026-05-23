"use client";

import { useRouter } from "next/navigation";

const TOTAL = 9;

interface StepNavigationProps {
  current: number;        // 1~9
  nextHref?: string;      // 기본값: /step/{current+1}
  prevHref?: string;      // 기본값: /step/{current-1} 또는 /
  nextLabel?: string;
  hideNext?: boolean;
  hidePrev?: boolean;
}

export function StepNavigation({
  current,
  nextHref,
  prevHref,
  nextLabel = "다음",
  hideNext = false,
  hidePrev = false,
}: StepNavigationProps) {
  const router = useRouter();

  const toNext = nextHref ?? (current < TOTAL ? `/step/${current + 1}` : "/");
  const toPrev = prevHref ?? (current > 1 ? `/step/${current - 1}` : "/");

  return (
    <div className="flex flex-col gap-3 px-5 pb-8 pt-4">
      {/* 다음 버튼 */}
      {!hideNext && (
        <button
          onClick={() => router.push(toNext)}
          className="w-full h-[50px] rounded-2xl text-[16px] font-medium text-white transition-opacity active:opacity-80"
          style={{ background: "#373C3E" }}
        >
          {nextLabel}
        </button>
      )}

      {/* 이전 버튼 */}
      {!hidePrev && (
        <button
          onClick={() => router.back()}
          className="w-full h-10 rounded-2xl text-[14px] font-medium transition-opacity active:opacity-70"
          style={{ color: "#888E9C" }}
        >
          이전
        </button>
      )}
    </div>
  );
}

// ─── 상단 진행 바 ─────────────────────────────────────────────────────────────

export function ProgressBar({ current }: { current: number }) {
  const pct = (current / TOTAL) * 100;

  return (
    <div className="px-5 pt-3 pb-1">
      {/* 레이블 */}
      <div className="flex justify-between mb-1.5">
        <span className="text-[11px] font-medium" style={{ color: "#888E9C" }}>
          STEP {current}
        </span>
        <span className="text-[11px]" style={{ color: "#C4C7CF" }}>
          {current} / {TOTAL}
        </span>
      </div>
      {/* 트랙 */}
      <div className="h-1 w-full rounded-full" style={{ background: "#F0F1F4" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#373C3E" }}
        />
      </div>
    </div>
  );
}
