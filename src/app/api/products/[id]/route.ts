import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { MOCK_PRODUCTS } from '@/data/mockData';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await dbConnect();
        const product = await Product.findById(id);

        if (product) {
            return NextResponse.json(product);
        }
    } catch (error) {
        // Continue to mock fallback on DB error or invalid ID
    }

    // Fallback to mock data
    const mockProduct = MOCK_PRODUCTS.find(p => p._id === id);
    if (mockProduct) {
        return NextResponse.json(mockProduct);
    }

    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
}
