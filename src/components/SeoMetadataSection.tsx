import React, { useState } from 'react';
import { Globe, Share2, Layers, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export interface SeoState {
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  slug: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  // OG & Twitter
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageUrl: string;
  // Editorial & Author
  authorName: string;
  authorBio: string;
  featuredImageAlt: string;
  featuredImageCaption: string;
  // Cluster & Series
  isPillarPage: boolean;
  parentClusterId: string;
  seriesName: string;
  seriesOrder: number | string;
  previousArticleId: string;
  nextArticleId: string;
  // Schema
  schemaType: string;
}

interface SeoMetadataSectionProps {
  seoData: SeoState;
  onChange: (field: keyof SeoState, value: any) => void;
}

export const SeoMetadataSection: React.FC<SeoMetadataSectionProps> = ({
  seoData,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'seo' | 'social' | 'cluster' | 'schema'>('seo');
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">
            SEO & Content Ecosystem Controls
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
            Search & Metadata
          </span>
        </div>
        <button type="button" className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'seo'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="w-4 h-4" /> SEO Meta
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'social'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Share2 className="w-4 h-4" /> Open Graph & Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cluster')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'cluster'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layers className="w-4 h-4" /> Content Cluster & Series
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'schema'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Author & Structured Data
            </button>
          </div>

          {/* TAB 1: SEO META */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">SEO Title (Title Tag)</label>
                  <span className={`text-xs ${seoData.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                    {seoData.seoTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={seoData.seoTitle}
                  onChange={(e) => onChange('seoTitle', e.target.value)}
                  placeholder="e.g. Complete Guide to Selling a Boat in Florida (2026)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <span className={`text-xs ${seoData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    {seoData.metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoData.metaDescription}
                  onChange={(e) => onChange('metaDescription', e.target.value)}
                  placeholder="Concise summary for Google search snippet..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keyword</label>
                  <input
                    type="text"
                    value={seoData.focusKeyword}
                    onChange={(e) => onChange('focusKeyword', e.target.value)}
                    placeholder="e.g. sell boat privately Florida"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={seoData.secondaryKeywords}
                    onChange={(e) => onChange('secondaryKeywords', e.target.value)}
                    placeholder="boat pricing, sea trial checklist, boat title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL Slug</label>
                  <input
                    type="text"
                    value={seoData.slug}
                    onChange={(e) => onChange('slug', e.target.value)}
                    placeholder="complete-guide-selling-boat-florida"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={seoData.canonicalUrl}
                    onChange={(e) => onChange('canonicalUrl', e.target.value)}
                    placeholder="https://jupitermarinesales.com/blogs/complete-guide..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={seoData.robotsIndex}
                    onChange={(e) => onChange('robotsIndex', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Index in Search Engines (robots: index)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={seoData.robotsFollow}
                    onChange={(e) => onChange('robotsFollow', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Follow Links (robots: follow)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL & OPEN GRAPH */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-800">Facebook / Open Graph Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => onChange('ogTitle', e.target.value)}
                    placeholder="Leave empty to use SEO Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL (1200x630)</label>
                  <input
                    type="text"
                    value={seoData.ogImageUrl}
                    onChange={(e) => onChange('ogImageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 pt-2">X / Twitter Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card Title</label>
                  <input
                    type="text"
                    value={seoData.twitterTitle}
                    onChange={(e) => onChange('twitterTitle', e.target.value)}
                    placeholder="Leave empty to use SEO Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image URL</label>
                  <input
                    type="text"
                    value={seoData.twitterImageUrl}
                    onChange={(e) => onChange('twitterImageUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT CLUSTER & SERIES */}
          {activeTab === 'cluster' && (
            <div className="space-y-5">
              <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.isPillarPage}
                  onChange={(e) => onChange('isPillarPage', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <div>
                  <span className="font-semibold text-sm text-blue-900 block">Mark as Core Pillar Guide</span>
                  <span className="text-xs text-blue-700">Designate this article as a foundational pillar page for content clusters.</span>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series Name</label>
                  <input
                    type="text"
                    value={seoData.seriesName}
                    onChange={(e) => onChange('seriesName', e.target.value)}
                    placeholder="e.g. The Complete Guide to Selling a Boat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series Order (Step Number)</label>
                  <input
                    type="number"
                    value={seoData.seriesOrder}
                    onChange={(e) => onChange('seriesOrder', e.target.value)}
                    placeholder="1, 2, 3..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Article ID / Link</label>
                  <input
                    type="text"
                    value={seoData.previousArticleId}
                    onChange={(e) => onChange('previousArticleId', e.target.value)}
                    placeholder="Previous article slug or ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Article ID / Link</label>
                  <input
                    type="text"
                    value={seoData.nextArticleId}
                    onChange={(e) => onChange('nextArticleId', e.target.value)}
                    placeholder="Next article slug or ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUTHOR & SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={seoData.authorName}
                    onChange={(e) => onChange('authorName', e.target.value)}
                    placeholder="e.g. Darren Diaz"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Structured Data Schema Type</label>
                  <select
                    value={seoData.schemaType}
                    onChange={(e) => onChange('schemaType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="BLOG_POSTING">BlogPosting</option>
                    <option value="FAQ_PAGE">FAQPage</option>
                    <option value="HOW_TO">HowTo</option>
                    <option value="LOCAL_BUSINESS">LocalBusiness</option>
                    <option value="ORGANIZATION">Organization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image Alt Text</label>
                  <input
                    type="text"
                    value={seoData.featuredImageAlt}
                    onChange={(e) => onChange('featuredImageAlt', e.target.value)}
                    placeholder="Descriptive alt text for SEO"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image Caption</label>
                  <input
                    type="text"
                    value={seoData.featuredImageCaption}
                    onChange={(e) => onChange('featuredImageCaption', e.target.value)}
                    placeholder="Image credit or caption"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
