const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(10);
        
        return res.status(200).json({
            success: true,
            data: {
                reviews
            }
        });
    } catch (error) {
        console.error('Error in getAllReviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { rating, description } = req.body;

        if (!rating || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both rating and description'
            });
        }

        const existingReview = await Review.findOne({ user: req.user.id });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a review'
            });
        }

        const review = new Review({
            user: req.user.id,
            userName: req.user.name,
            rating,
            description
        });

        await review.save();

        return res.status(201).json({
            success: true,
            data: {
                review
            }
        });
    } catch (error) {
        console.error('Error in createReview:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

exports.getUserReview = async (req, res) => {
    try {
        const review = await Review.findOne({ user: req.user.id });
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'No review found for this user'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                review
            }
        });
    } catch (error) {
        console.error('Error in getUserReview:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user review',
            error: error.message
        });
    }
};