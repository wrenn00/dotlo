"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

// ─── 앱 아이콘 ────────────────────────────────────────────────────────────────

interface AppIconProps {
  label: string;
  background: string;
  children: React.ReactNode;
  textColor?: string;
}

function AppIcon({ label, background, children }: AppIconProps) {
  return (
    <button className="flex flex-col items-center gap-1.5 shrink-0">
      <div
        className="flex items-center justify-center"
        style={{ width: 60, height: 60, background, borderRadius: 16 }}
      >
        {children}
      </div>
      <span style={{ fontSize: 11, color: "#090738" }}>{label}</span>
    </button>
  );
}

// 각 앱 아이콘 SVG
const AirDropIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="20" r="11" stroke="#fff" strokeWidth="1.8" />
    <circle cx="16" cy="20" r="6.5" stroke="#fff" strokeWidth="1.8" />
    <path d="M16 23l-2 2h4l-2-2z" fill="#fff" />
  </svg>
);

const MessageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M6 13c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8c-1.3 0-2.5-.2-3.6-.5L8 23l1.4-3.6C7.3 18 6 15.7 6 13z"
      fill="#fff"
    />
  </svg>
);

const KakaoIcon = () => (
  <span style={{ fontSize: 14, fontWeight: 900, color: "#090738", letterSpacing: -0.5 }}>
    TALK
  </span>
);

const MailIcon = () => (
  <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
    <rect x="2" y="2" width="28" height="18" rx="2" stroke="#fff" strokeWidth="1.8" fill="none" />
    <path d="M2 4l14 10L30 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── 액션 항목 ────────────────────────────────────────────────────────────────

interface ActionRowProps {
  label: string;
  icon: React.ReactNode;
  isLast?: boolean;
  onClick?: () => void;
}

function ActionRow({ label, icon, isLast, onClick }: ActionRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-3.5"
      style={{ borderBottom: isLast ? "none" : "1px solid #DDE5E8" }}
    >
      <span style={{ fontSize: 15, color: "#090738", fontWeight: 500 }}>{label}</span>
      <div className="text-[#090738]">{icon}</div>
    </button>
  );
}

// ─── 메인 시트 ───────────────────────────────────────────────────────────────

export default function ShareSheet({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText("https://dotlo.com/course/osaka");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("링크가 복사됐어요");
    }
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* 시트 */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          zIndex: 9999,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "75%",
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#DDE5E8" }} />
        </div>

        {/* 헤더 */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-4 shrink-0">
          {/* dotlo 아이콘 */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 52, height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #5CE7FF 0%, #00E1FF 100%)",
            }}
          >
            <div
              style={{
                width: 22, height: 22,
                background: "#fff",
                transform: "rotate(45deg)",
                borderRadius: 4,
              }}
            />
          </div>

          {/* 타이틀 */}
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 15, fontWeight: 700, color: "#090738" }}>코스 공유하기</p>
            <p style={{ fontSize: 12, color: "#7A858B", marginTop: 2 }}>dotlo.com</p>
          </div>

          {/* 닫기 */}
          <button
            onClick={onClose}
            className="flex items-center justify-center shrink-0"
            style={{ width: 30, height: 30, borderRadius: "50%", background: "#DDE5E8" }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1l-9 9" stroke="#555E63" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 구분선 */}
        <div className="h-px mx-5" style={{ background: "#DDE5E8" }} />

        {/* 앱 아이콘 그리드 */}
        <div className="flex justify-around px-3 py-5 shrink-0">
          <AppIcon label="AirDrop"  background="linear-gradient(135deg, #4DA0FF 0%, #0A84FF 100%)">
            <AirDropIcon />
          </AppIcon>
          <AppIcon label="메시지"   background="#34C759">
            <MessageIcon />
          </AppIcon>
          <AppIcon label="카카오톡" background="#FAE300">
            <KakaoIcon />
          </AppIcon>
          <AppIcon label="Mail"     background="linear-gradient(180deg, #61C2FF 0%, #0A84FF 100%)">
            <MailIcon />
          </AppIcon>
        </div>

        {/* 구분선 */}
        <div className="h-px mx-5" style={{ background: "#DDE5E8" }} />

        {/* 액션 리스트 */}
        <div className="flex flex-col px-5 overflow-y-auto">
          <ActionRow
            label={copied ? "링크가 복사됐어요" : "복사"}
            onClick={handleCopy}
            icon={
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <rect x="5" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="5" width="12" height="14" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
          <ActionRow
            label="새로운 빠른 메모"
            icon={
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path
                  d="M3 9C3 9 6 4 11 4s8 5 8 5-3 5-8 5-8-5-8-5z"
                  stroke="currentColor" strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
          <ActionRow
            label="파일에 저장"
            icon={
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path d="M3 1h12v18l-6-3-6 3V1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              </svg>
            }
          />
          <ActionRow
            label="Find on Page"
            isLast
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
          />
        </div>

        {/* 동작 편집 */}
        <div className="flex justify-center pt-4 pb-8 shrink-0">
          <button style={{ fontSize: 14, color: "#0A84FF", fontWeight: 500 }}>
            동작 편집
          </button>
        </div>
      </div>
    </>
  );
}
