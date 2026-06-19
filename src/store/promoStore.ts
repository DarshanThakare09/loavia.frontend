import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  timesUsed: number;
  expiry: string | null;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

interface PromoValidationResult {
  success: boolean;
  message: string;
  amount: number;
  promo?: PromoCode;
}

interface PromoState {
  promoCodes: PromoCode[];
  addPromoCode: (promo: Omit<PromoCode, 'id' | 'timesUsed' | 'createdAt'>) => void;
  updatePromoCode: (
    id: string,
    updates: Partial<Omit<PromoCode, 'id' | 'timesUsed' | 'createdAt'>>
  ) => void;
  deletePromoCode: (id: string) => void;
  togglePromoCodeActive: (id: string) => void;
  incrementUsage: (code: string) => void;
  validatePromoCode: (code: string, subtotal: number) => PromoValidationResult;
}

const safeStorage = {
  getItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(name);
    } catch (e) {
      console.warn('localStorage not available, using in-memory storage', e);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },
};

const normalizeCode = (code: string) => code.trim().toUpperCase();

const isPromoExpired = (expiry: string | null) => {
  if (!expiry) return false;
  const date = new Date(expiry);
  if (Number.isNaN(date.getTime())) return true;
  const now = new Date();
  return date < now;
};

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      promoCodes: [],

      addPromoCode: (promo) => {
        const code = normalizeCode(promo.code);
        set((state) => ({
          promoCodes: [
            ...state.promoCodes,
            {
              id: crypto.randomUUID(),
              code,
              type: promo.type,
              value: promo.value,
              minOrder: promo.minOrder,
              maxDiscount: promo.maxDiscount,
              usageLimit: promo.usageLimit,
              timesUsed: 0,
              expiry: promo.expiry,
              isActive: promo.isActive,
              description: promo.description,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      updatePromoCode: (id, updates) => {
        set((state) => ({
          promoCodes: state.promoCodes.map((promo) =>
            promo.id === id
              ? {
                  ...promo,
                  code: updates.code ? normalizeCode(updates.code) : promo.code,
                  type: updates.type ?? promo.type,
                  value: updates.value ?? promo.value,
                  minOrder: updates.minOrder ?? promo.minOrder,
                  maxDiscount:
                    updates.type === 'fixed' || promo.type === 'fixed'
                      ? updates.maxDiscount ?? undefined
                      : updates.maxDiscount ?? promo.maxDiscount,
                  usageLimit: updates.usageLimit ?? promo.usageLimit,
                  expiry: updates.expiry ?? promo.expiry,
                  isActive: updates.isActive ?? promo.isActive,
                  description: updates.description ?? promo.description,
                }
              : promo
          ),
        }));
      },

      deletePromoCode: (id) =>
        set((state) => ({
          promoCodes: state.promoCodes.filter((promo) => promo.id !== id),
        })),

      togglePromoCodeActive: (id) =>
        set((state) => ({
          promoCodes: state.promoCodes.map((promo) =>
            promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
          ),
        })),

      incrementUsage: (code) =>
        set((state) => ({
          promoCodes: state.promoCodes.map((promo) =>
            normalizeCode(promo.code) === normalizeCode(code) && promo.timesUsed < promo.usageLimit
              ? { ...promo, timesUsed: promo.timesUsed + 1 }
              : promo
          ),
        })),

      validatePromoCode: (code, subtotal) => {
        const normalized = normalizeCode(code);
        const promo = get().promoCodes.find((item) => normalizeCode(item.code) === normalized);

        if (!promo) {
          return { success: false, message: 'Invalid promo code.', amount: 0 };
        }

        if (!promo.isActive) {
          return { success: false, message: 'This promo code is inactive.', amount: 0, promo };
        }

        if (promo.usageLimit <= promo.timesUsed) {
          return { success: false, message: 'This promo code has reached its usage limit.', amount: 0, promo };
        }

        if (isPromoExpired(promo.expiry)) {
          return { success: false, message: 'This promo code has expired.', amount: 0, promo };
        }

        if (subtotal < promo.minOrder) {
          return {
            success: false,
            message: `Minimum order amount for this promo is ₹${promo.minOrder}.`,
            amount: 0,
            promo,
          };
        }

        let amount = 0;
        if (promo.type === 'percentage') {
          amount = subtotal * (promo.value / 100);
          if (promo.maxDiscount) {
            amount = Math.min(amount, promo.maxDiscount);
          }
        } else {
          amount = promo.value;
        }

        amount = Math.min(amount, subtotal);
        amount = Number(amount.toFixed(2));

        return {
          success: true,
          message: 'Promo code applied successfully.',
          amount,
          promo,
        };
      },
    }),
    {
      name: 'loavia-promo-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ promoCodes: state.promoCodes }),
    }
  )
);
