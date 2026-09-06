const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { JWT_SECRET } = require('../middleware/auth');
const { buildDefaultSections } = require('../utils/defaultSections');
const { generateUniqueCompanySlug } = require('../utils/slugGenerator');

function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

async function registerUser({ name, email, password, companyName }) {
  const cleanEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const slug = await generateUniqueCompanySlug(companyName);
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

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password,
    company: company._id,
    role: 'recruiter',
  });

  company.owner = user._id;
  await company.save();

  const token = generateToken(user._id);

  return {
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
  };
}

async function loginUser({ email, password }) {
  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: cleanEmail }).select('+password').populate('company');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
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
  };
}

async function getCurrentUser(reqUser) {
  return {
    _id: reqUser._id,
    name: reqUser.name,
    email: reqUser.email,
    company: reqUser.company
      ? {
          _id: reqUser.company._id,
          name: reqUser.company.name,
          slug: reqUser.company.slug,
          logoUrl: reqUser.company.logoUrl,
          primaryColor: reqUser.company.primaryColor,
        }
      : null,
  };
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  generateToken,
};
