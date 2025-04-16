// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified' });
    }
    
    // Attach user to request
    req.user = user.toJSON();
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Allowed roles
 * @returns {Function} - Middleware function
 */
const authorize = (roles = []) => {
  // Convert string to array if needed
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    // authMiddleware should be applied before this
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user role is allowed
    if (roles.length && !roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};