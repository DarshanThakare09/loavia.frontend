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

  // Setters
  updateGeneral: (websiteName: string, supportEmail: string, contactPhone: string, businessAddress: string) => void;
  updateStore: (shippingCharge: number, freeShippingThreshold: number, currency: string) => void;
  updateSocial: (instagramUrl: string, facebookUrl: string, linkedinUrl: string, youtubeUrl: string) => void;
  updateAdminProfile: (adminName: string, adminEmail: string) => void;
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

      updateGeneral: (websiteName, supportEmail, contactPhone, businessAddress) => set({ websiteName, supportEmail, contactPhone, businessAddress }),
      updateStore: (shippingCharge, freeShippingThreshold, currency) => set({ shippingCharge, freeShippingThreshold, currency }),
      updateSocial: (instagramUrl, facebookUrl, linkedinUrl, youtubeUrl) => set({ instagramUrl, facebookUrl, linkedinUrl, youtubeUrl }),
      updateAdminProfile: (adminName, adminEmail) => set({ adminName, adminEmail }),
      changePassword: (current, next) => {
        // For demo: store a simple password in localStorage under this store's key
        const state = get() as any;
        const stored = (state as any)._password || 'admin';
        if (current === stored) {
          set({ ...(state as any), _password: next });
          return true;
        }
        return false;
      }
    }),
    { name: 'loavia-settings-storage' }
  )
);
