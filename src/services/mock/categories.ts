import { CategoryItem } from "@/store/siteStore";

const defaultCategories: CategoryItem[] = [
  { name: "Classic Collection", image: "/premium_cookie.png", link: "/shop?category=classic" },
  { name: "Vegan Options", image: "/vegan_cookie.png", link: "/shop?category=vegan" },
  { name: "Gluten-Free", image: "/gluten_free_cookie.png", link: "/shop?category=gluten-free" },
  { name: "Stuffed Cookies", image: "/stuffed_cookie.png", link: "/shop?category=stuffed" },
];

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
