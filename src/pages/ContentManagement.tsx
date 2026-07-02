/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
} from '@/redux/features/blogManagement/blogmanagement';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface BlogImage {
  id: string;
  filename: string;
  originalFilename: string;
  path: string;
  url: string;
  fileType: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  blogImageId: string;
  blogTitle: string;
  blogDescription: string;
  sharedLink: string;
  readTime: number;
  postStatus: string;
  createdAt: string;
  updatedAt: string;
  blogImage: BlogImage;
  pageViewCount: number;
}

interface StaticPage {
  id: number;
  title: string;
}

const DEMO_STATIC_PAGES: StaticPage[] = [
  { id: 1, title: 'About Us' },
  { id: 2, title: 'Contact' },
  { id: 3, title: 'Privacy Policy' },
  { id: 4, title: 'Terms of Service' },
  { id: 5, title: 'Footer' },
  { id: 6, title: 'FAQ' },
  { id: 7, title: 'Why Us' },
  { id: 8, title: 'Our Team' },
  { id: 9, title: 'Featured Brands' },
  { id: 10, title: 'Category' },
  { id: 11, title: 'AI Search Banner' },
  { id: 12, title: 'Partners' },
];

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [staticPages] = useState<StaticPage[]>(DEMO_STATIC_PAGES);
  const { data: blogsData, isLoading, refetch } = useGetBlogsQuery(undefined);
  const [deleteBlog] = useDeleteBlogMutation();

  const blogPosts: BlogPost[] = blogsData || [];

  const handleNewArticle = () => {
    navigate('/content/new-article');
  };

  const handleEditPost = (id: string) => {
    navigate(`/content/edit/${id}`);
  };

  const handleDeleteBlog = (id: string) => async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id).unwrap();
        await refetch(); // Force refetch after delete
        Swal.fire({
          title: 'Deleted!',
          text: 'Blog post has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error: any) {
        console.error('Delete error:', error);
        Swal.fire({
          title: 'Error!',
          text: error?.data?.message || 'Failed to delete blog post',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleEditPage = (id: number) => {
    const pageRoutes: { [key: number]: string } = {
      1: '/content/about-us',
      2: '/content/contact',
      3: '/content/privacy-policy',
      4: '/content/terms-of-service',
      5: '/content/footer',
      6: '/content/faq',
      7: '/content/why-us',
      8: '/content/our-team',
      9: '/content/featured-brands',
      10: '/content/category',
      11: '/content/ai-search-banner',
      12: '/content/partners',
    };

    const route = pageRoutes[id];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Content Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage pages, blog posts, and site content
        </p>
      </div>

      {/* Flex Layout: Static Pages (2/3) on Left, Blog Posts (1/3) on Right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Static Pages Section - 2/3 Width */}
        <div className="flex-1 lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Static Pages
              </h2>
            </div>

            {/* Static Pages Grid - 4 per row */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {staticPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex flex-col items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 w-full text-center mb-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {page.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleEditPage(page.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Edit page"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Section - 1/3 Width */}
        <div className="flex-1 lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex  items-start justify-between p-4 md:p-6 border-b border-gray-200 gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Blog Articles
              </h2>
              <button
                onClick={handleNewArticle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors justify-center"
              >
                <Plus className="w-4 h-4" />
                New Article
              </button>
            </div>

            {/* Blog Posts List */}
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-gray-500">Loading blog posts...</p>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-gray-500 text-sm text-center">
                    No blog posts found. Create your first article!
                  </p>
                </div>
              ) : (
                blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex w-full gap-3">
                      {post.blogImage?.url && (
                        <img
                          src={post.blogImage.url}
                          alt={post.blogTitle}
                          className="w-28 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex justify-between items-center gap-5 w-full">
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {post.blogTitle}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {post.postStatus} • {post.pageViewCount} views •{' '}
                            {post.readTime} min read
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                            aria-label="Edit post"
                          >
                            <FaEdit className="text-base" />
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteBlog(post.id)}
                            className="flex-1 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            <FaTrash className="text-base" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
