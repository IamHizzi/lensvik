import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const status = url.searchParams.get('status');
        const category = url.searchParams.get('category');
        const limit = parseInt(url.searchParams.get('limit') || '0');
        const query: Record<string, any> = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        let productsQuery = Product.find(query).sort({ createdAt: -1 });
        
        if (limit > 0) {
            productsQuery = productsQuery.limit(limit);
        }

        const products = await productsQuery;

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
        
        // Guaranteed-unique ID: timestamp + random suffix
        const id = body._id || `prod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
        
        // Remove undefined / empty-string values to avoid Mongoose cast errors
        const clean = Object.fromEntries(
            Object.entries(body).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
        );

        const newProduct = new Product({
            ...clean,
            _id: id,
            price: Number(clean.price),
        });

        await newProduct.save();
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await dbConnect();
        await Product.deleteMany({});
        return NextResponse.json({ message: 'All products deleted successfully' });
    } catch (error: any) {
        console.error('Failed to clear products:', error);
        return NextResponse.json({ error: 'Failed to clear products' }, { status: 500 });
    }
}
