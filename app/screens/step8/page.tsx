"use client";

import { useRouter } from "next/navigation";
import LoadingStepper from "@/components/LoadingStepper";

const STEPS = ["카테고리별 장소 분석", "이동 동선 계산 중...", "코스 분석", "일정 생성"];

export default function Step8Page() {
  const router = useRouter();
  return (
    <LoadingStepper
      title="코스를 다시 만들고 있어요"
      icon="regenerate"
      steps={STEPS}
      completeMessage="다시 만들었어요!"
      onComplete={() => router.push("/screens/step7")}
    />
  );
}
