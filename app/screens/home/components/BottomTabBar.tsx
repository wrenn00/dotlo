"use client";

interface TabProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
}

function Tab({ active, label, icon }: TabProps) {
  const color = active ? "#00E1FF" : "#A1ADB3";
  const textColor = active ? "#00E1FF" : "#7A858B";
  return (
    <button className="flex flex-col items-center gap-0.5 flex-1 py-1.5">
      <div style={{ color }}>{icon}</div>
      <span
        style={{
          fontSize: 11,
          fontWeight: active ? 700 : 500,
          color: textColor,
        }}
      >
        {label}
      </span>
    </button>
  );
}

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M2 9l9-7 9 7v11a1 1 0 01-1 1h-4v-7H8v7H3a1 1 0 01-1-1V9z"
      fill="currentColor"
    />
  </svg>
);

const MyTripIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M3 9l16-6-6 16-3-7-7-3z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path
      d="M3 19c0-3.87 3.13-7 7-7s7 3.13 7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function BottomTabBar() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-around items-start pt-2 pb-5"
      style={{
        background: "#fff",
        borderTop: "1px solid #EEF2F4",
        zIndex: 30,
      }}
    >
      <Tab active label="홈" icon={<HomeIcon />} />
      <Tab active={false} label="마이트립" icon={<MyTripIcon />} />
      <Tab active={false} label="마이" icon={<UserIcon />} />
    </div>
  );
}
