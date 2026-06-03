"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, ThumbsUp } from "lucide-react";

export default function Step2Page() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FFFFFF" }}>

      {/* 헤더 */}
      <div className="shrink-0" style={{ padding: "44px 14px 0" }}>
        <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChevronLeft size={24} color="#090738" strokeWidth={2} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "0 21px", paddingBottom: 24 }}>

        {/* 제목 + 부제 */}
        <div className="flex flex-col" style={{ gap: 6, marginTop: 18 }}>
          <h1
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 22,
              fontWeight: 700,
              lineHeight: "28px",
              color: "#1A1A1A",
            }}
          >
            어디를 가보고 싶으세요?
          </h1>
          <p
            style={{
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: "#888888",
              whiteSpace: "pre-line",
            }}
          >
            구글맵에 저장한 장소를 가져오면{"\n"}코스를 더 빠르게 짤 수 있어요
          </p>
        </div>

        {/* 구글맵 연동 카드 — 336x206 #FAFAFA radius 12 */}
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: 32,
            padding: "15px 21px",
            gap: 26,
            background: "#FAFAFA",
            borderRadius: 12,
          }}
        >
          {/* 상단: 구글 로고 + 텍스트 */}
          <div className="flex flex-col items-center" style={{ gap: 15 }}>
            {/* 구글맵 로고 51x51 #FFFFFF radius 10 */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 51, height: 51, background: "#FFFFFF", borderRadius: 10 }}
            >
              <Image
                src="/images/googlemap.png"
                alt="Google Maps"
                width={31}
                height={31}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col items-center" style={{ gap: 5 }}>
              <p
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "#1A1A1A",
                  textAlign: "center",
                }}
              >
                구글맵 저장 장소 가져오기
              </p>
              <p
                style={{
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "15px",
                  color: "#888888",
                  textAlign: "center",
                }}
              >
                구글 맵의 저장 장소를 모두 불러올게요
              </p>
            </div>
          </div>

          {/* 연동 버튼 — 294x44 #090738 radius 12 */}
          <button
            onClick={() => router.push("/screens/step2/loading")}
            className="w-full"
            style={{
              height: 44,
              background: "#090738",
              borderRadius: 12,
              fontFamily: '"Spoqa Han Sans Neo"',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "-0.5px",
              color: "#FFFFFF",
            }}
          >
            구글 계정 연동하기
          </button>
        </div>

        {/* 또는 구분선 + 옵션 카드 — 큰 여백 두고 아래쪽 */}
        <div style={{ marginTop: "auto", paddingTop: 60 }}>
          <div className="flex flex-col" style={{ gap: 13 }}>
            {/* 또는 디바이더 */}
            <div className="flex items-center" style={{ gap: 0 }}>
              <div style={{ flex: 1, height: 1, background: "#D8D8E9" }} />
              <span
                style={{
                  padding: "0 12px",
                  fontFamily: '"Spoqa Han Sans Neo"',
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "15px",
                  color: "#888E9C",
                }}
              >
                또는
              </span>
              <div style={{ flex: 1, height: 1, background: "#D8D8E9" }} />
            </div>

            {/* 옵션 카드 2개 — 336x70 #FAFAFA radius 12 */}
            <div className="flex flex-col" style={{ gap: 9 }}>
              {[
                {
                  Icon: Search,
                  iconBg: "#E0FBFF",
                  iconColor: "#00E1FF",
                  title: "직접 검색해서 추가하기",
                  sub: "장소 이름과 주소로 찾기",
                },
                {
                  Icon: ThumbsUp,
                  iconBg: "#FFF9C2",
                  iconColor: "#FFE400",
                  title: "오사카 인기 장소 둘러보기",
                  sub: "현지인이 자주 가는 곳 찾기",
                },
              ].map(({ Icon, iconBg, iconColor, title, sub }) => (
                <button
                  key={title}
                  onClick={() => router.push("/screens/step2/select")}
                  className="relative w-full text-left"
                  style={{ height: 70, background: "#FAFAFA", borderRadius: 12 }}
                >
                  {/* 컬러 원 아이콘 */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{ left: 13, top: 18, width: 35, height: 35, background: iconBg, borderRadius: "50%" }}
                  >
                    <Icon size={20} color={iconColor} strokeWidth={2.2} fill={iconColor === "#FFE400" ? iconColor : "transparent"} />
                  </div>
                  {/* 텍스트 */}
                  <div className="absolute flex flex-col" style={{ left: 58, top: 18, gap: 4 }}>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: "20px",
                        color: "#000000",
                      }}
                    >
                      {title}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Spoqa Han Sans Neo"',
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: "15px",
                        color: "#666C78",
                      }}
                    >
                      {sub}
                    </span>
                  </div>
                  {/* 우측 chevron */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{ right: 12, top: 22, width: 27, height: 27 }}
                  >
                    <ChevronRight size={18} color="#A8A8A9" strokeWidth={1.8} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
