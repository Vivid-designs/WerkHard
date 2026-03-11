import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";

export default function AdminPage() {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get("wh_admin")?.value === "true";
  const adminEmail = cookieStore.get("wh_admin_email")?.value;

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <section className="container-narrow py-20">
      <div className="rounded-xl border border-ink-700 bg-ink-800 p-8 shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-500">Admin Area</p>
        <h1 className="mt-2 font-serif text-3xl text-parchment-100">Welcome, Lario</h1>
        <p className="mt-4 text-parchment-300">
          You are logged in as <span className="font-semibold">{adminEmail}</span> with
          admin access.
        </p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
