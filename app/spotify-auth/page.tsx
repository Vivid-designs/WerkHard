import Link from "next/link";

interface SpotifyAuthPageProps {
  searchParams: {
    refresh_token?: string;
    access_token?: string;
    expires_in?: string;
    error?: string;
  };
}

export default function SpotifyAuthPage({ searchParams }: SpotifyAuthPageProps) {
  const refreshToken = searchParams.refresh_token;
  const accessToken = searchParams.access_token;
  const expiresIn = searchParams.expires_in;
  const error = searchParams.error;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Spotify OAuth Helper</h1>
      <p className="mt-3 text-gray-600">
        Use this page to authorize your Spotify app and generate a refresh token.
      </p>

      <ol className="mt-6 list-decimal space-y-2 pl-6 text-gray-800">
        <li>
          Add these environment variables: <code>SPOTIFY_CLIENT_ID</code>,{" "}
          <code>SPOTIFY_CLIENT_SECRET</code>, and <code>SPOTIFY_REDIRECT_URI</code>.
        </li>
        <li>
          In Spotify Developer Dashboard, whitelist your callback URL (example: <code>http://127.0.0.1:3000/api/spotify/callback</code>).
        </li>
        <li>Click authorize and approve permissions.</li>
      </ol>

      <div className="mt-8">
        <a
          href="/api/spotify/login"
          className="inline-flex items-center rounded bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Authorize with Spotify
        </a>
      </div>

      {error ? (
        <div className="mt-8 rounded border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Authorization error</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      {refreshToken ? (
        <section className="mt-8 rounded border border-green-200 bg-green-50 p-4">
          <h2 className="text-lg font-semibold text-green-900">Success 🎉</h2>
          <p className="mt-2 text-green-900">
            Save this value as <code>SPOTIFY_REFRESH_TOKEN</code> in your environment.
          </p>
          <pre className="mt-3 overflow-x-auto rounded bg-white p-3 text-sm text-green-900">
            {refreshToken}
          </pre>
          {accessToken ? (
            <p className="mt-3 text-sm text-green-800">
              Temporary access token received (expires in {expiresIn ?? "unknown"} seconds).
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="mt-8 text-sm text-gray-600">
        Need to retry? Go back to <Link href="/spotify-auth" className="underline">/spotify-auth</Link>.
      </p>
    </main>
  );
}
