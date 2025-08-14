import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  Upload, 
  BarChart3, 
  Settings,
  ChevronLeft,
  PlayCircle
} from 'lucide-react';

const Sidebar = ({ open, onClose, user }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & analytics'
    },
    {
      path: '/content',
      icon: Video,
      label: 'Content',
      description: 'Manage videos & series'
    },
    {
      path: '/users',
      icon: Users,
      label: 'Users',
      description: 'User management'
    },
    {
      path: '/upload',
      icon: Upload,
      label: 'Upload',
      description: 'Upload videos & media'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Performance metrics'
    },
    {
      path: '/system',
      icon: Settings,
      label: 'System',
      description: 'Settings & monitoring'
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cino Admin</h1>
                <p className="text-xs text-gray-500">v1.2.0</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {user.username?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm font-medium ${isActive ? 'text-purple-700' : ''}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>© 2024 Cino Admin</p>
              <p>All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;