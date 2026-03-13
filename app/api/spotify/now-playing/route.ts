import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Spotify now-playing]", err);
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }
}
