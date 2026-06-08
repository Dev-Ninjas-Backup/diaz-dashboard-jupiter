/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { BsBookmarkFill } from 'react-icons/bs';
import { Eye } from 'lucide-react';
import { IoLocationOutline } from 'react-icons/io5';

interface ProductCardProps {
  product: any;
  isPremium: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isPremium }) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US')}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url =
      import.meta.env.VITE_FLORIDA_FRONTEND_URL ||
      'https://development.floridayachttrader.com';
    window.open(`${url}/search-listing/${product.id}`, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
    >
      <div className="relative w-full aspect-[4/2.6] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
        />
        {isPremium && (
          <button className="absolute -top-1 right-4" aria-label="Bookmark">
            <BsBookmarkFill className="text-5xl text-accent" />
          </button>
        )}

        {product.views !== undefined && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <Eye className="w-4 h-4" />
            <span>{product.views.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="p-3 2xl:p-5 pb-3 2xl:pb-5">
        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 mb-3">
          <IoLocationOutline className="text-sm 2xl:text-md text-black" />
          <span className="text-sm 2xl:text-md font-normal">
            {product.location}
          </span>
        </div>

        <h3 className="text-lg 2xl:text-xl font-semibold mb-2 2xl:mb-4">
          {product.name}
        </h3>

        <div className="flex items-start justify-between gap-2 2xl:gap-4 mb-10 border-y border-gray-200 py-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Make</p>
            <p className="text-sm font-medium text-gray-900">
              {product.brand_make}
            </p>
          </div>
          <div className="max-w-[100px]">
            <p className="text-sm text-gray-500 mb-1">Model</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {product.model}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Year</p>
            <p className="text-sm font-medium text-gray-900">
              {product.built_year}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <p className="text-lg 2xl:text-xl font-semibold text-primary">
          Price: {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
