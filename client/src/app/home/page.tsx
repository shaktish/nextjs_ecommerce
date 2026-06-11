import Banner from "../../modules/home/components/Banner";
import FeaturedProducts from "../../modules/home/components/FeaturedProducts";
import { getFeaturedBanner } from "./api/getFeaturedBanner";
import { getFeaturedProducts } from "./api/getFeaturedProducts";

async function Home() {
  const [banners, featureProducts] = await Promise.all([
    getFeaturedBanner(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div>Generated at: {new Date().toISOString()}</div>

      <Banner banners={banners?.data || []} />
      <FeaturedProducts featureProducts={featureProducts?.data || []} />
    </div>
  );
}

export default Home;
