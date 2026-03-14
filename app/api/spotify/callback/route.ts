import { NextRequest, NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RESULT_COOKIE_NAME = "spotify_oauth_result";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    const response = NextResponse.redirect(
      new URL(`/spotify-auth?error=${encodeURIComponent(error)}`, request.url),
    );
    response.cookies.delete("spotify_auth_state");
    return response;
  }

  const storedState = request.cookies.get("spotify_auth_state")?.value;

  if (!state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(new URL("/spotify-auth?error=state_mismatch", request.url));
    response.cookies.delete("spotify_auth_state");
    return response;
  }

  if (!code) {
    const response = NextResponse.redirect(new URL("/spotify-auth?error=missing_code", request.url));
    response.cookies.delete("spotify_auth_state");
    return response;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    const response = NextResponse.redirect(new URL("/spotify-auth?error=missing_spotify_env", request.url));
    response.cookies.delete("spotify_auth_state");
    return response;
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
    const response = NextResponse.redirect(
      new URL(`/spotify-auth?error=${encodeURIComponent(tokenError)}`, request.url),
    );
    response.cookies.delete("spotify_auth_state");
    return response;
  }

  const response = NextResponse.redirect(new URL("/spotify-auth", request.url));
  response.cookies.set(
    RESULT_COOKIE_NAME,
    JSON.stringify({
      refresh_token: data.refresh_token,
      access_token: data.access_token ?? null,
      expires_in: data.expires_in ?? null,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5,
      path: "/spotify-auth",
    },
  );
  response.cookies.delete("spotify_auth_state");

  return response;
}
