"use client";

import { useEffect, useState } from "react";

/**
 * 앱 전체에서 사용하는 장소 데이터를 한 곳에서 관리.
 *
 * - 첫 진입 시 sessionStorage 캐시 확인 → 없으면 일괄 API 호출
 * - 같은 세션 안에서는 같은 장소를 두 번 이상 호출하지 않음
 * - API 실패 시 null 반환 → 컴포넌트는 더미 데이터 fallback
 *
 * Storage 키: dotlo:places-data:v1
 * 버전 올리면 캐시 자동 무효화.
 */

export interface PlaceData {
  query: string;
  placeId: string;
  name: string;
  rating: number | null;
  userRatingCount: number | null;
  /** Places API (New) 사진 리소스 이름 — /api/places/photo?name=... 에 전달 */
  photoName: string | null;
}

// ─── 앱 전체 장소 카탈로그 ────────────────────────────────────────────────────

const PLACE_QUERIES = [
  // STEP 2 select
  "이치란 라멘 도본토리점 오사카",
  "EX 카페 교토 아라시야마",
  "기요미즈데라 교토",
  "오카페 교토",
  "스시노무사시 교토",
  "도톤보리 구로후네 오사카",
  // STEP 7 / 9 timeline
  "APA 호텔 우에노 도쿄",
  "이치란 라멘 우에노점 도쿄",
  "센소지 절 도쿄",
  "블루보틀 카페 도쿄",
  "도쿄 스카이트리",
  // STEP 9 edit/add
  "후시미 이나리 신사 교토",
  "오사카 성",
  "우메다 스카이빌딩 오사카",
  "해유관 오사카",
] as const;

/**
 * 화면에 표시되는 장소명 → 카탈로그 query 별칭
 * (화면 표시명에는 도시명이 없는 경우가 많아 매핑 필요)
 */
const ALIASES: Record<string, string> = {
  "이치란 라멘 도본토리점": "이치란 라멘 도본토리점 오사카",
  "EX 카페 교토 아라시야마점": "EX 카페 교토 아라시야마",
  "기요미즈데라": "기요미즈데라 교토",
  "오카페 교토": "오카페 교토",
  "스시노무사시": "스시노무사시 교토",
  "도톤보리 구로후네 야메무라점": "도톤보리 구로후네 오사카",
  "APA 호텔 우에노": "APA 호텔 우에노 도쿄",
  "이치란 라멘 우에노점": "이치란 라멘 우에노점 도쿄",
  "센소지 절": "센소지 절 도쿄",
  "블루보틀 카페": "블루보틀 카페 도쿄",
  "블루보틀 키요스미": "블루보틀 카페 도쿄",
  "도쿄 스카이 트리": "도쿄 스카이트리",
  "후시미 이나리 신사": "후시미 이나리 신사 교토",
  "오사카 성": "오사카 성",
  "우메다 스카이빌딩": "우메다 스카이빌딩 오사카",
  "해유관": "해유관 오사카",
  "니시키 시장": "기요미즈데라 교토", // 카탈로그에 없어서 인접 사진으로 대체 (선택)
};

// ─── 상태 ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "dotlo:places-data:v1";

type Cache = Record<string, PlaceData | null>;

let memoryCache: Cache | null = null;
let loadingPromise: Promise<void> | null = null;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((fn) => fn());
}

function readStorage(): Cache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cache) : null;
  } catch {
    return null;
  }
}

function writeStorage(cache: Cache) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // QuotaExceededError 등 무시
  }
}

// ─── 초기화 (앱 마운트 시 1회) ────────────────────────────────────────────────

export async function initPlacesData(): Promise<void> {
  if (memoryCache) return;
  if (loadingPromise) return loadingPromise;

  // 1) sessionStorage 우선
  const cached = readStorage();
  if (cached) {
    memoryCache = cached;
    notify();
    return;
  }

  // 2) 전체 일괄 호출 (실패는 조용히 null)
  loadingPromise = (async () => {
    const results: Cache = {};
    await Promise.all(
      PLACE_QUERIES.map(async (q) => {
        try {
          const res = await fetch(`/api/places/search?query=${encodeURIComponent(q)}`);
          if (!res.ok) {
            results[q] = null;
            return;
          }
          const data = await res.json();
          const first = data.results?.[0];
          results[q] = first
            ? {
                query: q,
                placeId: first.placeId,
                name: first.name,
                rating: first.rating,
                userRatingCount: first.userRatingCount,
                photoName: first.photoName,
              }
            : null;
        } catch {
          results[q] = null;
        }
      }),
    );
    memoryCache = results;
    writeStorage(results);
    notify();
    loadingPromise = null;
  })();

  return loadingPromise;
}

// ─── 동기 조회 ────────────────────────────────────────────────────────────────

export function getPlaceData(displayName: string): PlaceData | null {
  if (!memoryCache) memoryCache = readStorage();
  if (!memoryCache) return null;

  const key = ALIASES[displayName] ?? displayName;
  return memoryCache[key] ?? null;
}

// ─── React 훅 — 데이터 로드되면 자동 재렌더 ────────────────────────────────────

export function usePlaceData(displayName: string): PlaceData | null {
  const [data, setData] = useState<PlaceData | null>(() => getPlaceData(displayName));

  useEffect(() => {
    // 캐시 미스 → 초기화 트리거
    if (!data) initPlacesData();

    const update = () => setData(getPlaceData(displayName));
    subscribers.add(update);
    update();
    return () => {
      subscribers.delete(update);
    };
  }, [displayName, data]);

  return data;
}
