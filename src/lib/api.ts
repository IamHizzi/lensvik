import axios from 'axios';

const API_BASE_URL = '/api';

export interface Product {
    _id: string;
    name: string;
    price: number;
    comparePrice?: number;
    originalPrice?: number;
    size?: string;
    rating?: number;
    image: string;
    images?: string[];
    vtoImage?: string;
    category: string;
    subcategory?: string;
    frameType?: string;
    description?: string;
    gender?: string;
    material?: string;
    status?: string;
    collectionName?: string;
    tags?: string[];
    sku?: string;
    barcode?: string;
    stock?: number;
    variants?: Array<{
        color?: string;
        size?: string;
        lensType?: string;
        price?: number;
        stock?: number;
    }>;
    measurements?: {
        lensWidth?: number;
        bridgeWidth?: number;
        templeLength?: number;
        pdMin?: number;
        pdMax?: number;
        frameHeight?: number;
    };
    options?: {
        prescriptionCompatible?: boolean;
        blueLightFilter?: boolean;
        virtualTryOn?: boolean;
        lensCustomization?: boolean;
    };
    seo?: {
        metaTitle?: string;
        metaDesc?: string;
    };
}

/** Normalize a raw product object so both `image` and `images` are always resolved */
function normalizeProduct(data: any): Product {
    const images: string[] = data.images && data.images.length > 0 ? data.images : [];
    const image = data.image || images[0] || '/images/dfd.png';
    return {
        ...data,
        image,
        images,
        // Map comparePrice → originalPrice for backward compat with ProductCard
        originalPrice: data.originalPrice ?? data.comparePrice ?? undefined,
    };
}

export const getProducts = async (status = 'Active', limit?: number, category?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);
    
    const response = await axios.get(`${API_BASE_URL}/products?${params.toString()}`);
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeProduct);
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return normalizeProduct(response.data);
};
