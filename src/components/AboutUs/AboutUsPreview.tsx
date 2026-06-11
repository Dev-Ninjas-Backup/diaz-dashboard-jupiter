import React from 'react';
import { EditorPreview } from '../Editor';
import type { AboutUsPreviewProps } from './types';

export const AboutUsPreview: React.FC<AboutUsPreviewProps> = ({
  formData,
  ourStoryData,
  missionVisionData,
  whatSetsUsApartData,
}) => {
  const getImageUrl = (
    data:
      | typeof ourStoryData
      | typeof missionVisionData
      | typeof whatSetsUsApartData,
    imageKey: string,
  ): string | null => {
    const fileKey = imageKey as keyof typeof data;
    const existingKey =
      `existing${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}` as keyof typeof data;

    const file = data[fileKey];
    const existingImage = data[existingKey];

    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof existingImage === 'string' && existingImage) {
      return existingImage;
    }
    return null;
  };

  const ourStoryImages = [1, 2, 3, 4, 5]
    .map((num) => getImageUrl(ourStoryData, `image${num}`))
    .filter((url): url is string => url !== null);

  const missionVisionImages = [1, 2, 3]
    .map((num) => getImageUrl(missionVisionData, `image${num}`))
    .filter((url): url is string => url !== null);

  const whatSetsUsApartImages = [1, 2]
    .map((num) => getImageUrl(whatSetsUsApartData, `image${num}`))
    .filter((url): url is string => url !== null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* About Title */}
        <h1 className="text-4xl font-bold text-gray-900">
          {formData.aboutTitle || 'About Us'}
        </h1>

        {/* About Description */}
        <div className="prose prose-lg max-w-none">
          <EditorPreview content={formData.aboutDescription} />
        </div>

        {/* Mission & Vision — shown below via missionVisionData */}

        {/* Our Story Section */}
        {(ourStoryData.title ||
          ourStoryData.description ||
          ourStoryImages.length > 0) && (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {ourStoryData.title || 'Our Story'}
            </h2>

            {ourStoryData.description && (
              <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
                {ourStoryData.description}
              </p>
            )}

            {ourStoryImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {ourStoryImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={imageUrl}
                      alt={`Our Story ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mission & Vision Section */}
        {(missionVisionData.title ||
          missionVisionData.missionTitle ||
          missionVisionData.visionTitle ||
          missionVisionData.description ||
          missionVisionData.visionDescription ||
          missionVisionImages.length > 0) && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {missionVisionData.title || 'Mission & Vision'}
            </h2>

            <div className="space-y-6">
              {/* Mission */}
              {(missionVisionData.missionTitle ||
                missionVisionData.description) && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {missionVisionData.missionTitle || 'Our Mission'}
                  </h3>
                  {missionVisionData.description && (
                    <p className="text-gray-700 text-lg whitespace-pre-wrap">
                      {missionVisionData.description}
                    </p>
                  )}
                </div>
              )}

              {/* Vision */}
              {(missionVisionData.visionTitle ||
                missionVisionData.visionDescription) && (
                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {missionVisionData.visionTitle || 'Our Vision'}
                  </h3>
                  {missionVisionData.visionDescription && (
                    <p className="text-gray-700 text-lg whitespace-pre-wrap">
                      {missionVisionData.visionDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Images Gallery */}
              {missionVisionImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {missionVisionImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden shadow-md"
                    >
                      <img
                        src={imageUrl}
                        alt={`Mission & Vision ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* What Sets Us Apart Section */}
        {(whatSetsUsApartData.title ||
          whatSetsUsApartData.description ||
          whatSetsUsApartData.yearsOfYachtingExcellence ||
          whatSetsUsApartData.boatsSoldIn2024 ||
          whatSetsUsApartData.listingsViewedMonthly ||
          whatSetsUsApartImages.length > 0) && (
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {whatSetsUsApartData.title || 'What Sets Us Apart'}
            </h2>

            {whatSetsUsApartData.description && (
              <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
                {whatSetsUsApartData.description}
              </p>
            )}

            {/* Statistics Grid */}
            {(whatSetsUsApartData.yearsOfYachtingExcellence ||
              whatSetsUsApartData.boatsSoldIn2024 ||
              whatSetsUsApartData.listingsViewedMonthly) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {whatSetsUsApartData.yearsOfYachtingExcellence && (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {whatSetsUsApartData.yearsOfYachtingExcellence}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Years of Yachting Excellence
                    </div>
                  </div>
                )}

                {whatSetsUsApartData.boatsSoldIn2024 && (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {whatSetsUsApartData.boatsSoldIn2024}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Boats Sold in {new Date().getFullYear()}
                    </div>
                  </div>
                )}

                {whatSetsUsApartData.listingsViewedMonthly && (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {whatSetsUsApartData.listingsViewedMonthly}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Listings Viewed Monthly
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images Gallery */}
            {whatSetsUsApartImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {whatSetsUsApartImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={imageUrl}
                      alt={`What Sets Us Apart ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
