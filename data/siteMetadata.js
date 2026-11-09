/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Raffi Keklikian · Engineering, AI & Creative Code',
  // The same name as on raffi.website, so both sites describe one person.
  author: 'Raffi Keklikian',
  headerTitle: 'Raffi Keklikian',
  description:
    'Deep dives into software engineering, AI-assisted development, and creative coding. Practical guides, interactive demos, and honest takes on the tools shaping modern development.',
  language: 'en-us',
  theme: 'dark', // dark only, like raffi.website (see app/theme-providers.tsx)
  // The address readers and search engines should use for the blog: the one raffi.website
  // links to. Canonical links, the sitemap, the feeds, llms.txt and the structured data are all
  // built from it. (The project's own *.vercel.app address may serve the same pages; with this
  // set, search engines file them under the address below.)
  siteUrl: 'https://me.raffi.website',
  // The main site, and the author as it describes him. The one full Person record is on
  // raffi.website/about; the blog's structured data points at it by id (lib/schema.ts) instead of
  // describing a second person.
  mainSite: 'https://raffi.website',
  authorId: 'https://raffi.website/#person',
  authorUrl: 'https://raffi.website/about',
  authorImage: 'https://raffi.website/raffi.jpg',
  siteRepo: 'https://github.com/raffik16/rkliveblog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/favicons/favicon.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  github: 'https://github.com/raffik16',
  x: 'https://x.com/RKeklikian',
  linkedin: 'https://linkedin.com/in/raffikeklikian',
  instagram: 'https://www.instagram.com/raffisranch',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: true,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
