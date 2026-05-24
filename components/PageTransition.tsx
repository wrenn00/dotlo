"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // STEP 흐름은 더 쫀득한 슬라이드업, 그 외(홈 등)는 가벼운 페이드+슬라이드
  const isStep = pathname.startsWith("/screens/step");
  const variant = isStep
    ? {
        initial: { y: "50%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "20%", opacity: 0 },
      }
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 20, opacity: 0 },
      };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
