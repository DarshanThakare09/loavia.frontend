import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orders: Order[];
  addresses: Address[];
  wishlist: WishlistItem[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'orders' | 'addresses' | 'wishlist'>) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ 
        user: { ...userData, orders: [], addresses: [], wishlist: [] }, 
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      addOrder: (order) => set((state) => ({
        user: state.user ? {
          ...state.user,
          orders: [order, ...state.user.orders]
        } : null
      })),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
      addAddress: (address) => set((state) => {
        if (!state.user) return state;
        const newAddress = { ...address, id: Date.now().toString() };
        let newAddresses = [...state.user.addresses, newAddress];
        if (address.isDefault) {
          newAddresses = newAddresses.map(a => ({ ...a, isDefault: a.id === newAddress.id }));
        }
        return { user: { ...state.user, addresses: newAddresses } };
      }),
      updateAddress: (id, address) => set((state) => {
        if (!state.user) return state;
        let newAddresses = state.user.addresses.map(a => a.id === id ? { ...a, ...address } : a);
        if (address.isDefault) {
          newAddresses = newAddresses.map(a => ({ ...a, isDefault: a.id === id }));
        }
        return { user: { ...state.user, addresses: newAddresses } };
      }),
      deleteAddress: (id) => set((state) => ({
        user: state.user ? {
          ...state.user,
          addresses: state.user.addresses.filter(a => a.id !== id)
        } : null
      })),
      toggleWishlist: (item) => set((state) => {
        if (!state.user) return state;
        const currentWishlist = state.user.wishlist || [];
        const exists = currentWishlist.some(w => w.id === item.id);
        const newWishlist = exists 
          ? currentWishlist.filter(w => w.id !== item.id)
          : [...currentWishlist, item];
        return { user: { ...state.user, wishlist: newWishlist } };
      })
    }),
    {
      name: 'loavia-auth-storage',
    }
  )
);
