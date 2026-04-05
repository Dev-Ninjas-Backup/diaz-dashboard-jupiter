import { cn } from '@/lib/utils';
import { useGetAdminSettingsQuery } from '@/redux/features/adminSettingApis/adminSettingsApi';
import { logout } from '@/redux/features/auth/authSlice';
// import { persistor } from "@/redux/store"
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';
import { IoIosLogOut } from 'react-icons/io';
import {
  LuChartColumn,
  LuClipboardList,
  LuFileText,
  LuLayoutDashboard,
  LuLayoutGrid,
  LuSettings,
  LuShield,
  LuStar,
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  {
    label: 'Overview',
    path: '/',
    icon: <LuLayoutDashboard className="text-lg" />,
  },


  {
    label: 'Yacht Leads',
    path: '/yacht-leads',
    icon: <LuClipboardList className="text-lg" />,
  },
  {
    label: 'Featured & Homepage',
    path: '/featured',
    icon: <LuStar className="text-lg" />,
  },
  {
    label: 'Content Management',
    path: '/content',
    icon: <LuFileText className="text-lg" />,
  },


  {
    label: 'Users & Permissions',
    path: '/users',
    icon: <LuShield className="text-lg" />,
  },
  {
    label: 'Analytics & Reports',
    path: '/analytics',
    icon: <LuChartColumn className="text-lg" />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <LuSettings className="text-lg" />,
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const { data: settings } = useGetAdminSettingsQuery();

  console.log(settings);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());

    // persistor.purge();

    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    toast.success('Logout Successfully');

    navigate('/admin-login', { replace: true });
  };

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-2 left-2 z-60 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <HiX className="w-6 h-6 text-gray-700" />
        ) : (
          <LuLayoutGrid className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[280px] lg:w-[310px] xl:w-80 bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center gap-3 justify-center border-b border-gray-100">
          <img
            src={settings?.logoUrl || ''}
            className="h-8 sm:h-10"
            alt="Florida Yacht Trader"
          />
          <span className="text-sm sm:text-lg font-bold uppercase text-[#004DAC] leading-tight">
            {settings?.siteName}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base font-medium',
                      isActive
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-white' : 'text-black'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#FF3B30] text-white rounded-lg hover:bg-[#E5342A] transition-colors active:scale-[0.98]"
          >
            <IoIosLogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
