"use client";

import { usePathname, useRouter } from "next/navigation";

interface TabProps {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  width: number;
  onClick?: () => void;
}

function Tab({ active = false, label, icon, width, onClick }: TabProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center" style={{ width, height: 50 }}>
      <div
        className="flex items-center justify-center"
        style={{ width: 30, height: 30, color: active ? "#2E2E70" : "#BBBBBB" }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: '"Spoqa Han Sans Neo"',
          fontSize: 12,
          lineHeight: "20px",
          fontWeight: active ? 700 : 500,
          letterSpacing: "-0.5px",
          color: active ? "#2E2E70" : "#888888",
          marginTop: 1,
        }}
      >
        {label}
      </span>
    </button>
  );
}

const HomeIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor">
    <path d="M10 1l9 7v12a1 1 0 01-1 1h-4v-7H6v7H2a1 1 0 01-1-1V8l9-7z" />
  </svg>
);

const MyTripIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <circle cx="10" cy="6" r="4" />
    <path d="M2 19c0-4.42 3.58-8 8-8s8 3.58 8 8" />
  </svg>
);

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/screens/home" || pathname === "/";
  const isMyTrip = pathname.startsWith("/screens/mytrip");
  const isMe = pathname.startsWith("/screens/me");

  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{
        height: 89,
        background: "#FFFFFF",
        borderTop: "1px solid #E7E7E7",
        zIndex: 30,
      }}
    >
      <div
        className="flex items-center mx-auto"
        style={{ width: 263, height: 50, gap: 80, marginTop: 8 }}
      >
        <Tab active={isHome} label="홈" icon={<HomeIcon />} width={30} onClick={() => router.push("/screens/home")} />
        <Tab active={isMyTrip} label="마이트립" icon={<MyTripIcon />} width={43} onClick={() => router.push("/screens/mytrip")} />
        <Tab active={isMe} label="마이" icon={<UserIcon />} width={30} onClick={() => router.push("/screens/me")} />
      </div>
    </div>
  );
}
