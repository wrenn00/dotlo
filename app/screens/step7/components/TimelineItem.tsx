"use client";

import PlaceImage from "@/components/PlaceImage";
import { usePlaceData } from "@/lib/places-data";
import { getCategoryColor } from "./categoryColors";
import Icon from "@/components/Icon";

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
  flight: "flight",
  hotel:  "hotel",
  food:   "restaurant",
};

const TRANSPORT_ICON: Record<TransportType, string> = {
  walk:  "directions_walk",
  train: "directions_train",
  car:   "directions_car",
};

export default function TimelineItem({ data, isLast }: Props) {
  const real = usePlaceData(data.title);
  const hasPhoto = !!real?.photoName;
  const c = getCategoryColor(data.category);

  return (
    <div className="flex flex-col">
      <div className="flex gap-3">
        {/* 좌측: 시간 + 아이콘 */}
        <div className="flex flex-col items-center shrink-0" style={{ width: 52 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#555E63", marginBottom: 6 }}>
            {data.time}
          </span>
          <div
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: "50%", background: "#00E1FF" }}
          >
            <Icon name={ICONS[data.icon]} size={22} className="text-white" />
          </div>
        </div>

        {/* 우측: 카드 */}
        <div
          className="flex flex-1 items-stretch gap-3 p-3 rounded-2xl"
          style={{ background: "#F7F9FA" }}
        >
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="px-2 py-0.5 rounded-full" style={{ background: c.bg }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.text }}>
                  {data.category}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#7A858B" }}>{data.duration}</span>
            </div>
            <p
              className="truncate"
              style={{ fontSize: 15, fontWeight: 700, color: "#090738", marginTop: 6 }}
            >
              {data.title}
            </p>
            <p className="truncate" style={{ fontSize: 12, color: "#7A858B", marginTop: 2 }}>
              {data.subtitle}
            </p>
          </div>
          {hasPhoto && (
            <PlaceImage placeName={data.title} width={56} height={56} rounded="rounded-lg" />
          )}
        </div>
      </div>

      {/* 이동 정보 */}
      {data.transport && !isLast && (
        <div className="flex items-center gap-1.5 pl-[64px] py-2">
          <Icon name={TRANSPORT_ICON[data.transport.type]} size={15} className="text-cloudy-gray-500" />
          <span style={{ fontSize: 11, color: "#7A858B" }}>{data.transport.text}</span>
        </div>
      )}
    </div>
  );
}
