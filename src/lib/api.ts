import axios from 'axios';

const API_BASE_URL = '/api';

export interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    size?: string;
    rating?: number;
    image: string;
    vtoImage?: string;
    category: string;
    subcategory?: string;
    frameType: string;
    description?: string;
    measurements?: {
        lensWidth: number;
        bridgeWidth: number;
        templeLength: number;
    };
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
};
