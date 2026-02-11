import React from 'react';

type Props = {
  totalSlides: number;
  currentSlide: number;
  onSlideClick: (index: number) => void;
};

export const PaginationDots: React.FC<Props> = ({
  totalSlides,
  currentSlide,
  onSlideClick,
}) => {
  if (totalSlides <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
      {Array.from({ length: totalSlides }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSlideClick(idx)}
          className={`transition-all ${
            idx === currentSlide
              ? 'w-6 h-2 bg-white rounded-full' 
              : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70'
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};
