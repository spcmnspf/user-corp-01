import { nhost } from './nhost';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = []; // Array to hold listeners
    this.setupAuthListener();
  }

  setupAuthListener() {
    if (typeof window !== 'undefined') {
      nhost.auth.onAuthStateChanged((_, session) => {
        if (session) {
          this.currentUser = session.user;
          this.isAuthenticated = true;
        } else {
          this.currentUser = null;
          this.isAuthenticated = false;
        }
        this.updateStatusIndicator();
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
      this.updateStatusIndicator();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  }

  setupStatusIndicator() {
    if (typeof window !== 'undefined') {
      const indicator = document.createElement('div');
      indicator.id = 'auth-status';
      indicator.className = 'auth-status';
      document.body.appendChild(indicator);
      this.updateStatusIndicator();
    }
  }

  updateStatusIndicator() {
    if (typeof window !== 'undefined') {
      const indicator = document.getElementById('auth-status');
      if (!indicator) return;

      if (this.currentUser) {
        indicator.innerHTML = `
          <img src="${this.currentUser.user_metadata.avatar_url}" 
               alt="Google" 
               title="Logged in via Google">
        `;
      } else {
        indicator.innerHTML = '<span class="not-logged-in">?</span>';
      }
    }
  }
}

export const authService = new AuthService();