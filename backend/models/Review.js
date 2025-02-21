const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    }
}, {
    timestamps: true
});

// Ensure one review per user
reviewSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);