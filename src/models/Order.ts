import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    _id: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        variant: {
            color: String,
            size: String,
            lensType: String
        },
        prescription: {
            od: { sph: String, cyl: String, axis: String, add: String },
            os: { sph: String, cyl: String, axis: String, add: String },
            pd: String,
            type: String
        }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Lens Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Returned', 'Cancelled'],
        default: 'Pending' 
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    trackingNumber: String,
    notes: String
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);
