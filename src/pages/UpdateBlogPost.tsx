/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from '@/redux/features/blogManagement/blogmanagement';
import { ArrowLeft, Eye, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { EditorPreview, RichTextEditor } from '../components/Editor';

interface ArticleFormData {
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  blogImage: File | null;
  blogImagePreview: string;
  existingImageUrl: string;
}

const UpdateBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const {
    data: blogData,
    isLoading,
    refetch,
  } = useGetBlogByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    status: 'DRAFT',
    blogImage: null,
    blogImagePreview: '',
    existingImageUrl: '',
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.blogTitle || '',
        content: blogData.blogDescription || '',
        status: blogData.postStatus || 'DRAFT',
        blogImage: null,
        blogImagePreview: blogData.blogImage?.url || '',
        existingImageUrl: blogData.blogImage?.url || '',
      });
      setEditorKey((prev) => prev + 1);
    }
  }, [blogData]);

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
    if (
      formData.blogImagePreview &&
      formData.blogImagePreview !== formData.existingImageUrl
    ) {
      URL.revokeObjectURL(formData.blogImagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      blogImage: null,
      blogImagePreview: prev.existingImageUrl,
    }));
  };

  const handleUpdate = async () => {
    if (!id) return;

    const formDataToSend = new FormData();
    formDataToSend.append('blogTitle', formData.title);
    formDataToSend.append('blogDescription', formData.content);
    formDataToSend.append('postStatus', formData.status);

    if (formData.blogImage) {
      formDataToSend.append('blogImage', formData.blogImage);
    }

    try {
      await updateBlog({
        id,
        body: formDataToSend,
      }).unwrap();

      await refetch();

      Swal.fire({
        title: 'Success!',
        text: 'Blog post updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error: any) {
      console.error('Update error:', error);
      Swal.fire({
        title: 'Error!',
        text:
          error?.data?.message?.[0] ||
          error?.data?.message ||
          'Failed to update blog post',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

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
                  Update Blog Post
                </h1>
                <p className="text-sm text-gray-500">
                  Edit and update your blog article
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
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Updating...' : 'Update Blog'}
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
                  key={editorKey}
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article content here..."
                  minHeight="500px"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archive</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.status === 'DRAFT' &&
                    'Article will be saved as draft'}
                  {formData.status === 'PUBLISHED' &&
                    'Article will be visible to public'}
                  {formData.status === 'ARCHIVED' && 'Article will be archived'}
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
                    {formData.blogImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                        aria-label="Cancel new image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <label
                      htmlFor="blogImageUpload"
                      className="mt-2 flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-600"
                    >
                      <Upload className="w-4 h-4" />
                      {formData.blogImage
                        ? 'Change selection'
                        : 'Replace image'}
                      <input
                        id="blogImageUpload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {formData.blogImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        New: {formData.blogImage.name} (
                        {(formData.blogImage.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
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
        )}
      </div>
    </div>
  );
};

export default UpdateBlogPost;
