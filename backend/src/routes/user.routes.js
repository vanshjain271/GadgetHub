/**
 * User Routes - MVP
 * 
 * GET /users/me  - Buyer, Admin
 * PUT /users/me  - Buyer, Admin
 */

const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const { buyerOrAdmin } = require('../middleware/auth.middleware');
const { userValidation } = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Buyer, Admin
 */
router.get('/me', buyerOrAdmin, UserController.getProfile);

/**
 * @route   PUT /api/v1/users/me
 * @desc    Update current user profile
 * @access  Buyer, Admin
 * @body    { name?, addresses? }
 */
router.put('/me', buyerOrAdmin, userValidation.updateProfile, UserController.updateProfile);

/**
 * @route   POST /api/v1/users/fcm-token
 * @desc    Add/Update FCM token
 * @access  Buyer, Admin
 */
router.post('/fcm-token', buyerOrAdmin, UserController.updateFCMToken);

/**
 * @route   DELETE /api/v1/users/fcm-token
 * @desc    Remove FCM token
 * @access  Buyer, Admin
 */
router.delete('/fcm-token', buyerOrAdmin, UserController.removeFCMToken);

module.exports = router;
