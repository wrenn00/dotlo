"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaceActionSheet, { type PlaceInfo } from "./components/PlaceActionSheet";
import { getCategoryColor } from "../../step7/components/categoryColors";

// ─── 타입 / 데이터 ────────────────────────────────────────────────────────────

interface ScheduleItem {
  id: string;
  time: string;
  duration: string;
  title: string;
  category: string;
}

const DAYS = ["1일차", "2일차", "3일차", "4일차"];

const INITIAL: Record<string, ScheduleItem[]> = {
  "1일차": [
    { id: "1", time: "10:00", duration: "1시간 30분", title: "센소지 절",            category: "관광" },
    { id: "2", time: "12:00", duration: "1시간",     title: "이치란 라멘 우에노점", category: "맛집" },
    { id: "3", time: "14:00", duration: "1시간 30분", title: "블루보틀 카페",        category: "카페" },
    { id: "4", time: "18:00", duration: "1시간",     title: "도쿄 스카이 트리",     category: "관광" },
  ],
  "2일차": [],
  "3일차": [],
  "4일차": [],
};

// ─── 드래그 핸들 아이콘 ───────────────────────────────────────────────────────

function DragHandle() {
  return (
    <div className="grid grid-cols-2 gap-[3px] shrink-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-[3px] h-[3px] rounded-full" style={{ background: "#7A858B" }} />
      ))}
    </div>
  );
}

// ─── 정렬 카드 ────────────────────────────────────────────────────────────────

interface CardProps {
  item: ScheduleItem;
  highlighted: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableCard({ item, highlighted, onSelect, onRemove }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div
        onClick={onSelect}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
        style={{
          background: highlighted ? "#C2F5FF" : "#F7F9FA",
          border: highlighted ? "2px solid #00E1FF" : "2px solid transparent",
          cursor: "pointer",
        }}
      >
        {/* 드래그 핸들 */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="px-1 py-2"
          style={{ touchAction: "none", cursor: "grab" }}
        >
          <DragHandle />
        </div>

        {/* 시간 영역 */}
        <div className="flex flex-col items-center shrink-0" style={{ width: 50 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#090738" }}>{item.time}</span>
          <span style={{ fontSize: 10, color: "#7A858B", marginTop: 2 }}>{item.duration}</span>
        </div>

        {/* 본문 */}
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 14, fontWeight: 700, color: "#090738" }} className="truncate">
            {item.title}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {(() => {
              const c = getCategoryColor(item.category);
              return (
                <div className="px-1.5 py-0.5 rounded-full" style={{ background: c.bg }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: c.text }}>
                    {item.category}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 우측 액션: 강조 시 X, 평소 ⋯ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            highlighted ? onRemove() : onSelect();
          }}
          className="w-7 h-7 flex items-center justify-center shrink-0"
        >
          {highlighted ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="#090738" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="4" viewBox="0 0 14 4" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="#7A858B" />
              <circle cx="7" cy="2" r="1.5" fill="#7A858B" />
              <circle cx="12" cy="2" r="1.5" fill="#7A858B" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function Step9EditPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState("1일차");
  const [schedule, setSchedule] = useState<Record<string, ScheduleItem[]>>(INITIAL);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const items = schedule[selectedDay] ?? [];

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setSchedule((prev) => {
        const arr = prev[selectedDay] ?? [];
        const oldIdx = arr.findIndex((i) => i.id === active.id);
        const newIdx = arr.findIndex((i) => i.id === over.id);
        return { ...prev, [selectedDay]: arrayMove(arr, oldIdx, newIdx) };
      });
    }
  }

  function handleSelect(id: string) {
    setHighlightedId(id);
    setSelectedPlaceId(id);
  }

  function handleCloseSheet() {
    setSelectedPlaceId(null);
    setHighlightedId(null);
  }

  function handleRemove(id: string) {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] ?? []).filter((i) => i.id !== id),
    }));
    setHighlightedId(null);
    setSelectedPlaceId(null);
  }

  // 시트에 전달할 정보
  const selectedPlace: PlaceInfo | null = (() => {
    if (!selectedPlaceId) return null;
    const found = items.find((i) => i.id === selectedPlaceId);
    if (!found) return null;
    return {
      id: found.id,
      title: found.title,
      day: selectedDay,
      time: found.time,
      duration: found.duration,
    };
  })();

  function handleReset() {
    setSchedule(INITIAL);
    setHighlightedId("2");
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#090738" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#090738" }}>코스 수정</span>
        <button onClick={handleReset} style={{ fontSize: 13, color: "#7A858B", fontWeight: 500 }}>
          초기화
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto px-5 pb-2">

        {/* 일차 탭 */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {DAYS.map((d) => {
            const active = selectedDay === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className="shrink-0 px-4 py-2 rounded-full transition-colors"
                style={{
                  background: active ? "#090738" : "transparent",
                  color: active ? "#fff" : "#7A858B",
                  border: active ? "none" : "1px solid #DDE5E8",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{d}</span>
              </button>
            );
          })}
        </div>

        {/* 일차 헤더 */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <span style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}>
            {selectedDay} · {items.length}곳
          </span>
          <span style={{ fontSize: 11, color: "#7A858B" }}>ⓘ 드래그로 순서 변경</span>
        </div>

        {/* 드래그 가능한 일정 리스트 */}
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ fontSize: 13, color: "#A1ADB3" }}>일정이 없습니다</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <SortableCard
                    key={item.id}
                    item={item}
                    highlighted={highlightedId === item.id}
                    onSelect={() => handleSelect(item.id)}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* 장소 직접 추가 버튼 */}
        <button
          onClick={() => router.push("/screens/step9/edit/add")}
          className="flex items-center justify-center gap-2 mt-3 py-4 rounded-2xl transition-colors"
          style={{ border: "2px dashed #A1ADB3", background: "transparent" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="#7A858B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#7A858B" }}>장소 직접 추가</span>
        </button>

        {/* AI 수정 옵션 칩 */}
        <div className="flex gap-2 mt-5">
          {["덜 빽빽하게", "카페 추가"].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors"
              style={{ background: "#C2F5FF" }}
            >
              <span style={{ fontSize: 12 }}>✨</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#00A8BF" }}>{label}</span>
            </button>
          ))}
        </div>

        {/* AI 입력 바 */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full mt-3"
          style={{ background: "#F7F9FA" }}
        >
          <span style={{ fontSize: 14 }}>✨</span>
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#090738" }}
            placeholder="AI에게 수정 요청"
          />
          <button
            className="flex items-center justify-center shrink-0"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#00E1FF",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 11V2M2 6l4-4 4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 수정 완료 버튼 */}
      <div className="px-5 pb-8 pt-3 shrink-0" style={{ background: "#fff" }}>
        <button
          onClick={() => router.push("/screens/step9")}
          className="w-full h-[52px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#090738" }}
        >
          수정 완료
        </button>
      </div>

      {/* 장소 액션 바텀시트 (Frame 500) */}
      <PlaceActionSheet
        open={!!selectedPlaceId}
        place={selectedPlace}
        onClose={handleCloseSheet}
        onRemove={handleRemove}
      />
    </div>
  );
}
