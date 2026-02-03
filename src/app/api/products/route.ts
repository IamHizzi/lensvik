import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { MOCK_PRODUCTS } from '@/data/mockData';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({});

        if (products.length > 0) {
            return NextResponse.json(products);
        }

        // Fallback to mock data if DB is empty
        return NextResponse.json(MOCK_PRODUCTS);
    } catch (error) {
        console.error('Database connection failed, falling back to mock data:', error);
        return NextResponse.json(MOCK_PRODUCTS);
    }
}
