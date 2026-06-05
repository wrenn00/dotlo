"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Star } from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";
import places from "@/data/places.json";

const tokyoPlaces = places.filter((p) => p.city === "tokyo");

export default function Step2LoadedPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px", paddingBottom: 24 }}>

        {/* 연동완료 칩 — 항공권 선택사항 칩과 같은 사이즈 (h29, padding 0/14) */}
        <div
          className="inline-flex items-center justify-center self-start"
          style={{
            marginTop: 11,
            height: 29,
            padding: "0 14px",
            gap: 4,
            background: "#F2F2F6",
            borderRadius: 32,
          }}
        >
          <Check size={16} color="#2E2E70" strokeWidth={2.4} />
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              color: "#2E2E70",
            }}
          >
            연동완료
          </span>
        </div>

        {/* 제목 */}
        <h1
          style={{
            marginTop: 16,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
          }}
        >
          저장된 장소 <span style={{ color: "#2E2E70" }}>{tokyoPlaces.length}개를</span>
          <br />
          가져왔어요
        </h1>

        {/* 부제 */}
        <p
          style={{
            marginTop: 6,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#888E9C",
          }}
        >
          이제 코스 생성에 활용할 수 있어요
        </p>

        {/* 섹션 헤더 */}
        <div style={{ marginTop: 28, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "21px",
              color: "#333333",
            }}
          >
            추가된 장소
          </span>
        </div>

        {/* 장소 리스트 — 330x64 white shadow radius 12, 하단→상단 스태거 등장 */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {tokyoPlaces.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.36,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(idx * 0.05, 0.6),
              }}
              className="relative flex items-center"
              style={{
                height: 64,
                background: "#FFFFFF",
                borderRadius: 12,
                boxShadow: "0 0 6.8px rgba(0, 0, 0, 0.08)",
                padding: "0 8px",
              }}
            >
              <div className="flex items-center" style={{ gap: 8, flex: 1 }}>
                {/* 썸네일 50x50 */}
                <div className="shrink-0">
                  <PlaceThumbnail src={p.image} alt={p.name} category={p.category} size={50} />
                </div>
                {/* 텍스트 블록 */}
                <div className="flex flex-col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                  <span
                    className="truncate"
                    style={{
                      fontFamily: '"Spoqa Han Sans Neo"',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "18px",
                      color: "#1A1A1A",
                    }}
                  >
                    {p.name}
                  </span>
                  {/* 메타: 지역·카테고리 + 별점 */}
                  <div className="flex items-center" style={{ gap: 5 }}>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 10,
                        fontWeight: 500,
                        lineHeight: "13px",
                        color: "#555555",
                      }}
                    >
                      {p.region} · {p.category}
                    </span>
                    <div className="flex items-center" style={{ gap: 1 }}>
                      <Star size={11} color="#FFE770" fill="#FFE770" strokeWidth={0} />
                      <span
                        style={{
                          fontFamily: '"Spoqa Han Sans Neo"',
                          fontSize: 10,
                          fontWeight: 500,
                          lineHeight: "13px",
                          color: "#555555",
                        }}
                      >
                        {p.rating} ({p.reviews.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 다음 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={() => router.push("/screens/step2/select")}
          className="w-full"
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
          다음
        </button>
      </div>
    </div>
  );
}
