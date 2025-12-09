import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  // Initialize auth state listener
  init: () => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const result = await authService.signInWithGoogle();
    if (result.error) {
      throw new Error(result.error);
    }
    return result.user;
  },

  // Sign out
  signOut: async () => {
    const result = await authService.signOut();
    if (result.error) {
      throw new Error(result.error);
    }
    set({ user: null });
  },
}));

