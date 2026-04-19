import { cookies } from "next/headers";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import FeaturedPosts from "@/components/sections/FeaturedPosts";
import AboutPreview from "@/components/sections/AboutPreview";
import Newsletter from "@/components/sections/Newsletter";
import ScrollbarHider from "@/components/ScrollbarHider";
import { getPublishedWritingForRole } from "@/lib/writing-service";
import { getAuthenticatedUserRole } from "@/lib/admin-users";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieHeader = cookies().toString();
  const role = await getAuthenticatedUserRole(
    new Request("http://localhost", { headers: { cookie: cookieHeader } }),
  );

  const allWriting = await getPublishedWritingForRole(role);
  const featured = allWriting.filter((p) => p.featured).slice(0, 3);
  // Fall back to 3 most recent if none are marked featured
  const posts = featured.length > 0 ? featured : allWriting.slice(0, 3);

  return (
    <>
      <ScrollbarHider />
      <Hero />
      <Ticker />
      <FeaturedPosts posts={posts} />
      <AboutPreview />
      <Newsletter />
    </>
  );
}
