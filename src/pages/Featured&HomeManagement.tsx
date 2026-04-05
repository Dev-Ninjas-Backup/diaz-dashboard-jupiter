import HomeBannersSection from '@/components/FeaturedAndHomeComponents/HomeBannersSection';
import React from 'react';

const FeaturedAndHomeManagement: React.FC = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Featured & Homepage Control
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage homepage content
        </p>
      </div>
      <HomeBannersSection website="JUPITER" />
    </div>
  );
};

export default FeaturedAndHomeManagement;
