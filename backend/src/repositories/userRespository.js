// backend/src/repositories/userRepository.js
const { Pool } = require('pg');
const User = require('../models/user');

class UserRepository {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  /**
   * Find a user by their ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} - User instance or null if not found
   */
  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Find a user by their email
   * @param {string} email - User email
   * @returns {Promise<User|null>} - User instance or null if not found
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Create a new user in the database
   * @param {User} user - User instance to create
   * @returns {Promise<User>} - Created user
   */
  async create(user) {
    const query = `
      INSERT INTO users (
        id, email, password_hash, first_name, last_name, 
        phone, user_type, business_name, created_at, updated_at,
        is_verified, verification_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      user.id,
      user.email,
      user.passwordHash,
      user.firstName,
      user.lastName,
      user.phone,
      user.userType,
      user.businessName,
      user.createdAt,
      user.updatedAt,
      user.isVerified,
      user.verificationToken
    ];
    
    const result = await this.pool.query(query, values);
    return new User(this.mapDbUserToModel(result.rows[0]));
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<User>} - Updated user
   */
  async update(id, updates) {
    // Build SET part of query dynamically based on provided updates
    const setFields = [];
    const values = [id];
    let valueIndex = 2;
    
    const validFields = [
      'email', 'password_hash', 'first_name', 'last_name', 
      'phone', 'user_type', 'business_name', 'is_verified',
      'verification_token', 'reset_password_token', 'reset_password_expires'
    ];
    
    // Convert camelCase to snake_case and add to query
    for (const [key, value] of Object.entries(updates)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (validFields.includes(snakeKey)) {
        setFields.push(`${snakeKey} = $${valueIndex}`);
        values.push(value);
        valueIndex++;
      }
    }
    
    // Always update the updated_at timestamp
    setFields.push(`updated_at = $${valueIndex}`);
    values.push(new Date());
    
    const query = `
      UPDATE users 
      SET ${setFields.join(', ')} 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return new User(this.mapDbUserToModel(result.rows[0]));
  }

  /**
   * Save verification token for a user
   * @param {string} userId - User ID
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} - Success status
   */
  async saveVerificationToken(userId, token) {
    const query = `
      UPDATE users
      SET verification_token = $1, updated_at = NOW()
      WHERE id = $2
    `;
    
    const result = await this.pool.query(query, [token, userId]);
    return result.rowCount > 0;
  }

  /**
   * Verify a user's email using their verification token
   * @param {string} token - Verification token
   * @returns {Promise<User|null>} - Verified user or null
   */
  async verifyEmail(token) {
    const query = `
      UPDATE users
      SET is_verified = true, verification_token = NULL, updated_at = NOW()
      WHERE verification_token = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [token]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(this.mapDbUserToModel(result.rows[0]));
  }

  /**
   * Maps snake_case database fields to camelCase for User model
   * @param {Object} dbUser - Database user record
   * @returns {Object} - Object with camelCase keys
   */
  mapDbUserToModel(dbUser) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      passwordHash: dbUser.password_hash,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      phone: dbUser.phone,
      userType: dbUser.user_type,
      businessName: dbUser.business_name,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      isVerified: dbUser.is_verified,
      verificationToken: dbUser.verification_token,
      resetPasswordToken: dbUser.reset_password_token,
      resetPasswordExpires: dbUser.reset_password_expires
    };
  }
}

module.exports = UserRepository;