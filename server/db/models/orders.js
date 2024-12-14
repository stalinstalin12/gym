const mongoose = require('mongoose');

const order = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    address:{ type: String, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash'], default: 'cash' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('order', order);
