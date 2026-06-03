"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ─── 기본 마커 아이콘 fix (Leaflet/Webpack 호환 이슈) ────────────────────────
// 빌드 시 base64로 인라인되지 않게 CDN 경로로 강제 지정
type IconDefault = L.Icon.Default & { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface MapMarker {
  position: [number, number]; // [lat, lng]
  label?: string;
}

interface Props {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string | number;
  scrollWheelZoom?: boolean;
  className?: string;
}

export default function MiniMap({
  center = [34.6687, 135.5026], // 오사카 도톤보리
  zoom = 13,
  markers = [],
  height = 200,
  scrollWheelZoom = false,
  className = "",
}: Props) {
  return (
    <div
      className={className}
      style={{
        height,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
      >
        {/* CartoDB Voyager — Google Maps 유사 스타일 (도로·랜드마크 강조, 깔끔한 톤) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
