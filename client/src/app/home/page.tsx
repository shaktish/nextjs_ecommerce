"use client";
import {
  FeatureBanner,
  useFeatureBannerStore,
} from "@/store/useFeatureBannerStore";
import { useEffect, useState } from "react";
import Banner from "../../modules/home/components/Banner";
import { useProductStore } from "@/store/useProductStore";
import FeaturedProducts from "../../modules/home/components/FeaturedProducts";
function Home() {
  const [banners, setBanners] = useState<FeatureBanner[]>([]);
  const { isLoading, getAllFeatureBanners } = useFeatureBannerStore();
  const { getFeatureProducts, featureProducts } = useProductStore();

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getAllFeatureBanners();
      setBanners(data);
    };
    getFeatureProducts();
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Banner banners={banners} />
      <FeaturedProducts featureProducts={featureProducts} />
    </div>
  );
}

export default Home;
