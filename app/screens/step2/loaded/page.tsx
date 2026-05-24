"use client";

import { useRouter } from "next/navigation";
import PlaceImage from "@/components/PlaceImage";

const PLACES = [
  { id: 1, name: "이치란 라멘 도본토리점", sub: "오사카 · 음식점" },
  { id: 2, name: "후시미 이나리 신사", sub: "교토 · 관광명소" },
  { id: 3, name: "블루보틀 키요스미", sub: "오사카 · 카페" },
  { id: 4, name: "기요미즈데라", sub: "교토 · 관광명소" },
  { id: 5, name: "니시키 시장", sub: "교토 · 시장" },
];

export default function Step2LoadedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center px-5 pt-12 pb-2">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-6">

        {/* 연동완료 배지 */}
        <div
          className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2 mb-4"
          style={{ background: "#E5FBFF" }}
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5l3.5 3.5L11 1" stroke="#00E1FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#00E1FF" }}>연동완료</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", lineHeight: "32px" }}>
          저장된 장소{" "}
          <span style={{ color: "#00E1FF" }}>47개</span>
          를{"\n"}가져왔어요
        </h1>
        <p style={{ fontSize: 14, color: "#7A858B", marginTop: 8 }}>
          이제 코스 생성에 활용할 수 있어요
        </p>

        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <span style={{ fontSize: 14, fontWeight: 600, color: "#090738" }}>추가된 장소</span>
          <button style={{ fontSize: 13, color: "#00E1FF", fontWeight: 600 }}>전체보기</button>
        </div>

        {/* 장소 리스트 */}
        <div className="flex flex-col gap-2.5">
          {PLACES.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: "#fff", borderRadius: 14, border: "1px solid #DDE5E8" }}
            >
              {/* 썸네일 */}
              <PlaceImage placeName={p.name} width={48} height={48} />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontSize: 15, fontWeight: 600, color: "#090738" }}>
                  {p.name}
                </p>
                <p style={{ fontSize: 12, color: "#7A858B", marginTop: 2 }}>{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="px-5 pb-8 pt-3">
        <button
          onClick={() => router.push("/screens/step2/select")}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#090738" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
