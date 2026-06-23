"use client";
import { FeatureBannerAPI } from "@/store/useFeatureBannerStore";
import useSlider from "../hooks/useSlider";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  banners: FeatureBannerAPI[];
}
const Banner = ({ banners }: BannerProps) => {
  const [isBannerHover, setIsBannerHover] = useState(false);
  const { slide, nextHandler, prevHandler } = useSlider(banners, isBannerHover);

  return (
    <div
      className="group relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsBannerHover(true)}
      onMouseLeave={() => setIsBannerHover(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {banners?.length > 0 &&
          banners?.map((banner, index) => {
            return (
              <div className="relative min-w-full h-full" key={banner.id}>
                <Link href={banner.redirectUrl}>
                  <Image
                    src={banner.url}
                    alt={`Banner ${index}`}
                    className="absolute inset-0 w-full h-full object-cover object-left"
                    priority
                    fill
                  />
                </Link>
                s
              </div>
            );
          })}
      </div>

      <button
        type="button"
        aria-label="Previous banner"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        data-carousel-prev
        onClick={prevHandler}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/50 dark:bg-gray-800/30">
          <span>
            <ArrowLeft />
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Next banner"
        className="absolute top-0 end-0 z-30 items-center justify-center h-full px-4 cursor-pointer focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextHandler}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/50 dark:bg-gray-800/30 ">
          <ArrowRight />
        </span>
      </button>
    </div>
  );
};

export default Banner;
