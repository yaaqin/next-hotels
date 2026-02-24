'use client';

import { imageListState } from '@/src/models/images/list';
import { ArrowDownDoubleIcon, CheckListIcon, CheckmarkSquare02Icon } from 'hugeicons-react';
import { useState } from 'react';

interface ImageSelectorProps {
  images: imageListState[];
  onSubmit: (selectedIds: string[]) => void;
}

export default function ImageSelector({ images, onSubmit }: ImageSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedArray = Array.from(selectedIds);
    console.log('Selected Image IDs:', selectedArray);
    onSubmit(selectedArray);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const selectAll = () => {
    setSelectedIds(new Set(images.map(img => img.id)));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Controls */}
      <div className="flex gap-3 items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-blue-600">{selectedIds.size}</span> / {images.length}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const isSelected = selectedIds.has(image.id);
          const orderNumber = isSelected 
            ? Array.from(selectedIds).indexOf(image.id) + 1 
            : null;

          return (
            <div
              key={image.id}
              onClick={() => toggleSelection(image.id)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* Image */}
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay when selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10" />
                )}
              </div>

              {/* Selection Indicator */}
              <div className={`
                absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center
                font-bold text-sm transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 text-white scale-110' 
                  : 'bg-white/90 text-gray-400 border-2 border-gray-300'
                }
              `}>
                {isSelected ? orderNumber : ''}
              </div>

              {/* ID Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-xs font-mono truncate">
                  ID: {image.id}
                </p>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 text-white rounded-md bg-blue-600 blue-600 flex items-center justify-center">
                  <CheckmarkSquare02Icon/>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
        <button
          type="submit"
          disabled={selectedIds.size === 0}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white transition-all
            ${selectedIds.size > 0
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Submit Selected Images ({selectedIds.size})
        </button>
      </div>
    </form>
  );
}