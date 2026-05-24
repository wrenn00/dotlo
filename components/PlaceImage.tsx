"use client";

import { useState } from "react";
import { usePlaceData } from "@/lib/places-data";

interface Props {
  placeName: string;
  width: number;
  height: number;
  rounded?: string;   // tailwind class, default "rounded-xl"
  className?: string; // 추가 클래스
}

/**
 * Google Places 사진을 표시. 데이터 없거나 실패 시 회색 placeholder.
 *   - 로드 전: pulse 애니메이션
 *   - 사진 없음/에러: 회색 박스
 *   - 정상: 프록시 경유 이미지
 */
export default function PlaceImage({
  placeName,
  width,
  height,
  rounded = "rounded-xl",
  className = "",
}: Props) {
  const data = usePlaceData(placeName);
  const [imgError, setImgError] = useState(false);

  // 데이터 자체가 로딩 중 (sessionStorage 미스 + API 호출 중)
  const isLoading = data === null;

  // 사진 표시 가능 여부
  const hasPhoto = !!data?.photoName && !imgError;

  if (!hasPhoto) {
    return (
      <div
        className={`shrink-0 ${rounded} ${className} ${isLoading ? "animate-pulse" : ""}`}
        style={{
          width,
          height,
          background: "#DDE5E8",
        }}
      />
    );
  }

  // 2x 해상도로 요청 (retina 대응)
  const src = `/api/places/photo?name=${encodeURIComponent(data!.photoName!)}&w=${width * 2}`;

  return (
    <div
      className={`shrink-0 overflow-hidden ${rounded} ${className}`}
      style={{ width, height, background: "#DDE5E8" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={data!.name}
        onError={() => setImgError(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
