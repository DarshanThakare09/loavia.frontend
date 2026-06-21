import { mockProductService } from "./mock/products";
import { mockCategoryService } from "./mock/categories";
import { mockReviewService } from "./mock/reviews";
import { mockUserService } from "./mock/users";

export const MockService = {
  products: mockProductService,
  categories: mockCategoryService,
  reviews: mockReviewService,
  users: mockUserService,
};
