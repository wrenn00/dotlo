"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Step2LoadingPage() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  // 카운트업: 3초 동안 0 → 47
  useEffect(() => {
    const total = 47;
    const duration = 2800;
    const interval = 60;
    const steps = duration / interval;
    const increment = total / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= total) {
        setCount(total);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // 3초 후 자동 전환
  useEffect(() => {
    const t = setTimeout(() => router.push("/screens/step2/loaded"), 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #E5FBFF 0%, #ffffff 60%)",
      }}
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

        {/* 회전 로딩 원 + 아이콘 */}
        <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
          {/* 회전 원 */}
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
              strokeDashoffset="0"
            />
          </svg>
          {/* 흰 원 + 핀 아이콘 */}
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
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "#E5FBFF" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#00E1FF" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#00E1FF" }}>
            {count}개 장소 가져옴
          </span>
        </div>
      </div>

      {/* spin 키프레임 */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
