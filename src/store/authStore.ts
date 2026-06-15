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
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
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
  
  // Admin panel state and actions
  allUsers: User[];
  allOrders: Order[];
  updateOrderStatus: (orderId: string, status: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteUser: (userId: string) => void;
}

const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    orders: [
      {
        id: "ORD-A1B2C3",
        date: "2026-06-10T10:30:00.000Z",
        total: 897,
        status: "Delivered",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        shippingAddress: "123 Cookie Lane, Mumbai, Maharashtra - 400001",
        items: [
          {
            id: "1",
            name: "Classic Chocolate Chip",
            price: 299,
            quantity: 2,
            image: "/premium_cookie.png"
          },
          {
            id: "3",
            name: "Oatmeal Raisin Bliss",
            price: 279,
            quantity: 1,
            image: "/premium_cookie.png"
          }
        ]
      }
    ],
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        street: "123 Cookie Lane",
        city: "Mumbai",
        postalCode: "400001",
        isDefault: true
      }
    ],
    wishlist: []
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    orders: [
      {
        id: "ORD-D4E5F6",
        date: "2026-06-14T15:45:00.000Z",
        total: 698,
        status: "Processing",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        shippingAddress: "456 Bakery Road, Pune, Maharashtra - 411001",
        items: [
          {
            id: "2",
            name: "Double Dark Chocolate",
            price: 349,
            quantity: 2,
            image: "/premium_cookie.png"
          }
        ]
      }
    ],
    addresses: [
      {
        id: "addr-2",
        label: "Office",
        street: "456 Bakery Road",
        city: "Pune",
        postalCode: "411001",
        isDefault: true
      }
    ],
    wishlist: []
  }
];

const defaultOrders: Order[] = [
  ...defaultUsers[0].orders,
  ...defaultUsers[1].orders
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      allUsers: defaultUsers,
      allOrders: defaultOrders,

      login: (userData) => set((state) => {
        const email = userData.email;
        const name = userData.name;
        const existingUser = state.allUsers.find(u => u.email === email);
        if (existingUser) {
          const updatedUser = { ...existingUser, name: name || existingUser.name };
          const updatedUsers = state.allUsers.map(u => u.id === existingUser.id ? updatedUser : u);
          return {
            user: updatedUser,
            isAuthenticated: true,
            allUsers: updatedUsers
          };
        } else {
          const newUser: User = {
            id: userData.id || `user-${Date.now()}`,
            name: name || "John Doe",
            email: email,
            orders: [],
            addresses: [],
            wishlist: []
          };
          return {
            user: newUser,
            isAuthenticated: true,
            allUsers: [...state.allUsers, newUser]
          };
        }
      }),

      logout: () => set({ user: null, isAuthenticated: false }),

      addOrder: (order) => set((state) => {
        if (!state.user) return {};
        
        const defaultAddr = state.user.addresses.find(a => a.isDefault);
        const addressStr = defaultAddr 
          ? `${defaultAddr.street}, ${defaultAddr.city} - ${defaultAddr.postalCode}` 
          : "123 Cookie Lane, Mumbai, Maharashtra - 400001";

        const enrichedOrder: Order = {
          ...order,
          customerName: state.user.name,
          customerEmail: state.user.email,
          shippingAddress: addressStr
        };

        const updatedUser = {
          ...state.user,
          orders: [enrichedOrder, ...state.user.orders]
        };

        return {
          user: updatedUser,
          allOrders: [enrichedOrder, ...state.allOrders],
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

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
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      deleteAddress: (id) => set((state) => {
        if (!state.user) return {};
        const updatedUser = {
          ...state.user,
          addresses: state.user.addresses.filter(a => a.id !== id)
        };
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

      toggleWishlist: (item) => set((state) => {
        if (!state.user) return {};
        const currentWishlist = state.user.wishlist || [];
        const exists = currentWishlist.some(w => w.id === item.id);
        const newWishlist = exists 
          ? currentWishlist.filter(w => w.id !== item.id)
          : [...currentWishlist, item];
        const updatedUser = { ...state.user, wishlist: newWishlist };
        return {
          user: updatedUser,
          allUsers: state.allUsers.map(u => u.id === state.user!.id ? updatedUser : u)
        };
      }),

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
        const userToDelete = state.allUsers.find(u => u.id === userId);
        const updatedUsers = state.allUsers.filter(u => u.id !== userId);
        const updatedOrders = state.allOrders.filter(o => {
          return userToDelete ? o.customerEmail !== userToDelete.email : true;
        });

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
