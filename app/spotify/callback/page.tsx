interface SpotifyCallbackPageProps {
  searchParams?: {
    code?: string;
    error?: string;
    state?: string;
  };
}

export default function SpotifyCallbackPage({ searchParams }: SpotifyCallbackPageProps) {
  const code = searchParams?.code;
  const error = searchParams?.error;

  const localRedirectUri = "http://127.0.0.1:3000/spotify/callback";
  const productionRedirectUri = "https://spencesa.co.za/spotify/callback";

  return (
    <main className="container-narrow section-spacing">
      <section className="max-w-reading rounded-lg border border-ink-600 bg-ink-800 p-6">
        <p className="mb-2 font-sans text-2xs tracking-widest uppercase text-parchment-500">
          Spotify Callback
        </p>
        <h1 className="font-serif text-display-sm text-parchment-100">Spotify redirect URI</h1>

        <p className="mt-3 font-body text-sm leading-relaxed text-parchment-500">
          Register one of these exact callback URLs in Spotify Developer Dashboard:
        </p>
        <code className="mt-3 block rounded border border-ink-600 bg-ink-700 px-3 py-2 font-mono text-xs text-parchment-300">
          {localRedirectUri}
        </code>
        <code className="mt-2 block rounded border border-ink-600 bg-ink-700 px-3 py-2 font-mono text-xs text-parchment-300">
          {productionRedirectUri}
        </code>

        <p className="mt-3 font-body text-xs leading-relaxed text-parchment-600">
          Spotify requires HTTPS for non-loopback callback URLs. For local development, use a
          loopback address like <span className="font-mono">127.0.0.1</span> (not <span className="font-mono">localhost</span>).
        </p>

        {error ? (
          <p className="mt-4 font-body text-sm text-red-300">
            Spotify returned an error: <span className="font-mono">{error}</span>
          </p>
        ) : code ? (
          <p className="mt-4 font-body text-sm text-sage">
            Authorization code received. You can now exchange it for tokens server-side.
          </p>
        ) : (
          <p className="mt-4 font-body text-sm text-parchment-600">
            Waiting for Spotify authorization response.
          </p>
        )}
      </section>
    </main>
  );
}
