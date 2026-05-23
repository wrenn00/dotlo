"use client";

import { useEffect, useState } from "react";

export default function TouchCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 터치 디바이스에서는 숨김
    const isTouchDevice =
      "ontouchstart" in window ||
      (navigator.maxTouchPoints ?? 0) > 0 ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let scheduled = false;

    const flush = () => {
      setPosition({ x: pendingX, y: pendingY });
      scheduled = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(flush);
      }
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : 1})`,
        width: 40,
        height: 40,
        borderRadius: "50%",
        // 흰 배경/어두운 배경 모두에서 보이도록 약간 회색 톤 + 진한 테두리
        background: "rgba(150, 150, 160, 0.18)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1.5px solid rgba(255, 255, 255, 0.7)",
        boxShadow:
          "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "transform 0.12s ease-out, opacity 0.2s",
        willChange: "transform, left, top",
      }}
    />
  );
}
