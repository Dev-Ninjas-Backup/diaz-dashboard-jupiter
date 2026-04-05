import React from 'react';

interface ContactInfoSidebarProps {
  selectedSite: 'FLORIDA' | 'JUPITER';
  onSiteChange: (site: 'FLORIDA' | 'JUPITER') => void;
}

const ContactInfoSidebar: React.FC<ContactInfoSidebarProps> = () => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-600">Site: Jupiter</p>
      </div>
    </div>
  );
};

export default ContactInfoSidebar;
