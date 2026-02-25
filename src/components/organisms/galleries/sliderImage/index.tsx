'use client';

import { detailGalleryState } from '@/src/models/galleries/detail';
import { useState } from 'react';

interface GalleryDetailProps {
  data: detailGalleryState;
}

export default function SliderImage({ data }: GalleryDetailProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { images, title } = data;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious(e as unknown as React.MouseEvent);
    if (e.key === 'ArrowRight') goToNext(e as unknown as React.MouseEvent);
  };

  // Grid layout: first image large, rest in 2x2 grid
  const mainImage = images[0];
  const gridImages = images.slice(1, 5); // Max 4 images for grid
  const remainingCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <div className="w-full mx-auto p-6 space-y-8 ">
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>By {data.createdBy}</span>
          <span>•</span>
          <span>{new Date(data.createdAt).toLocaleDateString('id-ID')}</span>
          <span>•</span>
          <span>{images.length} photos</span>
        </div>
      </div>

      {/* Grid Layout - Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden bg-gray-100"  style={{ maxHeight: '75vh', height: '75vh' }}>
        {/* Main Large Image */}
        {mainImage && (
          <div 
            className="relative aspect-[4/3] md:aspect-auto md:row-span-2 cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img
              src={mainImage.url}
              alt={mainImage.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        )}

        {/* Right Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {gridImages.map((image, idx) => (
            <div
              key={image.id}
              className="relative cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => openLightbox(idx + 1)}
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* +X overlay on last image if more exist */}
              {idx === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Slider Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white/80 font-medium">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Image Container */}
          <div 
            className="max-w-5xl max-h-[80vh] mx-16 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Name Caption */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-white/90 text-lg font-medium">{images[selectedIndex].name}</p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto px-4 py-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(idx);
                }}
                className={`
                  flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                  ${idx === selectedIndex 
                    ? 'border-white scale-110' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}