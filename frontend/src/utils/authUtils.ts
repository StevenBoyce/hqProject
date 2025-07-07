const USERNAME_KEY = 'layoutBuilderUsername';

export const authUtils = {
  setUsername: (username: string): void => {
    localStorage.setItem(USERNAME_KEY, username);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(USERNAME_KEY) !== null;
  },

  getUsername: (): string | null => {
    return localStorage.getItem(USERNAME_KEY);
  },

  logout: (): void => {
    localStorage.removeItem(USERNAME_KEY);
  }
}; 