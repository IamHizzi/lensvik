import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ProductSchema = new mongoose.Schema({
    _id: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function clearProducts() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI not found');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing all products from database...');
        const result = await Product.deleteMany({});
        console.log(`✅ Successfully removed ${result.deletedCount} products`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
}

clearProducts();
