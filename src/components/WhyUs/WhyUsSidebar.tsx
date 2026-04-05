import { Trash2 } from 'lucide-react';
import React from 'react';

interface WhyUsSidebarProps {
  selectedSite: 'FLORIDA' | 'JUPITER';
  onSiteChange: (site: 'FLORIDA' | 'JUPITER') => void;
  hasData: boolean;
  onDelete: () => void;
}

const WhyUsSidebar: React.FC<WhyUsSidebarProps> = ({
  selectedSite,
  onSiteChange: _onSiteChange,
  hasData,
  onDelete,
}) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {hasData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Danger Zone
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Delete the Why Us content for {selectedSite}
          </p>
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Why Us
          </button>
        </div>
      )}
    </div>
  );
};

export default WhyUsSidebar;
