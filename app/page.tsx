import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import FeaturedPosts from "@/components/sections/FeaturedPosts";
import AboutPreview from "@/components/sections/AboutPreview";
import Newsletter from "@/components/sections/Newsletter";
import { featuredPosts } from "@/lib/placeholder-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <FeaturedPosts posts={featuredPosts} />
      <AboutPreview />
      <Newsletter />
    </>
  );
}
