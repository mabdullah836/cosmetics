"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/supabase';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [mainImage, setMainImage] = useState(images.find(img => img.is_primary)?.image_url || images[0]?.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop');

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          src={mainImage}
          alt="Product image"
          fill
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setMainImage(image.image_url)}
            className={cn(
              'relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors',
              image.image_url === mainImage ? 'border-primary' : 'border-transparent'
            )}
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || 'Product thumbnail'}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
