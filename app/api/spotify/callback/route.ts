import { NextRequest, NextResponse } from "next/server";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

export const dynamic = "force-dynamic";

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

  const redirect = new URL("/spotify-auth", request.url);
  redirect.searchParams.set("refresh_token", data.refresh_token as string);

  if (data.access_token) {
    redirect.searchParams.set("access_token", data.access_token as string);
  }

  if (data.expires_in) {
    redirect.searchParams.set("expires_in", String(data.expires_in));
  }

  const response = NextResponse.redirect(redirect);
  response.cookies.delete("spotify_auth_state");

  return response;
}
