// A CommonJS config file: require() is how it loads things
/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')
const siteMetadata = require('./data/siteMetadata')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is cloud.umami.is *.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app www.googletagmanager.com
`

// BACKSPIN (public/backspin) is a static page that loads its display face from Google Fonts.
// On an iPhone before iOS 16.4 it also plays a silent track it makes itself (a blob: URL), which
// stops the silent switch muting the game (src/engine.js)
const BackspinPolicy = ContentSecurityPolicy.replace(
  "style-src 'self' 'unsafe-inline';",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
)
  .replace("font-src 'self';", "font-src 'self' https://fonts.gstatic.com;")
  .replace("media-src 'self'", "media-src 'self' blob:")

// Trickline (public/trickline) is a static page that sets its film and its labels in Inter from
// Google Fonts
const TricklinePolicy = ContentSecurityPolicy.replace(
  "style-src 'self' 'unsafe-inline';",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
).replace("font-src 'self';", "font-src 'self' https://fonts.gstatic.com;")

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    trailingSlash: false,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
        // The Markdown copy of each post (scripts/llms.mjs) is the same writing as the post's
        // page. This tells search engines the page is the one to list, so the two don't compete.
        {
          source: '/blog/:slug(.+)\\.md',
          headers: [
            {
              key: 'Link',
              value: `<${siteMetadata.siteUrl}/blog/:slug>; rel="canonical"`,
            },
          ],
        },
        // Every post in one file, for AI assistants. Search engines should list the posts
        // themselves, not this copy of all of them.
        {
          source: '/llms-full.txt',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
        },
        // The BACKSPIN game: the site's policy plus Google Fonts (a later header with the same
        // key replaces the earlier one)
        {
          source: '/backspin',
          headers: [{ key: 'Content-Security-Policy', value: BackspinPolicy.replace(/\n/g, '') }],
        },
        {
          source: '/backspin/:path*',
          headers: [{ key: 'Content-Security-Policy', value: BackspinPolicy.replace(/\n/g, '') }],
        },
        // The Trickline film: the site's policy plus Google Fonts
        {
          source: '/trickline',
          headers: [{ key: 'Content-Security-Policy', value: TricklinePolicy.replace(/\n/g, '') }],
        },
        {
          source: '/trickline/:path*',
          headers: [{ key: 'Content-Security-Policy', value: TricklinePolicy.replace(/\n/g, '') }],
        },
      ]
    },
    // BACKSPIN and Trickline are plain HTML in public/backspin and public/trickline. Next.js
    // serves public files as they are but doesn't map a folder to its index.html, so each one is
    // pointed at it here.
    async rewrites() {
      return [
        { source: '/backspin', destination: '/backspin/index.html' },
        { source: '/trickline', destination: '/trickline/index.html' },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
