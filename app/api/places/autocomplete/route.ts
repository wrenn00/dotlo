import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export interface Prediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface NewApiSuggestion {
  placePrediction?: {
    placeId?: string;
    text?: { text?: string };
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
  };
}

interface NewApiResponse {
  suggestions?: NewApiSuggestion[];
  error?: { message?: string; status?: string };
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input")?.trim();
  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY 가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
        },
        body: JSON.stringify({
          input,
          languageCode: "ko",
          includedPrimaryTypes: ["(cities)"],
        }),
      },
    );

    const data = (await res.json()) as NewApiResponse;

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? `HTTP ${res.status}`, predictions: [] },
        { status: 502 },
      );
    }

    const predictions: Prediction[] = (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => !!p?.placeId)
      .map((p) => ({
        placeId: p.placeId!,
        description: p.text?.text ?? "",
        mainText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
        secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
      }));

    return NextResponse.json({ predictions });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "fetch failed", predictions: [] },
      { status: 500 },
    );
  }
}
