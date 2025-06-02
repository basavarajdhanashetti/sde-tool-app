import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Users,
  Upload,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

const Sidebar = ({ onTabChange }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle upload data click
  const handleUploadClick = () => {
    if (location.pathname === '/admin') {
      // If already on admin page, just switch tabs
      onTabChange?.('upload');
    } else {
      // Navigate to admin page with upload tab
      navigate('/admin?tab=upload');
    }
  };

  // Handle projects click for employees
  const handleProjectsClick = () => {
    if (location.pathname === '/dashboard') {
      // If already on dashboard page, just switch tabs
      onTabChange?.('projects');
    } else {
      // Navigate to dashboard page with projects tab
      navigate('/dashboard?tab=projects');
    }
  };

  // Handle profile click for employees
  const handleProfileClick = () => {
    if (location.pathname === '/dashboard') {
      // If already on dashboard page, just switch tabs
      onTabChange?.('profile');
    } else {
      // Navigate to dashboard page with profile tab (default)
      navigate('/dashboard');
    }
  };

  // Navigation items
  const navItems = user?.is_admin
    ? [
        { path: '/admin', icon: Users, label: 'Employees', type: 'link' },
        { path: '#', icon: Upload, label: 'Upload Data', type: 'action', onClick: handleUploadClick }
      ]
    : [
        { path: '#', icon: User, label: 'Profile', type: 'action', onClick: handleProfileClick },
        { path: '#', icon: Briefcase, label: 'Projects', type: 'action', onClick: handleProjectsClick }
      ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-white shadow-lg border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={`flex-shrink-0 p-4 border-b border-gray-200 ${isCollapsed ? 'flex justify-center' : 'flex justify-between items-center'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Home className="text-white" size={18} />
                </div>
                <span className="font-bold text-gray-800">Employee Hub</span>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="text-gray-500 hover:text-gray-700 hidden lg:block"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 overflow-y-auto min-h-0">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item.path || index}>
                  {item.type === 'action' ? (
                    <button
                      onClick={item.onClick}
                      className={`
                        flex items-center rounded-lg p-3 w-full text-left
                        ${(location.pathname === '/admin' && location.search.includes('tab=upload') && item.label === 'Upload Data') ||
                          (location.pathname === '/dashboard' && location.search.includes('tab=projects') && item.label === 'Projects') ||
                          (location.pathname === '/dashboard' && !location.search.includes('tab=projects') && item.label === 'Profile')
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                        transition-colors
                      `}
                    >
                      <item.icon className="flex-shrink-0" size={20} />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center rounded-lg p-3
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                        transition-colors
                      `}
                    >
                      <item.icon className="flex-shrink-0" size={20} />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className={`flex-shrink-0 p-4 border-t border-gray-200 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
              <div className="bg-blue-500 text-white rounded-full p-1">
                <User size={20} />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.is_admin ? 'Admin' : 'Employee'}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={logout}
                className="w-full mt-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 lg:hidden p-3 bg-white rounded-full shadow-lg border border-gray-200"
        aria-label="Open menu"
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
};

export default Sidebar;