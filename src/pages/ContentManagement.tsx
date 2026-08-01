/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
} from '@/redux/features/blogManagement/blogmanagement';
import {
  Plus,
  FileText,
  LayoutGrid,
  Eye,
  Clock,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
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
  slug?: string;
  readTime: number;
  postStatus: string;
  createdAt: string;
  updatedAt: string;
  blogImage: BlogImage;
  pageViewCount: number;
  seoTitle?: string;
  authorName?: string;
}

interface StaticPage {
  id: number;
  title: string;
}

type SortField = 'title' | 'status' | 'views' | 'readTime' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const DEMO_STATIC_PAGES: StaticPage[] = [
  { id: 1, title: 'About Us' },
  { id: 2, title: 'Contact' },
  { id: 3, title: 'Privacy Policy' },
  { id: 4, title: 'Terms of Service' },
  { id: 5, title: 'Footer' },
  { id: 6, title: 'FAQ' },
  { id: 7, title: 'Why Us' },
  { id: 8, title: 'Featured Brands' },
  { id: 9, title: 'Category' },
];

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'static' | 'blogs'>('blogs');
  const [staticPages] = useState<StaticPage[]>(DEMO_STATIC_PAGES);

  // Advanced Table Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  // Interactive Column Header Sorting State
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Query Params passed to RTK Query
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedStatus !== 'ALL') params.status = selectedStatus;
    return params;
  }, [searchQuery, selectedStatus]);

  const { data: blogsData, isLoading, refetch } = useGetBlogsQuery(queryParams);
  const [deleteBlog] = useDeleteBlogMutation();

  const rawBlogPosts: BlogPost[] = Array.isArray(blogsData)
    ? blogsData
    : (blogsData as any)?.data || [];

  // Filtered & Interactively Sorted Posts
  const filteredAndSortedPosts = useMemo(() => {
    const filtered = rawBlogPosts.filter((post) => {
      const matchesSearch =
        !searchQuery.trim() ||
        post.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.slug && post.slug.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.sharedLink && post.sharedLink.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'ALL' || post.postStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortField) {
        case 'title':
          valueA = a.blogTitle.toLowerCase();
          valueB = b.blogTitle.toLowerCase();
          break;
        case 'status':
          valueA = a.postStatus.toLowerCase();
          valueB = b.postStatus.toLowerCase();
          break;
        case 'views':
          valueA = a.pageViewCount ?? 0;
          valueB = b.pageViewCount ?? 0;
          break;
        case 'readTime':
          valueA = a.readTime ?? 0;
          valueB = b.readTime ?? 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawBlogPosts, searchQuery, selectedStatus, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / itemsPerPage));

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPosts, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'views' || field === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 font-bold" />
    );
  };

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
        await refetch();
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
      8: '/content/featured-brands',
      9: '/content/category',
    };

    const route = pageRoutes[id];
    if (route) {
      navigate(route);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            Published
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
            In Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Approved
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            Scheduled
          </span>
        );
      case 'UPDATING':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
            Updating
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Content Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage static pages, blog articles, and site content
          </p>
        </div>

        {activeTab === 'blogs' && (
          <button
            onClick={handleNewArticle}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg px-4 pt-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog Articles ({filteredAndSortedPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('static')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'static'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Static Pages ({staticPages.length})
          </button>
        </div>
      </div>

      {/* TAB 1: STATIC PAGES GRID */}
      {activeTab === 'static' && (
        <div className="bg-white rounded-b-lg rounded-t-none shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Static Pages List
            </h2>
            <p className="text-xs text-gray-500">Edit content for static site pages.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staticPages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group bg-white"
              >
                <div className="flex-1 w-full text-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {page.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleEditPage(page.id)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors font-medium cursor-pointer"
                  aria-label="Edit page"
                >
                  <FaEdit />
                  Edit Content
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BLOG ARTICLES DATA TABLE & ADVANCED TOOLBAR */}
      {activeTab === 'blogs' && (
        <div className="bg-white rounded-b-lg rounded-t-none shadow-sm border border-gray-200 overflow-hidden">
          {/* Advanced Toolbar: Search & Filters */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles by title, keyword or slug..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="UPDATING">Updating</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-gray-500">Loading blog articles...</span>
            </div>
          ) : paginatedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-base font-semibold text-gray-900">No blog articles match your filters</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Try clearing your search query or changing filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('ALL');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider select-none">
                      {/* ARTICLE Column with Sorting */}
                      <th
                        onClick={() => handleSort('title')}
                        className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>ARTICLE</span>
                          {renderSortIcon('title')}
                        </div>
                      </th>

                      {/* STATUS Column with Sorting */}
                      <th
                        onClick={() => handleSort('status')}
                        className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>STATUS</span>
                          {renderSortIcon('status')}
                        </div>
                      </th>

                      {/* VIEWS Column with Sorting */}
                      <th
                        onClick={() => handleSort('views')}
                        className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>VIEWS</span>
                          {renderSortIcon('views')}
                        </div>
                      </th>

                      {/* READ TIME Column with Sorting */}
                      <th
                        onClick={() => handleSort('readTime')}
                        className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>READ TIME</span>
                          {renderSortIcon('readTime')}
                        </div>
                      </th>

                      {/* CREATED DATE Column with Sorting */}
                      <th
                        onClick={() => handleSort('createdAt')}
                        className="py-3.5 px-4 cursor-pointer hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span>CREATED DATE</span>
                          {renderSortIcon('createdAt')}
                        </div>
                      </th>

                      <th className="py-3.5 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {paginatedPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Image & Title Column */}
                        <td className="py-4 px-4 max-w-md">
                          <div className="flex items-center gap-3">
                            {post.blogImage?.url ? (
                              <img
                                src={post.blogImage.url}
                                alt={post.blogTitle}
                                className="w-16 h-12 object-cover rounded-md shrink-0 border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-gray-100 rounded-md shrink-0 flex items-center justify-center border border-gray-200">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                                {post.blogTitle}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                slug: <span className="font-mono text-gray-600">{post.slug || post.sharedLink}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(post.postStatus)}
                        </td>

                        {/* Views Column */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-700 text-xs font-medium">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            {post.pageViewCount ?? 0} views
                          </div>
                        </td>

                        {/* Read Time Column */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-gray-700 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {post.readTime ?? 5} min read
                          </div>
                        </td>

                        {/* Published/Created Date Column */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditPost(post.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
                            >
                              <FaEdit className="text-gray-500" />
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteBlog(post.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors shadow-xs cursor-pointer"
                            >
                              <FaTrash className="text-red-500" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advanced Pagination Footer */}
              <div className="px-4 py-3.5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedPosts.length)}</span> to{' '}
                    <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredAndSortedPosts.length)}</span> of{' '}
                    <span className="font-semibold text-gray-900">{filteredAndSortedPosts.length}</span> articles
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-800 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
