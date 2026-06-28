import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/services/apiClient';

export interface OrderItem {
  productName: string;
  variantName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;     // Paise
}

export interface Order {
  id: string;
  receiptNumber: string;
  status: string;
  totalAmount: number;   // Paise
  createdAt: string;
  items: OrderItem[];
  shipment?: { status: string; trackingNumber: string | null } | null;
}

export interface Address {
  id: string;
  label: string;
  recipientName?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  phone?: string;
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
  role?: string;
  orders: Order[];
  addresses: Address[];
  wishlist: WishlistItem[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password?: string, phone?: string) => Promise<any>;
  logout: () => Promise<void>;
  hydrateSession: () => Promise<User | null>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  
  // Admin panel state and actions
  allUsers: User[];
  allOrders: Order[];
  updateOrderStatus: (orderId: string, status: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteUser: (userId: string) => void;
}

const defaultUsers: User[] = [];
const defaultOrders: Order[] = [];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrating: true,
      allUsers: defaultUsers,
      allOrders: defaultOrders,

      login: async (email, password) => {
        const normalizedEmail = email.toLowerCase().trim();
        const response = await apiClient.post('/auth/login', { email: normalizedEmail, password });
        const userData = response.data.data.user;

        let savedAddresses = [];
        try {
          const stored = localStorage.getItem(`loavia-addresses-${userData.id}`);
          if (stored) savedAddresses = JSON.parse(stored);
        } catch {}

        // Fetch live wishlist from backend
        let wishlist: any[] = [];
        try {
          const { wishlistService } = await import('@/services/wishlistService');
          wishlist = await wishlistService.getWishlist();
        } catch (err) {
          console.error("Failed to fetch wishlist on login", err);
        }

        const user: User = {
          ...userData,
          orders: [],
          addresses: savedAddresses,
          wishlist
        };
        set({ user, isAuthenticated: true, isHydrating: false });

        // Trigger Cart Merge after login
        try {
          const { useCartStore } = await import('./cartStore');
          await useCartStore.getState().mergeCartAction();
        } catch (err) {
          console.error("Failed to merge cart on login", err);
        }

        return user;
      },

      register: async (name, email, password, phone) => {
        const normalizedEmail = email.toLowerCase().trim();
        const response = await apiClient.post('/auth/register', { name, email: normalizedEmail, password, phone });
        return response.data;
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } catch (err) {
          console.error("Logout API call failed", err);
        }
        
        // Rotate guest session ID upon logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("loavia_guest_session_id");
        }

        set({ user: null, isAuthenticated: false, isHydrating: false });

        // Clear local cart store
        try {
          const { useCartStore } = await import('./cartStore');
          useCartStore.getState().clearCart();
        } catch {}
      },

      hydrateSession: async () => {
        set({ isHydrating: true });
        try {
          const response = await apiClient.get('/auth/me');
          if (response.data?.success && response.data?.data) {
            const userData = response.data.data;

            let savedAddresses = [];
            try {
              const stored = localStorage.getItem(`loavia-addresses-${userData.id}`);
              if (stored) savedAddresses = JSON.parse(stored);
            } catch {}

            // Fetch live wishlist
            let wishlist: any[] = [];
            try {
              const { wishlistService } = await import('@/services/wishlistService');
              wishlist = await wishlistService.getWishlist();
            } catch (err) {
              console.error("Failed to fetch wishlist on session hydration", err);
            }

            const user: User = {
              ...userData,
              orders: [],
              addresses: savedAddresses,
              wishlist
            };
            set({ user, isAuthenticated: true, isHydrating: false });

            // Sync Cart from backend
            try {
              const { useCartStore } = await import('./cartStore');
              await useCartStore.getState().hydrateCart();
            } catch (err) {
              console.error("Failed to hydrate cart on session hydration", err);
            }

            return user;
          }
        } catch (err) {
          console.debug("Hydration failed (user not logged in)");
        }
        set({ user: null, isAuthenticated: false, isHydrating: false });
        
        // Hydrate guest cart
        try {
          const { useCartStore } = await import('./cartStore');
          await useCartStore.getState().hydrateCart();
        } catch {}

        return null;
      },

      forgotPassword: async (email) => {
        await apiClient.post('/auth/forgot-password', { email });
      },

      resetPassword: async (password, token) => {
        await apiClient.post('/auth/reset-password', { password, token });
      },

      updateUser: (data) => set((state) => {
        if (!state.user) return {};
        const updatedUser = { ...state.user, ...data };
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      addAddress: (address) => set((state) => {
        if (!state.user) return {};
        const newAddress = { ...address, id: Date.now().toString() };
        let newAddresses = [...state.user.addresses, newAddress];
        if (address.isDefault) {
          newAddresses = newAddresses.map(a => ({ ...a, isDefault: a.id === newAddress.id }));
        }
        const updatedUser = { ...state.user, addresses: newAddresses };
        try {
          localStorage.setItem(`loavia-addresses-${state.user.id}`, JSON.stringify(newAddresses));
        } catch {}
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      updateAddress: (id, address) => set((state) => {
        if (!state.user) return {};
        let newAddresses = state.user.addresses.map(a => a.id === id ? { ...a, ...address } : a);
        if (address.isDefault) {
          newAddresses = newAddresses.map(a => ({ ...a, isDefault: a.id === id }));
        }
        const updatedUser = { ...state.user, addresses: newAddresses };
        try {
          localStorage.setItem(`loavia-addresses-${state.user.id}`, JSON.stringify(newAddresses));
        } catch {}
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      deleteAddress: (id) => set((state) => {
        if (!state.user) return {};
        const newAddresses = state.user.addresses.filter(a => a.id !== id);
        const updatedUser = {
          ...state.user,
          addresses: newAddresses
        };
        try {
          localStorage.setItem(`loavia-addresses-${state.user.id}`, JSON.stringify(newAddresses));
        } catch {}
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      toggleWishlist: async (item) => {
        const state = get();
        if (!state.user) return;
        
        const currentWishlist = state.user.wishlist || [];
        const exists = currentWishlist.some(w => w.id === item.id);
        
        try {
          const { wishlistService } = await import('@/services/wishlistService');
          if (exists) {
            await wishlistService.removeFromWishlist(item.id);
            const newWishlist = currentWishlist.filter(w => w.id !== item.id);
            set({
              user: { ...state.user, wishlist: newWishlist },
              allUsers: state.allUsers.map(u => u.id === state.user!.id ? { ...u, wishlist: newWishlist } : u)
            });
          } else {
            await wishlistService.addToWishlist(item.id);
            const newWishlist = [...currentWishlist, item];
            set({
              user: { ...state.user, wishlist: newWishlist },
              allUsers: state.allUsers.map(u => u.id === state.user!.id ? { ...u, wishlist: newWishlist } : u)
            });
          }
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || "Failed to toggle wishlist";
          console.error(msg);
        }
      },

      updateOrderStatus: (orderId, status) => set((state) => {
        const updatedOrders = state.allOrders.map(o => o.id === orderId ? { ...o, status } : o);
        const updatedUsers = state.allUsers.map(u => {
          const hasOrder = u.orders.some(o => o.id === orderId);
          if (hasOrder) {
            return {
              ...u,
              orders: u.orders.map(o => o.id === orderId ? { ...o, status } : o)
            };
          }
          return u;
        });
        
        let updatedCurrentUser = state.user;
        if (state.user && state.user.orders.some(o => o.id === orderId)) {
          updatedCurrentUser = {
            ...state.user,
            orders: state.user.orders.map(o => o.id === orderId ? { ...o, status } : o)
          };
        }

        return {
          allOrders: updatedOrders,
          allUsers: updatedUsers,
          user: updatedCurrentUser
        };
      }),

      deleteOrder: (orderId) => set((state) => {
        const updatedOrders = state.allOrders.filter(o => o.id !== orderId);
        const updatedUsers = state.allUsers.map(u => ({
          ...u,
          orders: u.orders.filter(o => o.id !== orderId)
        }));
        
        let updatedCurrentUser = state.user;
        if (state.user) {
          updatedCurrentUser = {
            ...state.user,
            orders: state.user.orders.filter(o => o.id !== orderId)
          };
        }

        return {
          allOrders: updatedOrders,
          allUsers: updatedUsers,
          user: updatedCurrentUser
        };
      }),

      deleteUser: (userId) => set((state) => {
        const updatedUsers = state.allUsers.filter(u => u.id !== userId);
        // allOrders is empty in production (orders fetched fresh from API); filter by userId if present
        const updatedOrders = state.allOrders.filter(o => (o as any).userId !== userId);

        const shouldLogout = state.user && state.user.id === userId;

        return {
          allUsers: updatedUsers,
          allOrders: updatedOrders,
          ...(shouldLogout ? { user: null, isAuthenticated: false } : {})
        };
      }),
    }),
    {
      name: 'loavia-auth-storage',
    }
  )
);
