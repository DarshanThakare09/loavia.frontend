import { apiClient } from "./apiClient";
import { Product } from "@/store/productStore";
import {
  BackendProduct,
  BackendCategory,
  BackendCollection,
  ProductFilterInput,
  PublicProductsResponse,
  PublicSingleProductResponse,
  PublicCategoriesResponse,
  PublicCollectionsResponse,
  PaginationMeta
} from "@/types/catalog";

// Helper to construct a plausible nutrition facts table based on calories
function generateNutritionTable(caloriesStr: string | null) {
  const caloriesVal = caloriesStr ? parseInt(caloriesStr) : 220;
  // Compute approximate estimates
  const fat = Math.round(caloriesVal * 0.05);
  const satFat = Math.round(fat * 0.5);
  const carbs = Math.round(caloriesVal * 0.125);
  const sugar = Math.round(carbs * 0.6);
  const protein = Math.round(caloriesVal * 0.015);

  return [
    { key: "Serving Size", value: "1 cookie (50g)" },
    { key: "Total Fat", value: `${fat}g` },
    { key: "Saturated Fat", value: `${satFat}g` },
    { key: "Trans Fat", value: "0g" },
    { key: "Cholesterol", value: `${Math.round(caloriesVal * 0.1)}mg` },
    { key: "Sodium", value: `${Math.round(caloriesVal * 0.6)}mg` },
    { key: "Total Carbohydrates", value: `${carbs}g` },
    { key: "Dietary Fiber", value: "1.5g" },
    { key: "Total Sugars", value: `${sugar}g` },
    { key: "Protein", value: `${protein}g` }
  ];
}

// Map Backend product to Frontend store Product format
export function mapBackendProduct(p: BackendProduct): Product {
  const primaryImageObj = p.images.find(img => img.isPrimary) || p.images[0];
  const primaryImageUrl = primaryImageObj?.url || "/premium_cookie.png";
  const mappedImages = p.images.map(img => img.url);

  // If comparePrice is defined, it is the lower sale price (discountPrice), and basePrice is the original price.
  // Wait, let's make sure that if comparePrice is greater than basePrice, basePrice is the sale price.
  // Let's do a safe conversion:
  let price = p.basePrice / 100;
  let discountPrice: number | null = null;

  if (p.comparePrice) {
    const p1 = p.basePrice / 100;
    const p2 = p.comparePrice / 100;
    if (p2 < p1) {
      price = p1; // original price
      discountPrice = p2; // sale price
    } else {
      price = p2; // original price
      discountPrice = p1; // sale price
    }
  }

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price,
    discountPrice,
    image: primaryImageUrl,
    images: mappedImages.length > 0 ? mappedImages : [primaryImageUrl],
    primaryImage: primaryImageUrl,
    coverImage: primaryImageUrl,
    rating: p.averageRating,
    reviews: p.reviewCount,
    category: p.category?.name || "Cookie",
    tags: p.tags.map(t => t.name),
    moods: p.tags.map(t => t.name),
    description: p.description,
    ingredients: p.ingredients,
    calories: p.calories || undefined,
    nutritionTable: generateNutritionTable(p.calories),
    inStock: p.inStock,
    isPopular: p.isBestSeller,
    isFeatured: p.isFeatured,
    featuredOrder: p.featuredOrder || undefined,
    featuredBadgeText: p.isFeatured ? "Featured" : undefined,
    variants: p.variants ? p.variants.map(v => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price / 100,
      discountPrice: v.discountPrice ? v.discountPrice / 100 : null,
      stockQuantity: v.stockQuantity,
      weight: v.weight,
      isDefault: v.isDefault,
      displayLabel: v.displayLabel
    })) : []
  };
}

export const catalogService = {
  // GET /products with optional filters
  async getProducts(filters?: ProductFilterInput): Promise<{ products: Product[]; pagination: PaginationMeta }> {
    const params: Record<string, any> = {};

    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.categorySlug) params.categorySlug = filters.categorySlug;
      if (filters.collectionId) params.collectionId = filters.collectionId;
      if (filters.collectionSlug) params.collectionSlug = filters.collectionSlug;
      if (filters.tagSlug) params.tagSlug = filters.tagSlug;
      if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured ? "true" : "false";
      if (filters.isBestSeller !== undefined) params.isBestSeller = filters.isBestSeller ? "true" : "false";
      if (filters.isNewArrival !== undefined) params.isNewArrival = filters.isNewArrival ? "true" : "false";
      if (filters.minPrice !== undefined) params.minPrice = Math.round(filters.minPrice * 100); // convert to Paise
      if (filters.maxPrice !== undefined) params.maxPrice = Math.round(filters.maxPrice * 100); // convert to Paise
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
    }

    const response = await apiClient.get<PublicProductsResponse>("/products", { params });
    const { data, pagination } = response.data;
    
    return {
      products: data.map(mapBackendProduct),
      pagination
    };
  },

  // GET /products/:slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<PublicSingleProductResponse>(`/products/${slug}`);
    return mapBackendProduct(response.data.data);
  },

  // GET /categories
  async getCategories(): Promise<BackendCategory[]> {
    const response = await apiClient.get<PublicCategoriesResponse>("/categories");
    return response.data.data;
  },

  // GET /collections
  async getCollections(): Promise<BackendCollection[]> {
    const response = await apiClient.get<PublicCollectionsResponse>("/collections");
    return response.data.data;
  }
};
