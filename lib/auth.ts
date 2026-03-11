import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12;

export const ADMIN_SESSION_COOKIE_NAME = "wh_admin_session";

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(payload: string) {
  if (!ADMIN_SESSION_SECRET) {
    return null;
  }

  return createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
}

export function isValidAdminLogin(email: string, password: string) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return false;
  }

  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function createAdminSessionToken(email: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64Url(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      exp: now + TWELVE_HOURS_IN_SECONDS,
    })
  );
  const signature = createSignature(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(payload);

  if (!expectedSignature) {
    return null;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as { email?: string; exp?: number };

    if (!parsed.email || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { email: parsed.email };
  } catch {
    return null;
  }
}

export function hasAdminAuthConfiguration() {
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_SESSION_SECRET);
}
