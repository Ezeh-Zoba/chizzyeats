"use client";

import Image from "next/image";

interface RecipeGalleryThumbsProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function RecipeGalleryThumbs({ images, activeIndex, onSelect }: RecipeGalleryThumbsProps) {
  if (images.length < 2) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 mb-8">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => onSelect(i)}
            className="relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden"
            style={{
              border: activeIndex === i ? "2.5px solid #FFC72C" : "2.5px solid transparent",
              opacity: activeIndex === i ? 1 : 0.7,
            }}
          >
            <Image src={img} alt={`Gallery ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
