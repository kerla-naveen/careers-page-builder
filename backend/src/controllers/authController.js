const authService = require('../services/authService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new recruiter + create company + default template sections
 */
async function register(req, res) {
  try {
    const { name, email, password, companyName } = req.body;
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Name, Email, Password, and Company Name',
      });
    }

    const result = await authService.registerUser({ name, email, password, companyName });
    return res.status(201).json({
      success: true,
      message: 'Account and company careers page created successfully!',
      ...result,
    });
  } catch (error) {
    console.error('Error in register controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
}

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate recruiter & get JWT token
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Email and Password',
      });
    }

    const result = await authService.loginUser({ email, password });
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    return res.status(error.statusCode || 401).json({
      success: false,
      error: error.message || 'Invalid credentials',
    });
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile & company
 */
async function getMe(req, res) {
  try {
    const user = await authService.getCurrentUser(req.user);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error in getMe controller:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user context',
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
