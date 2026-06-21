import { User, Order, Address } from "@/store/authStore";

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

let usersDb = [...defaultUsers];

export const mockUserService = {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...usersDb]);
      }, 100);
    });
  },

  async login(userData: Omit<User, 'orders' | 'addresses' | 'wishlist'>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = usersDb.find(u => u.email === userData.email);
        if (existing) {
          existing.name = userData.name || existing.name;
          resolve(existing);
        } else {
          const newUser: User = {
            id: userData.id || `user-${Date.now()}`,
            name: userData.name || "John Doe",
            email: userData.email,
            orders: [],
            addresses: [],
            wishlist: []
          };
          usersDb.push(newUser);
          resolve(newUser);
        }
      }, 200);
    });
  },

  async addOrder(userId: string, order: Order): Promise<Order> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = usersDb.find(u => u.id === userId);
        if (!user) {
          reject(new Error("User not found"));
          return;
        }

        const defaultAddr = user.addresses.find(a => a.isDefault);
        const addressStr = defaultAddr 
          ? `${defaultAddr.street}, ${defaultAddr.city} - ${defaultAddr.postalCode}` 
          : "123 Cookie Lane, Mumbai, Maharashtra - 400001";

        const enrichedOrder: Order = {
          ...order,
          customerName: user.name,
          customerEmail: user.email,
          shippingAddress: addressStr
        };

        user.orders = [enrichedOrder, ...user.orders];
        resolve(enrichedOrder);
      }, 150);
    });
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let foundOrder: Order | null = null;
        usersDb = usersDb.map(u => {
          const orders = u.orders.map(o => {
            if (o.id === orderId) {
              foundOrder = { ...o, status };
              return foundOrder;
            }
            return o;
          });
          return { ...u, orders };
        });

        if (foundOrder) {
          resolve(foundOrder);
        } else {
          reject(new Error("Order not found"));
        }
      }, 150);
    });
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        usersDb = usersDb.map(u => ({
          ...u,
          orders: u.orders.filter(o => o.id !== orderId)
        }));
        resolve(true);
      }, 100);
    });
  },

  async deleteUser(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        usersDb = usersDb.filter(u => u.id !== userId);
        resolve(true);
      }, 100);
    });
  }
};
