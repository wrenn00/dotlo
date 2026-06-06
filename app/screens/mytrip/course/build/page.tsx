"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MapPin, Map as MapIcon, Clock, X } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

const DAY_PALETTE = [
  { bg: "#E0FBFF", dash: "#00A8BF" }, // sky
  { bg: "#EFEFFF", dash: "#6B6BCC" }, // lavender
  { bg: "#FFFCE2", dash: "#CDB800" }, // yellow
  { bg: "#F5F5F5", dash: "#888888" }, // gray
];

interface SavedCourse {
  id: number | string;
  title: string;
  hashtags: string;
  region: string;
  placeCount: number;
  hours: string;
  duration: string;
  image: string;
  category: string;
}

const LIBRARY: SavedCourse[] = [
  { id: 1, title: "아름다운 도쿄의 밤",   hashtags: "#야경 #감성 #시부야",       region: "도쿄",    placeCount: 9,  hours: "8시간",  duration: "단일 코스", image: "/images/where/dokyo.png",    category: "야경" },
  { id: 2, title: "도쿄 Flex",           hashtags: "#쇼핑 #하라주쿠 #오모테산도", region: "도쿄",    placeCount: 21, hours: "9시간",  duration: "단일 코스", image: "/images/where/dokyo.png",    category: "쇼핑" },
  { id: 3, title: "도쿄 먹방 원정대",     hashtags: "#맛집 #라멘 #스시",          region: "도쿄",    placeCount: 25, hours: "10시간", duration: "단일 코스", image: "/images/where/dokyo.png",    category: "미식" },
  { id: 4, title: "홋카이도 자연 투어",   hashtags: "#자연 #힐링 #온천",          region: "훗카이도", placeCount: 3,  hours: "3박 4일", duration: "3박 4일",   image: "/images/where/fukuoka.png",  category: "자연" },
  { id: 5, title: "푸켓 힐링 바캉스",     hashtags: "#휴식 #자연 #관광",          region: "태국",    placeCount: 16, hours: "7시간",  duration: "단일 코스", image: "/images/where/bangkok.png",  category: "자연" },
  { id: 6, title: "로마의 휴일",         hashtags: "#역사 #문화 #관광",          region: "이탈리아", placeCount: 8,  hours: "5시간",  duration: "단일 코스", image: "/images/where/paris.png",    category: "관광" },
  { id: 7, title: "상하이의 야경",       hashtags: "#야경 #감성 #와이탄",        region: "이탈리아", placeCount: 8,  hours: "6시간",  duration: "단일 코스", image: "/images/where/shanghai.png", category: "야경" },
];

// 드래그 가능한 보관함 카드
function DraggableMiniCard({ course, isOverlay = false, isAssigned = false }: { course: SavedCourse; isOverlay?: boolean; isAssigned?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${course.id}`,
    data: { course },
    disabled: isAssigned, // 이미 배치된 코스는 드래그 불가
  });
  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay || isAssigned ? {} : attributes)}
      {...(isOverlay || isAssigned ? {} : listeners)}
      className="shrink-0 relative overflow-hidden text-left select-none"
      style={{
        width: 166,
        borderRadius: 8,
        background: "#FFFFFF",
        opacity: isAssigned ? 0.35 : isDragging && !isOverlay ? 0.4 : 1,
        cursor: isAssigned ? "not-allowed" : isOverlay ? "grabbing" : "grab",
        touchAction: "none",
        boxShadow: isOverlay ? "0 10px 30px rgba(0,0,0,0.18)" : undefined,
      }}
    >
      {/* 이미지 영역 166x118 (높이 축소) */}
      <div
        className="relative"
        style={{
          width: 166,
          height: 118,
          backgroundImage: `url(${course.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0, right: 0, top: 40, height: 78,
            background:
              "linear-gradient(180deg, rgba(62,62,62,0) 0%, rgba(39,39,39,0.365) 19.71%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* 제목 — 이미지 하단 좌측 정렬 (배지 제거, mytrip 카드와 동일) */}
        <p
          className="absolute line-clamp-2"
          style={{
            left: 12,
            right: 12,
            bottom: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 15,
            fontWeight: 700,
            lineHeight: "19px",
            color: "#FAFAFA",
            textAlign: "left",
          }}
        >
          {course.title}
        </p>
      </div>

      {/* 메타 52h */}
      <div className="relative" style={{ width: 166, height: 52, background: "#F9FAFB" }}>
        <span
          className="absolute truncate"
          style={{
            left: 9, top: 9, right: 9,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "13px",
            color: "#2E2E70",
            display: "block",
          }}
        >
          {course.hashtags}
        </span>
        <div className="absolute flex items-center" style={{ left: 9, top: 29, right: 9, gap: 4 }}>
          <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
            <MapPin size={11} color="#555555" strokeWidth={1.6} />
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>{course.region}</span>
          </div>
          <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
            <MapIcon size={11} color="#555555" strokeWidth={1.6} />
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>장소 {course.placeCount}개</span>
          </div>
          <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
            <Clock size={11} color="#555555" strokeWidth={1.6} />
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#555555" }}>{course.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 일차 슬롯의 드롭 영역
function DroppableSlotInner({
  dayIndex,
  course,
  borderColor,
  onClear,
}: {
  dayIndex: number;
  course: SavedCourse | null;
  borderColor: string;
  onClear: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${dayIndex}` });

  if (course) {
    return (
      <div
        ref={setNodeRef}
        className="relative flex items-center"
        style={{
          flex: 1,
          height: 70,
          padding: "5px 10px",
          gap: 10,
          background: "#FFFFFF",
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
        }}
      >
        {/* 썸네일 59x59 */}
        <div
          className="shrink-0 relative overflow-hidden"
          style={{
            width: 59,
            height: 59,
            borderRadius: 4,
            backgroundImage: `url(${course.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* 텍스트 */}
        <div className="flex flex-col min-w-0" style={{ gap: 6, flex: 1 }}>
          <span
            className="truncate"
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "15px",
              color: "#000000",
            }}
          >
            {course.title}
          </span>
          <div className="flex items-center" style={{ gap: 4 }}>
            <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
              <MapIcon size={11} color="#888888" strokeWidth={1.6} />
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#888888" }}>
                장소 {course.placeCount}개
              </span>
            </div>
            <div className="flex items-center whitespace-nowrap" style={{ gap: 2 }}>
              <Clock size={11} color="#888888" strokeWidth={1.6} />
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, color: "#888888" }}>
                {course.hours}
              </span>
            </div>
          </div>
        </div>
        {/* X 버튼 — 드롭 해제 */}
        <button
          onClick={onClear}
          className="shrink-0 flex items-center justify-center"
          style={{ width: 22, height: 22, borderRadius: "50%", background: "#F2F2F6" }}
          aria-label="코스 비우기"
        >
          <X size={12} color="#555555" strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className="flex items-center justify-center text-center"
      style={{
        flex: 1,
        height: 70,
        background: isOver ? "rgba(255,255,255,0.7)" : "#FFFFFF",
        border: `1px dashed ${borderColor}`,
        borderRadius: 8,
        transition: "background 150ms",
      }}
    >
      <span
        className="whitespace-pre-line"
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "15px",
          color: "#888888",
        }}
      >
        {"여기에 코스를 드래그하세요\n또는 + 코스 추가"}
      </span>
    </div>
  );
}

function fmtDate(date: Date) {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const mm = String(date.getMonth() + 1);
  const dd = String(date.getDate());
  return { short: `${mm}.${dd} (${weekdays[date.getDay()]})`, weekday: weekdays[date.getDay()] };
}

function fmtRange(start: Date, end: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${["일","월","화","수","목","금","토"][d.getDay()]})`;
  return `${fmt(start)} ~ ${fmt(end)}`;
}

function CourseBuildContent() {
  const router = useRouter();
  const params = useSearchParams();

  // ?start=2026-05-18&end=2026-05-21 형태로 받기 — 없으면 기본값
  const { startDate, endDate, nights, days } = useMemo(() => {
    const startStr = params.get("start") ?? "2026-05-18";
    const endStr = params.get("end") ?? "2026-05-21";
    const s = new Date(startStr);
    const e = new Date(endStr);
    const dayCount = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
    return { startDate: s, endDate: e, nights: dayCount - 1, days: dayCount };
  }, [params]);

  const slots = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [startDate, days]);

  const [activeCat, setActiveCat] = useState("전체");
  const [assignments, setAssignments] = useState<Record<number, SavedCourse>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const draggingCourse = draggingId
    ? LIBRARY.find((c) => `lib-${c.id}` === draggingId) ?? null
    : null;
  const filtered = activeCat === "전체" ? LIBRARY : LIBRARY.filter((c) => c.category === activeCat);
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of LIBRARY) counts[c.category] = (counts[c.category] ?? 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [{ label: "전체", count: LIBRARY.length }, ...sorted.map(([label, count]) => ({ label, count }))];
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  function handleDragStart(e: DragStartEvent) {
    setDraggingId(String(e.active.id));
  }
  function handleDragEnd(e: DragEndEvent) {
    setDraggingId(null);
    const { active, over } = e;
    if (!over) return;
    const overId = String(over.id);
    if (!overId.startsWith("slot-")) return;
    const dayIdx = parseInt(overId.replace("slot-", ""), 10);
    const course = active.data.current?.course as SavedCourse | undefined;
    if (!course || Number.isNaN(dayIdx)) return;
    setAssignments((prev) => {
      // 같은 코스가 이미 다른 일차에 있으면 거기서 제거 후 새 일차에 배치 (이동)
      const next: Record<number, SavedCourse> = {};
      for (const k of Object.keys(prev)) {
        const idx = Number(k);
        if (String(prev[idx].id) === String(course.id)) continue;
        next[idx] = prev[idx];
      }
      next[dayIdx] = course;
      return next;
    });
  }
  const hasAny = Object.keys(assignments).length > 0;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>
      {/* 헤더 */}
      <div className="shrink-0 flex items-center justify-center relative" style={{ paddingTop: 50, height: 86 }}>
        <button
          onClick={() => router.back()}
          className="absolute flex items-center justify-center"
          style={{ left: 14, top: 50, width: 36, height: 36 }}
        >
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#000000",
          }}
        >
          일정 만들기
        </span>
      </div>

      {/* 본문 — 보관함 코스 (스크롤 영역, 하단 드로어 위까지) */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 280 }}>
        {/* 타이틀 */}
        <div className="flex flex-col" style={{ padding: "0 23px", marginTop: 24, gap: 6 }}>
          <h1
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 22,
              fontWeight: 700,
              lineHeight: "28px",
              color: "#1A1A1A",
              whiteSpace: "pre-line",
            }}
          >
            {"담고 싶은 코스를\n아래 날짜로 끌어내려요"}
          </h1>
          <p
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              color: "#888888",
            }}
          >
            {fmtRange(startDate, endDate)} - {nights}박 {days}일
          </p>
        </div>

        {/* 보관함의 코스 섹션 */}
        <div className="flex flex-col" style={{ padding: "0 20px", marginTop: 28, gap: 14 }}>
          <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "21px", color: "#363636" }}>
            보관함의 코스
          </span>

          {/* 카테고리 칩 */}
          <div className="flex items-center overflow-x-auto scrollbar-hide" style={{ gap: 10 }}>
            {categories.map(({ label, count }) => {
              const active = activeCat === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveCat(label)}
                  className="shrink-0 inline-flex items-center justify-center"
                  style={{
                    height: 32,
                    padding: "0 14px",
                    background: active ? "#090738" : "#F2F2F6",
                    borderRadius: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Spoqa Han Sans Neo"',
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "18px",
                      color: active ? "#FFFFFF" : "#2E2E70",
                    }}
                  >
                    {label} {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2열 그리드 카드 */}
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(2, 166px)", gap: 8, justifyContent: "center", marginTop: 4 }}
          >
            {filtered.map((c) => (
              <DraggableMiniCard
                key={c.id}
                course={c}
                isAssigned={Object.values(assignments).some((a) => String(a.id) === String(c.id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 드로어 — 일자별 코스 (sticky) */}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          background: "#FFFFFF",
          borderTop: "1px solid #E7E7E7",
          boxShadow: "0 -4px 15px rgba(0,0,0,0.08)",
          padding: "16px 20px 96px",
        }}
      >
        <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
          <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "21px", color: "#363636" }}>
            일자별 코스
          </span>
          <div
            className="inline-flex items-center justify-center"
            style={{ height: 17, padding: "0 8px", background: "#E0FBFF", borderRadius: 8 }}
          >
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#00A8BF" }}>
              {Object.keys(assignments).length}개
            </span>
          </div>
        </div>

        {/* 일차 슬롯 — 가로 스크롤 (156×114 카드) */}
        <div className="flex items-stretch overflow-x-auto scrollbar-hide" style={{ gap: 12, marginLeft: -20, paddingLeft: 20, paddingRight: 20 }}>
          {slots.map((d, idx) => {
            const palette = DAY_PALETTE[idx % DAY_PALETTE.length];
            const { short } = fmtDate(d);
            return (
              <div
                key={idx}
                className="shrink-0 relative"
                style={{
                  width: 156,
                  height: 114,
                  border: "1px solid #F3F4F6",
                  borderRadius: 14,
                  background: "#FFFFFF",
                }}
              >
                <span style={{ position: "absolute", left: 13, top: 10, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "21px", color: "#363636" }}>
                  {idx + 1}일차
                </span>
                <span style={{ position: "absolute", left: 53, top: 13, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "18px", color: "#888888" }}>
                  {short}
                </span>
                <div style={{ position: "absolute", left: 10, right: 10, bottom: 11, height: 57 }}>
                  <DroppableSlotInner
                    dayIndex={idx}
                    course={assignments[idx] ?? null}
                    borderColor={palette.dash}
                    onClear={() =>
                      setAssignments((prev) => {
                        const next = { ...prev };
                        delete next[idx];
                        return next;
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 버튼 — 비활성 회색 (sticky 위) */}
      <div
        className="absolute flex justify-center"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 22px 24px",
          background: "transparent",
        }}
      >
        <button
          disabled={!hasAny}
          onClick={() => {
            // 일차별 코스 배치 + 여행 기간을 done 화면이 읽을 수 있게 저장
            try {
              sessionStorage.setItem(
                "dotlo:final-combine",
                JSON.stringify({
                  assignments,
                  startISO: startDate.toISOString(),
                  endISO: endDate.toISOString(),
                  nights,
                  days,
                }),
              );
            } catch {
              /* sessionStorage 사용 불가 시 무시 */
            }
            router.push(`/screens/mytrip/course/loading?days=${days}`);
          }}
          className="w-full transition-opacity disabled:cursor-not-allowed"
          style={{
            height: 50,
            background: hasAny ? "#090738" : "#E0E0E0",
            borderRadius: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          이 조합으로 만들기
        </button>
      </div>
    </div>

    {/* 드래그 오버레이 */}
    <DragOverlay dropAnimation={null}>
      {draggingCourse ? <DraggableMiniCard course={draggingCourse} isOverlay /> : null}
    </DragOverlay>
    </DndContext>
  );
}

export default function CourseBuildPage() {
  return (
    <Suspense fallback={<div className="h-full" style={{ background: "#FFFFFF" }} />}>
      <CourseBuildContent />
    </Suspense>
  );
}
