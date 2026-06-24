import { Product as StoreProduct } from "@/store/productStore";

export type ProductSortOption = "newest" | "oldest" | "price_asc" | "price_desc" | "rated" | "popular";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BackendCategory {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface BackendTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BackendCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export interface BackendProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface BackendProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number; // in Paise
  discountPrice: number | null; // in Paise
  stockQuantity: number;
  weight: number | null;
  isDefault: boolean;
  displayLabel: string | null;
}

export interface BackendProduct {
  id: string;
  categoryId: string;
  category: BackendCategory;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  ingredients: string;
  calories: string | null;
  inStock: boolean;
  basePrice: number; // in Paise
  comparePrice: number | null; // in Paise
  sku: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  featuredOrder: number | null;
  sortOrder: number;
  averageRating: number;
  reviewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  images: BackendProductImage[];
  variants: BackendProductVariant[];
  tags: BackendTag[];
  collections: BackendCollection[];
}

export interface ProductFilterInput {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  collectionSlug?: string;
  tagSlug?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export interface PublicProductsResponse {
  success: boolean;
  message: string;
  data: BackendProduct[];
  pagination: PaginationMeta;
  filters?: {
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };
  };
}

export interface PublicSingleProductResponse {
  success: boolean;
  message: string;
  data: BackendProduct;
}

export interface PublicCategoriesResponse {
  success: boolean;
  message: string;
  data: BackendCategory[];
}

export interface PublicCollectionsResponse {
  success: boolean;
  message: string;
  data: BackendCollection[];
}
