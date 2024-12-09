const User = require('../models/User');
const logger = require('../utils/logger');
const { handleMongooseError } = require('../utils/errorHandlers');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort('-createdAt')
      .lean()
      .exec();

    if (!users) {
      throw new Error('Failed to fetch users');
    }

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    const { statusCode, message } = handleMongooseError(error);
    res.status(statusCode).json({ 
      success: false,
      message: message || 'Error fetching users'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username and email are required'
      });
    }

    // Check for existing user with improved error handling
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    }).lean().exec();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email.toLowerCase() === email.toLowerCase()
          ? 'Email already registered'
          : 'Username already taken'
      });
    }

    // Create new user with improved validation
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim()
    });

    const savedUser = await user.save();
    
    logger.info(`New user created: ${savedUser.username}`);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: savedUser
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    const { statusCode, message } = handleMongooseError(error);
    res.status(statusCode).json({ 
      success: false,
      message: message || 'Error creating user'
    });
  }
};

module.exports = {
  getAllUsers,
  createUser
};