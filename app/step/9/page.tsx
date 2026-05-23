import { ProgressBar, StepNavigation } from "@/components/StepNavigation";

export default function Step9Page() {
  return (
    <div className="flex flex-col h-full" style={{ background: "#FFFFFF" }}>
      <ProgressBar current={9} />

      {/* 콘텐츠 영역 — 나중에 Figma 디자인으로 교체 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "#F8F9FB" }}
        >
          <span className="text-[32px] font-bold" style={{ color: "#C4C7CF" }}>
            9
          </span>
        </div>
        <p className="text-[20px] font-bold" style={{ color: "#373C3E" }}>
          STEP 9
        </p>
        <p className="text-[14px] text-center" style={{ color: "#888E9C" }}>
          Figma 디자인이 여기에 들어올 예정입니다
        </p>
      </div>

      <StepNavigation
        current={9}
        
        nextHref="/" nextLabel="처음으로"
      />
    </div>
  );
}
