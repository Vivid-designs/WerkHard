import Hero from "@/components/sections/Hero";
import FeaturedPosts from "@/components/sections/FeaturedPosts";
import AboutPreview from "@/components/sections/AboutPreview";
import Newsletter from "@/components/sections/Newsletter";
import { featuredPosts } from "@/lib/placeholder-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPosts posts={featuredPosts} />
      <AboutPreview />
      <Newsletter />
    </>
  );
}
