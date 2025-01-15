import { nhost } from './nhost';
import { useUserAvatarUrl } from '@nhost/react'; // Import the hook from Nhost

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = []; // Array to hold listeners
    this.setupAuthListener();
  }

  setupAuthListener() {
    if (typeof window !== 'undefined') {
      nhost.auth.onAuthStateChanged((event, session) => {
        this.currentUser = session?.user || null;
        this.isAuthenticated = !!session;
        this.notifyListeners(); // Notify all listeners when auth state changes
      });
    }
  }

  // Add a listener for auth state changes
  onAuthStateChanged(listener) {
    this.listeners.push(listener);
    // Return a function to unsubscribe
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners when auth state changes
  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isAuthenticated));
  }

  async signInWithGoogle() {
    const { error } = await nhost.auth.signIn({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Auth failed:', error.message);
    }
  }

  async logout() {
    try {
      const { error } = await nhost.auth.signOut();
      if (error) throw error;

      this.currentUser = null;
      this.isAuthenticated = false;
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  }
}

export const authService = new AuthService();