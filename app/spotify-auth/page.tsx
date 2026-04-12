import { cookies } from "next/headers";
import Link from "next/link";

const SPOTIFY_AUTH_RESULT_COOKIE = "spotify_auth_result";

interface SpotifyAuthResultCookie {
  refreshToken: string;
  expiresIn?: number;
  accessTokenReceived: boolean;
}

interface SpotifyAuthPageProps {
  searchParams: {
    error?: string;
  };
}

function fromCookiePayload(value: string): SpotifyAuthResultCookie | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

    if (!parsed || typeof parsed !== "object" || typeof parsed.refreshToken !== "string") {
      return null;
    }

    return {
      refreshToken: parsed.refreshToken,
      expiresIn: typeof parsed.expiresIn === "number" ? parsed.expiresIn : undefined,
      accessTokenReceived: Boolean(parsed.accessTokenReceived),
    };
  } catch {
    return null;
  }
}

export default async function SpotifyAuthPage({ searchParams }: SpotifyAuthPageProps) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(SPOTIFY_AUTH_RESULT_COOKIE)?.value;
  const authResult = authCookie ? fromCookiePayload(authCookie) : null;
  const error = searchParams.error;

  return (
    <main className="container-narrow section-spacing">
      <div className="max-w-prose-wide">
        <p className="font-sans text-2xs tracking-widest uppercase text-parchment-500 mb-4">
          Spotify OAuth Helper
        </p>
        <h1 className="font-serif text-display-md text-parchment-100 mb-3">
          Koppel Spotify
        </h1>
        <p className="font-body text-parchment-400 text-base leading-relaxed mb-10">
          Gebruik hierdie bladsy om jou Spotify-app te magtig en 'n refresh token te genereer vir die widgets.
        </p>

        <div className="bg-ink-800 border border-ink-600 rounded-lg p-6 mb-6">
          <h2 className="font-serif text-display-sm text-parchment-100 mb-4">Opstelling</h2>
          <ol className="space-y-3 font-body text-parchment-400 text-sm leading-relaxed list-decimal pl-5">
            <li>
              Stel hierdie omgewingsveranderlikes in:
              <div className="mt-2 space-y-1">
                {["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI"].map((v) => (
                  <code key={v} className="block rounded border border-ink-600 bg-ink-700 px-3 py-1.5 font-mono text-xs text-parchment-300">
                    {v}
                  </code>
                ))}
              </div>
            </li>
            <li>
              Registreer hierdie callback-URL in jou{" "}
              <span className="text-parchment-300">Spotify Developer Dashboard</span> onder Redirect URIs:
              <div className="mt-2 space-y-1">
                <code className="block rounded border border-ink-600 bg-ink-700 px-3 py-1.5 font-mono text-xs text-parchment-300">
                  http://127.0.0.1:3000/api/spotify/callback
                </code>
                <code className="block rounded border border-ink-600 bg-ink-700 px-3 py-1.5 font-mono text-xs text-parchment-300">
                  https://spencesa.co.za/api/spotify/callback
                </code>
              </div>
              <p className="mt-2 text-xs text-parchment-600">
                Stel <code className="font-mono">SPOTIFY_REDIRECT_URI</code> op die ooreenstemmende URL in jou omgewing.
              </p>
            </li>
            <li>Klik die knoppie hieronder en keur die toestemmings goed.</li>
            <li>
              Kopieer die <code className="font-mono text-xs text-parchment-300">SPOTIFY_REFRESH_TOKEN</code>{" "}
              wat verskyn en voeg dit by jou omgewingsveranderlikes.
            </li>
          </ol>
        </div>

        <a
          href="/api/spotify/login"
          className="inline-flex items-center gap-2 rounded-md bg-sage/20 border border-sage/30 px-5 py-3 font-sans text-sm font-medium text-sage transition-colors duration-200 hover:bg-sage/30"
        >
          Magtig met Spotify ↗
        </a>

        {error ? (
          <div className="mt-8 rounded-lg border border-peach/30 bg-peach/10 p-5">
            <p className="font-sans text-sm font-medium text-peach mb-1">Magtigingsfout</p>
            <p className="font-body text-sm text-parchment-400">{error}</p>
          </div>
        ) : null}

        {authResult ? (
          <div className="mt-8 rounded-lg border border-sage/30 bg-sage/10 p-5">
            <p className="font-sans text-sm font-medium text-sage mb-2">Sukses — token ontvang</p>
            <p className="font-body text-sm text-parchment-400 mb-3">
              Stoor hierdie waarde as <code className="font-mono text-xs text-parchment-300">SPOTIFY_REFRESH_TOKEN</code> in jou omgewing:
            </p>
            <pre className="overflow-x-auto rounded border border-ink-600 bg-ink-700 px-4 py-3 font-mono text-xs text-parchment-200 leading-relaxed">
              {authResult.refreshToken}
            </pre>
            {authResult.accessTokenReceived ? (
              <p className="mt-3 font-sans text-xs text-parchment-600">
                Tydelike toegangstoken ontvang (verval in {authResult.expiresIn ?? "onbekend"} sekondes).
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-10 font-body text-sm text-parchment-600">
          Wil jy weer probeer?{" "}
          <Link href="/spotify-auth" className="text-parchment-400 underline underline-offset-2 hover:text-parchment-200">
            Laai die bladsy versnu
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
