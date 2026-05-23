"use client";

import { useRouter } from "next/navigation";

function ArrowRight({ color = "#C4C7CF" }: { color?: string }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Step2Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center px-5 pt-12 pb-2">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-6">

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", lineHeight: "30px", marginTop: 12 }}>
          어디를 가보고 싶으세요?
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 8, lineHeight: "22px" }}>
          구글맵에 저장한 장소를 가져오면{"\n"}코스를 더 빠르게 짤 수 있어요
        </p>

        {/* 구글맵 연동 카드 */}
        <div
          className="flex flex-col items-center mt-6 px-5 py-6"
          style={{ background: "#F5F5F7", borderRadius: 20 }}
        >
          {/* 구글맵 아이콘 */}
          <div
            className="flex items-center justify-center mb-4"
            style={{ width: 64, height: 64, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 3C10.48 3 6 7.48 6 13c0 7.75 10 19 10 19s10-11.25 10-19c0-5.52-4.48-10-10-10z" fill="#38C6AF" />
              <circle cx="16" cy="13" r="3.5" fill="white" />
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>구글맵 저장 장소 가져오기</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>
            구글 맵의 저장 장소를 모두 불러올게요
          </p>
          <button
            onClick={() => router.push("/screens/step2/loading")}
            className="w-full mt-5 h-[46px] rounded-2xl font-semibold text-white transition-opacity active:opacity-80"
            style={{ background: "#38C6AF", fontSize: 15 }}
          >
            구글 계정 연동하기
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>또는</span>
          <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
        </div>

        {/* 대체 옵션 */}
        <div className="flex flex-col gap-3">
          {[
            { icon: "🔍", title: "직접 검색해서 추가하기", sub: "장소 이름과 주소로 찾기" },
            { icon: "👍", title: "오사카 인기 장소 둘러보기", sub: "현지인이 자주 가는 곳 찾기" },
          ].map(({ icon, title, sub }) => (
            <button
              key={title}
              onClick={() => router.push("/screens/step2/select")}
              className="flex items-center gap-3 px-4 text-left transition-colors"
              style={{ height: 64, background: "#F5F5F7", borderRadius: 16 }}
            >
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div className="flex-1">
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{title}</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{sub}</p>
              </div>
              <ArrowRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
