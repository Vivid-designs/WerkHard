# Spotify API setup from first principles

This project already includes server-side Spotify integrations for:

- `GET /api/spotify/now-playing`
- `GET /api/spotify/top-tracks`

Those routes rely on a **refresh token flow** (server to server), not a client-side PKCE flow.

---

## 1) Mental model: what must exist for Spotify API calls to work

From first principles, any successful Spotify Web API request in this app requires all of the following:

1. A Spotify application (`client_id` + `client_secret`).
2. A user grant that includes the scopes you need.
3. A valid refresh token tied to that user grant.
4. Server environment variables loaded into Next.js:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
5. A token exchange (`refresh_token` -> `access_token`) that succeeds.
6. A Web API request with `Authorization: Bearer <access_token>`.

If any single part is missing, API calls fail.

---

## 2) What this codebase currently uses

`lib/spotify.ts` performs the token exchange by calling:

- `https://accounts.spotify.com/api/token`

Then it uses the returned access token to call:

- `https://api.spotify.com/v1/me/player/currently-playing`
- `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term`

This means your Spotify app and refresh token must include scopes for the endpoints above.

---

## 3) Spotify Developer Dashboard checklist

In Spotify Developer Dashboard:

1. Create (or open) your app.
2. Copy your **Client ID** and **Client Secret**.
3. Add at least one Redirect URI for one-time authorization token generation.
   - Example local URI: `http://127.0.0.1:3000/spotify/callback`
   - Example production URI: `https://spencesa.co.za/spotify/callback`
4. Save settings.

> Redirect URI must exactly match what you use in your authorization request.
>
> Spotify security requirements: use HTTPS for non-loopback redirect URIs. For local development, use an explicit loopback address (`127.0.0.1` or `[::1]`) instead of `localhost`.

---

## 4) One-time refresh token generation (PKCE flow from Spotify guide)

Use Spotify's PKCE guide to obtain a `code`, then exchange it for tokens.

At minimum, request scopes needed by this project:

- `user-read-private`
- `user-read-email`
- `user-read-currently-playing`
- `user-top-read`

After token exchange, persist the `refresh_token` value. That token is what this app uses long-term.

---

## 5) Configure `.env.local`

Add these values in your Next.js root `.env.local` file:

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

Restart `npm run dev` after editing env vars.

---

## 6) Validate locally

Run:

```bash
npm run dev
```

Then test endpoints:

- `http://localhost:3000/api/spotify/now-playing`
- `http://localhost:3000/api/spotify/top-tracks`

Expected behavior:

- `top-tracks` returns `{ "tracks": [...] }`.
- `now-playing` returns either active track data or `{ "isPlaying": false }`.

---

## 7) Fast troubleshooting map

### Error: missing env var

This project now throws explicit startup/runtime errors when required Spotify env vars are absent.

### Error: Spotify token error (401/400)

Likely causes:

- Wrong client secret.
- Refresh token revoked/expired.
- Refresh token generated for a different Spotify app.

### `tracks: []` or `isPlaying: false` unexpectedly

- Scope missing when refresh token was minted.
- User has no short-term top tracks.
- Nothing currently playing.

### Redirect URI mismatch during auth

- The auth request URI and Dashboard URI differ by path, port, or trailing slash.

---

## 8) If you want user-by-user login (PKCE in-browser)

The Spotify guide you shared is ideal for a **single-page app with per-user login**.

This repository currently uses a **single server-owned refresh token** model for read-only widgets. If you want per-user profile pages (`/v1/me`) for each logged-in visitor, add a dedicated PKCE flow in the frontend and store user tokens per session.
