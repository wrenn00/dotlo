"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Car, TrainFront, HelpCircle, Check } from "lucide-react";

type OptionKey = "rent" | "transit" | "later";

interface RentOption {
  key: OptionKey;
  Icon: typeof Car;
  title: string;
  description: string;
}

const OPTIONS: RentOption[] = [
  {
    key: "rent",
    Icon: Car,
    title: "렌트해요",
    description: "먼 곳도 자유롭게 다닐 수 있게\n코스를 짜드려요",
  },
  {
    key: "transit",
    Icon: TrainFront,
    title: "대중교통으로 다닐게요",
    description: "지하철 버스 동선에 맞춰 도심 위주로\n짜드려요",
  },
  {
    key: "later",
    Icon: HelpCircle,
    title: "아직 정하지 않았어요",
    description: "기본값(대중교통)으로 코스를 만들고 나중에\n바꿀 수 있어요",
  },
];

export default function RentcarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<OptionKey>("rent");

  function handleBack() {
    router.back();
  }
  function handleConfirm() {
    router.push("/screens/step1");
  }

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0", position: "relative" }}>
        <button onClick={handleBack} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#373C3E" strokeWidth={2} />
        </button>
        <button
          onClick={handleConfirm}
          className="absolute"
          style={{
            right: 22,
            top: 62,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "15px",
            color: "#888888",
          }}
        >
          건너뛰기
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px", paddingBottom: 110 }}>

        {/* 선택사항 칩 + 타이틀 */}
        <div className="flex flex-col" style={{ gap: 12, marginTop: 18 }}>
          <div
            className="inline-flex items-center justify-center self-start"
            style={{
              height: 29,
              padding: "0 14px",
              background: "#F2F2F6",
              borderRadius: 32,
            }}
          >
            <span
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#6060A0",
              }}
            >
              선택사항
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 6 }}>
            <h1
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: "28px",
                color: "#1A1A1A",
              }}
            >
              차 빌려서 다니실 건가요?
            </h1>
            <p
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "#555555",
              }}
            >
              이동 방식에 따라 동선과 코스가 달라져요
            </p>
          </div>
        </div>

        {/* 옵션 카드 3개 */}
        <div className="flex flex-col" style={{ gap: 14, marginTop: 16 }}>
          {OPTIONS.map((opt) => {
            const active = selected === opt.key;
            const Icon = opt.Icon;
            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                className="relative w-full text-left"
                style={{
                  height: 94,
                  background: "#FAFAFA",
                  border: active ? "2px solid #D8D8E9" : "2px solid transparent",
                  borderRadius: 12,
                }}
              >
                {/* 좌측: 원 + 텍스트 */}
                <div className="absolute flex items-center" style={{ left: 13, top: 19, gap: 11, right: 50 }}>
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: 35, height: 35, background: "#F2F2F6", borderRadius: "50%" }}
                  >
                    <Icon size={20} color="#2E2E70" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col" style={{ gap: 4, flex: 1 }}>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: "20px",
                        color: "#1A1A1A",
                      }}
                    >
                      {opt.title}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: "16px",
                        color: "#555555",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {opt.description}
                    </span>
                  </div>
                </div>

                {/* 우측 선택 표시 */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{ right: 12, top: "calc(50% - 14px)", width: 28, height: 28 }}
                >
                  {active ? (
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 28, height: 28, background: "#2E2E70", borderRadius: "50%" }}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        background: "#F2F2F6",
                        border: "1px solid #D8D8E9",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택 완료 */}
      <div className="shrink-0 flex justify-center" style={{ padding: "0 22px 31px" }}>
        <button
          onClick={handleConfirm}
          className="w-full"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}
