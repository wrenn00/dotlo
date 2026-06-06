"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ChevronLeft, Share2, Bookmark, Sparkles, MapPin, Footprints, Route, Wallet,
  Pencil, Star,
} from "lucide-react";
import PlaceThumbnail from "@/components/PlaceThumbnail";

const CourseMap = dynamic(() => import("@/components/CourseMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full" style={{ background: "#EFEFFF" }} />,
});

// 야경 코스 마커 (B코스에서 가져온 도쿄 야경 명소)
const MARKERS = [
  { number: 1, lat: 35.6586, lng: 139.7454, name: "도쿄타워" },
  { number: 2, lat: 35.6694, lng: 139.7,    name: "롯폰기 힐스" },
  { number: 3, lat: 35.6595, lng: 139.7004, name: "시부야 스카이" },
  { number: 4, lat: 35.6938, lng: 139.7036, name: "신주쿠 전망대" },
  { number: 5, lat: 35.71,   lng: 139.8107, name: "스카이트리" },
  { number: 6, lat: 35.6284, lng: 139.7387, name: "오다이바" },
];

// 일정 카드 데이터
const SCHEDULE = [
  { time: "18:00", title: "시부야 스카이",       region: "도쿄·시부야",   category: "야경", rating: 4.6, reviews: 24300, description: "360도 파노라마 야경 명소",         image: "/images/location/save/Shibuya Sky.png",            next: "도보 10분 · 800m" },
  { time: "19:30", title: "롯폰기 힐스 모리타워",  region: "도쿄·롯폰기",   category: "야경", rating: 4.5, reviews: 24800, description: "미술관과 전망대를 한번에",           image: "/images/location/save/Roppongi Hills Mori Tower.png", next: "지하철 15분 · 4km" },
  { time: "21:00", title: "도쿄 타워 메인 데크",   region: "도쿄·미나토",   category: "야경", rating: 4.4, reviews: 78000, description: "도쿄의 상징, 150m 전망대",           image: "/images/location/save/Tokyo Tower Main Deck.png",  next: "도보 6분 · 500m" },
  { time: "22:30", title: "레인보우 브릿지 산책로", region: "도쿄·미나토",   category: "야경", rating: 4.3, reviews: 9200,  description: "도보로 건너는 야경 명소",            image: "/images/location/save/Rainbow Bridge Promenade.png" },
];

// 통계 4개 (좌측 아이콘 + 라벨/캡션)
const STATS = [
  { Icon: MapPin,     value: "16개 장소", caption: "최적의 동선" },
  { Icon: Footprints, value: "도보 중심", caption: "여유로운 이동" },
  { Icon: Route,      value: "약 3.2km", caption: "전체 이동 거리" },
  { Icon: Wallet,     value: "90만원",   caption: "예상 비용" },
];

// AI 추천 만족도 (단일 카드로 변경)
const AI_MATCH_PERCENT = 92;
const AI_MATCH_LINE_1 = `나의 취향 카테고리 야경과 ${AI_MATCH_PERCENT}% 일치하는 코스에요`;
const AI_MATCH_LINE_2 = "야경 시간대를 일정 마지막에 배치했어요";

export default function CourseDetailPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col h-full" style={{ background: "#FCFCFC" }}>

      {/* 본문 스크롤 */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>

        {/* 히어로 — 도쿄 야경 이미지 + 어두운 그라데이션 + 타이틀 오버레이 */}
        <div
          className="relative shrink-0"
          style={{
            height: 276,
            backgroundImage: "url('/images/where/dokyo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 어두운 그라데이션 */}
          <div
            className="absolute inset-x-0"
            style={{
              top: 85,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(62,62,62,0) 5%, rgba(39,39,39,0.37) 25%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* 상단 헤더 — 뒤로/공유/북마크 */}
          <div className="absolute flex items-center justify-between" style={{ top: 50, left: 0, right: 0, padding: "0 18px 0 12px", height: 36 }}>
            <button onClick={() => router.back()} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
              <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
            </button>
            <div className="flex items-center" style={{ gap: 12 }}>
              <button className="flex items-center justify-center" style={{ width: 23, height: 23 }}>
                <Share2 size={20} color="#FFFFFF" strokeWidth={1.8} />
              </button>
              <button className="flex items-center justify-center" style={{ width: 23, height: 23 }}>
                <Bookmark size={18} color="#FFFFFF" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* 타이틀 블록 */}
          <div className="absolute" style={{ left: 22, bottom: 22, width: 280 }}>
            <h1
              style={{
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: "28px",
                color: "#FFFFFF",
              }}
            >
              아름다운
              <br />
              도쿄의 밤
            </h1>
            <p
              style={{
                marginTop: 8,
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 10,
                fontWeight: 500,
                lineHeight: "13px",
                color: "#F5F5F5",
              }}
            >
              16개 장소 / 4일 코스
            </p>
            <p
              style={{
                marginTop: 5,
                fontFamily: '"Spoqa Han Sans Neo"',
                fontSize: 10,
                fontWeight: 500,
                lineHeight: "13px",
                color: "#F5F5F5",
              }}
            >
              아름다운 밤의 도시 도쿄의 매력을 담았어요
            </p>
          </div>
        </div>

        {/* 카드 영역 */}
        <div className="flex flex-col" style={{ padding: "14px 14px 0", gap: 12 }}>

          {/* AI 추천 만족도 — 145h #FAFAFA + 진행 바 */}
          <div className="relative" style={{ height: 145, background: "#FAFAFA", borderRadius: 12 }}>
            {/* 라벤더 칩 */}
            <div className="absolute flex items-center justify-center" style={{ left: 17, top: 10, width: 34, height: 34, background: "#EFEFFF", borderRadius: 20 }}>
              <Sparkles size={18} color="#A5A5FF" fill="#A5A5FF" strokeWidth={0} />
            </div>
            <span className="absolute" style={{ left: 60, top: 19, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 700, lineHeight: "18px", color: "#1A1A1A" }}>
              AI 추천 만족도
            </span>

            {/* 92% + 그라데이션 진행 바 */}
            <div className="absolute" style={{ left: 18, top: 55, width: 292 }}>
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 700, lineHeight: "20px", color: "#1A1A1A" }}>
                {AI_MATCH_PERCENT}%
              </span>
              <div className="relative" style={{ marginTop: 8, width: "100%", height: 5, background: "#E0E0E0", borderRadius: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${AI_MATCH_PERCENT}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #A5A5FF 0%, #4F4FAA 100%)",
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>

            {/* 본문 2줄 */}
            <span
              className="absolute"
              style={{ left: 18, top: 99, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#666C78" }}
              dangerouslySetInnerHTML={{
                __html: AI_MATCH_LINE_1.replace(
                  `${AI_MATCH_PERCENT}%`,
                  `<span style="color:#A5A5FF;font-weight:700;">${AI_MATCH_PERCENT}%</span>`,
                ),
              }}
            />
            <span className="absolute" style={{ left: 18, top: 118, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#666C78" }}>
              {AI_MATCH_LINE_2}
            </span>
          </div>

          {/* 통계 카드 — 87h #FAFAFA */}
          <div className="flex items-center justify-around" style={{ height: 87, padding: "0 16px", background: "#FAFAFA", borderRadius: 12 }}>
            {STATS.map(({ Icon, value, caption }) => (
              <div key={value} className="flex flex-col items-center" style={{ gap: 4 }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: 28, height: 28, background: "#F2F2F6", borderRadius: 25 }}
                >
                  <Icon size={14} color="#333333" strokeWidth={1.8} />
                </div>
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 700, lineHeight: "13px", color: "#000000", textAlign: "center" }}>
                  {value}
                </span>
                <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 8, fontWeight: 400, lineHeight: "10px", color: "#000000", textAlign: "center" }}>
                  {caption}
                </span>
              </div>
            ))}
          </div>

          {/* 코스 미리보기 헤더 */}
          <span style={{ marginTop: 6, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 16, fontWeight: 700, lineHeight: "20px", color: "#000000" }}>
            코스 미리보기
          </span>

          {/* 지도 미리보기 — 271h */}
          <div className="relative overflow-hidden" style={{ height: 271, background: "#F2F4F7", borderRadius: 12 }}>
            <CourseMap
              courses={[{ id: "B", color: "#A5A5FF", markers: MARKERS }]}
              center={[MARKERS[0].lat, MARKERS[0].lng]}
              zoom={12}
              height="100%"
              showAll
            />
          </div>

          {/* 타임라인 — 스태거 등장 */}
          <div className="flex flex-col" style={{ marginTop: 4, gap: 18 }}>
            {SCHEDULE.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                className="flex"
              >
                {/* 좌측: 시간 + 아이콘 + 라인 */}
                <div className="shrink-0 flex flex-col items-center" style={{ width: 33 }}>
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#4B5969" }}>
                    {item.time}
                  </span>
                  <div className="flex items-center justify-center" style={{ marginTop: 3, width: 25, height: 25, background: "#EFEFFF", borderRadius: 8 }}>
                    <Sparkles size={14} color="#A5A5FF" fill="#A5A5FF" strokeWidth={0} />
                  </div>
                  {idx < SCHEDULE.length - 1 && (
                    <div className="flex-1 flex flex-col items-center" style={{ marginTop: 4, gap: 4 }}>
                      <div style={{ width: 1, flex: 1, background: "#E6E8EB" }} />
                      {item.next && <Footprints size={14} color="#A0A0C0" strokeWidth={1.8} />}
                    </div>
                  )}
                </div>

                {/* 우측: 카드 + 이동 안내 */}
                <div className="flex-1" style={{ marginLeft: 8 }}>
                  <div className="relative" style={{ padding: 9, background: "#F9FAFB", borderRadius: 8 }}>
                    <div className="flex items-start" style={{ gap: 8 }}>
                      <div className="shrink-0">
                        <PlaceThumbnail src={item.image} alt={item.title} category={item.category} size={51} />
                      </div>
                      <div className="flex flex-col min-w-0" style={{ gap: 4, flex: 1 }}>
                        <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: "#1A1A1A" }}>
                          {item.title}
                        </span>
                        <div className="flex flex-col" style={{ gap: 2 }}>
                          <div className="flex items-center whitespace-nowrap" style={{ gap: 5 }}>
                            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#555555" }}>
                              {item.region.split("·").slice(-1)[0]}·{item.category}
                            </span>
                            <div className="flex items-center" style={{ gap: 1 }}>
                              <Star size={11} color="#FFE770" fill="#FFE770" strokeWidth={0} />
                              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#555555" }}>
                                {item.rating}({item.reviews.toLocaleString()})
                              </span>
                            </div>
                          </div>
                          <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#555555" }}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 우상단 태그 */}
                    <div className="absolute inline-flex items-center justify-center" style={{ top: 6, right: 6, height: 14, padding: "0 6px", background: "#EFEFFF", borderRadius: 4 }}>
                      <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 8, fontWeight: 500, lineHeight: "10px", color: "#A5A5FF" }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {item.next && (
                    <div className="flex items-center" style={{ marginTop: 4, gap: 4 }}>
                      <Footprints size={13} color="#A0A0C0" strokeWidth={1.8} />
                      <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#767F89" }}>
                        {item.next}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 버튼 — 코스 수정하기 단일 navy */}
      <div className="shrink-0" style={{ padding: "0 22px 31px", background: "#FCFCFC" }}>
        <button
          onClick={() => router.push("/screens/step9/edit")}
          className="w-full flex items-center justify-center transition-opacity active:opacity-80"
          style={{
            height: 50,
            background: "#090738",
            borderRadius: 12,
            gap: 8,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
          }}
        >
          <Pencil size={18} color="#FFFFFF" strokeWidth={1.8} />
          코스 수정하기
        </button>
      </div>
    </div>
  );
}
