const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new recruiter + create company + default careers page template
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate recruiter & get token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user details
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

module.exports = router;

