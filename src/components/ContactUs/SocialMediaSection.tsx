import {
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Plus,
  Trash2,
  Link2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { type SocialMedia } from './types';

interface SocialMediaSectionProps {
  socialMedia: SocialMedia;
  onChange: (updatedSocialMedia: SocialMedia) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socialMedia,
  onChange,
}) => {
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);

  // Initialize and sync links from socialMedia prop
  useEffect(() => {
    const areRecordsEqual = (
      a: Record<string, string>,
      b: Record<string, string>,
    ) => {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => a[key] === b[key]);
    };

    const currentObj: Record<string, string> = {};
    links.forEach((item) => {
      const key = item.platform.trim();
      if (key) {
        currentObj[key] = item.url.trim();
      }
    });

    const propObj = socialMedia || {};

    if (!areRecordsEqual(currentObj, propObj)) {
      const entries = Object.entries(propObj);
      if (entries.length > 0) {
        setLinks(entries.map(([platform, url]) => ({ platform, url })));
      } else {
        setLinks([
          { platform: 'Facebook', url: '' },
          { platform: 'Twitter', url: '' },
          { platform: 'LinkedIn', url: '' },
          { platform: 'YouTube', url: '' },
        ]);
      }
    }
  }, [socialMedia]);

  const updateParent = (updatedLinks: typeof links) => {
    const obj: Record<string, string> = {};
    updatedLinks.forEach((item) => {
      const key = item.platform.trim();
      if (key) {
        obj[key] = item.url.trim();
      }
    });
    onChange(obj);
  };

  const handlePlatformChange = (index: number, newPlatform: string) => {
    const updated = [...links];
    updated[index].platform = newPlatform;
    setLinks(updated);
    updateParent(updated);
  };

  const handleUrlChange = (index: number, newUrl: string) => {
    const updated = [...links];
    updated[index].url = newUrl;
    setLinks(updated);
    updateParent(updated);
  };

  const addLink = () => {
    const updated = [...links, { platform: '', url: '' }];
    setLinks(updated);
    updateParent(updated);
  };

  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    updateParent(updated);
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook'))
      return <Facebook className="w-4 h-4 text-blue-600" />;
    if (p.includes('linkedin'))
      return <Linkedin className="w-4 h-4 text-blue-700" />;
    if (p.includes('twitter') || p === 'x')
      return <Twitter className="w-4 h-4 text-sky-500" />;
    if (p.includes('youtube'))
      return <Youtube className="w-4 h-4 text-red-600" />;
    if (p.includes('instagram'))
      return <Instagram className="w-4 h-4 text-pink-600" />;
    return <Link2 className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          Social Media Links
        </h3>
        <button
          type="button"
          onClick={addLink}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Social Link
        </button>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            {/* Platform Name Input */}
            <div className="w-1/3">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                {getPlatformIcon(link.platform)}
                Platform
              </label>
              <input
                type="text"
                value={link.platform}
                onChange={(e) => handlePlatformChange(index, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="e.g. TikTok"
              />
            </div>

            {/* URL Input */}
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Link URL
              </label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="https://..."
              />
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {links.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No social media links added yet. Click "Add Social Link" to begin.
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialMediaSection;
