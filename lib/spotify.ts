/**
 * Spotify Web API utility — server-side only.
 * Secrets never leave this file or the API routes that import it.
 */

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const TOP_TRACKS_URL =
  "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term";

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyArtist {
  name: string;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls: { spotify: string };
  duration_ms: number;
}

export interface NowPlayingResult {
  isPlaying: boolean;
  track?: SpotifyTrack;
  progressMs?: number;
}

export interface TopTracksResult {
  tracks: SpotifyTrack[];
}

export async function getNowPlaying(): Promise<NowPlayingResult> {
  const token = await getAccessToken();

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 },
  });

  if (res.status === 204 || res.status > 400) {
    return { isPlaying: false };
  }

  const data = await res.json();

  if (data.currently_playing_type !== "track" || !data.item) {
    return { isPlaying: false };
  }

  return {
    isPlaying: data.is_playing,
    track: data.item as SpotifyTrack,
    progressMs: data.progress_ms,
  };
}

export async function getTopTracks(): Promise<TopTracksResult> {
  const token = await getAccessToken();

  const res = await fetch(TOP_TRACKS_URL, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    return { tracks: [] };
  }

  const data = await res.json();
  return { tracks: data.items as SpotifyTrack[] };
}

export function formatArtists(artists: SpotifyArtist[]): string {
  return artists.map((a) => a.name).join(", ");
}

export function getBestImage(images: SpotifyImage[], preferredSize = 300): string {
  if (!images.length) return "";

  const sorted = [...images].sort(
    (a, b) =>
      Math.abs(a.width - preferredSize) - Math.abs(b.width - preferredSize),
  );

  return sorted[0].url;
}
