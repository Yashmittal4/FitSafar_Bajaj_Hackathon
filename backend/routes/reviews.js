const express = require('express');
const router = express.Router();
const { 
    getAllReviews, 
    createReview, 
    getUserReview 
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllReviews);

// Protected routes
router.use(auth);
router.post('/', createReview);
router.get('/user', getUserReview);

module.exports = router;