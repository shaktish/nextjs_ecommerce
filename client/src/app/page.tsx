import Banner from "@/modules/home/components/Banner";
import { getFeaturedBanner } from "../modules/home/api/getFeaturedBanner";
import { getFeaturedProducts } from "../modules/home/api/getFeaturedProducts";
import FeaturedProducts from "@/modules/home/components/FeaturedProducts";

async function Home() {
  const [banners, featureProducts] = await Promise.all([
    getFeaturedBanner(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Banner banners={banners?.data || []} />
      <FeaturedProducts featureProducts={featureProducts?.data || []} />
    </div>
  );
}

export default Home;
