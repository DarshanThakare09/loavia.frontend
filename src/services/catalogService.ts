import { apiClient } from "./apiClient";
import { Product } from "@/store/productStore";
import { PRODUCTS } from "@/lib/mockData";
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

// Fallback logic when API server is unavailable
function getMockProductsResponse(filters?: ProductFilterInput): { products: Product[]; pagination: PaginationMeta } {
  let list: Product[] = PRODUCTS.map((p: any, index: number) => ({
    id: p.id || String(index + 1),
    name: p.name,
    price: p.price,
    discountPrice: p.discountPrice || null,
    image: p.image || "/premium_cookie.png",
    images: p.images || [p.image || "/premium_cookie.png"],
    primaryImage: p.image || "/premium_cookie.png",
    coverImage: p.image || "/premium_cookie.png",
    rating: p.rating || 5,
    reviews: p.reviews || 10,
    category: p.category || "Cookie",
    tags: p.tags || [],
    moods: p.moods || [],
    description: p.description || "",
    ingredients: p.ingredients || "",
    calories: p.calories || undefined,
    nutritionTable: p.nutritionTable || [],
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    inStock: p.inStock ?? true,
    isPopular: p.isPopular ?? true,
    isFeatured: p.isFeatured ?? true,
    featuredOrder: p.featuredOrder,
    featuredBadgeText: p.featuredBadgeText ?? "Featured",
  }));

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.categorySlug) {
      const cat = filters.categorySlug.toLowerCase();
      list = list.filter(p => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cat || p.category.toLowerCase() === cat);
    }
    if (filters.tagSlug) {
      const tag = filters.tagSlug.toLowerCase();
      list = list.filter(p => p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-") === tag || t.toLowerCase() === tag));
    }
    if (filters.isFeatured !== undefined) {
      list = list.filter(p => !!p.isFeatured === !!filters.isFeatured);
    }
    if (filters.isBestSeller !== undefined) {
      list = list.filter(p => !!p.isPopular === !!filters.isBestSeller);
    }
    if (filters.minPrice !== undefined) {
      list = list.filter(p => p.price >= filters.minPrice! / 100);
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter(p => p.price <= filters.maxPrice! / 100);
    }
    if (filters.sortBy) {
      if (filters.sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
      if (filters.sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
      if (filters.sortBy === "rated") list.sort((a, b) => b.rating - a.rating);
    }
  }

  const total = list.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedList = list.slice(startIndex, startIndex + limit);

  return {
    products: paginatedList,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  };
}

export const catalogService = {
  // GET /products with optional filters
  async getProducts(filters?: ProductFilterInput): Promise<{ products: Product[]; pagination: PaginationMeta }> {
    try {
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
    } catch (err) {
      console.warn("[catalogService] API call to /products failed. Falling back to mockData.", err);
      return getMockProductsResponse(filters);
    }
  },

  // GET /products/:slug
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await apiClient.get<PublicSingleProductResponse>(`/products/${slug}`);
      return mapBackendProduct(response.data.data);
    } catch (err) {
      console.warn(`[catalogService] API call to /products/${slug} failed. Falling back to mockData.`, err);
      const found = PRODUCTS.find((p: any) => {
        const pSlug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return pSlug === slug || p.id === slug;
      });
      const item: any = found || PRODUCTS[0];
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice || null,
        image: item.image || "/premium_cookie.png",
        images: item.images || [item.image || "/premium_cookie.png"],
        primaryImage: item.image || "/premium_cookie.png",
        coverImage: item.image || "/premium_cookie.png",
        rating: item.rating || 5,
        reviews: item.reviews || 10,
        category: item.category || "Cookie",
        tags: item.tags || [],
        moods: item.moods || [],
        description: item.description || "",
        ingredients: item.ingredients || "",
        calories: item.calories || undefined,
        nutritionTable: item.nutritionTable || [],
        slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        inStock: item.inStock ?? true,
        isPopular: item.isPopular ?? true,
        isFeatured: item.isFeatured ?? true,
      };
    }
  },

  // GET /categories
  async getCategories(): Promise<BackendCategory[]> {
    try {
      const response = await apiClient.get<PublicCategoriesResponse>("/categories");
      return response.data.data;
    } catch (err) {
      console.warn("[catalogService] API call to /categories failed. Falling back to mock categories.", err);
      return [
        { id: "cat-1", parentId: null, name: "Classic", slug: "classic", description: "Classic Collection", image: null, isActive: true, sortOrder: 1 },
        { id: "cat-2", parentId: null, name: "Vegan", slug: "vegan", description: "Vegan Options", image: null, isActive: true, sortOrder: 2 },
        { id: "cat-3", parentId: null, name: "Gluten-Free", slug: "gluten-free", description: "Gluten-Free Cookies", image: null, isActive: true, sortOrder: 3 },
        { id: "cat-4", parentId: null, name: "Stuffed", slug: "stuffed", description: "Stuffed Cookies", image: null, isActive: true, sortOrder: 4 },
        { id: "cat-5", parentId: null, name: "Specialty", slug: "specialty", description: "Specialty Flavors", image: null, isActive: true, sortOrder: 5 },
      ];
    }
  },

  // GET /collections
  async getCollections(): Promise<BackendCollection[]> {
    try {
      const response = await apiClient.get<PublicCollectionsResponse>("/collections");
      return response.data.data;
    } catch (err) {
      console.warn("[catalogService] API call to /collections failed.", err);
      return [];
    }
  }
};

