import { NotificationBell } from '@/components/shared/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetProfileQuery } from '@/redux/features/auth/authApi';
import { useAppSelector } from '@/redux/typeHook';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Searchable routes list
const searchableRoutes = [
  { name: 'Overview', path: '/overview', category: 'Dashboard' },
  { name: 'Listing Management', path: '/listings', category: 'Listings' },
  { name: 'Add Listing', path: '/listings/add', category: 'Listings' },
  { name: 'Seller Management', path: '/sellers', category: 'Management' },
  { name: 'Yacht Leads', path: '/yacht-leads', category: 'Leads' },
  {
    name: 'Featured & Home Management',
    path: '/featured',
    category: 'Management',
  },
  { name: 'Content Management', path: '/content', category: 'Content' },
  {
    name: 'Subscription Management',
    path: '/subscription',
    category: 'Management',
  },
  {
    name: 'Create New Article',
    path: '/content/new-article',
    category: 'Content',
  },
  { name: 'About Us', path: '/content/about-us', category: 'Content' },
  { name: 'Contact Us', path: '/content/contact', category: 'Content' },
  {
    name: 'Privacy Policy',
    path: '/content/privacy-policy',
    category: 'Content',
  },
  {
    name: 'Terms of Service',
    path: '/content/terms-of-service',
    category: 'Content',
  },
  { name: 'Footer', path: '/content/footer', category: 'Content' },
  { name: 'FAQ', path: '/content/faq', category: 'Content' },
  { name: 'Why Us', path: '/content/why-us', category: 'Content' },
  { name: 'Our Team', path: '/content/our-team', category: 'Content' },
  {
    name: 'Featured Brands',
    path: '/content/featured-brands',
    category: 'Content',
  },
  {
    name: 'Category Management',
    path: '/content/category',
    category: 'Content',
  },
  { name: 'Users & Permission', path: '/users', category: 'Management' },
  { name: 'Analytics & Reports', path: '/analytics', category: 'Dashboard' },
  { name: 'Settings', path: '/settings', category: 'Settings' },
  {
    name: 'Promo Code Management',
    path: '/promoCodeManagement',
    category: 'Management',
  },
];

const UpperNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState(searchableRoutes);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const authUser = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetProfileQuery(undefined, { skip: !authUser });
  const user = profile ?? authUser;

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? 'AU';

  const getRoleLabel = (role: string) =>
    role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin';

  // Filter routes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRoutes(searchableRoutes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = searchableRoutes.filter(
        (route) =>
          route.name.toLowerCase().includes(query) ||
          route.category.toLowerCase().includes(query) ||
          route.path.toLowerCase().includes(query),
      );
      setFilteredRoutes(filtered);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRouteClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredRoutes(searchableRoutes);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white p-1">
      <div className="md:ml-0 ml-10 flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search pages..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {filteredRoutes.length > 0 ? (
                <div className="py-2">
                  {filteredRoutes.map((route) => (
                    <button
                      key={route.path}
                      onClick={() => handleRouteClick(route.path)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {route.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {route.path}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {route.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No routes found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Notification & User */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell */}
          <div className="cursor-pointer">
            <NotificationBell />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-gray-200">
              <AvatarImage src={user?.avatarUrl ?? ''} alt={user?.name ?? ''} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {getInitials(user?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user?.name ?? 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {user?.role ? getRoleLabel(user.role) : 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpperNavbar;
