import { apiClient } from '@/services/apiClient';
import { handleApiError } from '@/utils/adminErrorHandler';
import {
  ProductDTO,
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

// Helper to map backend product structure to frontend ProductDTO format
function mapBackendProduct(p: any): ProductDTO {
  const primaryImage = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || p.image || '/premium_cookie.png';
  const mappedImages = p.images?.map((img: any) => img.url) || p.images || [];

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    ingredients: p.ingredients || "",
    calories: p.calories || null,
    price: p.basePrice ?? p.price ?? 0,
    discountPrice: p.comparePrice ?? p.discountPrice ?? undefined,
    sku: p.sku,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : { id: "", name: "Cookie" },
    image: primaryImage,
    images: mappedImages.length > 0 ? mappedImages : [primaryImage],
    isFeatured: p.isFeatured ?? false,
    status: p.status === 'PUBLISHED' ? 'ACTIVE' : p.status === 'DRAFT' ? 'INACTIVE' : p.status,
    variants: p.variants ? p.variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      discountPrice: v.discountPrice ?? undefined,
      stock: v.stockQuantity ?? v.stock ?? 0,
      isActive: !v.isDeleted,
    })) : [],
    tags: p.tags?.map((t: any) => t.name) || p.tags || [],
    createdAt: p.createdAt,
  };
}

// Helper to map Create/Update request DTO to backend format
function mapFrontendRequest(data: any) {
  const mapped = { ...data };
  if (data.status) {
    mapped.status = data.status === 'ACTIVE' ? 'PUBLISHED' : data.status === 'INACTIVE' ? 'DRAFT' : data.status;
  }
  return mapped;
}

export const adminProductService = {
  async listProducts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    search?: string
  ): Promise<PaginatedResponse<ProductDTO>> {
    try {
      const response = await apiClient.get<any>(
        '/admin/products',
        {
          params: { page, limit, categoryId, search },
        }
      );
      // Map products array inside paginated response
      return {
        ...response.data,
        data: Array.isArray(response.data.data) ? response.data.data.map(mapBackendProduct) : [],
        meta: response.data.meta || { page, limit, total: 0, totalPages: 1 },
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getProduct(id: string): Promise<ProductDTO> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `/admin/products/${id}`
      );
      return mapBackendProduct(response.data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createProduct(data: CreateProductRequestDTO): Promise<ProductDTO> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        '/admin/products',
        mapFrontendRequest(data)
      );
      return mapBackendProduct(response.data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProduct(
    id: string,
    data: UpdateProductRequestDTO
  ): Promise<ProductDTO> {
    try {
      const response = await apiClient.put<ApiResponse<any>>(
        `/admin/products/${id}`,
        mapFrontendRequest(data)
      );
      return mapBackendProduct(response.data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/products/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
