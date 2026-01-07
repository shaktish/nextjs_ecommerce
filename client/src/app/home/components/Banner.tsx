import { FeatureBanner } from "@/store/useFeatureBannerStore";
import useSlider from "../hooks/useSlider";

interface BannerProps {
  banners: FeatureBanner[];
}
const Banner = ({ banners }: BannerProps) => {
  const { slide, nextHandler, prevHandler } = useSlider(banners);
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {banners?.length > 0 &&
          banners?.map((item, index) => {
            return (
              <div className="relative min-w-full h-full" key={item.id}>
                <img
                  src={item.url}
                  alt={`Banner ${index}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            );
          })}
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
        onClick={prevHandler}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <span>Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextHandler}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <span>Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
