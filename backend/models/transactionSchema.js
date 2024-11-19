const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    rentalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash','upi']  // Limit payment methods to these values
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],  // Restrict status values
        default: 'pending'
    }
}, {
    timestamps: true  // Track transaction creation and updates
});

module.exports = mongoose.model('Transaction', TransactionSchema);