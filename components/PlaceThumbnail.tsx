"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "./Icon";

interface PlaceThumbnailProps {
  src?: string;
  alt: string;
  category: string;
  size?: number;
}

const categoryIcons: Record<string, string> = {
  맛집: "restaurant",
  카페: "local_cafe",
  쇼핑: "shopping_bag",
  관광: "account_balance",
  야경: "dark_mode",
  숙소: "hotel",
};

export default function PlaceThumbnail({ src, alt, category, size = 64 }: PlaceThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // 아직 실제 이미지가 없는 placeholder(default.*)는 네트워크 요청 없이 바로 fallback
  const isPlaceholder = !src || src.includes("default");

  if (hasError || isPlaceholder) {
    return (
      <div
        className="bg-cloudy-gray-100 rounded-xl flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <Icon name={categoryIcons[category] ?? "place"} size={Math.round(size * 0.4)} className="text-cloudy-gray-400" />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-cloudy-gray-100 shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
