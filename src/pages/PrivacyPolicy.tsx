import {
  useCreatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { EditorPreview, RichTextEditor } from '../components/Editor';

interface PrivacyPolicyFormData {
  title: string;
  content: string;
  site: 'FLORIDA' | 'JUPITER';
}

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [editorKey, setEditorKey] = useState(0);
  const [formData, setFormData] = useState<PrivacyPolicyFormData>({
    title: '',
    content: '',
    site: 'JUPITER',
  });

  const {
    data: getPrivacyPolicyData,
    isLoading,
    isError,
  } = useGetPrivacyPolicyQuery(selectedSite, {
    refetchOnMountOrArgChange: true,
  });
  const [createPrivacyPolicy, { isLoading: isCreating }] =
    useCreatePrivacyPolicyMutation();
  const [updatePrivacyPolicy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyMutation();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    console.log('🟢 Privacy useEffect triggered');
    console.log('🟢 getPrivacyPolicyData:', getPrivacyPolicyData);
    console.log('🟢 isError:', isError);
    console.log('🟢 isLoading:', isLoading);
    console.log('🟢 selectedSite:', selectedSite);

    if (getPrivacyPolicyData && !isError) {
      console.log('✅ Setting form data with:', {
        title: getPrivacyPolicyData.privacyTitle,
        contentLength: getPrivacyPolicyData.privacyDescription?.length,
      });
      setFormData({
        title: getPrivacyPolicyData.privacyTitle || '',
        content: getPrivacyPolicyData.privacyDescription || '',
        site: selectedSite,
      });
      setEditorKey((prev) => prev + 1);
    } else {
      console.log('⚠️ Resetting form data');
      // Reset form when no data for selected site or error
      setFormData({
        title: '',
        content: '',
        site: selectedSite,
      });
      setEditorKey((prev) => prev + 1);
    }
  }, [getPrivacyPolicyData, selectedSite, isError, isLoading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSave = async () => {
    try {
      const privacyPolicy = {
        privacyTitle: formData.title,
        privacyDescription: formData.content,
      };

      if (getPrivacyPolicyData && !isError) {
        await updatePrivacyPolicy({
          site: selectedSite,
          privacyPolicy,
        }).unwrap();
      } else {
        await createPrivacyPolicy({
          site: selectedSite,
          privacyPolicy,
        }).unwrap();
      }

      await Swal.fire({
        icon: 'success',
        title: getPrivacyPolicyData
          ? 'Privacy Policy Updated'
          : 'Privacy Policy Created',
        text: `Privacy Policy page has been ${getPrivacyPolicyData ? 'updated' : 'created'} successfully!`,
      });
      navigate('/content');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save Privacy Policy page',
      });
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Privacy Policy Page
                </h1>
                <p className="text-sm text-gray-500">
                  Edit your Privacy Policy content
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
        {isPreviewMode ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                {formData.title || 'Privacy Policy'}
              </h1>
              <EditorPreview content={formData.content} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Page Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter page title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Page Content *
                </label>
                <RichTextEditor
                  key={editorKey}
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your Privacy Policy content here..."
                  minHeight="500px"
                />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Page Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Type:</span> Static Page
                  </p>
                  {getPrivacyPolicyData?.updatedAt && (
                    <p>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(
                        getPrivacyPolicyData.updatedAt,
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Site:</span> {selectedSite}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
