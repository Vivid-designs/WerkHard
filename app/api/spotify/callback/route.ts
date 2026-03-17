import { NextRequest, NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export const dynamic = "force-dynamic";

const SPOTIFY_AUTH_RESULT_COOKIE = "spotify_auth_result";

interface SpotifyAuthResultCookie {
  refreshToken: string;
  expiresIn?: number;
  accessTokenReceived: boolean;
}

function toCookiePayload(payload: SpotifyAuthResultCookie) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/spotify-auth?error=${encodeURIComponent(error)}`, request.url));
  }

  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/spotify-auth?error=state_mismatch", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/spotify-auth?error=missing_code", request.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/spotify-auth?error=missing_spotify_env", request.url));
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok || !data.refresh_token) {
    const tokenError = data.error_description || data.error || `token_request_failed_${tokenRes.status}`;
    return NextResponse.redirect(
      new URL(`/spotify-auth?error=${encodeURIComponent(tokenError)}`, request.url),
    );
  }

  const response = NextResponse.redirect(new URL("/spotify-auth", request.url));
  response.cookies.delete("spotify_auth_state");
  response.cookies.set({
    name: SPOTIFY_AUTH_RESULT_COOKIE,
    value: toCookiePayload({
      refreshToken: data.refresh_token as string,
      expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
      accessTokenReceived: Boolean(data.access_token),
    }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/spotify-auth",
  });

  return response;
}
