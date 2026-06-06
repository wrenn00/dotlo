"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingStepper from "@/components/LoadingStepper";

function CourseLoadingContent() {
  const router = useRouter();
  const params = useSearchParams();

  // ?days=N 으로 받아서 단계 라벨에 반영. 기본 4일차.
  const days = useMemo(() => {
    const raw = params.get("days");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : 4;
  }, [params]);

  const steps = [
    `${days}일차 코스 분석`,
    "이동 동선 계산 중...",
    "코스 조합",
    "일정 완성",
  ];

  return (
    <LoadingStepper
      title="코스를 조합하고 있어요"
      icon="create"
      steps={steps}
      completeMessage="조합 완료!"
      completeSubMessage="저장한 코스로 이동할게요"
      onComplete={() => router.push("/screens/mytrip/course/done")}
    />
  );
}

export default function CourseLoadingPage() {
  return (
    <Suspense fallback={<div className="h-full" style={{ background: "#FFFFFF" }} />}>
      <CourseLoadingContent />
    </Suspense>
  );
}
