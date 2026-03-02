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
        name: "Artisan Craft - 0123 - Tortoise",
        price: 3500,
        originalPrice: 4900,
        size: "Medium",
        rating: 5,
        image: "/images/L-432-433.png",
        vtoImage: "/images/L-432-433.png",
        category: "Eyeglasses",
        subcategory: "Women",
        frameType: "rect",
        description: "Handcrafted tortoise shell pattern with premium blue light protection.",
        measurements: { lensWidth: 53, bridgeWidth: 19, templeLength: 142 }
    },
    {
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
        name: "Marble Grey - MX-410 - Wayfarer",
        price: 2499,
        originalPrice: 3999,
        size: "Medium",
        rating: 5,
        image: "/images/changes/copilot_image_1763813104749.jpeg",
        vtoImage: "/images/changes/copilot_image_1763813104749.jpeg",
        category: "Eyeglasses",
        subcategory: "Men",
        frameType: "rect",
        description: "Grey marble textured wayfarer with a modern slim profile. Lightweight acetate for all-day comfort.",
        measurements: { lensWidth: 54, bridgeWidth: 18, templeLength: 142 }
    },
    {
        name: "Elite Square - ES-220 - Gold Accent",
        price: 3799,
        originalPrice: 5200,
        size: "Large",
        rating: 5,
        image: "/images/changes/copilot_image_1764438794480.jpeg",
        vtoImage: "/images/changes/copilot_image_1764438794480.jpeg",
        category: "Eyeglasses",
        subcategory: "Women",
        frameType: "rect",
        description: "Oversized square frame in glossy black with 18K gold-plated hinge accents.",
        measurements: { lensWidth: 56, bridgeWidth: 17, templeLength: 145 }
    },
    {
        name: "Junior Flex - JF-101 - Bumblebee",
        price: 1299,
        originalPrice: 1999,
        size: "Small",
        rating: 5,
        image: "/images/changes/copilot_image_1764444276880.jpeg",
        vtoImage: "/images/changes/copilot_image_1764444276880.jpeg",
        category: "Eyeglasses",
        subcategory: "Kids",
        frameType: "rect",
        description: "Durable black frame with vibrant yellow temple tips. Designed for active kids with flexible hinges.",
        measurements: { lensWidth: 46, bridgeWidth: 15, templeLength: 125 }
    },
    {
        name: "Stealth Slim - SS-330 - Navy",
        price: 2199,
        originalPrice: 3500,
        size: "Medium",
        rating: 5,
        image: "/images/changes/copilot_image_1764700749276.jpeg",
        vtoImage: "/images/changes/copilot_image_1764700749276.jpeg",
        category: "NextGen",
        subcategory: "Digital Glasses",
        frameType: "rect",
        description: "Ultra-slim matte navy frame with blue light block technology. Perfect for long screen hours.",
        measurements: { lensWidth: 52, bridgeWidth: 17, templeLength: 140 }
    },
    {
        name: "Grand Vista - GV-500 - Copper Edition",
        price: 4299,
        originalPrice: 5999,
        size: "Large",
        rating: 5,
        image: "/images/changes/image_1764333424584.jpeg",
        vtoImage: "/images/changes/image_1764333424584.jpeg",
        category: "NextGen",
        subcategory: "Smart Glasses",
        frameType: "rect",
        description: "Premium oversized frame with copper accent studs. Transition lenses included for indoor-outdoor versatility.",
        measurements: { lensWidth: 58, bridgeWidth: 19, templeLength: 148 }
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
