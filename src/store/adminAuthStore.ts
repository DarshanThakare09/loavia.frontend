import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ResetToken {
  token: string;
  expiry: number; // Unix ms
  used: boolean;
}

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  resetTokens: ResetToken[];
  login: () => void;
  logout: () => void;
  generateResetToken: () => string;
  validateResetToken: (token: string) => 'valid' | 'expired' | 'invalid' | 'used';
  consumeResetToken: (token: string) => boolean;
}

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function makeToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      resetTokens: [],

      login: () => set({ isAdminAuthenticated: true }),
      logout: () => {
        set({ isAdminAuthenticated: false });
        // Clear the mock admin cookies
        if (typeof document !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0';
          document.cookie = 'admin_access_token=; path=/; max-age=0';
        }
      },

      generateResetToken: () => {
        const token = makeToken();
        const expiry = Date.now() + TOKEN_TTL_MS;
        // Purge expired/used tokens before adding new one
        const active = get().resetTokens.filter(t => !t.used && t.expiry > Date.now());
        set({ resetTokens: [...active, { token, expiry, used: false }] });
        return token;
      },

      validateResetToken: (token) => {
        const found = get().resetTokens.find(t => t.token === token);
        if (!found) return 'invalid';
        if (found.used) return 'used';
        if (Date.now() > found.expiry) return 'expired';
        return 'valid';
      },

      consumeResetToken: (token) => {
        const state = get();
        const found = state.resetTokens.find(t => t.token === token);
        if (!found || found.used || Date.now() > found.expiry) return false;
        set({
          resetTokens: state.resetTokens.map(t =>
            t.token === token ? { ...t, used: true } : t
          ),
        });
        return true;
      },
    }),
    { name: 'loavia-admin-auth' }
  )
);

// NOTE: Admin authentication is intentionally decoupled from the storefront authStore.
// A customer logging in on the storefront must NOT affect the admin session.

