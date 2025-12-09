import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Chrome } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, loading } = useAuthStore();

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-light-text dark:text-dark-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-light-border dark:border-dark-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
              Gamebridge Admin
            </h1>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Sign in to access your admin panel
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-light-text dark:text-dark-text font-medium shadow-sm"
          >
            <Chrome className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

