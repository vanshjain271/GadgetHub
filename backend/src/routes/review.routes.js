/**
 * Review Routes - Customer facing
 */
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

// Submit a review (authenticated)
router.post('/', auth.authenticate, ReviewController.submitReview);

// Get product reviews (public)
router.get('/product/:productId', ReviewController.getProductReviews);

module.exports = router;
