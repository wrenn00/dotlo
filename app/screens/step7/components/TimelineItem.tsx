"use client";

export type IconType = "flight" | "hotel" | "food";
export type TransportType = "walk" | "train" | "car";

export interface Transport {
  type: TransportType;
  text: string;
}

export interface TimelineData {
  time: string;
  icon: IconType;
  category: string;
  duration: string;
  title: string;
  subtitle: string;
  transport?: Transport;
}

interface Props {
  data: TimelineData;
  isLast?: boolean;
}

const ICONS: Record<IconType, string> = {
  flight: "✈️",
  hotel:  "🛏️",
  food:   "🍴",
};

const TRANSPORT_ICON: Record<TransportType, string> = {
  walk:  "🚶",
  train: "🚆",
  car:   "🚗",
};

export default function TimelineItem({ data, isLast }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        {/* 좌측: 시간 + 아이콘 */}
        <div className="flex flex-col items-center shrink-0" style={{ width: 52 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
            {data.time}
          </span>
          <div
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: "50%", background: "#22D3CC" }}
          >
            <span style={{ fontSize: 18 }}>{ICONS[data.icon]}</span>
          </div>
        </div>

        {/* 우측: 카드 */}
        <div
          className="flex flex-col flex-1 p-3 rounded-2xl"
          style={{ background: "#F5F5F7" }}
        >
          <div className="flex items-center justify-between">
            <div
              className="px-2 py-0.5 rounded-full"
              style={{ background: "#CCFBF1" }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0F766E" }}>{data.category}</span>
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{data.duration}</span>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 6 }}>
            {data.title}
          </p>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* 이동 정보 */}
      {data.transport && !isLast && (
        <div className="flex items-center gap-1.5 pl-[64px] py-2">
          <span style={{ fontSize: 11 }}>{TRANSPORT_ICON[data.transport.type]}</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{data.transport.text}</span>
        </div>
      )}
    </div>
  );
}
