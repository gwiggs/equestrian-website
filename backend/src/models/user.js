// backend/src/models/user.js
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * User model representing a marketplace user
 */
class User {
  /**
   * Create a new user
   * @param {Object} data - User data
   * @param {string} data.email - User email
   * @param {string} data.password - Plain text password (will be hashed)
   * @param {string} data.firstName - User first name
   * @param {string} data.lastName - User last name
   * @param {string} data.phone - User phone number (optional)
   * @param {string} data.userType - Type of user (buyer, seller, admin)
   * @param {string} data.businessName - Business name (for business accounts)
   */
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.passwordHash = data.passwordHash || '';
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone || null;
    this.userType = data.userType || 'buyer';
    this.businessName = data.businessName || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isVerified = data.isVerified || false;
    this.verificationToken = data.verificationToken || null;
    this.resetPasswordToken = data.resetPasswordToken || null;
    this.resetPasswordExpires = data.resetPasswordExpires || null;
  }

  /**
   * Create a new user with password hashing
   * @param {Object} data - User data including plain text password
   * @returns {Promise<User>} - New user instance with hashed password
   */
  static async create(data) {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);
    
    return new User({
      ...data,
      passwordHash
    });
  }

  /**
   * Verify if provided password matches stored hash
   * @param {string} password - Plain text password to verify
   * @returns {Promise<boolean>} - True if password matches
   */
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  /**
   * Get sanitized user data (without sensitive fields)
   * @returns {Object} - User data without password hash and tokens
   */
  toJSON() {
    const { passwordHash, verificationToken, resetPasswordToken, ...userData } = this;
    return userData;
  }
}

module.exports = User;