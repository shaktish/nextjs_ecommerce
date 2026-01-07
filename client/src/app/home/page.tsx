"use client";
import {
  FeatureBanner,
  useFeatureBannerStore,
} from "@/store/useFeatureBannerStore";
import { useEffect, useState } from "react";
import Banner from "./components/Banner";

function Home() {
  const [banners, setBanners] = useState<FeatureBanner[]>([]);
  const { isLoading, getAllFeatureBanners } = useFeatureBannerStore();

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getAllFeatureBanners();
      setBanners(data);
    };
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Banner banners={banners} />
      <section className="py-16"></section>
    </div>
  );
}

export default Home;
