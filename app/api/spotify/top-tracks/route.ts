import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getTopTracks();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Spotify top-tracks]", err);
    return NextResponse.json({ tracks: [] }, { status: 200 });
  }
}
