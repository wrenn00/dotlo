"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { courses, type CourseId } from "./courses";

// 도로 느낌의 옅은 격자 패턴 placeholder 지도
function MapBackdrop() {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#DDE5E8" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      {/* 굵은 도로 */}
      <path d="M10 60 Q120 40 200 120 T360 260" stroke="#C2CCD1" strokeWidth="6" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M60 -10 Q100 120 240 180 T300 400" stroke="#C2CCD1" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Step7ComparePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<CourseId | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="px-5 pt-12 pb-2 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#090738" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-2">

        {/* AI 배지 */}
        <div className="self-start flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "#C2F5FF" }}>
          <span style={{ fontSize: 11 }}>✨</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#00A8BF" }}>AI 추천</span>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#090738", marginTop: 10, lineHeight: "30px" }}>
          코스를 만들었어요
        </h1>
        <p style={{ fontSize: 13, color: "#7A858B", marginTop: 6, lineHeight: "20px" }}>
          3가지 스타일로 골랐어요. 선택한 코스는 수정가능해요
        </p>

        {/* 큰 지도 */}
        <div className="relative overflow-hidden rounded-3xl mt-5" style={{ height: 380, background: "#EEF2F4" }}>
          <MapBackdrop />

          {/* 연결선 — 코스별 색상 */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {courses.map((c) => (
              <polyline
                key={c.id}
                points={c.markers.map((m) => `${parseFloat(m.x)},${parseFloat(m.y)}`).join(" ")}
                fill="none"
                stroke={c.colorHex}
                strokeOpacity={selected && selected !== c.id ? 0.15 : 0.7}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 3 }}
              />
            ))}
          </svg>

          {/* 마커 */}
          {courses.flatMap((c) =>
            c.markers.map((m) => {
              const dimmed = selected && selected !== c.id;
              return (
                <div
                  key={`${c.id}-${m.number}`}
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    left: m.x,
                    top: m.y,
                    width: 30,
                    height: 30,
                    background: c.colorHex,
                    color: c.id === "C" ? "#090738" : "#fff",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 6px rgba(9,7,56,0.18)",
                    transform: "translate(-50%, -50%)",
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: dimmed ? 0.3 : 1,
                    transition: "opacity 0.2s",
                    zIndex: dimmed ? 1 : 2,
                  }}
                >
                  {m.number}
                </div>
              );
            })
          )}

          {/* 범례 */}
          <div
            className="absolute flex flex-col gap-1.5 px-3 py-2.5 rounded-xl"
            style={{ left: 12, bottom: 12, background: "#fff", boxShadow: "0 2px 8px rgba(9,7,56,0.12)" }}
          >
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.colorHex }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#090738" }}>
                  {c.id} {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3개 코스 카드 */}
        <div className="flex gap-2.5 mt-4">
          {courses.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="flex flex-col flex-1 items-start text-left p-3 rounded-2xl transition-all"
                style={{
                  background: active ? "#fff" : "#F7F9FA",
                  border: active ? `2px solid ${c.colorHex}` : "2px solid transparent",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.colorHex }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#090738" }}>{c.id}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#090738", marginTop: 6 }}>
                  {c.label}
                </span>
                <span style={{ fontSize: 11, color: "#7A858B", marginTop: 2, lineHeight: "15px" }}>
                  {c.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* 일러스트 영역 */}
        <div className="flex flex-col items-center text-center py-7">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, background: "var(--gradient-ai-glow, #E5FBFF)" }}
          >
            <span style={{ fontSize: 38 }}>🗺️</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#090738", marginTop: 12 }}>
            코스를 선택해서 비교해 보세요!
          </p>
          <p style={{ fontSize: 12, color: "#7A858B", marginTop: 4 }}>
            코스별 위치 동선을 비교하고 장소를 선정해요
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-8 pt-3 shrink-0" style={{ background: "#fff" }}>
        <button
          onClick={() => selected && router.push(`/screens/step7/detail?course=${selected}`)}
          disabled={!selected}
          className="w-full h-[52px] rounded-2xl text-base font-semibold transition-all"
          style={{
            background: selected ? "#090738" : "#DDE5E8",
            color: selected ? "#fff" : "#7A858B",
          }}
        >
          이 코스 선택하기
        </button>
      </div>
    </div>
  );
}
