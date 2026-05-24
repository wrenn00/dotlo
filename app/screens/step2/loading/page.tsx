"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successCheck from "@/public/lottie/success-check.json";

type Stage = "loading" | "success";

export default function Step2LoadingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [count, setCount] = useState(0);

  // 카운트업 0 → 47 (60ms 간격 ≈ 2.8s)
  useEffect(() => {
    if (stage !== "loading") return;
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 47) {
          clearInterval(timer);
          return 47;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [stage]);

  // 47 도달 → 0.3s 대기 → success 단계로
  useEffect(() => {
    if (count === 47 && stage === "loading") {
      const t = setTimeout(() => setStage("success"), 300);
      return () => clearTimeout(t);
    }
  }, [count, stage]);

  // success 단계 → 1.5s 후 다음 페이지
  useEffect(() => {
    if (stage !== "success") return;
    const t = setTimeout(() => router.push("/screens/step2/loaded"), 1500);
    return () => clearTimeout(t);
  }, [stage, router]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #E5FBFF 0%, #ffffff 60%)" }}
    >
      {/* 뒤로가기 */}
      <div className="px-5 pt-12">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col flex-1 items-center justify-center gap-6 px-8">
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              {/* 회전 로딩 원 + 핀 */}
              <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
                <svg
                  className="absolute inset-0"
                  width="110" height="110" viewBox="0 0 110 110"
                  style={{ animation: "spin 1.4s linear infinite" }}
                >
                  <circle cx="55" cy="55" r="50" fill="none" stroke="#E5FBFF" strokeWidth="6" />
                  <circle
                    cx="55" cy="55" r="50"
                    fill="none"
                    stroke="#00E1FF"
                    strokeWidth="6"
                    strokeDasharray="80 235"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 80, height: 80,
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 4px 20px rgba(56,198,175,0.2)",
                  }}
                >
                  <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
                    <path d="M16 2C9.37 2 4 7.37 4 14c0 9.63 12 24 12 24s12-14.37 12-24C28 7.37 22.63 2 16 2z" fill="#00E1FF" />
                    <circle cx="16" cy="14" r="5" fill="white" />
                  </svg>
                </div>
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col items-center gap-2">
                <p style={{ fontSize: 20, fontWeight: 700, color: "#090738" }}>장소를 불러오고 있어요</p>
                <p style={{ fontSize: 14, color: "#7A858B", textAlign: "center", lineHeight: "22px" }}>
                  잠시만 기다려주세요{"\n"}최대 30초 정도 걸려요
                </p>
              </div>

              {/* 카운트 칩 */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "#E5FBFF" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#00E1FF" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#00E1FF" }}>
                  {count}개 장소 가져옴
                </span>
              </div>
            </motion.div>
          )}

          {stage === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div style={{ width: 180, height: 180 }}>
                <Lottie animationData={successCheck} loop={false} autoplay />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{ fontSize: 20, fontWeight: 700, color: "#090738", marginTop: 8 }}
              >
                모두 가져왔어요!
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                style={{ fontSize: 14, color: "#7A858B", marginTop: 8 }}
              >
                47개 장소를 불러왔어요
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
