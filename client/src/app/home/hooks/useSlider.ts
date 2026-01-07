'use client'
import { useEffect, useState } from "react";

const useSlider = (banners: any[]) => {
    const [slide, setSlide] = useState(0);

    const nextHandler = () => {
        setSlide((currentSlide) => {
            return currentSlide + 1 === banners.length ? 0 : currentSlide + 1;
        });
    };
    const prevHandler = () => {
        setSlide((currentSlide) => {
            return currentSlide - 1 < 0 ? banners.length - 1 : currentSlide - 1;
        });
    };

    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            nextHandler();
        }, 3000);
        return () => clearInterval(interval);
    }, [banners.length]);

    return {
        slide,
        nextHandler,
        prevHandler
    }
}

export default useSlider;