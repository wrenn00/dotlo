"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ChevronLeft, Share2, Bookmark, Sparkles, MapPin, Footprints, Route, Wallet, Map as MapIcon,
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

// AI 노트 bullets
const AI_BULLETS = [
  "맛집 우선으로 점심·저녁 동선 짰어요",
  "야경 시간대를 일정 마지막에 배치했어요",
  "숙소 기준으로 동선이 가장 짧아요",
];

// 취향 반영 — 누적 가로 막대 (총합 100%)
const PREFERENCES = [
  { label: "카페", percent: 40, color: "#00E1FF" },
  { label: "맛집", percent: 25, color: "#A5A5FF" },
  { label: "관광", percent: 20, color: "#FFE400" },
  { label: "야경", percent: 15, color: "#090738" },
];

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
              아름다운 도쿄의 야경
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

        {/* 통계 바 — 60h 흰색 */}
        <div className="flex items-center" style={{ height: 60, padding: "0 8px", gap: 10, background: "#FFFFFF" }}>
          {STATS.map(({ Icon, value, caption }) => (
            <div key={value} className="flex items-center" style={{ gap: 4, flex: 1 }}>
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ width: 28, height: 28, background: "#F2F2F6", borderRadius: 25 }}
              >
                <Icon size={14} color="#6060A0" strokeWidth={1.6} />
              </div>
              <div className="flex flex-col min-w-0" style={{ gap: 3 }}>
                <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 700, lineHeight: "13px", color: "#000000" }}>
                  {value}
                </span>
                <span className="truncate" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 8, fontWeight: 400, lineHeight: "10px", color: "#000000" }}>
                  {caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 카드 영역 */}
        <div className="flex flex-col" style={{ padding: "12px 20px 0", gap: 11 }}>

          {/* AI가 이렇게 짰어요 — 134h navy */}
          <div className="relative" style={{ height: 134, background: "#090738", borderRadius: 12 }}>
            <div className="absolute flex items-center" style={{ left: 10, top: 10, gap: 9 }}>
              <div className="flex items-center justify-center" style={{ width: 34, height: 34, background: "#484759", borderRadius: 20 }}>
                <Sparkles size={18} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
              </div>
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: "#FBFBFB" }}>
                AI가 이렇게 짰어요
              </span>
            </div>
            <div className="absolute flex flex-col" style={{ left: 18, top: 51, gap: 10 }}>
              {AI_BULLETS.map((text) => (
                <div key={text} className="flex items-center" style={{ gap: 13 }}>
                  <div className="shrink-0" style={{ width: 5, height: 5, background: "#A0A0C0", borderRadius: "50%" }} />
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#C1C3C8" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 내 취향 반영 — 124h 흰색 + 가로 막대 */}
          <div className="relative" style={{ height: 124, background: "#FFFFFF", borderRadius: 12, boxShadow: "0 0 6.8px rgba(0,0,0,0.08)" }}>
            <span className="absolute" style={{ left: 18, top: 17, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 14, fontWeight: 500, lineHeight: "18px", color: "#000000" }}>
              내 취향 반영
            </span>
            <span className="absolute" style={{ right: 18, top: 22, fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#888E9C" }}>
              총 16곳 중
            </span>

            {/* 누적 가로 막대 (총 7px high) */}
            <div className="absolute flex" style={{ left: 18, right: 18, top: 50, height: 7, borderRadius: 4, overflow: "hidden" }}>
              {PREFERENCES.map((p) => (
                <div key={p.label} style={{ flex: p.percent, background: p.color }} />
              ))}
            </div>

            {/* 카테고리 범례 — 2열 4개 */}
            <div className="absolute grid grid-cols-2" style={{ left: 18, right: 18, top: 68, gap: "11px 41px" }}>
              {PREFERENCES.map((p) => (
                <div key={`legend-${p.label}`} className="flex items-center" style={{ gap: 8 }}>
                  <div className="shrink-0" style={{ width: 8, height: 8, background: p.color, borderRadius: "50%" }} />
                  <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#535353" }}>{p.label}</span>
                  <span className="ml-auto" style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 10, fontWeight: 500, lineHeight: "13px", color: "#535353" }}>{p.percent}%</span>
                </div>
              ))}
            </div>
          </div>

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

          {/* 일정 섹션 헤더 */}
          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 20, fontWeight: 700, lineHeight: "30px", color: "#363636" }}>
              일정
            </span>
            <button className="flex items-center" style={{ gap: 3 }}>
              <span style={{ fontFamily: '"Spoqa Han Sans Neo"', fontSize: 12, fontWeight: 500, lineHeight: "15px", color: "#888888" }}>
                전체 지도로 보기
              </span>
              <MapIcon size={14} color="#888888" strokeWidth={1.8} />
            </button>
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

      {/* 하단 버튼 영역 — 일정 수정하기 (outline) + 다음 (navy) */}
      <div className="shrink-0 flex" style={{ padding: "0 22px 31px", gap: 10, background: "#FCFCFC" }}>
        <button
          onClick={() => router.push("/screens/step9/edit")}
          className="flex items-center justify-center transition-opacity active:opacity-80"
          style={{
            flex: 1,
            height: 50,
            background: "#FFFFFF",
            border: "1px solid #888888",
            borderRadius: 12,
            gap: 8,
            fontFamily: '"Spoqa Han Sans Neo"',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "20px",
            letterSpacing: "-0.5px",
            color: "#888888",
          }}
        >
          <Pencil size={18} color="#7C7C7C" strokeWidth={1.8} />
          일정 수정하기
        </button>
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center transition-opacity active:opacity-80"
          style={{
            flex: 1,
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
          다음
        </button>
      </div>
    </div>
  );
}
