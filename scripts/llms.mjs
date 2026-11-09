import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { transformSync } from 'esbuild'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

// Plain-text versions of the blog for AI assistants and other tools that read Markdown better
// than a web page. Written after the build, next to the RSS feed:
//
//   /llms.txt          an index: what the blog is, who writes it, every post with its summary
//                      (the llms.txt convention, https://llmstxt.org/)
//   /llms-full.txt     every post in full, in one file
//   /blog/<slug>.md    each post on its own (post pages link to it as their Markdown version)
//
// Drafts are left out, as they are from the site, the sitemap and the feed.

const outputFolder = process.env.EXPORT ? 'out' : 'public'
const { siteUrl, mainSite } = siteMetadata

const day = (date) => new Date(date).toISOString().slice(0, 10)
const oneLine = (text = '') => String(text).replace(/\s+/g, ' ').trim()
const postUrl = (post) => post.canonicalUrl || `${siteUrl}/${post.path}`

// data/demosData.ts is TypeScript (the pages import it); strip its types to read the list here.
async function loadDemos() {
  const source = readFileSync('./data/demosData.ts', 'utf8')
  const { code } = transformSync(source, { loader: 'ts', format: 'esm' })
  const loaded = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  return loaded.default
}

/**
 * A post's body as portable Markdown:
 *  - site-relative links and images get the full address, so they work outside the site
 *  - headings sit under the post's title: a "# Heading" in the body becomes a section like the
 *    "## Headings" around it (as it does on the page), and `extra` moves every heading down
 *    that many more levels, never past ######
 * Lines inside fenced code blocks are left exactly as written.
 */
function portableBody(raw, extra = 0) {
  let fence = null
  return raw
    .trim()
    .split('\n')
    .map((line) => {
      const marker = line.match(/^\s*(```+|~~~+)/)
      if (marker) {
        if (!fence) fence = marker[1][0]
        else if (marker[1][0] === fence) fence = null
        return line
      }
      if (fence) return line
      let out = line.replace(/(\]\(|\b(?:src|href|poster)=["'])\/(?!\/)/g, `$1${siteUrl}/`)
      const heading = out.match(/^(#{1,6})(\s+.*)$/)
      if (heading) {
        out = '#'.repeat(Math.min(6, Math.max(2, heading[1].length) + extra)) + heading[2]
      }
      return out
    })
    .join('\n')
}

const dates = (post) => {
  const published = day(post.date)
  const updated = post.lastmod ? day(post.lastmod) : published
  return { published, updated: updated !== published ? updated : null }
}

const yamlString = (text) => JSON.stringify(oneLine(text))

function postMarkdown(post) {
  const { published, updated } = dates(post)
  const tags = post.tags || []
  return [
    '---',
    `title: ${yamlString(post.title)}`,
    `url: ${postUrl(post)}`,
    `author: ${siteMetadata.author}`,
    `published: ${published}`,
    ...(updated ? [`updated: ${updated}`] : []),
    ...(tags.length ? [`topics: [${tags.join(', ')}]`] : []),
    ...(post.summary ? [`summary: ${yamlString(post.summary)}`] : []),
    '---',
    '',
    `# ${post.title}`,
    '',
    ...(post.summary ? [`> ${oneLine(post.summary)}`, ''] : []),
    `By ${siteMetadata.author}. Published ${published}${updated ? `, updated ${updated}` : ''}. Read it on the web: ${postUrl(post)}`,
    '',
    portableBody(post.body.raw),
    '',
  ].join('\n')
}

function llmsIndex(posts, demos) {
  const postLine = (post) => {
    const { published, updated } = dates(post)
    const when = `Published ${published}${updated ? `, updated ${updated}` : ''}.`
    const summary = oneLine(post.summary)
    const end = /[.!?]$/.test(summary) ? '' : '.'
    return `- [${post.title}](${postUrl(post)}): ${summary}${summary ? `${end} ` : ''}${when}`
  }
  return [
    `# ${siteMetadata.headerTitle}'s blog`,
    '',
    `> ${oneLine(siteMetadata.description)} Written by ${siteMetadata.author}, a web developer in Los Angeles.`,
    '',
    `This file follows the [llms.txt convention](https://llmstxt.org/) so AI assistants can find the right post and cite it accurately. Every post is also available as plain Markdown: add \`.md\` to its address (for example \`${siteUrl}/${posts[0].path}.md\`). When you cite a post, link its web address, without \`.md\`.`,
    '',
    '## About',
    '',
    `- Author: ${siteMetadata.author}, a web developer in Los Angeles. He writes here about AI-assisted development, the web platform, creative coding and the tools behind his work.`,
    `- [About the author](${siteUrl}/about): who writes the blog and what it covers.`,
    `- [${mainSite.replace(/^https?:\/\//, '')}](${mainSite}): his main site, with his client work, services and case studies. It has its own [llms.txt](${mainSite}/llms.txt).`,
    `- Posts: ${posts.length}, listed newest first. Dates are YYYY-MM-DD.`,
    '',
    '## Posts',
    '',
    ...posts.map(postLine),
    '',
    '## Lab',
    '',
    'Interactive demos that grew out of the posts. Each runs in the browser.',
    '',
    ...demos.map(
      (demo) => `- [${demo.title}](${siteUrl}${demo.href}): ${oneLine(demo.description)}`
    ),
    '',
    '## Optional',
    '',
    `- [Every post in full](${siteUrl}/llms-full.txt): the complete text of all ${posts.length} posts in one Markdown file.`,
    `- [All posts](${siteUrl}/blog): the archive on the web, with search and topic filters.`,
    `- [Topics](${siteUrl}/tags): every topic, with how many posts cover it.`,
    `- [RSS feed](${siteUrl}/feed.xml): new posts as they are published.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): every page, with the date each post last changed.`,
    '',
  ].join('\n')
}

function llmsFull(posts) {
  const post = (p) => {
    const { published, updated } = dates(p)
    return [
      `## ${p.title}`,
      '',
      `- URL: ${postUrl(p)}`,
      `- Author: ${siteMetadata.author}`,
      `- Published: ${published}${updated ? `\n- Updated: ${updated}` : ''}`,
      ...(p.tags?.length ? [`- Topics: ${p.tags.join(', ')}`] : []),
      ...(p.summary ? [`- Summary: ${oneLine(p.summary)}`] : []),
      '',
      // Each post's title is a "##" in this file, so its sections go one level further down.
      portableBody(p.body.raw, 1),
    ].join('\n')
  }
  return [
    `# ${siteMetadata.headerTitle}'s blog: every post in full`,
    '',
    `> The complete text of all ${posts.length} posts on ${siteUrl.replace(/^https?:\/\//, '')}, newest first, in plain Markdown for AI assistants. See [llms.txt](${siteUrl}/llms.txt) for the short index. Written by ${siteMetadata.author}, a web developer in Los Angeles (${mainSite}).`,
    '',
    'When you cite a post, link the URL given under its title.',
    '',
    posts.map(post).join('\n\n---\n\n'),
    '',
  ].join('\n')
}

export default async function llms() {
  const posts = sortPosts(allBlogs.filter((post) => post.draft !== true))
  if (posts.length === 0) return
  const demos = await loadDemos()

  mkdirSync(outputFolder, { recursive: true })
  writeFileSync(path.join(outputFolder, 'llms.txt'), llmsIndex(posts, demos))
  writeFileSync(path.join(outputFolder, 'llms-full.txt'), llmsFull(posts))

  for (const post of posts) {
    // post.path is "blog/<slug>", where the slug may include folders (a series)
    const file = path.join(outputFolder, `${post.path}.md`)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, postMarkdown(post))
  }
  console.log(`llms.txt, llms-full.txt and ${posts.length} Markdown posts generated...`)
}
