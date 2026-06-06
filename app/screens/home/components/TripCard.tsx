"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface TripCardProps {
  title: string;
  date: string;
  dDay: string;
  participants:
    | { type: "avatars"; count: number; label: string }
    | { type: "single"; icon?: string; label: string };
  image?: string;
}


export default function TripCard({ title, date, dDay, participants, image }: TripCardProps) {
  return (
    <button
      className="flex items-center w-full text-left"
      style={{
        width: "100%",
        height: 80,
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 0 6.8px rgba(0, 0, 0, 0.08)",
        padding: "0 11px",
      }}
    >
      {/* 좌측: 썸네일 + 텍스트 (gap 10) */}
      <div className="flex items-center" style={{ gap: 10, flex: 1, minWidth: 0 }}>
        {/* 썸네일 59×59 #B8BCC3 radius 8 */}
        <div
          className="shrink-0 relative overflow-hidden"
          style={{ width: 59, height: 59, background: "#B8BCC3", borderRadius: 8 }}
        >
          {image && <Image src={image} alt={title} fill className="object-cover" sizes="59px" />}
        </div>

        {/* 텍스트 블록 */}
        <div className="flex flex-col min-w-0" style={{ width: 119, height: 55 }}>
          {/* 상단 35px (gap 4): 제목+D-day 행 + 날짜 행 */}
          <div className="flex flex-col" style={{ gap: 4, height: 35 }}>
            {/* 제목 + D-day 배지 (gap 4) */}
            <div className="flex items-center" style={{ gap: 4, height: 18 }}>
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
                {title}
              </span>
              <span
                className="shrink-0 inline-flex items-center justify-center"
                style={{
                  padding: "0 6px",
                  height: 16,
                  background: "#EFEFFF",
                  borderRadius: 8,
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: "13px",
                  color: "#6B6BCC",
                }}
              >
                {dDay}
              </span>
            </div>
            {/* 날짜 */}
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 10,
                fontWeight: 500,
                lineHeight: "13px",
                color: "#888888",
              }}
            >
              {date}
            </span>
          </div>

          {/* 하단 20px: 동행자 */}
          <div className="flex items-center" style={{ gap: 4, height: 20, marginTop: 0 }}>
            {participants.type === "avatars" ? (
              <div className="flex items-center">
                {/* 프로필 3장 — 20x20 원형, 6px 겹침 */}
                <div className="flex items-center" style={{ height: 20 }}>
                  {[1, 2, 3].map((n, i) => (
                    <div
                      key={n}
                      className="relative shrink-0 overflow-hidden"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "1.5px solid #FFFFFF",
                        background: "#F2F2F6",
                        marginLeft: i === 0 ? 0 : -6,
                        zIndex: 3 - i,
                      }}
                    >
                      <Image
                        src={`/images/profile${n}.png`}
                        alt=""
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: "13px",
                    color: "#555555",
                  }}
                >
                  {participants.label}
                </span>
              </div>
            ) : (
              <>
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{
                    width: 20,
                    height: 20,
                    background: "#F2F2F6",
                    border: "1.5px solid #FFFFFF",
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src="/images/profile4.png"
                    alt=""
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </div>
                <span
                  style={{
                    fontFamily: '"Spoqa Han Sans Neo"',
                    fontSize: 10,
                    fontWeight: 500,
                    lineHeight: "13px",
                    color: "#555555",
                  }}
                >
                  {participants.label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 우측 chevron */}
      <div className="shrink-0 flex items-center justify-center" style={{ width: 27, height: 27 }}>
        <ChevronRight size={16} color="#888888" strokeWidth={1.8} />
      </div>
    </button>
  );
}
