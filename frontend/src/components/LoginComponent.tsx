import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';

interface LoginComponentProps {
  className?: string;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ className = '' }) => {
  const [username, setUsername] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing username using authUtils
    const storedUsername = authUtils.getUsername();
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    if (inputValue.trim()) {
      authUtils.setUsername(inputValue.trim());
      setUsername(inputValue.trim());
      setIsLoggedIn(true);
      setInputValue('');
    }
  };

  const handleLogout = () => {
    authUtils.logout();
    setUsername('');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Don't render anything until we've checked localStorage
  if (isLoading) {
    return null;
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${className}`}>
      {isLoggedIn ? (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            Welcome, {username}!
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-3">
            Log in to save and share layouts!
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              disabled={!inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 