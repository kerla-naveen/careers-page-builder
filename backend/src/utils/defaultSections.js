/**
 * Build default page sections for new company onboarding
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

module.exports = { buildDefaultSections };
