"use client";

import { Fragment } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapCourse {
  id: string;
  color: string;
  markers: { number: number; lat: number; lng: number; name?: string }[];
}

interface CourseMapProps {
  courses: MapCourse[];
  center: [number, number];
  zoom?: number;
  height?: string;
  showAll?: boolean;
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

        {displayCourses.map((course) => (
          <Fragment key={course.id}>
            <Polyline
              positions={course.markers.map((m) => [m.lat, m.lng])}
              pathOptions={{ color: course.color, weight: 3, opacity: 0.7, dashArray: "4 8" }}
            />
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
              </CircleMarker>
            ))}
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
