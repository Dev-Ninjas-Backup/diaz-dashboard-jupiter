import { ArrowLeft, Eye, Plus, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  useCreateFooterMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,
} from '../redux/features/contentmanagement/contentmanagement';

interface SocialMediaLink {
  platform: string;
  url: string;
  icon?: string;
}

interface LinkItem {
  text: string;
  url: string;
}

interface ApiLinkItem {
  label: string;
  url: string;
}

const Footer: React.FC = () => {
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();

  // Fetch footer data for selected site
  const {
    data: footerData,
    isLoading,
    isError,
    error,
  } = useGetFooterQuery(
    { site: selectedSite },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [createFooter, { isLoading: isCreating }] = useCreateFooterMutation();
  const [updateFooter, { isLoading: isUpdating }] = useUpdateFooterMutation();

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>([
    { text: '', url: '' },
  ]);
  const [policyLinks, setPolicyLinks] = useState<LinkItem[]>([
    { text: '', url: '' },
  ]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([
    { platform: '', url: '' },
  ]);
  const [copyrightText, setCopyrightText] = useState('');

  // Check if footer exists (ignore 404 errors)
  console.log('Footer Error:', error);
  console.log('Is Error:', isError);
  console.log('Error Status:', (error as any)?.status);
  const is404Error = isError && (error as any)?.status === 404;
  const footerExists = !is404Error && footerData?.data?.id;

  // Load footer data when it's available
  useEffect(() => {
    if (footerData?.data) {
      const data = footerData.data;
      setCompanyName(data.companyName || '');
      setCompanyDescription(data.companyDescription || '');

      // Map quickLinks from API format (label) to form format (text)
      setQuickLinks(
        data.quickLinks && data.quickLinks.length > 0
          ? data.quickLinks.map((link: ApiLinkItem) => ({
              text: link.label,
              url: link.url,
            }))
          : [{ text: '', url: '' }],
      );

      // Map policyLinks from API format (label) to form format (text)
      setPolicyLinks(
        data.policyLinks && data.policyLinks.length > 0
          ? data.policyLinks.map((link: ApiLinkItem) => ({
              text: link.label,
              url: link.url,
            }))
          : [{ text: '', url: '' }],
      );

      setPhone(data.phone || '');
      setEmail(data.email || '');

      // Social media links already match the format
      setSocialMediaLinks(
        data.socialMediaLinks && data.socialMediaLinks.length > 0
          ? data.socialMediaLinks
          : [{ platform: '', url: '' }],
      );

      setCopyrightText(data.copyrightText || '');
    } else if (is404Error) {
      // Reset form for new site with no data
      setCompanyName('');
      setCompanyDescription('');
      setQuickLinks([{ text: '', url: '' }]);
      setPolicyLinks([{ text: '', url: '' }]);
      setPhone('');
      setEmail('');
      setSocialMediaLinks([{ platform: '', url: '' }]);
      setCopyrightText('');
    }
  }, [footerData, is404Error, selectedSite]);

  // Handle adding new quick link
  const handleAddQuickLink = () => {
    setQuickLinks([...quickLinks, { text: '', url: '' }]);
  };

  // Handle removing quick link
  const handleRemoveQuickLink = (index: number) => {
    const newLinks = quickLinks.filter((_, i) => i !== index);
    setQuickLinks(newLinks.length > 0 ? newLinks : [{ text: '', url: '' }]);
  };

  // Handle quick link change
  const handleQuickLinkChange = (
    index: number,
    field: 'text' | 'url',
    value: string,
  ) => {
    const newLinks = [...quickLinks];
    newLinks[index][field] = value;
    setQuickLinks(newLinks);
  };

  // Handle adding new policy link
  const handleAddPolicyLink = () => {
    setPolicyLinks([...policyLinks, { text: '', url: '' }]);
  };

  // Handle removing policy link
  const handleRemovePolicyLink = (index: number) => {
    const newLinks = policyLinks.filter((_, i) => i !== index);
    setPolicyLinks(newLinks.length > 0 ? newLinks : [{ text: '', url: '' }]);
  };

  // Handle policy link change
  const handlePolicyLinkChange = (
    index: number,
    field: 'text' | 'url',
    value: string,
  ) => {
    const newLinks = [...policyLinks];
    newLinks[index][field] = value;
    setPolicyLinks(newLinks);
  };

  // Handle adding new social media link
  const handleAddSocialLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: '', url: '' }]);
  };

  // Handle removing social media link
  const handleRemoveSocialLink = (index: number) => {
    const newLinks = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(
      newLinks.length > 0 ? newLinks : [{ platform: '', url: '' }],
    );
  };

  // Handle social media link change
  const handleSocialLinkChange = (
    index: number,
    field: 'platform' | 'url',
    value: string,
  ) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index][field] = value;
    setSocialMediaLinks(newLinks);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!companyName.trim() || !copyrightText.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Company Name and Copyright Text are required!',
      });
      return;
    }

    // Prepare footer content - map text back to label for API
    const footerContent = {
      companyName: companyName.trim(),
      companyDescription: companyDescription.trim(),
      quickLinks: quickLinks
        .filter((link) => link.text.trim() && link.url.trim())
        .map((link) => ({ label: link.text.trim(), url: link.url.trim() })),
      policyLinks: policyLinks
        .filter((link) => link.text.trim() && link.url.trim())
        .map((link) => ({ label: link.text.trim(), url: link.url.trim() })),
      phone: phone.trim(),
      email: email.trim(),
      socialMediaLinks: socialMediaLinks
        .filter((link) => link.platform.trim() && link.url.trim())
        .map((link) => ({
          platform: link.platform.trim(),
          url: link.url.trim(),
          icon: link.icon || `fab fa-${link.platform.toLowerCase()}`,
        })),
      copyrightText: copyrightText.trim(),
    };

    try {
      if (footerExists) {
        // Update existing footer using PATCH
        await updateFooter({
          site: selectedSite,
          footerContent,
        }).unwrap();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Footer updated successfully!',
        });
      } else {
        // Create new footer using POST
        await createFooter({
          site: selectedSite,
          footerContent: {
            ...footerContent,
            site: selectedSite,
          },
        }).unwrap();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Footer created successfully!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save footer. Please try again.',
      });
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading footer data...</p>
        </div>
      </div>
    );
  }

  // Only show error if it's NOT a 404
  if (isError && !is404Error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading footer data</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Footer Management
            </h1>
            <p className="text-gray-600 mt-1">
              {footerExists ? 'Update' : 'Create'} footer content for your
              website
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye size={18} />
            {isPreview ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      {isPreview ? (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Footer Preview</h2>

          {/* Footer Preview */}
          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-3">
                  {companyName || 'Company Name'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {companyDescription || 'Company description goes here...'}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  {quickLinks
                    .filter((link) => link.text.trim())
                    .map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Policy Links */}
              <div>
                <h4 className="font-semibold mb-3">Policies</h4>
                <ul className="space-y-2">
                  {policyLinks
                    .filter((link) => link.text.trim())
                    .map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  {phone && (
                    <p className="text-sm text-gray-300">Phone: {phone}</p>
                  )}
                  {email && (
                    <p className="text-sm text-gray-300">Email: {email}</p>
                  )}
                </div>

                {/* Social Media Links */}
                <div className="flex gap-4">
                  {socialMediaLinks
                    .filter((link) => link.platform.trim())
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className="text-gray-300 hover:text-white transition-colors capitalize"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.platform}
                      </a>
                    ))}
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-6 text-center text-sm text-gray-400">
                {copyrightText || '© 2024 Company Name. All rights reserved.'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Form
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
                required
              />
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company description"
              />
            </div>

            {/* Quick Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quick Links
                </label>
                <button
                  type="button"
                  onClick={handleAddQuickLink}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) =>
                        handleQuickLinkChange(index, 'text', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Link text"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleQuickLinkChange(index, 'url', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Link URL"
                    />
                    {quickLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Remove quick link"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Policy Links
                </label>
                <button
                  type="button"
                  onClick={handleAddPolicyLink}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {policyLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) =>
                        handlePolicyLinkChange(index, 'text', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Link text"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handlePolicyLinkChange(index, 'url', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Link URL"
                    />
                    {policyLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePolicyLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Remove policy link"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Social Media Links
                </label>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>
              <div className="space-y-3">
                {socialMediaLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          index,
                          'platform',
                          e.target.value,
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Platform (e.g., Facebook)"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleSocialLinkChange(index, 'url', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Social media URL"
                    />
                    {socialMediaLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSocialLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Remove social media link"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="© 2024 Company Name. All rights reserved."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isCreating || isUpdating
                  ? 'Saving...'
                  : footerExists
                    ? 'Update Footer'
                    : 'Create Footer'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Footer;
