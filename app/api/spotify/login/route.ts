import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(
      new URL("/spotify-auth?error=missing_spotify_env", request.url),
    );
  }
  const scope =
    process.env.SPOTIFY_AUTH_SCOPE ??
    "user-read-private user-read-email user-top-read user-read-currently-playing";

  const state = randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
    show_dialog: "true",
  });

  const response = NextResponse.redirect(`${AUTHORIZE_ENDPOINT}?${params.toString()}`);

  response.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
