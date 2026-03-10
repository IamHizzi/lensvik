import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
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

const Product = mongoose.model('Product', ProductSchema);

// Products to seed
const PRODUCTS = [
    {
        _id: "1",
        name: "Modern Chic - 0693 - Gold Series",
        price: 3200,
        originalPrice: 4500,
        size: "Medium",
        rating: 5,
        image: "/images/IMG-20251128-WA0693.jpg.jpeg",
        vtoImage: "/images/IMG-20251128-WA0693.jpg.jpeg",
        category: "Eyeglasses",
        subcategory: "Men",
        frameType: "rect",
        description: "Elegant gold finish with a modern chic design. Perfect for everyday luxury.",
        measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 140 }
    },
    {
        _id: "2",
        name: "Urban Style - 0727 - Midnight",
        price: 2800,
        originalPrice: 3800,
        size: "Large",
        rating: 5,
        image: "/images/IMG-20251128-WA0727.jpg.jpeg",
        vtoImage: "/images/IMG-20251128-WA0727.jpg.jpeg",
        category: "Sunglasses",
        subcategory: "Men",
        frameType: "round",
        description: "Bold midnight frames for a confident urban statement.",
        measurements: { lensWidth: 55, bridgeWidth: 18, templeLength: 145 }
    },
    {
        _id: "3",
        name: "Artisan Craft - 0123 - Tortoise",
        price: 3500,
        originalPrice: 4900,
        size: "Medium",
        rating: 5,
        image: "/images/changes/IMG-20251014-WA0058.jpg.jpeg",
        vtoImage: "/images/changes/IMG-20251014-WA0058.jpg.jpeg",
        category: "Eyeglasses",
        subcategory: "Women",
        frameType: "round",
        description: "Handcrafted tortoise shell round frame with premium blue light protection.",
        measurements: { lensWidth: 48, bridgeWidth: 19, templeLength: 142 }
    },
    {
        _id: "4",
        name: "Classic Vision - 0143 - Slate",
        price: 3100,
        originalPrice: 4200,
        size: "Large",
        rating: 5,
        image: "/images/L-430.png",
        vtoImage: "/images/L-430.png",
        category: "Eyeglasses",
        subcategory: "Men",
        frameType: "rect",
        description: "Timeless slate grey frames designed for superior comfort and clarity.",
        measurements: { lensWidth: 56, bridgeWidth: 18, templeLength: 148 }
    },
    {
        _id: "5",
        name: "Aero Precision - 2196-L - Matte Black",
        price: 1699,
        originalPrice: 3000,
        size: "Medium",
        rating: 5,
        image: "/images/z-100-tryon-1.png",
        vtoImage: "/images/z-100-tryon-1.png",
        category: "Sunglasses",
        subcategory: "Women",
        frameType: "rect",
        description: "Sleek matte finish with architectural precision. Durable and lightweight.",
        measurements: { lensWidth: 52, bridgeWidth: 18, templeLength: 145 }
    },
    {
        _id: "6",
        name: "Heritage Round - HR-410 - Tortoise",
        price: 2499,
        originalPrice: 3999,
        size: "Large",
        rating: 5,
        image: "/images/changes/IMG_20260306_234015.jpg.jpeg",
        vtoImage: "/images/changes/IMG_20260306_234015.jpg.jpeg",
        category: "Eyeglasses",
        subcategory: "Men",
        frameType: "round",
        description: "Premium wide tortoise shell round frame with polished metal bridge. Classic vintage aesthetic meets modern engineering.",
        measurements: { lensWidth: 50, bridgeWidth: 20, templeLength: 145 }
    },
    {
        _id: "7",
        name: "Noir Cat-Eye - NC-220 - Gold Accent",
        price: 3799,
        originalPrice: 5200,
        size: "Medium",
        rating: 5,
        image: "/images/changes/IMG_20260306_234309.jpg.jpeg",
        vtoImage: "/images/changes/IMG_20260306_234309.jpg.jpeg",
        category: "Eyeglasses",
        subcategory: "Women",
        frameType: "cat",
        description: "Dramatic cat-eye silhouette in glossy black with 18K gold inner rim accents. Statement elegance for the modern woman.",
        measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 140 }
    },
    {
        _id: "8",
        name: "Stealth Slim - SS-330 - Navy",
        price: 2199,
        originalPrice: 3500,
        size: "Medium",
        rating: 5,
        image: "/images/changes/IMG_20260306_234235.jpg.jpeg",
        vtoImage: "/images/changes/IMG_20260306_234235.jpg.jpeg",
        category: "Eyeglasses",
        subcategory: "Men",
        frameType: "rect",
        description: "Ultra-slim matte navy rectangular frame with blue light block technology. Perfect for long screen hours.",
        measurements: { lensWidth: 54, bridgeWidth: 17, templeLength: 142 }
    },
    {
        _id: "9",
        name: "Crystal Clear - CC-500 - Transparent",
        price: 1899,
        originalPrice: 2999,
        size: "Medium",
        rating: 5,
        image: "/images/changes/IMG_20260306_234347.jpg.jpeg",
        vtoImage: "/images/changes/IMG_20260306_234347.jpg.jpeg",
        category: "NextGen",
        subcategory: "Digital Glasses",
        frameType: "rect",
        description: "Ultra-lightweight transparent acetate frame with anti-glare coating. Invisible look, maximum clarity for digital professionals.",
        measurements: { lensWidth: 53, bridgeWidth: 18, templeLength: 140 }
    },
    {
        _id: "10",
        name: "Arctic Frost - AF-600 - Ice Edition",
        price: 2299,
        originalPrice: 3499,
        size: "Large",
        rating: 5,
        image: "/images/changes/IMG_20260306_234430.jpg.jpeg",
        vtoImage: "/images/changes/IMG_20260306_234430.jpg.jpeg",
        category: "NextGen",
        subcategory: "Smart Glasses",
        frameType: "rect",
        description: "Premium frosted crystal frame with wide lens design. Photochromic-ready for seamless indoor-outdoor transitions.",
        measurements: { lensWidth: 56, bridgeWidth: 19, templeLength: 145 }
    }
];

async function seedDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in environment variables');
            console.log('Please set MONGODB_URI in your .env.local file');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        console.log(`   URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        console.log('\n🗑️  Clearing existing products...');
        const deleteResult = await Product.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} existing products`);

        // Insert new products
        console.log('\n📦 Inserting products...');
        const insertedProducts = await Product.insertMany(PRODUCTS);
        console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

        // Display inserted products
        console.log('\n📋 Inserted Products:');
        insertedProducts.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name}`);
            console.log(`      ID: ${product._id}`);
            console.log(`      Price: Rs ${product.price}`);
            console.log(`      Category: ${product.category}`);
            console.log('');
        });

        console.log('✨ Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the seed function
seedDatabase();
