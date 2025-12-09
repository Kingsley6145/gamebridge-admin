import { Search, Moon, Sun, Menu, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../../styles/theme';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Header = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <header className="h-16 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border fixed top-0 left-0 lg:left-64 right-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-light-text dark:text-dark-text" />
        </button>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-light-text dark:text-dark-text" />
          ) : (
            <Moon className="w-5 h-5 text-light-text dark:text-dark-text" />
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
            title="Profile"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg py-2 z-50">
              {user && (
                <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                  <p className="text-sm font-medium text-light-text dark:text-dark-text">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                    {user.email}
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

