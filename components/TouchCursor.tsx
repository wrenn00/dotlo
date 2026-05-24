"use client";

import { useEffect, useRef, useState } from "react";

const DRAG_THRESHOLD = 5; // px — 이 이상 움직이면 드래그로 판정

function getScrollableParent(el: Element | null): Element | null {
  if (!el || el === document.body || el === document.documentElement) {
    return document.scrollingElement ?? document.documentElement;
  }
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const isScrollable =
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight > el.clientHeight;
  if (isScrollable) return el;
  return getScrollableParent(el.parentElement);
}

export default function TouchCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 드래그 상태 (리렌더 불필요 → ref)
  const dragRef = useRef({
    startY: 0,
    startScrollTop: 0,
    target: null as Element | null,
    moved: false,
  });

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints ?? 0) > 0 ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    // ── rAF 기반 좌표 동기화 ──
    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let scheduled = false;
    const flush = () => {
      setPosition({ x: pendingX, y: pendingY });
      scheduled = false;
    };

    // ── 이벤트 핸들러 ──
    const onMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(flush);
      }

      // 드래그 처리
      const d = dragRef.current;
      if (d.target) {
        const deltaY = d.startY - e.clientY;
        if (!d.moved && Math.abs(deltaY) >= DRAG_THRESHOLD) {
          d.moved = true;
          setIsDragging(true);
          document.body.classList.add("dragging-scroll");
        }
        if (d.moved) {
          d.target.scrollTop = d.startScrollTop + deltaY;
          // 텍스트 선택 방지
          e.preventDefault();
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsPressed(true);
      const target = getScrollableParent(e.target as Element);
      dragRef.current = {
        startY: e.clientY,
        startScrollTop: target?.scrollTop ?? 0,
        target,
        moved: false,
      };
    };

    const onMouseUp = () => {
      setIsPressed(false);
      const wasDragging = dragRef.current.moved;
      setIsDragging(false);
      document.body.classList.remove("dragging-scroll");
      dragRef.current = { startY: 0, startScrollTop: 0, target: null, moved: false };

      // 드래그였다면 다음 click 이벤트 한 번 무시 (의도치 않은 버튼 클릭 방지)
      if (wasDragging) {
        const swallow = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        window.addEventListener("click", swallow, { capture: true, once: true });
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.body.classList.remove("dragging-scroll");
    };
  }, []);

  if (!isVisible) return null;

  const scale = isPressed || isDragging ? 0.85 : 1;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(150, 150, 160, 0.18)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1.5px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
        pointerEvents: "none",
        zIndex: 10000,
        transition: "transform 0.12s ease-out, opacity 0.2s",
        willChange: "transform, left, top",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 드래그 중 양방향 화살표 */}
      {isDragging && (
        <svg
          width="10" height="14" viewBox="0 0 10 14" fill="none"
          style={{ opacity: 0.85 }}
        >
          <path d="M5 1L2 4h6L5 1z" fill="#090738" />
          <path d="M5 13l3-3H2l3 3z" fill="#090738" />
        </svg>
      )}
    </div>
  );
}
