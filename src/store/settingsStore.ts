import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // General
  websiteName: string;
  supportEmail: string;
  contactPhone: string;
  businessAddress: string;

  // Store
  shippingCharge: number;
  freeShippingThreshold: number;
  currency: string;

  // Social
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;

  // Admin
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminAvatar: string;
  adminStatus: string;
  adminPassword: string;

  // Hydration
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;

  // Setters
  updateGeneral: (websiteName: string, supportEmail: string, contactPhone: string, businessAddress: string) => void;
  updateStore: (shippingCharge: number, freeShippingThreshold: number, currency: string) => void;
  updateSocial: (instagramUrl: string, facebookUrl: string, linkedinUrl: string, youtubeUrl: string) => void;
  updateAdminProfile: (adminName: string, adminEmail: string, adminPhone: string, adminAvatar: string) => void;
  changePassword: (current: string, next: string) => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      websiteName: 'LOAVIA',
      supportEmail: 'support@loavia.com',
      contactPhone: '+91-9000000000',
      businessAddress: 'Nashik, Maharashtra, India',

      shippingCharge: 50,
      freeShippingThreshold: 999,
      currency: 'INR',

      instagramUrl: '',
      facebookUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',

      adminName: 'Admin User',
      adminEmail: 'admin@loavia.com',
      adminPhone: '+91-9000000000',
      adminAvatar: '',
      adminStatus: 'Active',
      adminPassword: '123',
      hasHydrated: false,

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      updateGeneral: (websiteName, supportEmail, contactPhone, businessAddress) => set({ websiteName, supportEmail, contactPhone, businessAddress }),
      updateStore: (shippingCharge, freeShippingThreshold, currency) => set({ shippingCharge, freeShippingThreshold, currency }),
      updateSocial: (instagramUrl, facebookUrl, linkedinUrl, youtubeUrl) => set({ instagramUrl, facebookUrl, linkedinUrl, youtubeUrl }),
      updateAdminProfile: (adminName, adminEmail, adminPhone, adminAvatar) => set({ adminName, adminEmail, adminPhone, adminAvatar }),
      changePassword: (current, next) => {
        const state = get() as any;
        const stored = state.adminPassword;
        console.debug('[settingsStore] changePassword called', { current, stored, hasHydrated: state.hasHydrated });
        if (stored !== undefined && current === stored) {
          set((s: any) => ({ ...s, adminPassword: next }));
          console.debug('[settingsStore] password updated to', next);
          return true;
        }
        console.debug('[settingsStore] password mismatch');
        return false;
      }
    }),
    {
      name: 'loavia-settings-storage',
      partialize: (state) => {
        const { hasHydrated, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          state.setHasHydrated(true);
          console.debug('[settingsStore] rehydrated', state);
        }
      }
    }
  )
);
