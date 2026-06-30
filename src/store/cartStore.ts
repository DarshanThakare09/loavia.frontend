import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isCustomBox?: boolean;
  customBoxSelections?: any[];
}

interface CartState {
  items: CartItem[];
  isMiniCartOpen: boolean;
  appliedPromoCode: string | null;
  isLoading: boolean;
  error: string | null;

  hydrateCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number; variantId?: string }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCartAction: () => Promise<void>;
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
      isLoading: false,
      error: null,

      hydrateCart: async () => {
        const { useAuthStore } = await import('@/store/authStore');
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          set({ items: [], isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          const items = await cartService.getCart();
          set({ items, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to load cart", isLoading: false });
        }
      },

      addItem: async (newItem) => {
        const { useAuthStore } = await import('@/store/authStore');
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          const { toast } = await import('sonner');
          toast.error("Please log in to add items to your cart.");
          if (typeof window !== "undefined") {
            window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
          }
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          const quantityToAdd = newItem.quantity || 1;
          const items = await cartService.addToCart(
            newItem.variantId || newItem.id,
            quantityToAdd,
            newItem.isCustomBox || false,
            newItem.customBoxSelections
          );
          set({ items, isLoading: false });
          get().openMiniCart();
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "Failed to add item to cart";
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      removeItem: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          const items = await cartService.removeFromCart(id);
          set({ items, isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to remove item", isLoading: false });
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id);
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          const items = await cartService.updateQuantity(id, quantity);
          set({ items, isLoading: false });
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "Failed to update quantity";
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          await cartService.clearCart();
          set({ items: [], isLoading: false });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to clear cart", isLoading: false });
        }
      },

      mergeCartAction: async () => {
        const guestItems = get().items;
        if (guestItems.length === 0) {
          await get().hydrateCart();
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const { cartService } = await import('@/services/cartService');
          const mappedItems = guestItems.map(item => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity,
            isCustomBox: item.isCustomBox || false,
            customBoxSelections: item.customBoxSelections || []
          }));

          const { items, clampedItems } = await cartService.mergeCarts(mappedItems);
          set({ items, isLoading: false });

          if (clampedItems && clampedItems.length > 0) {
            const { toast } = await import('sonner');
            toast.warning(`Some items in your cart were adjusted due to stock limits.`);
          }
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message || "Failed to merge carts", isLoading: false });
        }
      },

      setAppliedPromoCode: (code) => set({ appliedPromoCode: code }),
      clearAppliedPromoCode: () => set({ appliedPromoCode: null }),

      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'loavia-cart-storage-v2',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ items: state.items, appliedPromoCode: state.appliedPromoCode }),
    }
  )
);
