import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export interface PlaceSearchResult {
  placeId: string;
  name: string;
  rating: number | null;
  userRatingCount: number | null;
  /** "places/{placeId}/photos/{photoId}" 형식 — /api/places/photo?name=... 로 사용 */
  photoName: string | null;
}

interface NewApiPlace {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{ name?: string }>;
}

interface NewApiResponse {
  places?: NewApiPlace[];
  error?: { message?: string };
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY 가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.rating,places.userRatingCount,places.photos",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "ko",
        pageSize: 5,
      }),
    });

    const data = (await res.json()) as NewApiResponse;
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? `HTTP ${res.status}`, results: [] },
        { status: 502 },
      );
    }

    const results: PlaceSearchResult[] = (data.places ?? [])
      .filter((p): p is NewApiPlace & { id: string } => !!p.id)
      .map((p) => ({
        placeId: p.id,
        name: p.displayName?.text ?? "",
        rating: typeof p.rating === "number" ? p.rating : null,
        userRatingCount:
          typeof p.userRatingCount === "number" ? p.userRatingCount : null,
        photoName: p.photos?.[0]?.name ?? null,
      }));

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "fetch failed", results: [] },
      { status: 500 },
    );
  }
}
