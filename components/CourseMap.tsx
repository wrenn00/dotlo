"use client";

import { Fragment } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapCourse {
  id: string;
  color: string;
  markers: { number: number; lat: number; lng: number; name?: string; description?: string }[];
}

interface CourseMapProps {
  courses: MapCourse[];
  center: [number, number];
  zoom?: number;
  height?: string;
  showAll?: boolean;
}

// 색을 흰색과 mix해서 더 옅게 만듦. t=0이면 흰색, t=1이면 원래 색.
function tintTowardWhite(hex: string, t: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lerp = (c: number) => Math.round(c * t + 255 * (1 - t));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(lerp(r))}${toHex(lerp(g))}${toHex(lerp(b))}`;
}

// 마커 경로를 N개의 짧은 세그먼트로 쪼개서 각 세그먼트에 그라데이션 색을 할당
function gradientSegments(
  positions: [number, number][],
  color: string,
  subdivisions = 12,
): { from: [number, number]; to: [number, number]; color: string }[] {
  const result: { from: [number, number]; to: [number, number]; color: string }[] = [];
  const edges = positions.length - 1;
  if (edges <= 0) return result;
  for (let i = 0; i < edges; i++) {
    const a = positions[i];
    const b = positions[i + 1];
    for (let k = 0; k < subdivisions; k++) {
      const t1 = k / subdivisions;
      const t2 = (k + 1) / subdivisions;
      const p1: [number, number] = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
      const p2: [number, number] = [a[0] + (b[0] - a[0]) * t2, a[1] + (b[1] - a[1]) * t2];
      const globalT = (i * subdivisions + k + 0.5) / (edges * subdivisions);
      // 시작 옅음 → 끝 진함. 0.35..1.0 범위라 너무 새하얗게 시작하지는 않음.
      const shade = tintTowardWhite(color, 0.35 + globalT * 0.65);
      result.push({ from: p1, to: p2, color: shade });
    }
  }
  return result;
}

export default function CourseMap({
  courses,
  center,
  zoom = 13,
  height = "400px",
  showAll = true,
}: CourseMapProps) {
  const displayCourses = showAll ? courses : courses.slice(0, 1);

  return (
    <div style={{ height, borderRadius: 24, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {displayCourses.map((course) => {
          const positions: [number, number][] = course.markers.map((m) => [m.lat, m.lng]);
          const segs = gradientSegments(positions, course.color);
          return (
          <Fragment key={course.id}>
            {segs.map((s, i) => (
              <Polyline
                key={`${course.id}-seg-${i}`}
                positions={[s.from, s.to]}
                pathOptions={{ color: s.color, weight: 6, opacity: 0.95, lineCap: "round", lineJoin: "round" }}
              />
            ))}
            {course.markers.map((m) => (
              <CircleMarker
                key={`${course.id}-${m.number}`}
                center={[m.lat, m.lng]}
                radius={14}
                pathOptions={{ fillColor: course.color, fillOpacity: 1, color: "white", weight: 2 }}
              >
                <Tooltip permanent direction="center" className="map-marker-label">
                  {m.number}
                </Tooltip>
                {(m.name || m.description) && (
                  <Popup className="map-marker-popup" closeButton={false} maxWidth={220} offset={[0, -8]}>
                    <div style={{ fontFamily: '"Spoqa Han Sans Neo"' }}>
                      {m.name && (
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: "16px",
                            color: "#1A1A1A",
                            marginBottom: m.description ? 4 : 0,
                          }}
                        >
                          {m.name}
                        </div>
                      )}
                      {m.description && (
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            lineHeight: "15px",
                            color: "#555555",
                          }}
                        >
                          {m.description}
                        </div>
                      )}
                    </div>
                  </Popup>
                )}
              </CircleMarker>
            ))}
          </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
