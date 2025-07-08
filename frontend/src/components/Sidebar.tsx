import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardIcon, ProfileIcon, LogoutIcon } from '../icons';
import { authUtils } from '../utils/authUtils';
import { layoutPersistence } from '../utils/layoutPersistence';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const username = authUtils.getUsername();
  const navigate = useNavigate();

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear stored layout ID when navigating away from EditLayoutPage
    layoutPersistence.clearLayoutId();
    navigate('/dashboard');
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear stored layout ID when logging out
    layoutPersistence.clearLayoutId();
    authUtils.logout();
    navigate('/login');
  };

  const handleSidebarClick = () => {
    onToggle();
  };

  return (
    <div 
      className={`bg-white shadow-lg border-r transition-all duration-300 ease-in-out flex flex-col cursor-pointer ${
        isCollapsed ? 'w-14' : 'w-64'
      }`}
      onClick={handleSidebarClick}
    >
      {/* Top Navigation */}
      <div className="flex-1">
        {/* Dashboard Navigation Item */}
        <div 
          className="flex items-center p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border-b"
          onClick={handleDashboardClick}
        >
          <DashboardIcon size={20} className="text-gray-600 flex-shrink-0 hover:text-gray-800 transition-colors duration-200" />
          {!isCollapsed && (
            <span className="ml-3 text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200">Dashboard</span>
          )}
        </div>
      </div>

      {/* Footer with User Profile and Logout */}
      <div className="border-t p-4 space-y-2">
        {/* User Profile */}
        <div className="flex items-center">
          <ProfileIcon size={20} className="text-gray-600 flex-shrink-0 hover:text-gray-800 transition-colors duration-200" />
          {!isCollapsed && (
            <span className="ml-3 text-gray-700 font-medium truncate hover:text-gray-900 transition-colors duration-200">
              {username}
            </span>
          )}
        </div>
        
        {/* Logout */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={handleLogoutClick}
        >
          <LogoutIcon size={20} className="text-red-500 flex-shrink-0 hover:text-gray-800 transition-colors duration-200" />
          {!isCollapsed && (
            <span className="ml-3 text-red-500 font-medium hover:text-gray-900 transition-colors duration-200">
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 