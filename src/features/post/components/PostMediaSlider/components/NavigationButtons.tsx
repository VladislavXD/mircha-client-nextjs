import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
};

export const NavigationButtons: React.FC<Props> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
}) => {
  if (totalSlides <= 1) return null;

  return (
    <>
      {currentSlide > 0 && (
        <button
          aria-label="Previous"
          className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm shadow-lg transition-all"
          onClick={onPrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          aria-label="Next"
          className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm shadow-lg transition-all"
          onClick={onNext}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
