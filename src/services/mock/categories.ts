import { CategoryItem } from "@/store/siteStore";

const defaultCategories: CategoryItem[] = [];

let categoriesDb = [...defaultCategories];

export const mockCategoryService = {
  async getCategories(): Promise<CategoryItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...categoriesDb]);
      }, 100);
    });
  },

  async updateCategories(categories: CategoryItem[]): Promise<CategoryItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        categoriesDb = [...categories];
        resolve(categoriesDb);
      }, 150);
    });
  }
};
