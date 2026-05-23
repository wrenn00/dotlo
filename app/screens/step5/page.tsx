"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── 데이터 ──────────────────────────────────────────────────────────────────

interface Item {
  id: string;
  label: string;
  icon: string;
}

const INITIAL: Item[] = [
  { id: "food",     label: "미식", icon: "🍴" },
  { id: "night",    label: "야경", icon: "🌙" },
  { id: "shopping", label: "쇼핑", icon: "🛍️" },
];

function weightLabel(rank: number) {
  if (rank === 1) return { text: "가장 중요", color: "#38C6AF" };
  if (rank === 2) return { text: "중요",     color: "#7FE0D8" };
  return             { text: "보통",         color: "#9CA3AF" };
}

// ─── 드래그 핸들 아이콘 ───────────────────────────────────────────────────────

function DragHandle() {
  return (
    <div className="grid grid-cols-2 gap-[3px] px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-[4px] h-[4px] rounded-full" style={{ background: "#CBD5E1" }} />
      ))}
    </div>
  );
}

// ─── 카드 (Overlay용 순수 뷰) ─────────────────────────────────────────────────

function CardView({ item, rank, dragging }: { item: Item; rank: number; dragging?: boolean }) {
  const { text, color } = weightLabel(rank);
  const isTop = rank === 1;

  return (
    <div
      className="flex items-center gap-3 px-4 rounded-2xl select-none"
      style={{
        height: 72,
        background: isTop ? "#F0FDFB" : "#fff",
        border: isTop ? "2px solid #38C6AF" : "1.5px solid #E5E7EB",
        boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.14)" : "none",
        transform: dragging ? "scale(1.03)" : "scale(1)",
        transition: "box-shadow 150ms, transform 150ms",
      }}
    >
      {/* 순위 */}
      <div
        className="flex items-center justify-center shrink-0 rounded-lg"
        style={{ width: 32, height: 32, background: "#38C6AF" }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{rank}</span>
      </div>

      {/* 아이콘 + 텍스트 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span style={{ fontSize: 22 }}>{item.icon}</span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{item.label}</p>
          <p style={{ fontSize: 11, fontWeight: 600, color }}>{text}</p>
        </div>
      </div>

      {/* 핸들 */}
      <DragHandle />
    </div>
  );
}

// ─── 정렬 가능한 카드 ─────────────────────────────────────────────────────────

function SortableCard({ item, rank }: { item: Item; rank: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
    >
      <CardView item={item} rank={rank} />
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function Step5Page() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.findIndex((i) => i.id === active.id);
        const newIdx = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>

      {/* 헤더 */}
      <div className="px-5 pt-12 pb-2 shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1 8.5 9 16" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 제목 */}
      <div className="px-5 pb-6 shrink-0">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", lineHeight: "32px" }}>
          뭐가 가장 중요한가요?
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>
          위로 끌어올릴수록 더 많이 반영돼요
        </p>
      </div>

      {/* 드래그 리스트 */}
      <div className="flex flex-col flex-1 overflow-y-auto px-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <SortableCard key={item.id} item={item} rank={idx + 1} />
              ))}
            </div>
          </SortableContext>

          {/* 드래그 중 floating 카드 */}
          <DragOverlay>
            {activeItem && (
              <CardView
                item={activeItem}
                rank={items.findIndex((i) => i.id === activeItem.id) + 1}
                dragging
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* 안내 박스 */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mt-5"
          style={{ background: "#F5F5F7" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.4" />
            <path d="M8 7v4M8 5.5v.5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            손가락으로 길게 눌러서 순서를 바꿔보세요
          </p>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="px-5 pb-8 pt-4 shrink-0">
        <button
          onClick={() => router.push("/screens/step6")}
          className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: "#1A1A1A" }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
