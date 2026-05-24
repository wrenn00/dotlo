import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Places API (New) 사진 프록시.
 *   name 예시: "places/ChIJ.../photos/AeS..."
 *   요청: /api/places/photo?name=<photoResourceName>&w=400
 * 응답: image/* 바이너리를 그대로 스트리밍 (1일 캐시)
 */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const w = req.nextUrl.searchParams.get("w") ?? "400";

  if (!name || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) {
    return NextResponse.json({ error: "invalid name" }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY 가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${encodeURIComponent(w)}&key=${key}`;

  const res = await fetch(url, { redirect: "follow", cache: "no-store" });
  if (!res.ok || !res.body) {
    return NextResponse.json(
      { error: `upstream ${res.status}` },
      { status: 502 },
    );
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
