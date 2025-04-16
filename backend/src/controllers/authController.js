// backend/src/controllers/authController.js
const UserService = require('../services/userService');

class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone, userType, businessName } = req.body;
      
      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Register user
      const { user } = await this.userService.registerUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        userType,
        businessName
      });
      
      // Return user data
      res.status(201).json({
        message: 'User registered successfully. Please check your email to verify your account.',
        user: user.toJSON()
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ message: error.message });
      }
      
      if (error.message.includes('Password must be')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to register user' });
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const { user, token } = await this.userService.loginUser(email, password);
      
      res.json({
        message: 'Login successful',
        user,
        token
      });
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (
        error.message === 'Invalid email or password' ||
        error.message === 'Please verify your email before logging in'
      ) {
        return res.status(401).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to login' });
    }
  }

  /**
   * Verify user email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
      }
      
      const user = await this.userService.verifyEmail(token);
      
      res.json({
        message: 'Email verified successfully',
        user: user.toJSON()
      });
      
    } catch (error) {
      console.error('Email verification error:', error);
      
      if (error.message === 'Invalid or expired verification token') {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to verify email' });
    }
  }

  /**
   * Request password reset
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      await this.userService.requestPasswordReset(email);
      
      // Always return success even if email doesn't exist (security)
      res.json({
        message: 'If your email exists in our system, you will receive a password reset link'
      });
      
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ message: 'Failed to process password reset request' });
    }
  }

  /**
   * Reset password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
      }
      
      await this.userService.resetPassword(token, password);
      
      res.json({
        message: 'Password reset successfully'
      });
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (
        error.message === 'Invalid or expired reset token' ||
        error.message.includes('Password must be')
      ) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to reset password' });
    }
  }
}

module.exports = new AuthController();