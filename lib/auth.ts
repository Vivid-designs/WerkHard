export const ADMIN_EMAIL =
  process.env.ADMIN_LOGIN_EMAIL ?? "lario@vividgraphics.co.za";
export const ADMIN_PASSWORD =
  process.env.ADMIN_LOGIN_PASSWORD ?? "L@R10.5p3nc3.werkhard";

export function isValidAdminLogin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}
