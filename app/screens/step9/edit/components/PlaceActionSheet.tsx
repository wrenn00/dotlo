"use client";

export interface PlaceInfo {
  id: string;
  title: string;
  day: string;        // "1일차"
  time: string;       // "12:00"
  duration: string;   // "1시간 30분"
}

interface Props {
  open: boolean;
  place: PlaceInfo | null;
  onClose: () => void;
  onRemove: (id: string) => void;
}

// ─── 아이콘 ───────────────────────────────────────────────────────────────────

const Sparkle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 1l2.5 6 6 1-4.5 4.5 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5L1.5 8l6-1L10 1z" fill="#00E1FF" />
  </svg>
);

const Clock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="#090738" strokeWidth="1.6" />
    <path d="M10 5v5l3 2" stroke="#090738" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Calendar = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="14" rx="2" stroke="#090738" strokeWidth="1.6" />
    <path d="M2 8h16M7 2v4M13 2v4" stroke="#090738" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Info = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="#090738" strokeWidth="1.6" />
    <path d="M10 9v5M10 6v.5" stroke="#090738" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Trash = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 5h14M8 5V3h4v2M5 5l1 13h8l1-13M9 9v6M11 9v6" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path d="M1 1l5 5-5 5" stroke="#A1ADB3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── 액션 항목 ────────────────────────────────────────────────────────────────

interface ActionProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  danger?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}

function ActionRow({ icon, label, right, danger, isLast, onClick }: ActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full py-4 text-left transition-colors active:bg-gray-50"
      style={{ borderBottom: isLast ? "none" : "1px solid #DDE5E8" }}
    >
      <div className="w-7 flex items-center justify-center shrink-0">{icon}</div>
      <span
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 500,
          color: danger ? "#EF4444" : "#090738",
        }}
      >
        {label}
      </span>
      {right && <div className="shrink-0">{right}</div>}
    </button>
  );
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function PlaceActionSheet({ open, place, onClose, onRemove }: Props) {
  return (
    <>
      {/* 오버레이 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 40,
        }}
        onClick={onClose}
      />

      {/* 시트 */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "85%",
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#DDE5E8" }} />
        </div>

        {/* 헤더 (X) */}
        <div className="flex items-center justify-end px-5 pt-2 shrink-0">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="#090738" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 장소명 + 메타 */}
        <div className="px-5 pb-3 shrink-0">
          <p style={{ fontSize: 18, fontWeight: 700, color: "#090738" }}>
            {place?.title ?? ""}
          </p>
          <p style={{ fontSize: 12, color: "#7A858B", marginTop: 4 }}>
            {place ? `${place.day} ${place.time}` : ""}
          </p>
        </div>

        {/* 액션 목록 */}
        <div className="overflow-y-auto flex-1 px-5">
          <ActionRow
            icon={<Sparkle />}
            label="비슷한 장소로 교체"
            right={
              <div
                className="px-2 py-0.5 rounded-full"
                style={{ background: "#C2F5FF" }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "#00A8BF" }}>AI</span>
              </div>
            }
          />
          <ActionRow
            icon={<Clock />}
            label="머무는 시간 조정"
            right={
              <span style={{ fontSize: 12, color: "#7A858B" }}>
                {place?.duration ?? ""}
              </span>
            }
          />
          <ActionRow icon={<Calendar />} label="다른 일정으로 이동" right={<ChevronRight />} />
          <ActionRow icon={<Info />} label="상세 정보 보기" right={<ChevronRight />} />
          <ActionRow
            icon={<Trash />}
            label="일정에서 삭제"
            danger
            isLast
            onClick={() => place && onRemove(place.id)}
          />
        </div>

        {/* 완료 버튼 */}
        <div className="px-5 pb-8 pt-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full h-[50px] rounded-2xl text-base font-semibold text-white transition-opacity active:opacity-80"
            style={{ background: "#090738" }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </>
  );
}
