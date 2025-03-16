import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth';
import axiosInstance from '@/services/axios';
import { API_ROUTES } from '@/constants/api';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="fixed z-10 w-full bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center md:hidden">
          <button
            onClick={onOpenSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center md:ml-auto">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center rounded-full text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <span className="text-sm font-medium">
                  {profile.name ? profile.name[0]?.toUpperCase() : 'A'}
                </span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="border-b px-4 py-2">
                  <p className="text-sm font-medium text-gray-700">{profile.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{profile.email || 'admin@example.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}