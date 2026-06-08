import {
  useCreateAiSearchBannerMutation,
  useDeleteAiSearchBannerMutation,
  useGetAiSearchBannerQuery,
  useUpdateAiSearchBannerMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import { ArrowLeft, Eye, Save, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface BannerFormData {
  bannerTitle: string;
  subtitle: string;
  imageFile: File | null;
  existingImageUrl: string;
}

const AiSearchBannerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>({
    bannerTitle: '',
    subtitle: '',
    imageFile: null,
    existingImageUrl: '',
  });

  const {
    data: bannerResponse,
    isLoading,
    refetch,
  } = useGetAiSearchBannerQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [createBanner, { isLoading: isCreating }] =
    useCreateAiSearchBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] =
    useUpdateAiSearchBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] =
    useDeleteAiSearchBannerMutation();

  const isSaving = isCreating || isUpdating;

  // Extract banner object from NestJS Response { message, data: [...] }
  const existingBanner =
    bannerResponse?.data && bannerResponse.data.length > 0
      ? bannerResponse.data[0]
      : null;

  useEffect(() => {
    if (existingBanner) {
      setFormData({
        bannerTitle: existingBanner.bannerTitle || '',
        subtitle: existingBanner.subtitle || '',
        imageFile: null,
        existingImageUrl: existingBanner.aiSearchBanner?.url || '',
      });
    } else {
      setFormData({
        bannerTitle: '',
        subtitle: '',
        imageFile: null,
        existingImageUrl: '',
      });
    }
  }, [existingBanner]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      existingImageUrl: '',
    }));
  };

  const handleSave = async () => {
    if (!formData.bannerTitle.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter a Banner Title.',
      });
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('bannerTitle', formData.bannerTitle);
      dataToSend.append('subtitle', formData.subtitle);

      if (formData.imageFile) {
        dataToSend.append('aisearchBanner', formData.imageFile);
      }

      if (existingBanner) {
        // Update endpoint
        await updateBanner({
          id: existingBanner.id,
          formData: dataToSend,
        }).unwrap();
      } else {
        // Create endpoint
        await createBanner(dataToSend).unwrap();
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `AI Search Banner has been ${existingBanner ? 'updated' : 'created'} successfully!`,
      });

      refetch();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: error?.data?.message || 'Failed to save AI Search Banner.',
      });
    }
  };

  const handleDelete = async () => {
    if (!existingBanner) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the AI Search Banner. You can create a new one afterwards.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteBanner(existingBanner.id).unwrap();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'AI Search Banner has been deleted.',
        });
        refetch();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: error?.data?.message || 'Failed to delete AI Search Banner.',
        });
      }
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  // Generate preview image URL dynamically
  const previewImageSrc = formData.imageFile
    ? URL.createObjectURL(formData.imageFile)
    : formData.existingImageUrl;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  AI Search Banner
                </h1>
                <p className="text-sm text-gray-500">
                  JUPITER Site Only Banner Content
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 ml-3">Loading banner data...</p>
          </div>
        ) : isPreviewMode ? (
          /* PREVIEW MOCKUP MODE */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Public Site Render Preview
              </h2>
              <div className="h-[400px] md:h-[500px] relative rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-end text-center p-8 text-white">
                {previewImageSrc ? (
                  <img
                    src={previewImageSrc}
                    alt="banner preview"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-400 z-0">
                    No Background Image Selected
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/55 z-10"></div>

                {/* Content Overlay */}
                <div className="relative z-20 flex flex-col items-center justify-end space-y-4 pb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl uppercase font-bold leading-tight max-w-2xl drop-shadow-md">
                    {formData.bannerTitle || 'Where Luxury Meets Reliability'}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-lg max-w-xl text-gray-200">
                    {formData.subtitle ||
                      'Showcasing the finest yachts from our trusted network.'}
                  </p>
                  <button className="mt-2 px-6 sm:px-8 py-2 md:py-2.5 rounded-2xl bg-black text-xs sm:text-sm font-semibold text-white hover:bg-gray-950 transition-colors border border-gray-700 shadow-lg">
                    Start AI Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FORM EDITOR MODE */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Text Fields */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                  <label
                    htmlFor="bannerTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    id="bannerTitle"
                    name="bannerTitle"
                    value={formData.bannerTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Find Your Dream Boat with AI"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subtitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subtitle
                  </label>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    rows={4}
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Smart search powered by artificial intelligence..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>
              </div>

              {/* Background Image Upload */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Banner Background Image
                </label>

                {previewImageSrc ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={previewImageSrc}
                      alt="Banner background"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-md"
                      aria-label="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <label className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Upload background image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WebP up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar metadata */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
                  Banner Info
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Target Site:</span>
                    <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-blue-100">
                      JUPITER
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span>{existingBanner ? 'Active' : 'Not Configured'}</span>
                  </div>
                  {existingBanner?.updatedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Last Updated:</span>
                      <span>
                        {new Date(
                          existingBanner.updatedAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {existingBanner && (
                <div className="bg-red-50 rounded-lg border border-red-200 p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-red-800">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-700">
                    Permanently delete this banner. The website will revert to
                    default text placeholders.
                  </p>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Banner
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSearchBannerManagement;
