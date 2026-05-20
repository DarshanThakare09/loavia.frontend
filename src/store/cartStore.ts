import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isMiniCartOpen: false,

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

      openMiniCart: () => set({ isMiniCartOpen: true }),
      
      closeMiniCart: () => set({ isMiniCartOpen: false }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'loavia-cart-storage',
      // Don't persist the UI state of the mini cart being open/closed
      partialize: (state) => ({ items: state.items }),
    }
  )
);
