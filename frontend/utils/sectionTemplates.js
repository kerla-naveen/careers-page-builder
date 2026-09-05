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

    case 'TEAM':
      return {
        type: 'TEAM',
        title: 'Meet the Leadership Team',
        subtitle: 'The people driving our vision and empowering our teams.',
        content: {
          members: [
            {
              name: 'Sarah Jenkins',
              role: 'Head of People & Culture',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
              bio: 'Passionate about building inclusive, high-performing teams.',
            },
            {
              name: 'David Chen',
              role: 'VP of Engineering',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
              bio: 'Scaling engineering teams and robust cloud architectures.',
            },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'TESTIMONIALS':
      return {
        type: 'TESTIMONIALS',
        title: 'What Our Team Says',
        subtitle: 'Hear directly from team members about life at our company.',
        content: {
          testimonials: [
            {
              quote: "Joining this company was the best career decision I've made. The culture of autonomy and trust allows everyone to do their best work.",
              author: 'Marcus Vance',
              role: 'Senior Staff Engineer',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'FAQ':
      return {
        type: 'FAQ',
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about our hiring process.',
        content: {
          faqs: [
            {
              question: 'What is your interviewing process like?',
              answer: 'Our process consists of an initial recruiter chat, role assessment, virtual onsite, and team match.',
            },
            {
              question: 'Do you support remote work?',
              answer: 'Yes, we are remote-first with flexible hours and home office stipends.',
            },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'CTA':
      return {
        type: 'CTA',
        title: 'Ready to Shape the Future with Us?',
        subtitle: 'Discover your next career milestone and join a team that values your growth.',
        content: {
          buttonText: 'Explore Open Roles',
          buttonLink: '#jobs-section',
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    case 'GALLERY':
      return {
        type: 'GALLERY',
        title: 'Life at the Office & Remote',
        subtitle: 'A glimpse into our team events, workspaces, and retreats.',
        content: {
          images: [
            {
              url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
              caption: 'Team hackathon and collaboration space',
            },
            {
              url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
              caption: 'Annual engineering retreat',
            },
          ],
        },
        orderIndex: currentLength,
        isVisible: true,
      };

    default:
      return null;
  }
}
