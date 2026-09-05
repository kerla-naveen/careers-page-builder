const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Company = require('../models/Company');
const Job = require('../models/Job');

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careers_page_builder';
  await mongoose.connect(connStr);
  console.log(`🍃 Connected to MongoDB for Seeding...`);
};

const demoCompanies = [
  {
    name: 'Workable',
    slug: 'workable',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600',
    primaryColor: '#059669',
    accentColor: '#10b981',
    backgroundColor: '#f0fdf4',
    textColor: '#064e3b',
    description: 'The all-in-one recruiting software helping companies hire the best candidates globally.',
    website: 'https://workable.com',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sections: [
      {
        type: 'HERO',
        title: 'Shape the Future of Hiring Worldwide',
        subtitle: 'Join a global team empowering 27,000+ businesses to hire better, faster, and smarter.',
        content: {
          headline: 'Build Your Career at Workable',
          tagline: 'Remote-first culture, global scale, and relentless commitment to quality.',
          ctaText: 'Explore Open Positions',
          badgeText: '🚀 We are actively hiring worldwide',
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'ABOUT',
        title: 'Who We Are',
        subtitle: 'Driven by purpose, innovation, and human connection.',
        content: {
          story: 'Founded in 2012, Workable provides flexible recruiting software to over 27,000 businesses globally across 100+ countries.',
        },
        orderIndex: 1,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Open Opportunities',
        subtitle: 'Browse current vacancies across engineering, product, sales, and customer success.',
        content: {},
        orderIndex: 2,
        isVisible: true,
      },
    ],
    isPublished: true,
  },
  {
    name: 'Ashby',
    slug: 'ashby',
    logoUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600',
    primaryColor: '#4f46e5',
    accentColor: '#6366f1',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    description: 'All-in-one talent search, scheduling, and ATS for fast-growing tech companies.',
    website: 'https://ashbyhq.com',
    sections: [
      {
        type: 'HERO',
        title: 'Build High-Performance Talent Tools',
        subtitle: 'Join an ambitious, product-obsessed team building modern recruiting software.',
        content: {
          headline: 'Engineering High-Performance Recruiting',
          tagline: 'We build high-velocity software backed by top investors.',
          ctaText: 'View Open Roles',
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Open Roles',
        subtitle: 'Select a position below to learn more.',
        content: {},
        orderIndex: 1,
        isVisible: true,
      },
    ],
    isPublished: true,
  },
  {
    name: 'Whitecarrot',
    slug: 'whitecarrot',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600',
    primaryColor: '#ea580c',
    accentColor: '#f97316',
    backgroundColor: '#fff7ed',
    textColor: '#431407',
    description: 'AI-powered recruitment platform designed to build branded careers pages and candidate pipelines.',
    website: 'https://whitecarrot.io',
    sections: [
      {
        type: 'HERO',
        title: 'Transform Hiring with AI',
        subtitle: 'Empowering companies worldwide with automated ATS workflows and custom career builders.',
        content: {
          headline: 'Build Branded Careers Pages in Minutes',
          tagline: 'Join Whitecarrot to shape the future of AI-native hiring systems.',
          ctaText: 'Explore Openings',
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Join Our Team',
        subtitle: 'Find your place on our team.',
        content: {},
        orderIndex: 1,
        isVisible: true,
      },
    ],
    isPublished: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log('🧹 Clearing existing Company and Job collections...');
    await Company.deleteMany({});
    await Job.deleteMany({});

    console.log('🏢 Seeding demo companies...');
    const insertedCompanies = await Company.insertMany(demoCompanies);
    console.log(`✅ Seeded ${insertedCompanies.length} companies: ${insertedCompanies.map(c => c.slug).join(', ')}`);

    // Map inserted companies by slug
    const companyMap = {};
    insertedCompanies.forEach(c => {
      companyMap[c.slug] = c;
    });

    // Read jobs data
    const jobsFilePath = path.join(__dirname, 'jobs-data.json');
    const rawJobs = JSON.parse(fs.readFileSync(jobsFilePath, 'utf-8'));

    console.log(`💼 Seeding ${rawJobs.length} jobs from sample dataset...`);
    const companySlugs = ['workable', 'ashby', 'whitecarrot'];

    const jobsToInsert = rawJobs.map((raw, idx) => {
      const companySlug = companySlugs[idx % companySlugs.length];
      const companyObj = companyMap[companySlug];

      return {
        companyId: companyObj._id,
        companySlug: companySlug,
        title: raw.title || 'Untitled Position',
        job_slug: (raw.job_slug || raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')) + `-${idx + 1}`,
        work_policy: raw.work_policy || 'Hybrid',
        location: raw.location || 'Remote',
        department: raw.department || 'Engineering',
        employment_type: raw.employment_type || 'Full time',
        experience_level: raw.experience_level || 'Mid-level',
        job_type: raw.job_type || 'Permanent',
        salary_range: raw.salary_range || 'Competitive',
        posted_days_ago: raw.posted_days_ago || 'Posted recently',
        description: `We are looking for a highly skilled ${raw.title} to join the ${raw.department} team at ${companyObj.name}.`,
        requirements: `• 3+ years of professional experience in ${raw.department}.\n• Proven track record of delivering quality results.\n• Excellent communication skills.`,
      };
    });

    const insertedJobs = await Job.insertMany(jobsToInsert);
    console.log(`🎉 Successfully seeded ${insertedJobs.length} jobs into MongoDB!`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
