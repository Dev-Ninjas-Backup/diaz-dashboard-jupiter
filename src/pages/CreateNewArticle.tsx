/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateBlogMutation } from '@/redux/features/blogManagement/blogmanagement';
import { ArrowLeft, Eye, Save, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { EditorPreview, RichTextEditor } from '../components/Editor';
import { SeoMetadataSection, type SeoState } from '../components/SeoMetadataSection';

interface ArticleFormData {
  title: string;
  content: string;
  status: string;
  blogImage: File | null;
  blogImagePreview: string;
}

const CreateNewArticle: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [createBlog, { isLoading: isSaving }] = useCreateBlogMutation();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    status: 'DRAFT',
    blogImage: null,
    blogImagePreview: '',
  });

  const [seoData, setSeoData] = useState<SeoState>({
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    secondaryKeywords: '',
    slug: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImageUrl: '',
    authorName: '',
    authorBio: '',
    featuredImageAlt: '',
    featuredImageCaption: '',
    isPillarPage: false,
    parentClusterId: '',
    seriesName: '',
    seriesOrder: '',
    previousArticleId: '',
    nextArticleId: '',
    schemaType: 'ARTICLE',
  });

  const handleSeoChange = (field: keyof SeoState, value: any) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        blogImage: file,
        blogImagePreview: previewUrl,
      }));
    }
  };

  const handleRemoveImage = () => {
    if (formData.blogImagePreview) {
      URL.revokeObjectURL(formData.blogImagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      blogImage: null,
      blogImagePreview: '',
    }));
  };

  const handleSave = async () => {
    const cleanContent = formData.content?.replace(/&nbsp;|\u00a0/g, ' ') || '';
    const formDataToSend = new FormData();
    formDataToSend.append('blogTitle', formData.title);
    formDataToSend.append('blogDescription', cleanContent);
    formDataToSend.append('postStatus', formData.status);

    if (formData.blogImage) {
      formDataToSend.append('blogImage', formData.blogImage);
    }

    // Append SEO & Ecosystem Fields
    if (seoData.seoTitle) formDataToSend.append('seoTitle', seoData.seoTitle);
    if (seoData.metaDescription) formDataToSend.append('metaDescription', seoData.metaDescription);
    if (seoData.focusKeyword) formDataToSend.append('focusKeyword', seoData.focusKeyword);
    if (seoData.secondaryKeywords) formDataToSend.append('secondaryKeywords', seoData.secondaryKeywords);
    if (seoData.slug) formDataToSend.append('slug', seoData.slug);
    if (seoData.canonicalUrl) formDataToSend.append('canonicalUrl', seoData.canonicalUrl);
    formDataToSend.append('robotsIndex', String(seoData.robotsIndex));
    formDataToSend.append('robotsFollow', String(seoData.robotsFollow));
    if (seoData.ogTitle) formDataToSend.append('ogTitle', seoData.ogTitle);
    if (seoData.ogDescription) formDataToSend.append('ogDescription', seoData.ogDescription);
    if (seoData.ogImageUrl) formDataToSend.append('ogImageUrl', seoData.ogImageUrl);
    if (seoData.twitterTitle) formDataToSend.append('twitterTitle', seoData.twitterTitle);
    if (seoData.twitterDescription) formDataToSend.append('twitterDescription', seoData.twitterDescription);
    if (seoData.twitterImageUrl) formDataToSend.append('twitterImageUrl', seoData.twitterImageUrl);
    if (seoData.authorName) formDataToSend.append('authorName', seoData.authorName);
    if (seoData.authorBio) formDataToSend.append('authorBio', seoData.authorBio);
    if (seoData.featuredImageAlt) formDataToSend.append('featuredImageAlt', seoData.featuredImageAlt);
    if (seoData.featuredImageCaption) formDataToSend.append('featuredImageCaption', seoData.featuredImageCaption);
    formDataToSend.append('isPillarPage', String(seoData.isPillarPage));
    if (seoData.parentClusterId) formDataToSend.append('parentClusterId', seoData.parentClusterId);
    if (seoData.seriesName) formDataToSend.append('seriesName', seoData.seriesName);
    if (seoData.seriesOrder) formDataToSend.append('seriesOrder', String(seoData.seriesOrder));
    if (seoData.previousArticleId) formDataToSend.append('previousArticleId', seoData.previousArticleId);
    if (seoData.nextArticleId) formDataToSend.append('nextArticleId', seoData.nextArticleId);
    if (seoData.schemaType) formDataToSend.append('schemaType', seoData.schemaType);

    try {
      await createBlog(formDataToSend).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Article created successfully with SEO metadata',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      navigate('/content');
    } catch (error: any) {
      console.error('Create error:', error);
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || 'Failed to create article',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Create New Article
                </h1>
                <p className="text-sm text-gray-500">
                  Write article content and configure SEO metadata
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreviewMode ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              {formData.blogImagePreview && (
                <img
                  src={formData.blogImagePreview}
                  alt={formData.title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                {formData.title || 'Untitled Article'}
              </h1>
              <EditorPreview content={formData.content} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Article Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your article title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Article Description *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your article content here..."
                  />
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Post Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="UPDATING">Updating</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Select workflow status for editorial tracking
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Image
                  </label>

                  {formData.blogImagePreview ? (
                    <div className="mt-2 relative">
                      <img
                        src={formData.blogImagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label
                        htmlFor="blogImageUpload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          id="blogImageUpload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SEO & Content Ecosystem Section - FULL WIDTH (Matches Edit Form) */}
            <SeoMetadataSection seoData={seoData} onChange={handleSeoChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNewArticle;
