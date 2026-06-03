"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronLeft,
  GripVertical,
  Info,
  Utensils,
  MountainSnow,
  ShoppingBag,
  Bath,
  Coffee,
  Moon,
  Cake,
  Landmark,
  BookOpen,
  Waves,
  Mountain,
  Drama,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  미식: Utensils,
  관광: MountainSnow,
  쇼핑: ShoppingBag,
  휴식: Bath,
  카페: Coffee,
  야경: Moon,
  디저트: Cake,
  박물관: Landmark,
  역사: BookOpen,
  바다: Waves,
  강변: Mountain,
  "공연·전시": Drama,
};

interface Item {
  id: string;
  label: string;
  Icon: LucideIcon;
}

const DEFAULTS: Item[] = [
  { id: "food",  label: "미식", Icon: Utensils },
  { id: "night", label: "야경", Icon: Moon },
  { id: "shop",  label: "쇼핑", Icon: ShoppingBag },
];

function weightLabel(rank: number) {
  if (rank === 1) return { text: "가장 중요", color: "#2E2E70" };
  if (rank === 2) return { text: "중요",     color: "#555555" };
  return             { text: "보통",         color: "#888888" };
}

// ─── 카드 ───────────────────────────────────────────────────────────────────

function CardView({ item, rank, dragging }: { item: Item; rank: number; dragging?: boolean }) {
  const { text, color } = weightLabel(rank);
  const isTop = rank === 1;
  const Icon = item.Icon;

  return (
    <div
      className="flex items-center select-none"
      style={{
        height: 72,
        padding: "0 16px",
        gap: 12,
        background: isTop ? "#F4F4FB" : "#FFFFFF",
        border: isTop ? "1.5px solid #D8D8E9" : "1.5px solid transparent",
        borderRadius: 12,
        boxShadow: dragging
          ? "0 8px 24px rgba(0,0,0,0.14)"
          : "0 0 6.8px rgba(0,0,0,0.08)",
        transform: dragging ? "scale(1.03)" : "scale(1)",
        transition: "box-shadow 150ms, transform 150ms",
      }}
    >
      {/* 순위 32x32 radius 8 */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: isTop ? "#2E2E70" : "#EFEFFF",
        }}
      >
        <span
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 14,
            fontWeight: 700,
            color: isTop ? "#FFFFFF" : "#2E2E70",
          }}
        >
          {rank}
        </span>
      </div>

      {/* 아이콘 + 텍스트 */}
      <div className="flex items-center flex-1 min-w-0" style={{ gap: 10 }}>
        <Icon size={22} color="#A0A0C0" strokeWidth={2} />
        <div className="flex flex-col" style={{ gap: 2 }}>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 15,
              fontWeight: 700,
              lineHeight: "20px",
              color: "#1A1A1A",
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: "14px",
              color,
            }}
          >
            {text}
          </span>
        </div>
      </div>

      {/* 드래그 핸들 */}
      <GripVertical size={20} color="#A0A0C0" strokeWidth={1.8} />
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
  const [items, setItems] = useState<Item[]>(DEFAULTS);
  const [activeId, setActiveId] = useState<string | null>(null);

  // step4에서 저장한 선택값 → items 로드
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dotlo:step4-keywords");
      if (!raw) return;
      const labels = JSON.parse(raw) as string[];
      if (!Array.isArray(labels) || labels.length === 0) return;
      const next: Item[] = labels.map((label, i) => ({
        id: `kw-${i}-${label}`,
        label,
        Icon: ICON_MAP[label] ?? Sparkles,
      }));
      setItems(next);
    } catch {
      // sessionStorage 파싱 실패 시 기본값 유지
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
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
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 제목 + 부제 */}
      <div className="shrink-0 flex flex-col" style={{ padding: "0 21px", marginTop: 49, gap: 6 }}>
        <h1
          style={{
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 22,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#1A1A1A",
          }}
        >
          뭐가 가장 중요한가요?
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
          위로 끌어올릴수록 더 많이 반영돼요
        </p>
      </div>

      {/* 드래그 리스트 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 22px", marginTop: 30 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col" style={{ gap: 11 }}>
              {items.map((item, idx) => (
                <SortableCard key={item.id} item={item} rank={idx + 1} />
              ))}
            </div>
          </SortableContext>

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

        {/* 안내 박스 — lavender bg */}
        <div
          className="flex items-center"
          style={{
            marginTop: 20,
            padding: "12px 16px",
            gap: 10,
            background: "#F4F4FB",
            borderRadius: 12,
          }}
        >
          <Info size={18} color="#A0A0C0" strokeWidth={1.8} />
          <p
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 13,
              fontWeight: 500,
              color: "#888888",
            }}
          >
            손가락으로 길게 눌러서 순서를 바꿔보세요
          </p>
        </div>
      </div>

      {/* 다음 버튼 — 330x50 #090738 radius 12 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={() => {
            sessionStorage.setItem(
              "dotlo:step5-priority",
              JSON.stringify(items.map((i) => i.label)),
            );
            router.push("/screens/step6");
          }}
          className="w-full transition-opacity active:opacity-80"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
