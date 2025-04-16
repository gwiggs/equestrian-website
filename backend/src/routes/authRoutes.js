// backend/src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route GET /api/auth/verify/:token
 * @desc Verify user email
 * @access Public
 */
router.get('/verify/:token', authController.verifyEmail.bind(authController));

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post('/forgot-password', authController.requestPasswordReset.bind(authController));

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', authController.resetPassword.bind(authController));

module.exports = router;