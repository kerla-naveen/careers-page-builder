const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { protect, JWT_SECRET } = require('../middleware/auth');

/**
 * Generate JWT Token helper
 */
function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

/**
 * Generate a clean, unique slug for a company
 */
async function generateUniqueSlug(name) {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = 'company';

  let slug = baseSlug;
  let counter = 1;
  while (await Company.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Default section template builder for new registered companies
 */
function buildDefaultSections(companyName) {
  return [
    {
      type: 'HERO',
      title: `Build Your Career at ${companyName}`,
      subtitle: 'Join a world-class team driving innovation and excellence.',
      content: {
        headline: `Welcome to ${companyName}`,
        tagline: 'Empowering talented individuals to build the future of tech.',
        ctaText: 'Explore Open Positions',
        badgeText: '🚀 We are actively hiring',
        stats: [
          { value: '100+', label: 'Team Members' },
          { value: '50+', label: 'Global Clients' },
          { value: '4.8★', label: 'Glassdoor Rating' },
        ],
      },
      orderIndex: 0,
      isVisible: true,
    },
    {
      type: 'ABOUT',
      title: 'Who We Are',
      subtitle: 'Our story, mission, and vision.',
      content: {
        story: `${companyName} was founded to solve critical challenges and empower teams globally.\n\nWe believe in high-velocity innovation, transparent communication, and giving our people autonomy to build extraordinary products.`,
        stats: [
          { value: '2024', label: 'Founded' },
          { value: '100%', label: 'Remote Friendly' },
        ],
      },
      orderIndex: 1,
      isVisible: true,
    },
    {
      type: 'CULTURE',
      title: 'Our Culture & Values',
      subtitle: 'The principles that define how we build.',
      content: {
        description: `Culture at ${companyName} is driven by accountability, trust, and continuous growth.`,
        values: [
          { icon: '💡', name: 'Innovation First', description: 'We encourage experimentation and challenge the status quo.' },
          { icon: '🤝', name: 'Transparency', description: 'We communicate open context and clear goals across teams.' },
          { icon: '🎯', name: 'Impact Driven', description: 'Every line of code and customer interaction is built for impact.' },
        ],
      },
      orderIndex: 2,
      isVisible: true,
    },
    {
      type: 'PERKS',
      title: 'Perks & Benefits',
      subtitle: 'Invested in your growth, health, and happiness.',
      content: {
        perks: [
          { icon: '🏠', title: 'Remote Work Stipend', description: '$1,000 home office setup allowance.' },
          { icon: '📚', title: 'Learning Allowance', description: '$2,000 annual budget for courses and conferences.' },
          { icon: '🏥', title: 'Comprehensive Healthcare', description: 'Full medical, dental, and vision coverage.' },
        ],
      },
      orderIndex: 3,
      isVisible: true,
    },
    {
      type: 'JOBS',
      title: 'Open Positions',
      subtitle: 'Find your next role with us.',
      content: {},
      orderIndex: 4,
      isVisible: true,
    },
  ];
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new recruiter + create company + default careers page template
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Name, Email, Password, and Company Name',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    // Generate unique slug for company
    const slug = await generateUniqueSlug(companyName);

    // Create Company first with default template sections
    const defaultSections = buildDefaultSections(companyName);
    const company = await Company.create({
      name: companyName.trim(),
      slug,
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'Outfit',
      borderRadius: '16px',
      description: `Careers page and open opportunities at ${companyName}`,
      sections: defaultSections,
      publishedSections: defaultSections,
      isPublished: true,
    });

    // Create User linked to Company
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      company: company._id,
      role: 'recruiter',
    });

    // Update Company owner
    company.owner = user._id;
    await company.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account and company careers page created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        company: {
          _id: company._id,
          name: company.name,
          slug: company.slug,
          logoUrl: company.logoUrl,
          primaryColor: company.primaryColor,
        },
      },
    });
  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed: ' + error.message,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate recruiter & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Email and Password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user by email and explicitly include password field
    const user = await User.findOne({ email: cleanEmail }).select('+password').populate('company');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company
          ? {
              _id: user.company._id,
              name: user.company.name,
              slug: user.company.slug,
              logoUrl: user.company.logoUrl,
              primaryColor: user.company.primaryColor,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user details
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        company: req.user.company
          ? {
              _id: req.user.company._id,
              name: req.user.company.name,
              slug: req.user.company.slug,
              logoUrl: req.user.company.logoUrl,
              primaryColor: req.user.company.primaryColor,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/auth/me:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user context',
    });
  }
});

module.exports = router;
