import React from 'react';

interface SiteSelectorProps {
  selectedSite: 'FLORIDA' | 'JUPITER';
  onChange: (site: 'FLORIDA' | 'JUPITER') => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = () => {
  return null;
};

export default SiteSelector;
