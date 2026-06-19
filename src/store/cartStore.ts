import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isCustomBox?: boolean;
}

interface CartState {
  items: CartItem[];
  isMiniCartOpen: boolean;
  appliedPromoCode: string | null;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedPromoCode: (code: string | null) => void;
  clearAppliedPromoCode: () => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  getCartTotal: () => number;
}

// Custom storage with fallback
const safeStorage = {
  getItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(name);
      return item;
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
      // Silently fail - cart will still work in memory
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isMiniCartOpen: false,
      appliedPromoCode: null,

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === newItem.id);
          const quantityToAdd = newItem.quantity || 1;
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + quantityToAdd }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: quantityToAdd }] };
        });
        // Automatically open the mini cart when an item is added
        get().openMiniCart();
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity > 0
            ? state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
            : state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      setAppliedPromoCode: (code) => set({ appliedPromoCode: code }),
      clearAppliedPromoCode: () => set({ appliedPromoCode: null }),

      openMiniCart: () => set({ isMiniCartOpen: true }),
      
      closeMiniCart: () => set({ isMiniCartOpen: false }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'loavia-cart-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ items: state.items, appliedPromoCode: state.appliedPromoCode }),
    }
  )
);
