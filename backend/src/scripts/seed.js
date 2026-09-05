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
          stats: [
            { value: '27,000+', label: 'Companies' },
            { value: '100+', label: 'Countries' },
            { value: '1M+', label: 'Hires Made' },
          ],
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'ABOUT',
        title: 'Who We Are',
        subtitle: 'Driven by purpose, innovation, and human connection.',
        content: {
          story: 'Founded in 2012, Workable set out to solve the biggest pain points in hiring. Today, we serve over 27,000 businesses across 100+ countries — from scrappy startups to Fortune 500 enterprises.\n\nOur mission is simple: make hiring easy, collaborative, and human. We build tools that let teams focus on what matters most — finding the right people and building great organizations.\n\nWe are a remote-first company with teammates across Athens, London, Boston, and beyond. We believe the best work happens when talented people have autonomy, trust, and the right tools.',
          stats: [
            { value: '2012', label: 'Founded' },
            { value: '250+', label: 'Team Members' },
            { value: '4.5★', label: 'Glassdoor Rating' },
          ],
        },
        orderIndex: 1,
        isVisible: true,
      },
      {
        type: 'CULTURE',
        title: 'Our Culture & Values',
        subtitle: 'The principles that guide everything we do.',
        content: {
          description: 'At Workable, culture is not a poster on the wall — it is how we make decisions, treat each other, and build products every single day.',
          values: [
            { icon: '💡', name: 'Innovation First', description: 'We challenge assumptions and ship bold solutions. Experimentation is encouraged — failure is how we learn fastest.' },
            { icon: '🤝', name: 'Radical Transparency', description: 'We share context openly so everyone can make great decisions. No information hoarding, no politics.' },
            { icon: '🏆', name: 'Ownership Mentality', description: 'Every team member owns their outcomes end-to-end. We do not wait for permission — we take initiative and deliver.' },
            { icon: '🌍', name: 'Global Inclusion', description: 'We hire the best people regardless of location, background, or identity. Diverse perspectives drive better products.' },
            { icon: '🎯', name: 'Customer Obsession', description: 'We start with the customer and work backwards. Every feature, fix, and decision is measured by customer impact.' },
            { icon: '🌱', name: 'Continuous Growth', description: 'We invest in learning — conference budgets, mentorship programs, and a culture that celebrates curiosity.' },
          ],
        },
        orderIndex: 2,
        isVisible: true,
      },
      {
        type: 'PERKS',
        title: 'Benefits & Perks',
        subtitle: 'We take care of our people so they can do their best work.',
        content: {
          perks: [
            { icon: '🏠', title: 'Remote-First', description: 'Work from anywhere in the world. We provide stipends for home office setup and coworking spaces.' },
            { icon: '📚', title: 'Learning Budget', description: '$2,000 annual learning budget for courses, conferences, books, and certifications of your choice.' },
            { icon: '🏥', title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage plus a monthly wellness stipend for gym or therapy.' },
            { icon: '📈', title: 'Stock Options', description: 'All full-time employees receive equity. When Workable wins, you win too.' },
            { icon: '🌴', title: 'Generous PTO', description: '25 days paid vacation plus local public holidays. We encourage you to actually take them.' },
            { icon: '✈️', title: 'Team Retreats', description: 'Annual company-wide offsites in exciting locations — past trips include Crete, Lisbon, and Barcelona.' },
            { icon: '👶', title: 'Parental Leave', description: '16 weeks fully paid parental leave for all new parents, regardless of gender.' },
            { icon: '💻', title: 'Equipment Allowance', description: 'Top-spec MacBook Pro, monitor, and peripherals. Plus a $500 annual upgrade budget.' },
          ],
        },
        orderIndex: 3,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Open Opportunities',
        subtitle: 'Browse current vacancies across engineering, product, sales, and customer success.',
        content: {},
        orderIndex: 4,
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
          stats: [
            { value: '10x', label: 'Faster Hiring' },
            { value: '5,000+', label: 'Customers' },
            { value: '$50M+', label: 'Series C' },
          ],
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'ABOUT',
        title: 'About Ashby',
        subtitle: 'Purpose-built for high-growth teams.',
        content: {
          story: 'Ashby was founded with a contrarian belief: recruiting software should be as powerful as the teams using it. Most ATS products are built for compliance, not performance — we are changing that.\n\nOur all-in-one platform combines sourcing, scheduling, ATS, and analytics into a single system that helps the world\'s fastest-growing companies hire at scale without sacrificing quality.\n\nBacked by top-tier investors and trusted by companies like Notion, Ramp, and Figma, we are building the operating system for world-class recruiting teams.',
          stats: [
            { value: '2018', label: 'Founded' },
            { value: '150+', label: 'Team Size' },
            { value: '$70M+', label: 'Total Raised' },
          ],
        },
        orderIndex: 1,
        isVisible: true,
      },
      {
        type: 'CULTURE',
        title: 'How We Work',
        subtitle: 'The values behind our velocity.',
        content: {
          description: 'Ashby operates at the intersection of craft and speed. We ship fast, but we never ship sloppy.',
          values: [
            { icon: '⚡', name: 'High Velocity', description: 'We bias toward action. Small teams, fast iteration, and ruthless prioritization let us move faster than companies 10x our size.' },
            { icon: '🔬', name: 'Deep Craft', description: 'We obsess over details — from pixel-perfect UI to query performance. Great products are built by people who care about craft.' },
            { icon: '📊', name: 'Data-Informed', description: 'We measure what matters and let data guide decisions. Intuition is valuable, but data is indispensable.' },
            { icon: '🧩', name: 'Systems Thinking', description: 'We design holistic solutions, not band-aids. Every feature considers the entire system it lives within.' },
          ],
        },
        orderIndex: 2,
        isVisible: true,
      },
      {
        type: 'PERKS',
        title: 'Why Join Ashby',
        subtitle: 'Competitive compensation and benefits that support your best work.',
        content: {
          perks: [
            { icon: '💰', title: 'Top-of-Market Pay', description: 'We benchmark to the 90th percentile. No negotiation games — just transparent, competitive offers.' },
            { icon: '📈', title: 'Meaningful Equity', description: 'Generous stock option grants with a 10-year exercise window. Your upside is real.' },
            { icon: '🏥', title: 'Premium Healthcare', description: '100% covered medical, dental, and vision for you and your dependents.' },
            { icon: '🧠', title: 'Growth Budget', description: '$3,000 annual budget for learning, conferences, and professional development.' },
            { icon: '🏖️', title: 'Flexible Time Off', description: 'Unlimited PTO with a 3-week minimum. We trust you to manage your own time.' },
            { icon: '🖥️', title: 'Best-in-Class Setup', description: 'Latest MacBook, 4K monitor, and any tools you need to do your best work.' },
          ],
        },
        orderIndex: 3,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Open Roles',
        subtitle: 'Select a position below to learn more.',
        content: {},
        orderIndex: 4,
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
          badgeText: '🤖 AI-Powered Recruitment',
          stats: [
            { value: '500+', label: 'Companies' },
            { value: '50K+', label: 'Candidates' },
            { value: '3x', label: 'Faster Hiring' },
          ],
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'ABOUT',
        title: 'About Whitecarrot',
        subtitle: 'Reimagining recruitment from the ground up.',
        content: {
          story: 'Whitecarrot was born from a simple observation: career pages are a company\'s most important recruiting asset, yet most look like they were built in 2010.\n\nWe are building AI-native tools that let any company create stunning, branded careers pages in minutes — complete with automated candidate pipelines, smart filtering, and real-time analytics.\n\nOur small but mighty team is on a mission to democratize great employer branding for companies of every size.',
          stats: [
            { value: '2023', label: 'Founded' },
            { value: '20+', label: 'Team Members' },
            { value: '98%', label: 'Customer Satisfaction' },
          ],
        },
        orderIndex: 1,
        isVisible: true,
      },
      {
        type: 'CULTURE',
        title: 'Life at Whitecarrot',
        subtitle: 'A startup culture that puts people first.',
        content: {
          description: 'We are a young, fast-moving team that believes great products come from happy, empowered people.',
          values: [
            { icon: '🚀', name: 'Ship & Iterate', description: 'We launch early, learn fast, and improve relentlessly. Perfect is the enemy of shipped.' },
            { icon: '💬', name: 'Radical Candor', description: 'We give honest feedback with empathy. No sugar-coating, no harsh criticism — just real conversations.' },
            { icon: '🎨', name: 'Design Matters', description: 'We believe beautiful products win. Every pixel, interaction, and word is intentional.' },
            { icon: '🤖', name: 'AI-Native Thinking', description: 'We build with AI at the core, not as an afterthought. Every team member thinks about how AI can amplify their work.' },
            { icon: '❤️', name: 'Customer Love', description: 'We treat every customer interaction as a gift. Their success is our north star metric.' },
          ],
        },
        orderIndex: 2,
        isVisible: true,
      },
      {
        type: 'PERKS',
        title: 'Perks & Benefits',
        subtitle: 'Startup energy with grown-up benefits.',
        content: {
          perks: [
            { icon: '🌍', title: 'Work From Anywhere', description: 'Fully remote team across multiple time zones. We care about output, not office hours.' },
            { icon: '📚', title: 'Learning Stipend', description: '$1,500 annual budget for courses, books, and conferences to fuel your growth.' },
            { icon: '🏥', title: 'Health Coverage', description: 'Comprehensive health insurance for you and your family from day one.' },
            { icon: '📈', title: 'Early-Stage Equity', description: 'Generous ESOP grants — join early and own a meaningful piece of what we are building.' },
            { icon: '🏖️', title: 'Flexible PTO', description: 'Take time when you need it. We track output, not hours.' },
            { icon: '🎉', title: 'Team Bonding', description: 'Monthly virtual events and quarterly in-person meetups to keep the team connected.' },
          ],
        },
        orderIndex: 3,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Join Our Team',
        subtitle: 'Find your place on our team.',
        content: {},
        orderIndex: 4,
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
