/**
 * Hero Title Configuration
 *
 * Define title variations based on UTM parameters.
 * The key is the utm_title parameter value, and the value contains the titles to display.
 *
 * Usage: Add ?utm_title=<key> to your URL to display the corresponding titles.
 * Example: https://yoursite.com?utm_title=developer
 *
 * Each variation can have:
 * - titles: Array of strings that cycle in the TextType animation
 * - subtitle: Optional custom subtitle text
 */

export interface HeroTitleVariation {
  titles: string[]
  subtitle?: string
}

export interface HeroTitlesConfig {
  default: HeroTitleVariation
  variations: Record<string, HeroTitleVariation>
}

const heroTitles: HeroTitlesConfig = {
  // Default titles when no UTM parameter is present
  default: {
    titles: ['Daily Moments', 'Personal Insights', 'Life Updates', 'Authentic Stories'],
    subtitle:
      'Welcome to my corner of the internet. Here I share authentic thoughts, everyday experiences, and personal insights as they unfold. Join me on this journey of continuous discovery and genuine storytelling.',
  },

  // UTM-based variations
  // Add ?utm_title=<key> to URL to use these
  variations: {
    // Developer-focused landing
    developer: {
      titles: ['Code Stories', 'Dev Insights', 'Tech Journey', 'Building in Public'],
      subtitle:
        'Follow along as I share my development journey, coding experiments, and lessons learned building software. Real experiences from the trenches of software development.',
    },

    // Creative/design focused
    creative: {
      titles: ['Creative Process', 'Design Thinking', 'Visual Stories', 'Artistic Journey'],
      subtitle:
        'Exploring the intersection of creativity and technology. Join me as I share insights on design, visual storytelling, and the creative process.',
    },

    // Business/entrepreneurship focused
    business: {
      titles: ['Startup Lessons', 'Business Insights', 'Growth Stories', 'Founder Journey'],
      subtitle:
        'Real talk about building and growing businesses. Honest reflections on entrepreneurship, strategy, and the lessons learned along the way.',
    },

    // Personal growth focused
    growth: {
      titles: ['Growth Mindset', 'Learning Journey', 'Self Discovery', 'Daily Progress'],
      subtitle:
        'Documenting my personal growth journey. Sharing insights on learning, self-improvement, and the small steps that lead to big changes.',
    },

    // Newsletter/subscriber focused
    newsletter: {
      titles: ['Weekly Insights', 'Curated Thoughts', 'Fresh Perspectives', 'Your Inbox Upgrade'],
      subtitle:
        'Get my best insights delivered straight to your inbox. Join thousands of readers who start their week with thoughtful perspectives and actionable ideas.',
    },

    // Product Hunt / launch focused
    launch: {
      titles: ['Just Launched', 'New & Fresh', 'Check This Out', 'Hot Off The Press'],
      subtitle:
        "Thanks for checking us out! We're excited to share what we've been building. Dive in and explore our latest content and features.",
    },

    // Social media traffic
    social: {
      titles: ['Hey There', 'Welcome Friend', 'Glad You Found Us', 'Nice To Meet You'],
      subtitle:
        "Thanks for clicking through! You're in the right place for authentic stories, real insights, and genuine content. Make yourself at home.",
    },
  },
}

export default heroTitles
