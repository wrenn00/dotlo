"use client";

interface TripCardProps {
  title: string;
  date: string;
  dDay: string;           // "D-7"
  /** 동행자 표시 - 아바타 3개 + "3명 함께" 또는 단일 텍스트 */
  participants:
    | { type: "avatars"; count: number; label: string }
    | { type: "single"; icon: string; label: string };
}

export default function TripCard({ title, date, dDay, participants }: TripCardProps) {
  return (
    <button
      className="flex items-center gap-3 w-full px-3 py-3 text-left rounded-2xl transition-colors active:bg-gray-50"
      style={{ background: "#fff", border: "1px solid #DDE5E8" }}
    >
      {/* 썸네일 */}
      <div
        className="shrink-0 rounded-xl"
        style={{ width: 59, height: 59, background: "#A1ADB3" }}
      />

      {/* 본문 */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, fontWeight: 600, color: "#090738" }} className="truncate">
            {title}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: "#E5FBFF" }}
          >
            <span style={{ fontSize: 10, fontWeight: 600, color: "#00E1FF" }}>{dDay}</span>
          </span>
        </div>
        <span style={{ fontSize: 10, color: "#7A858B", fontWeight: 500 }}>{date}</span>

        {/* 동행자 */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {participants.type === "avatars" ? (
            <>
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full shrink-0"
                    style={{
                      width: 17,
                      height: 17,
                      background: "#A1ADB3",
                      border: "1.5px solid #fff",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 10, color: "#7A858B", fontWeight: 500, marginLeft: 4 }}>
                {participants.label}
              </span>
            </>
          ) : (
            <>
              <div
                className="flex items-center justify-center"
                style={{ width: 15, height: 15, borderRadius: "50%", background: "#E5FBFF" }}
              >
                <span style={{ fontSize: 9 }}>{participants.icon}</span>
              </div>
              <span style={{ fontSize: 10, color: "#7A858B", fontWeight: 500 }}>
                {participants.label}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 우측 화살표 */}
      <svg width="7" height="13" viewBox="0 0 7 13" fill="none" className="shrink-0">
        <path
          d="M1 1l5 5.5L1 12"
          stroke="#A1ADB3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
