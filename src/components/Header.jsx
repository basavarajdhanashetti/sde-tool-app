import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
      <div>
        {/* Left side of header - could contain logo or breadcrumbs */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
            <div className="bg-blue-100 rounded-full p-1.5">
              <User className="text-blue-600" size={18} />
            </div>
            <span className="font-medium">{user?.email}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;