import { Product } from "@/store/productStore";
import { PRODUCTS as initialProducts } from "@/lib/mockData";

// Convert mock data to new schema
const defaultProducts: Product[] = initialProducts.map((p, index) => ({
  ...p,
  discountPrice: null,
  calories: p.calories || '',
  nutritionTable: p.nutritionTable || [],
  inStock: true,
  isPopular: true,
  isFeatured: index < 3,
  featuredOrder: index + 1,
  featuredBadgeText: "Featured",
}));

// Local in-memory cache to simulate database
let productsDb: Product[] = [...defaultProducts];

export const mockProductService = {
  async getProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...productsDb]);
      }, 200); // simulate network latency
    });
  },

  async getProductById(id: string): Promise<Product | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsDb.find((p) => p.id === id));
      }, 100);
    });
  },

  async addProduct(productData: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          rating: 5.0,
          reviews: 0,
        };
        productsDb = [newProduct, ...productsDb];
        resolve(newProduct);
      }, 150);
    });
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = productsDb.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error("Product not found"));
          return;
        }
        const updatedProduct = { ...productsDb[index], ...productData };
        productsDb[index] = updatedProduct;
        resolve(updatedProduct);
      }, 150);
    });
  },

  async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        productsDb = productsDb.filter((p) => p.id !== id);
        resolve(true);
      }, 100);
    });
  }
};
