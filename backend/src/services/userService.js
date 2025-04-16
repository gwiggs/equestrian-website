// backend/src/services/userService.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserRepository = require('../repositories/userRepository');
const { sendEmail } = require('../utils/emailService');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<{user: User, verificationToken: string}>}
   */
  async registerUser(userData) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    this.validatePassword(userData.password);

    // Generate verification token
    const verificationToken = this.generateToken();

    // Create user with verification token
    const user = await User.create({
      ...userData,
      verificationToken,
      isVerified: false
    });

    // Save user to database
    const savedUser = await this.userRepository.create(user);

    // Send verification email
    await this.sendVerificationEmail(savedUser);

    return {
      user: savedUser,
      verificationToken
    };
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: User, token: string}>}
   */
  async loginUser(email, password) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate JWT token
    const token = this.generateJWT(user);

    return {
      user: user.toJSON(), // Return sanitized user data
      token
    };
  }

  /**
   * Verify user email
   * @param {string} token - Verification token
   * @returns {Promise<User>}
   */
  async verifyEmail(token) {
    const user = await this.userRepository.verifyEmail(token);
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }
    return user;
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<boolean>}
   */
  async requestPasswordReset(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return true;
    }

    // Generate reset token
    const resetToken = this.generateToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `
    });

    return true;
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>}
   */
  async resetPassword(token, newPassword) {
    // Find user by reset token
    const query = 'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()';
    const result = await this.userRepository.pool.query(query, [token]);
    
    if (result.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }
    
    const user = new User(this.userRepository.mapDbUserToModel(result.rows[0]));
    
    // Validate new password
    this.validatePassword(newPassword);
    
    // Hash new password
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await this.userRepository.update(user.id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    return true;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<User>}
   */
  async updateProfile(userId, updates) {
    // Don't allow updating sensitive fields
    const { password, passwordHash, isVerified, ...safeUpdates } = updates;
    
    // If password is provided, hash it
    if (password) {
      this.validatePassword(password);
      safeUpdates.passwordHash = await bcrypt.hash(password, 10);
    }
    
    return await this.userRepository.update(userId, safeUpdates);
  }

  /**
   * Generate a random token
   * @returns {string} - Random token
   */
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate a JWT for a user
   * @param {User} user - User to generate token for
   * @returns {string} - JWT token
   */
  generateJWT(user) {
    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType
    };
    
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @throws {Error} - If password is invalid
   */
  validatePassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Add more complex validation as needed
    // e.g., require uppercase, lowercase, numbers, special chars
  }

  /**
   * Send verification email to user
   * @param {User} user - User to send email to
   * @returns {Promise<void>}
   */
  async sendVerificationEmail(user) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h1>Welcome to Equestrian Marketplace!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    });
  }
}

module.exports = UserService;