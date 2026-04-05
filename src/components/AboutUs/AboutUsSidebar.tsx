import React from 'react';
import type { AboutUsSidebarProps } from './types';

export const AboutUsSidebar: React.FC<AboutUsSidebarProps> = ({
  selectedSite,
  updatedAt,
}) => {
  return (
      <div className="lg:col-span-1 space-y-6">
      {/* Page Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Page Info</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Type:</span> Static Page
          </p>
          <p>
            <span className="font-medium">Site:</span> {selectedSite}
          </p>
          {updatedAt && (
            <p>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
