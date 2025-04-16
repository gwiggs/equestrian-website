// backend/src/controllers/userController.js
const UserService = require('../services/userService');
const UserRepository = require('../repositories/userRepository');

class UserController {
  constructor() {
    this.userService = new UserService();
    this.userRepository = new UserRepository();
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCurrentUser(req, res) {
    try {
      // User is attached to request by auth middleware
      const userId = req.user.id;
      
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ user: user.toJSON() });
      
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProfile(req, res) {
    try {
      // User is attached to request by auth middleware
      const userId = req.user.id;
      
      // Fields that can be updated
      const { firstName, lastName, phone, businessName } = req.body;
      
      // Update user profile
      const updatedUser = await this.userService.updateProfile(userId, {
        firstName,
        lastName,
        phone,
        businessName
      });
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser.toJSON()
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }

  /**
   * Change password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required' });
      }
      
      // Find user
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await user.verifyPassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Validate new password
      this.userService.validatePassword(newPassword);
      
      // Update password
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash(newPassword, 10);
      
      await this.userRepository.update(userId, { passwordHash });
      
      res.json({
        message: 'Password changed successfully'
      });
      
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.message.includes('Password must be')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Failed to change password' });
    }
  }

  /**
   * Get user by ID (for public profiles)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return only public information
      const publicProfile = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: user.businessName,
        userType: user.userType
      };
      
      res.json({ user: publicProfile });
      
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  }
}

module.exports = new UserController();