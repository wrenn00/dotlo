"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

interface Props {
  code: string;
  title: string;
  summary: string;
  aiNote: string;
  bgHex: string;
  accentHex: string;
}

export default function CourseCard({ code, title, summary, aiNote, bgHex, accentHex }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="relative flex flex-col p-5 rounded-2xl" style={{ background: bgHex }}>
      {/* 상단 라인 */}
      <div className="flex items-center justify-between">
        <div className="px-2.5 py-1 rounded-full" style={{ background: "#fff" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: accentHex }}>{code}</span>
        </div>
        <button
          onClick={() => setBookmarked((b) => !b)}
          className="flex items-center justify-center transition-transform active:scale-90"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff" }}
        >
          <svg width="14" height="16" viewBox="0 0 14 16" fill={bookmarked ? accentHex : "none"}>
            <path d="M1 1h12v14l-6-3.5L1 15V1z" stroke={accentHex} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 제목 */}
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#090738",
          lineHeight: "32px",
          marginTop: 12,
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </h2>

      {/* 부제 */}
      <p style={{ fontSize: 13, color: accentHex, marginTop: 6, fontWeight: 500 }}>{summary}</p>

      {/* AI 노트 박스 */}
      <div className="flex items-start gap-2 p-3 rounded-xl mt-4" style={{ background: "rgba(255,255,255,0.6)" }}>
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 22, height: 22, borderRadius: "50%", background: accentHex }}
        >
          <Icon name="auto_awesome" size={13} fill className="text-white" />
        </div>
        <p style={{ fontSize: 12, color: "#090738", lineHeight: "18px", whiteSpace: "pre-line", flex: 1 }}>
          {aiNote}
        </p>
      </div>
    </div>
  );
}
