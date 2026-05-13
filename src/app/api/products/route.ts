import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const query: Record<string, any> = {};

        if (status) {
            query.status = status;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        const normalizedProducts = products.map(p => {
            const obj = p.toObject();
            return {
                ...obj,
                image: obj.image || (obj.images && obj.images[0]) || '/images/dfd.png'
            };
        });

        return NextResponse.json(normalizedProducts);
    } catch (error) {
        console.error('Database connection failed:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        if (!body.image && Array.isArray(body.images) && body.images.length > 0) {
            body.image = body.images[0];
        }
        const id = body._id || `prod_${Math.random().toString(36).substring(2, 11)}`;
        const newProduct = new Product({
            ...body,
            _id: id
        });

        await newProduct.save();
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}
