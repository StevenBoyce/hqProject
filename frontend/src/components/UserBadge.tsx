import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ProfileIcon } from '../icons';

interface UserBadgeProps {
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ className = '' }) => {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing username in localStorage on component mount
    const storedUsername = authService.getUsername();
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUsername('');
    navigate('/login');
  };

  // Don't render anything until we've checked localStorage
  if (isLoading) {
    return null;
  }

  // Don't render if not logged in
  if (!username) {
    return null;
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${className}`}>
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ProfileIcon size={20} className="text-gray-600" />
          {username}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}; 