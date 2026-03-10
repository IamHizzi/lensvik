import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    size: String,
    rating: Number,
    image: { type: String, required: true },
    vtoImage: String,
    category: { type: String, required: true },
    frameType: String,
    description: String,
    measurements: {
        lensWidth: Number,
        bridgeWidth: Number,
        templeLength: Number
    }
}, { timestamps: true });

// Check if model exists before defining to avoid OverwriteModelError in Next.js hot-reloading
export default models.Product || model('Product', ProductSchema);
