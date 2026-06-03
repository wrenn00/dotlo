"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useKeyboard } from "@/components/KeyboardProvider";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse" style={{ width: 330, height: 218, background: "#B9B9C0", borderRadius: 12 }} />
  ),
});

const INPUT_ID = "stay-search";

// Tokyo 숙소 위치 — 신주쿠/시부야/아사쿠사 (도쿄 주요 호텔 거점)
const PLACES = [
  { id: 1, name: "신주쿠",   sub: "도쿄 신주쿠구",  coords: [35.6896, 139.7006] as [number, number], image: "/images/where/dokyo.png" },
  { id: 2, name: "시부야",   sub: "도쿄 시부야구",  coords: [35.6595, 139.7004] as [number, number], image: "/images/where/dokyo.png" },
  { id: 3, name: "아사쿠사", sub: "도쿄 다이토구",  coords: [35.7148, 139.7967] as [number, number], image: "/images/where/dokyo.png" },
];

// 도쿄 중심 (시부야~신주쿠 사이)
const TOKYO_CENTER: [number, number] = [35.68, 139.74];

export default function StayPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const { open: openKeyboard, close: closeKeyboard, isOpen: kbOpen, inputId } = useKeyboard();

  const trimmed = query.trim();
  const filtered = trimmed
    ? PLACES.filter((p) => {
        const q = trimmed.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q);
      })
    : PLACES;

  const isFocused = kbOpen && inputId === INPUT_ID;

  function focusSearch() {
    openKeyboard(INPUT_ID, query, setQuery);
  }

  function handleBack() {
    closeKeyboard();
    router.back();
  }

  function handleConfirm() {
    closeKeyboard();
    router.push("/screens/step1");
  }

  function handleSelect(id: number) {
    setSelected(id);
    closeKeyboard();
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더: 뒤로가기 + 건너뛰기 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0", position: "relative" }}>
        <button onClick={handleBack} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
        <button
          onClick={handleConfirm}
          className="absolute"
          style={{
            right: 22,
            top: 62,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "15px",
            color: "#888888",
          }}
        >
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 22px", paddingBottom: 110 }}>

        {/* 선택사항 칩 + 타이틀 블록 */}
        <div className="flex flex-col" style={{ gap: 12, marginTop: 18 }}>
          <div
            className="inline-flex items-center justify-center self-start"
            style={{
              height: 29,
              padding: "0 14px",
              background: "#F2F2F6",
              borderRadius: 32,
            }}
          >
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#6060A0",
              }}
            >
              선택사항
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 6 }}>
            <h1
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: "28px",
                color: "#1A1A1A",
              }}
            >
              어디서 머무시나요?
            </h1>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#555555",
              }}
            >
              숙소를 알려주시면 가까운 곳부터 코스를 짜드려요
            </p>
          </div>
        </div>

        {/* 검색바 — 세로 패딩 더 크게 */}
        <div
          onClick={focusSearch}
          className="shrink-0 flex items-center cursor-pointer"
          style={{
            marginTop: 26,
            height: 72,
            padding: "0 20px",
            gap: 12,
            background: "#F8F9FB",
            borderRadius: 12,
          }}
        >
          <Search size={22} color="#8995A2" strokeWidth={1.8} />
          <div className="flex-1 flex items-center min-w-0">
            {query ? (
              <span
                className="truncate"
                style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}
              >
                {query}
              </span>
            ) : (
              <span
                style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 500, lineHeight: "24px", color: "#8995A2" }}
              >
                호텔 이름 또는 주소
              </span>
            )}
            {isFocused && (
              <span className="ml-0.5 animate-pulse" style={{ width: 2, height: 18, background: "#2E2E70" }} />
            )}
          </div>
        </div>

        {/* 지도 — shrink-0으로 flex 부모에 의해 줄어들지 않게 고정 */}
        <div
          className="shrink-0 overflow-hidden"
          style={{
            marginTop: 13,
            width: "100%",
            height: 280,
            minHeight: 280,
            borderRadius: 12,
            background: "#B9B9C0",
          }}
        >
          <MiniMap
            center={TOKYO_CENTER}
            zoom={13}
            markers={PLACES.map((p) => ({ position: p.coords, label: `${p.name} — ${p.sub}` }))}
            height={280}
          />
        </div>

        {/* 자주 머무는 지역 */}
        <p
          style={{
            marginTop: 16,
            marginBottom: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "21px",
            color: "#333333",
          }}
        >
          자주 머무는 지역
        </p>

        {/* 카드 리스트 — 334x63 white, shadow, radius 12, gap 12 */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {(trimmed ? filtered : PLACES).map((p) => {
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className="relative flex items-center w-full text-left"
                style={{
                  height: 63,
                  background: "#FFFFFF",
                  borderRadius: 12,
                  boxShadow: "0 0 6.8px rgba(0, 0, 0, 0.08)",
                  border: active ? "1.5px solid #2E2E70" : "1.5px solid transparent",
                  padding: "0 8px",
                }}
              >
                <div className="flex items-center" style={{ gap: 8, flex: 1 }}>
                  {/* 썸네일 50x50 */}
                  <div
                    className="shrink-0 relative overflow-hidden"
                    style={{ width: 50, height: 50, background: "#B9B9C0", borderRadius: 8 }}
                  >
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="50px" />
                  </div>
                  {/* 텍스트 */}
                  <div className="flex flex-col" style={{ gap: 4 }}>
                    <span
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
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 10,
                        fontWeight: 500,
                        lineHeight: "13px",
                        color: "#555555",
                      }}
                    >
                      {p.sub}
                    </span>
                  </div>
                </div>
                {/* 우측 chevron */}
                <div className="shrink-0 flex items-center justify-center" style={{ width: 27, height: 27 }}>
                  <ChevronRight size={18} color="#A8A8A9" strokeWidth={1.8} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택 완료 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={handleConfirm}
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
          선택 완료
        </button>
      </div>
    </div>
  );
}
