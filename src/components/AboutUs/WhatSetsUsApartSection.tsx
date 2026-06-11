import { Save, Upload, X } from 'lucide-react';
import React from 'react';
import type { WhatSetsUsApartSectionProps } from './types';

export const WhatSetsUsApartSection: React.FC<WhatSetsUsApartSectionProps> = ({
  formData,
  onInputChange,
  onImageChange,
  onSave,
  isSaving = false,
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: string,
  ) => {
    const file = e.target.files?.[0] || null;
    onImageChange(imageKey, file);
  };

  const removeImage = (imageKey: string) => {
    onImageChange(imageKey, null);
  };

  const getImagePreview = (imageKey: string): string | null => {
    const fileKey = imageKey as keyof typeof formData;
    const existingKey =
      `existing${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}` as keyof typeof formData;

    const file = formData[fileKey];
    const existingImage = formData[existingKey];

    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof existingImage === 'string' && existingImage) {
      return existingImage;
    }
    return null;
  };

  const renderImageUpload = (imageNumber: number) => {
    const imageKey = `image${imageNumber}`;
    const preview = getImagePreview(imageKey);

    return (
      <div key={imageKey} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image {imageNumber}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt={`Preview ${imageNumber}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(imageKey)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label={`Remove image ${imageNumber}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, imageKey)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          What Sets Us Apart Section
        </h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save What Sets Us Apart'}
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label
          htmlFor="whatSetsUsApartTitle"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title *
        </label>
        <input
          type="text"
          id="whatSetsUsApartTitle"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder="What Sets Us Apart"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          htmlFor="whatSetsUsApartDescription"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="whatSetsUsApartDescription"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="What makes us unique..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Statistics Grid */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Years of Yachting Excellence */}
          <div>
            <label
              htmlFor="yearsOfYachtingExcellence"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Years of Yachting Excellence
            </label>
            <input
              type="text"
              id="yearsOfYachtingExcellence"
              name="yearsOfYachtingExcellence"
              value={formData.yearsOfYachtingExcellence}
              onChange={onInputChange}
              placeholder="25+"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Boats Sold in 2024 */}
          <div>
            <label
              htmlFor="boatsSoldIn2024"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Boats Sold in {new Date().getFullYear()}
            </label>
            <input
              type="text"
              id="boatsSoldIn2024"
              name="boatsSoldIn2024"
              value={formData.boatsSoldIn2024}
              onChange={onInputChange}
              placeholder="500+"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Listings Viewed Monthly */}
          <div>
            <label
              htmlFor="listingsViewedMonthly"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Listings Viewed Monthly
            </label>
            <input
              type="text"
              id="listingsViewedMonthly"
              name="listingsViewedMonthly"
              value={formData.listingsViewedMonthly}
              onChange={onInputChange}
              placeholder="100K+"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Images (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((num) => renderImageUpload(num))}
        </div>
      </div>
    </div>
  );
};
