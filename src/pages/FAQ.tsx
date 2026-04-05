import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import { ArrowLeft, Eye, Plus, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { EditorPreview, RichTextEditor } from '../components/Editor';

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

interface FAQFormData {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
  site: 'FLORIDA' | 'JUPITER';
}

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [editorRefreshKey, setEditorRefreshKey] = useState(0);
  const [formData, setFormData] = useState<FAQFormData>({
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about our services',
    faqs: [{ id: '1', question: '', answer: '' }],
    site: 'JUPITER',
  });

  const { data: faqData } = useGetFaqQuery(selectedSite, {
    refetchOnMountOrArgChange: true,
  });
  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  // Load data when fetched or site changes
  useEffect(() => {
    if (faqData?.data) {
      setFormData({
        title: faqData.data.title || 'Frequently Asked Questions',
        subtitle:
          faqData.data.subtitle ||
          'Find answers to common questions about our services',
        faqs:
          faqData.data.questions?.length > 0
            ? faqData.data.questions.map((q: FAQItem, index: number) => ({
                id: `${index + 1}`,
                question: q.question,
                answer: q.answer,
              }))
            : [{ id: '1', question: '', answer: '' }],
        site: selectedSite,
      });
      setEditorRefreshKey(prev => prev + 1);
    } else {
      // Reset to default when no data or site changes
      setFormData({
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our services',
        faqs: [{ id: '1', question: '', answer: '' }],
        site: selectedSite,
      });
      setEditorRefreshKey(prev => prev + 1);
    }
  }, [faqData, selectedSite]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFAQChange = (
    id: string,
    field: 'question' | 'answer',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  const addFAQ = () => {
    const newId = Date.now().toString();
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id: newId, question: '', answer: '' }],
    }));
  };

  const removeFAQ = (id: string) => {
    if (formData.faqs.length <= 1) {
      Swal.fire('Error', 'At least one FAQ is required', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
  };

  const handleSave = async () => {
    const hasEmptyFields = formData.faqs.some(
      (faq) => !faq.question.trim() || !faq.answer.trim(),
    );

    if (!formData.title.trim() || hasEmptyFields) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    try {
      const faqPayload = {
        site: selectedSite,
        title: formData.title,
        subtitle: formData.subtitle,
        questions: formData.faqs.map(({ question, answer }) => ({
          question,
          answer,
        })),
      };

      if (faqData?.data) {
        // Update existing FAQ
        await updateFaq({
          site: selectedSite,
          faqContent: {
            title: formData.title,
            subtitle: formData.subtitle,
            questions: formData.faqs.map(({ question, answer }) => ({
              question,
              answer,
            })),
          },
        }).unwrap();
        await Swal.fire('Success!', 'FAQ updated successfully', 'success');
      } else {
        // Create new FAQ
        await createFaq({
          faqContent: faqPayload,
        }).unwrap();
        await Swal.fire('Success!', 'FAQ created successfully', 'success');
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save FAQ',
        'error',
      );
    }
  };

  const handleDelete = async () => {
    if (!faqData?.data) {
      Swal.fire('Error', 'No FAQ data to delete', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the FAQ for ${selectedSite}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteFaq({ site: selectedSite }).unwrap();
        Swal.fire('Deleted!', 'FAQ has been deleted successfully', 'success');
        // Reset form
        setFormData({
          title: 'Frequently Asked Questions',
          subtitle: 'Find answers to common questions about our services',
          faqs: [{ id: '1', question: '', answer: '' }],
          site: selectedSite,
        });
      } catch (error) {
        Swal.fire(
          'Error!',
          (error as { data?: { message?: string } })?.data?.message ||
            'Failed to delete FAQ',
          'error',
        );
      }
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  FAQ Content
                </h1>
                <p className="text-sm text-gray-500">
                  Manage frequently asked questions
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreviewMode ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {formData.title}
              </h1>
              {formData.subtitle && (
                <p className="text-gray-600 mb-8">{formData.subtitle}</p>
              )}
              <div className="space-y-6">
                {formData.faqs.map((faq, index) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {index + 1}. {faq.question || 'Question'}
                    </h3>
                    <EditorPreview content={faq.answer || 'Answer'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter page title..."
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label
                  htmlFor="subtitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter subtitle..."
                />
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    FAQ Items <span className="text-red-500">*</span>
                  </h3>
                  <button
                    onClick={addFAQ}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                          Question {index + 1}
                        </h4>
                        {formData.faqs.length > 1 && (
                          <button
                            onClick={() => removeFAQ(faq.id!)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            aria-label="Remove FAQ"
                            title="Remove this FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            handleFAQChange(faq.id!, 'question', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter question..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Answer
                        </label>
                        <RichTextEditor
                          key={`${faq.id}-${editorRefreshKey}`}
                          value={faq.answer}
                          onChange={(value) =>
                            handleFAQChange(faq.id!, 'answer', value)
                          }
                          placeholder="Enter answer..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delete Button */}
              {faqData?.data && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Delete the FAQ content for {selectedSite}
                  </p>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete FAQ
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

export default FAQ;
