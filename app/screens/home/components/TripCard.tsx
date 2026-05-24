"use client";

import Image from "next/image";
import Icon from "@/components/Icon";

interface TripCardProps {
  title: string;
  date: string;
  dDay: string;
  participants:
    | { type: "avatars"; count: number; label: string }
    | { type: "single"; icon: string; label: string };
  /** 썸네일 이미지 경로 — 없으면 회색 placeholder */
  image?: string;
}

export default function TripCard({ title, date, dDay, participants, image }: TripCardProps) {
  return (
    <button
      className="flex items-center gap-3 w-full p-3 text-left rounded-2xl transition-colors active:bg-cloudy-gray-50"
      style={{ background: "#fff", border: "1px solid #EEF2F4" }}
    >
      {/* 썸네일 56x56 */}
      <div
        className="shrink-0 rounded-xl relative overflow-hidden"
        style={{ width: 56, height: 56, background: "#DDE5E8" }}
      >
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        {/* 도시명 + D-day */}
        <div className="flex items-center gap-1.5">
          <span
            className="truncate"
            style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}
          >
            {title}
          </span>
          <span
            className="shrink-0 px-1.5 py-0.5 rounded-full"
            style={{ background: "#E5FBFF" }}
          >
            <span style={{ fontSize: 10, fontWeight: 600, color: "#006B7A" }}>
              {dDay}
            </span>
          </span>
        </div>

        {/* 날짜 */}
        <span style={{ fontSize: 12, color: "#7A858B" }}>{date}</span>

        {/* 동행자 */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {participants.type === "avatars" ? (
            <>
              <div className="flex -space-x-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full shrink-0"
                    style={{
                      width: 14,
                      height: 14,
                      background: i === 0 ? "#A5A5FF" : i === 1 ? "#5CE7FF" : "#A1ADB3",
                      border: "1.5px solid #fff",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 11, color: "#7A858B", marginLeft: 4 }}>
                {participants.label}
              </span>
            </>
          ) : (
            <>
              <Icon name={participants.icon} size={14} className="text-cloudy-gray-500" />
              <span style={{ fontSize: 11, color: "#7A858B" }}>{participants.label}</span>
            </>
          )}
        </div>
      </div>

      {/* 우측 화살표 */}
      <svg
        width="6"
        height="11"
        viewBox="0 0 6 11"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M1 1l4 4.5L1 10"
          stroke="#A1ADB3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
