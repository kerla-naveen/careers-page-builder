/**
 * Generates default section data objects when adding new sections in Recruiter Studio
 */
export function createNewSection(type, currentLength = 0) {
  switch (type) {
    case 'HERO':
      return {
        type: 'HERO',
        title: 'Build The Future With Us',
        subtitle: 'Join an ambitious team crafting world-class products.',
        content: {
          headline: 'Build The Future With Us',
          tagline: 'We are hiring top talent across engineering, product, and growth.',
          ctaText: 'Explore Positions',
          badgeText: '🚀 We are actively hiring',
          stats: [
            { value: '500+', label: 'Customers' },
            { value: '20+', label: 'Countries' },
            { value: '4.9★', label: 'Glassdoor' },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'ABOUT':
      return {
        type: 'ABOUT',
        title: 'Our Mission & Story',
        subtitle: 'Solving hard problems with relentless focus on quality.',
        content: {
          story: 'Founded with a clear mission to innovate and lead.\n\nOur team is committed to excellence, transparency, and building lasting value for our customers.',
          stats: [
            { value: '2024', label: 'Founded' },
            { value: '100+', label: 'Team Members' },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'CULTURE':
      return {
        type: 'CULTURE',
        title: 'Culture & Core Values',
        subtitle: 'The principles that guide our work every day.',
        content: {
          description: 'We foster a collaborative culture built on ownership, trust, and continuous improvement.',
          values: [
            { icon: '💡', name: 'Craft & Quality', description: 'We care deeply about details and long-term design.' },
            { icon: '🚀', name: 'Bias for Action', description: 'We iterate fast and learn directly from output.' },
            { icon: '🤝', name: 'Radical Honesty', description: 'We communicate transparently and treat each other with respect.' },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'PERKS':
      return {
        type: 'PERKS',
        title: 'Benefits & Perks',
        subtitle: 'Everything you need to perform at your best.',
        content: {
          perks: [
            { icon: '🏠', title: 'Remote Work Flexibility', description: 'Work from home or anywhere worldwide.' },
            { icon: '📚', title: 'Annual Learning Budget', description: '$2,000 allowance for courses and conferences.' },
            { icon: '🏥', title: 'Health Insurance', description: 'Full medical, dental, and vision coverage.' },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'JOBS':
      return {
        type: 'JOBS',
        title: 'Open Opportunities',
        subtitle: 'Browse open roles and apply today.',
        content: {},
        orderIndex: currentLength,
        isVisible: true,
      };

    default:
      return null;
  }
}
