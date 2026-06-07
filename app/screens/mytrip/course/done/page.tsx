"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface FinalCombine {
  startISO: string;
  endISO: string;
  nights: number;
  days: number;
}

export default function CourseDonePage() {
  const router = useRouter();
  const [combine, setCombine] = useState<FinalCombine | null>(null);
  const [where, setWhere] = useState("도쿄");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dotlo:final-combine");
      if (raw) setCombine(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    const w = sessionStorage.getItem("dotlo:where");
    if (w) setWhere(w);
  }, []);

  const days = combine?.days ?? 4;
  const nights = combine?.nights ?? days - 1;

  return (
    <div
      className="relative flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #F2FDFF 0%, #FFFFFF 34%)" }}
    >
      {/* 뒤로가기 — 좌상단 */}
      <button
        onClick={() => router.back()}
        className="absolute flex items-center justify-center"
        style={{ left: 14, top: 50, width: 36, height: 36, zIndex: 10 }}
        aria-label="뒤로"
      >
        <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
      </button>

      {/* 본문 — 수직 중앙 정렬 */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center justify-center"
        style={{ padding: "70px 20px 24px" }}
      >
        {/* 캐릭터 + 타이틀 블록 — 캐릭터는 진입 시 살짝 점프 */}
        <div className="flex flex-col items-center" style={{ gap: 14 }}>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -16, 0, -10, 0] }}
            transition={{ duration: 1.4, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeOut", delay: 0.15 }}
            style={{ width: 110, height: 107, position: "relative" }}
          >
            <Image src="/images/cheer.png" alt="" fill priority style={{ objectFit: "contain" }} />
          </motion.div>
          <h1
            className="text-center"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 22,
              fontWeight: 700,
              lineHeight: "28px",
              color: "#1A1A1A",
              whiteSpace: "pre-line",
            }}
          >
            {`${where} ${nights}박 ${days}일\n여행 코스가 완성되었어요!`}
          </h1>
          <p
            className="text-center"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: "#888E9C",
              whiteSpace: "pre-line",
            }}
          >
            {"AI가 최적의 동선과 시간을 고려해\n여정을 완성했어요"}
          </p>
        </div>

      </div>

      {/* 하단 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px", background: "transparent" }}>
        <button
          onClick={() => router.push("/screens/mytrip/course/final")}
          className="w-full transition-opacity active:opacity-80"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          최종 코스 보기
        </button>
      </div>
    </div>
  );
}
