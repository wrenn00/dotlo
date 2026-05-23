"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card } from "@/components/shared/Card";

// ─── 유효성 검사 ──────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(v: string): string {
  if (!v) return "";
  return EMAIL_RE.test(v) ? "" : "올바른 이메일 형식이 아닙니다.";
}

// ─── 흔들림 애니메이션 variants ───────────────────────────────────────────────

const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0] as number[],
    transition: { duration: 0.45, ease: "easeInOut" as const },
  },
};

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [shakeKey, setShakeKey] = useState(0); // key 변경으로 애니메이션 재트리거
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 실시간 검증
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setEmail(val);
      setEmailError(validateEmail(val));
      setServerError("");
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setServerError("");
    },
    []
  );

  // 버튼 활성화 조건: 두 필드 입력 + 이메일 에러 없음
  const isReady =
    email.trim().length > 0 &&
    password.length > 0 &&
    emailError === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady || isLoading) return;

    setIsLoading(true);
    setServerError("");

    try {
      // TODO: 실제 인증 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = password.length >= 6; // 임시 조건

      if (success) {
        router.push("/home");
      } else {
        setServerError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setShakeKey((k) => k + 1); // 흔들림 트리거
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#f4f4f5" }}
    >
      <Card className="w-full max-w-sm px-6 py-8">
        {/* 타이틀 */}
        <div className="mb-8 text-center">
          <h1
            className="text-[30px] font-bold leading-tight"
            style={{ color: "#000000" }}
          >
            로그인
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
            계정에 로그인하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* 이메일 */}
          <Input
            label="이메일"
            type="email"
            placeholder="hello@example.com"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
          />

          {/* 비밀번호 — 실패 시 흔들림 */}
          <motion.div
            key={shakeKey}
            variants={shakeVariants}
            initial="idle"
            animate={shakeKey > 0 ? "shake" : "idle"}
          >
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={serverError}
            />
          </motion.div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            disabled={!isReady || isLoading}
            className="mt-2 w-full py-3 text-base font-semibold transition-opacity disabled:opacity-40"
          >
            {isLoading ? "로그인 중…" : "로그인"}
          </Button>
        </form>

        {/* 하단 링크 */}
        <p className="mt-6 text-center text-sm" style={{ color: "#71717a" }}>
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="font-semibold underline-offset-2 hover:underline"
            style={{ color: "#6366f1" }}
          >
            회원가입
          </a>
        </p>
      </Card>
    </main>
  );
}
