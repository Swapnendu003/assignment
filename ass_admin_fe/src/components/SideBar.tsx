import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axios';
import { API_ROUTES } from '@/constants/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    axiosInstance.get(API_ROUTES.AUTH.PROFILE)
      .then((res) => {
        setProfile({
          name: res.data.admin.name,
          email: res.data.admin.email,
        });
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
      });
  }, []);

  const pathname = usePathname();
  
  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      label: 'Coupons',
      href: '/admin/coupons',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
        </svg>
      ),
    },
    {
      label: 'Add Coupon',
      href: '/admin/coupons/add',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Claim History',
      href: '/admin/claims',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen transform bg-white shadow-lg transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex h-16 items-center justify-between border-b px-4 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
              <h1 className="ml-2 text-lg font-semibold text-gray-800">Coupon Admin</h1>
            </div>
          )}
          {isCollapsed && (
            <div className="flex w-full justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
            </div>
          )}
          
          <div className="flex">
            <button
              onClick={onToggleCollapse}
              className="hidden rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:block"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className={`mt-4 ${isCollapsed ? 'px-1' : 'px-2'}`}>
          <div className="mb-6 px-4">
            {!isCollapsed && (
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Main
              </h2>
            )}
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg py-2 text-sm font-medium transition-colors ${
                      isCollapsed ? 'justify-center px-2' : 'px-4'
                    } ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                    {!isCollapsed && item.label}
                    {pathname === item.href && !isCollapsed && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {!isCollapsed && (
          <div className="absolute bottom-0 w-full border-t p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-sm font-medium">
                    {profile.name ? profile.name[0]?.toUpperCase() : 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{profile.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{profile.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="absolute bottom-0 w-full border-t p-2">
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white" title={profile.name}>
                <span className="text-sm font-medium">
                  {profile.name ? profile.name[0]?.toUpperCase() : 'A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}