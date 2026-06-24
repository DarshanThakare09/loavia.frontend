import { User, Order, Address } from "@/store/authStore";

const defaultUsers: User[] = [];

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
