// backend/src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authMiddleware, userController.getCurrentUser.bind(userController));

/**
 * @route PUT /api/users/me
 * @desc Update user profile
 * @access Private
 */
router.put('/me', authMiddleware, userController.updateProfile.bind(userController));

/**
 * @route POST /api/users/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authMiddleware, userController.changePassword.bind(userController));

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID (public profile)
 * @access Public
 */
router.get('/:userId', userController.getUserById.bind(userController));

module.exports = router;