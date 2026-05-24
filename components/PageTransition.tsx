"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getStepNumber(path: string): number | null {
  const m = path.match(/\/screens\/step(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function isHome(path: string): boolean {
  // 라우트 구조상 홈은 /screens/home; '/'도 안전하게 포함
  return path === "/" || path === "/screens/home";
}

interface NavContext {
  type: "horizontal" | "vertical";
  direction: "forward" | "backward";
}

// AnimatePresence의 custom으로 흘러들어 enter/exit 모두 최신 NavContext를 사용
const variants: Variants = {
  initial: (ctx: NavContext) => {
    if (ctx.type === "horizontal") {
      return { x: ctx.direction === "forward" ? "100%" : "-100%", opacity: 0 };
    }
    // vertical: 모달처럼 앞으로 갈 때만 아래에서 슬라이드업
    return ctx.direction === "forward"
      ? { y: "100%", opacity: 0 }
      : { y: 0, opacity: 1 };
  },
  animate: { x: 0, y: 0, opacity: 1 },
  exit: (ctx: NavContext) => {
    if (ctx.type === "horizontal") {
      return { x: ctx.direction === "forward" ? "-100%" : "100%", opacity: 0 };
    }
    // vertical: 뒤로 갈 때만 아래로 슬라이드다운
    return ctx.direction === "backward"
      ? { y: "100%", opacity: 0 }
      : { y: 0, opacity: 1 };
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevRef = useRef<string>(pathname);

  // 렌더 시점에 prev→current로 방향/타입 계산 (effect 전이라 prevRef는 아직 OLD)
  const prev = prevRef.current;
  const prevStep = getStepNumber(prev);
  const currStep = getStepNumber(pathname);

  let type: NavContext["type"] = "vertical";
  let direction: NavContext["direction"] = "forward";

  if (prevStep !== null && currStep !== null) {
    type = "horizontal";
    direction = currStep > prevStep ? "forward" : "backward";
  } else if (isHome(prev) && currStep !== null) {
    direction = "forward";
  } else if (prevStep !== null && isHome(pathname)) {
    direction = "backward";
  }

  // 페인트 후 prevRef 동기화
  useEffect(() => {
    prevRef.current = pathname;
  }, [pathname]);

  const context: NavContext = { type, direction };

  const transition =
    type === "horizontal"
      ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
      : { duration: 0.4, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] };

  return (
    <AnimatePresence mode="wait" initial={false} custom={context}>
      <motion.div
        key={pathname}
        custom={context}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        style={{ position: "absolute", inset: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
