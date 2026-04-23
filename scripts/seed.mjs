import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Product Schema
const ProductSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    size: String,
    rating: Number,
    image: { type: String, required: true },
    vtoImage: String,
    category: { type: String, required: true },
    subcategory: String,
    frameType: String,
    description: String,
    measurements: {
        lensWidth: Number,
        bridgeWidth: Number,
        templeLength: Number
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seedDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        console.log('\n🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('   Cleared all products.');

        const productsToInsert = [
            // P1 Product
            {
                _id: "p1",
                name: "Lensvik P1 - Elite Series",
                price: 3800,
                originalPrice: 5200,
                size: "Medium",
                rating: 5,
                image: "/images/Products/P1/11.jpeg",
                vtoImage: "/images/Products/P1/try 1.png",
                category: "Eyeglasses",
                subcategory: "Unisex",
                frameType: "rect",
                description: "Sophisticated black frames with ivory temples and gold accents. Part of our exclusive P1 Elite series.",
                measurements: { lensWidth: 52, bridgeWidth: 18, templeLength: 145 }
            },
            // P3 Product
            {
                _id: "p3",
                name: "Lensvik P3 - Premium Edition",
                price: 3500,
                originalPrice: 4800,
                size: "Large",
                rating: 5,
                image: "/images/Products/P3/333.jpeg",
                vtoImage: "/images/Products/P3/try 3.png",
                category: "Eyeglasses",
                subcategory: "Unisex",
                frameType: "square",
                description: "Bold architectural design featuring signature gold square accents on the hinges. A masterpiece from the P3 collection.",
                measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 140 }
            }
        ];

        console.log('\n📦 Inserting P1 and P3 products...');
        await Product.insertMany(productsToInsert);
        console.log(`✅ Successfully inserted 2 products`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

seedDatabase();
