"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Plane, User } from "lucide-react";

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

const HomeIcon = ({ active }: { active: boolean }) => (
  <Home size={22} color={active ? "#2E2E70" : "#BBBBBB"} fill={active ? "#2E2E70" : "transparent"} strokeWidth={active ? 0 : 1.8} />
);

const MyTripIcon = ({ active }: { active: boolean }) => (
  <Plane size={22} color={active ? "#2E2E70" : "#BBBBBB"} fill={active ? "#2E2E70" : "transparent"} strokeWidth={active ? 0 : 1.8} />
);

const UserIcon = ({ active }: { active: boolean }) => (
  <User size={22} color={active ? "#2E2E70" : "#BBBBBB"} fill={active ? "#2E2E70" : "transparent"} strokeWidth={active ? 0 : 1.8} />
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
        <Tab active={isHome} label="홈" icon={<HomeIcon active={isHome} />} width={30} onClick={() => router.push("/screens/home")} />
        <Tab active={isMyTrip} label="마이트립" icon={<MyTripIcon active={isMyTrip} />} width={43} onClick={() => router.push("/screens/mytrip")} />
        <Tab active={isMe} label="마이" icon={<UserIcon active={isMe} />} width={30} onClick={() => router.push("/screens/me")} />
      </div>
    </div>
  );
}
