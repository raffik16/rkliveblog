# RK Live Blog - Claude Code Documentation

## Quick Start: Voice-Based Blog Posting

This document explains how to quickly create blog posts using Claude Code with voice dictation.

---

## Table of Contents

1. [Quick Post Creation (Voice Optimized)](#quick-post-creation-voice-optimized)
2. [Post Structure & Requirements](#post-structure--requirements)
3. [Frontmatter Fields Reference](#frontmatter-fields-reference)
4. [Voice Command Examples](#voice-command-examples)
5. [Common Layouts](#common-layouts)
6. [After Publishing](#after-publishing)

---

## Quick Post Creation (Voice Optimized)

### Simple Voice Workflow

**Say this to Claude Code:**

> "Create a new blog post titled [YOUR TITLE] with the following content: [YOUR CONTENT]"

Claude will automatically:

1. Generate a URL-friendly slug from your title
2. Create the MDX file in `/data/blog/`
3. Add proper frontmatter with current date
4. Format your content correctly
5. Set appropriate defaults (layout, tags, etc.)

### Example Voice Commands

```
"Create a blog post titled 'My thoughts on AI' with content about
how AI is changing software development. Tag it with AI and technology."
```

```
"Write a new post called 'Quick TypeScript Tips' with these 5 tips:
[list your tips]. Use the PostSimple layout and tag it typescript, tutorial."
```

---

## Post Structure & Requirements

### Minimum Required Fields

Every blog post MUST have:

- **title**: The post title
- **date**: Publication date (YYYY-MM-DD format)
- **file location**: `/data/blog/your-post-slug.mdx`

### Recommended Fields

For better SEO and organization:

- **summary**: Brief description (155 characters or fewer, so search results show all of it)
- **tags**: Array of relevant tags
- **draft**: Set to `true` for unpublished posts

### File Location

All blog posts go in: `/data/blog/`

**File naming convention:**

- Use kebab-case: `my-awesome-post.mdx`
- Only lowercase letters, numbers, and hyphens
- Must end with `.mdx` extension

---

## Frontmatter Fields Reference

### Complete Frontmatter Template

```yaml
---
title: 'Your Post Title Here'
date: '2025-10-27'
lastmod: '2025-10-27'
tags: ['tag1', 'tag2', 'tag3']
draft: false
summary: 'A brief summary of your post that appears in listings and social media previews.'
images: ['/static/images/post-image.jpg']
authors: ['default']
layout: PostLayout
canonicalUrl: ''
bibliography: references-data.bib
---
```

### Field Descriptions

| Field          | Type    | Required | Description                                       |
| -------------- | ------- | -------- | ------------------------------------------------- |
| `title`        | string  | ✅ Yes   | Post title (appears in heading and metadata)      |
| `date`         | date    | ✅ Yes   | Publication date (YYYY-MM-DD)                     |
| `tags`         | array   | ❌ No    | List of tags for categorization                   |
| `lastmod`      | date    | ❌ No    | Last modified date (for SEO)                      |
| `draft`        | boolean | ❌ No    | `true` to hide from production builds             |
| `summary`      | string  | ❌ No    | Brief description, 155 characters or fewer        |
| `images`       | array   | ❌ No    | Featured images for Open Graph/Twitter cards      |
| `authors`      | array   | ❌ No    | Author slugs (e.g., `['default', 'sparrowhawk']`) |
| `layout`       | string  | ❌ No    | Layout template (see below)                       |
| `bibliography` | string  | ❌ No    | BibTeX file for citations                         |
| `canonicalUrl` | string  | ❌ No    | Canonical URL if content is republished           |

---

## Common Layouts

### Available Layout Options

1. **PostLayout** (default)
   - Contents rail on the left (from the post's `##` headings), notes on the right
   - Issue number, reading time, author byline, publish/updated dates
   - Previous/next posts and the newsletter at the end
   - **Use for**: Standard blog posts

2. **PostSimple**
   - Same reading layout without the contents rail
   - Comments under the article (when giscus is configured)
   - **Use for**: Essays, long-form content

3. **PostBanner**
   - The first image in `images` runs wide under the header
   - Comments under the article (when giscus is configured)
   - **Use for**: Photo essays, visual content

### Layout Selection

```yaml
# In your frontmatter:
layout: PostLayout      # Default (can be omitted)
layout: PostSimple      # Minimal layout
layout: PostBanner      # With banner image
```

---

## Voice Command Examples

### Example 1: Quick Technical Post

**Say:**

> "Create a blog post titled 'Understanding React Server Components' with an explanation of how RSCs work, their benefits, and a code example. Tag it with react, nextjs, and tutorial."

**Result:** Claude creates:

```
/data/blog/understanding-react-server-components.mdx
```

### Example 2: Personal Update

**Say:**

> "Write a post called 'My Weekend Project' about building a weather app. Keep it casual, use PostSimple layout, and tag it with projects and javascript."

### Example 3: Draft Post

**Say:**

> "Create a draft post titled 'Future of Web Development' with placeholder content. I'll finish it later."

Claude will set `draft: true` automatically.

### Example 4: Multi-section Post

**Say:**

> "Create a post called 'TypeScript Best Practices' with these sections: Introduction, Type Safety, Generics, and Conclusion. Add actual content for each section."

---

## After Publishing

### Local Development

1. **Start dev server:**

   ```bash
   yarn dev
   ```

2. **View your post:**
   - Navigate to `http://localhost:3000/blog`
   - Find your post in the list
   - Click to view full post

### Production Deployment

1. **Build the site:**

   ```bash
   yarn build
   ```

2. **Test production build:**

   ```bash
   yarn start
   ```

3. **Deploy:**
   - Commit changes to git
   - Push to GitHub
   - Vercel will auto-deploy (if connected)

### Verification Checklist

After creating a post, verify:

- [ ] Frontmatter is properly formatted (no YAML errors)
- [ ] The body has no single-`#` heading (the title is the page's H1; sections start at `##`)
- [ ] `lastmod` is today's date if you edited an existing post
- [ ] Date is in correct format (YYYY-MM-DD)
- [ ] Tags are in array format: `['tag1', 'tag2']`
- [ ] Images paths are correct (if used)
- [ ] Draft status is correct (`true` or `false`)
- [ ] Content renders properly in dev mode

---

## MDX Content Features

### Available Components

This blog supports:

**Text Formatting:**

- Standard Markdown syntax
- **Bold**, _italic_, `code`
- Headings (H1-H6)
- Lists (ordered/unordered)
- Blockquotes
- Tables

**Code Blocks:**

````markdown
```javascript
const greeting = 'Hello World'
console.log(greeting)
```
````

**Math Equations (KaTeX):**

```markdown
Inline: $E = mc^2$

Block:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**Images:**

```markdown
![Alt text](/static/images/photo.jpg)
```

**Links:**

```markdown
[Link text](https://example.com)
```

**Custom Components:**

- Use any React component in MDX
- Import components at top of file
- Embed interactive elements

---

## Tips for Voice-Based Posting

### Best Practices

1. **Speak clearly and structure your content**
   - "New paragraph" for breaks
   - "Heading: [title]" for sections
   - "Code block: [language]" before code

2. **Provide all metadata upfront**
   - Title, tags, layout in initial request
   - Saves back-and-forth clarification

3. **Use natural language**
   - Claude will format properly
   - No need to spell out Markdown syntax
   - Just describe what you want

4. **Edit after creation**
   - Voice posts are starting points
   - Review and refine after generation
   - Ask Claude to "edit the post to add [content]"

### Common Voice Patterns

```
"Create a [layout] blog post titled '[title]' tagged with [tags]
about [topic]. Include sections on [section1], [section2], [section3]."
```

```
"Add a new post called '[title]' with this content: [dictate content].
Make it a draft and tag it [tags]."
```

```
"Write a technical post about [topic] with code examples in [language].
Use the PostLayout and tag it [tags]."
```

---

## Troubleshooting

### Post Not Appearing

**Cause:** Post marked as draft
**Fix:** Set `draft: false` in frontmatter

**Cause:** Invalid frontmatter YAML
**Fix:** Check for:

- Missing quotes around strings with special characters
- Incorrect date format
- Malformed arrays (should be `['tag1', 'tag2']`)

### Build Errors

**Cause:** Invalid MDX syntax
**Fix:** Check for:

- Unclosed JSX tags
- Invalid component imports
- Syntax errors in code blocks

### Images Not Loading

**Cause:** Incorrect image path
**Fix:**

- Images should be in `/public/static/images/`
- Reference as: `/static/images/your-image.jpg`
- Use forward slashes (not backslashes)

---

## Design System (Edition '26)

The blog uses the same visual system as the main site, [raffi.website](https://raffi.website)
(repo `raffik16/raffi-website-com-25`). Keep new pages and components on it:

- **Dark only.** Every page sits on a fixed backdrop (`components/edition/EdBackdrop.tsx`) that
  takes the colour of the section in the middle of the screen. Mark a section with
  `data-chapter="id"`, `data-chapter-label`, `data-chapter-num` and
  `data-chapter-color="var(--ed-cobalt)"` (ink, cobalt, violet, raspberry, ember, forest).
  Sections with labels show up in the left chapter rail; add `data-chapter-rail="off"` to colour
  the backdrop without adding a rail entry.
- **Tokens and pieces** live in `css/edition.css` (colours, type, shell grid, navbar, rail,
  chapter heads, pills, panels, notes, stats). Blog-specific styles (hero, post lists, filters,
  post page, prose) are in `css/blog.css`. Class names match the main site's (`ed-*`).
- **Type:** Inter for text, Inter Tight for headings, Instrument Serif italic for the odd accent
  word (`<em>` in big titles), JetBrains Mono for labels and meta.
- **Lime (`--ed-signal`)** is for primary calls to action, focus rings and live states only.
- **Components:** `EdChapterHead` (numbered chapter opener with the outline title that fills on
  scroll), `EdPanel`, `EdPill`, `EdNote` (margin notes), `PostRow` (post list row).
- **Scroll reveals:** add `data-reveal` to a content block (or `data-reveal-children` to a
  container, as the post body does) and it fades and rises in as it scrolls into view.
  `components/edition/Reveal.tsx` runs it (a port of the main site's `plugins/reveal.js`); blocks
  already on screen when the page loads are never hidden, and reduced motion shows everything.
- `lib/edition/fibreField.js` is copied unchanged from the main site; edit it there and copy it
  back rather than changing it here.
- Watch out: `prettier-plugin-tailwindcss` trims spaces inside template-literal class names, so
  join conditional classes with `cx()` from `lib/edition/cx.ts` instead of `` `a${x ? ' b' : ''}` ``.

---

## Search Engines and AI Assistants

How the blog describes itself to Google, Bing and AI assistants. Keep new pages on it:

- **Address.** `siteUrl` in `data/siteMetadata.js` is the blog's public address
  (`https://me.raffi.website`). Canonical links, the sitemap, the feeds, `llms.txt` and the
  structured data are all built from it, so change it there and nowhere else.
- **One author, two sites.** The author is the Person that raffi.website/about declares
  (`https://raffi.website/#person`). `lib/schema.ts` builds every JSON-LD block from that id, so
  the blog never describes a second person. Use its helpers (`authorRef`, `breadcrumbSchema`,
  `jsonLdGraph`) rather than writing JSON-LD by hand.
- **Page metadata.** Use `genPageMetadata({ title, description, path })` from `app/seo.tsx`.
  Descriptions are 155 characters or fewer. Topic pages get theirs from `lib/tagMetadata.ts`;
  a topic with one post is `noindex` until a second post uses the tag.
- **One H1 per page.** A post's `title` is its H1; a `# Heading` in the body renders as an H2
  (`components/MDXComponents.tsx`).
- **llms.txt.** After the build, `scripts/llms.mjs` writes `/llms.txt`, `/llms-full.txt` and a
  Markdown copy of each post at `/blog/<slug>.md`. They are build output (ignored by git).
- **Referral links.** Add the programme's host to `data/referralLinks.ts` and the disclosure note
  to the post; `components/Link.tsx` then marks those links `rel="sponsored nofollow"`.
- **New top-level pages** go in `app/sitemap.ts` (`OTHER_PAGES`).

---

## Quick Reference: File Structure

```
rkliveblog/
├── data/
│   ├── blog/                          ← PUT YOUR POSTS HERE
│   │   ├── your-post.mdx             ← Individual post
│   │   ├── another-post.mdx          ← Another post
│   │   └── nested-route/             ← Multi-part posts
│   │       ├── introducing-multi-part-posts.mdx
│   │       └── nested-post.mdx
│   ├── authors/                       ← Author profiles
│   │   └── default.mdx
│   └── siteMetadata.js                ← Site configuration
├── public/
│   └── static/
│       └── images/                    ← PUT YOUR IMAGES HERE
└── app/
    └── blog/                          ← Blog pages (don't edit)
```

---

## Example: Complete Blog Post

**File:** `/data/blog/my-first-post.mdx`

```mdx
---
title: 'My First Blog Post'
date: '2025-10-27'
tags: ['getting-started', 'tutorial']
draft: false
summary: 'Welcome to my new blog! This is my first post using the Next.js starter blog template.'
authors: ['default']
layout: PostLayout
---

This is my first blog post using this awesome Next.js starter template.

## What I'm Going to Write About

I plan to write about:

- Web development
- JavaScript and TypeScript
- React and Next.js
- Personal projects

## Getting Started Was Easy

The setup process was straightforward:

1. Clone the repository
2. Install dependencies with `yarn`
3. Create my first post
4. Deploy to Vercel

Here's a simple code example:

\`\`\`javascript
function greet(name) {
return `Hello, ${name}!`;
}

console.log(greet('World'));
\`\`\`

## Conclusion

I'm excited to start blogging! Stay tuned for more posts.
```

---

## Advanced: Nested Routes

For multi-part series or organized content:

```
data/blog/
└── react-series/
    ├── part-1-introduction.mdx
    ├── part-2-components.mdx
    └── part-3-state.mdx
```

Posts will be available at:

- `/blog/react-series/part-1-introduction`
- `/blog/react-series/part-2-components`
- `/blog/react-series/part-3-state`

---

## Support & Resources

- **Documentation:** [Next.js Docs](https://nextjs.org/docs)
- **Contentlayer:** [Contentlayer Docs](https://contentlayer.dev)
- **MDX:** [MDX Documentation](https://mdxjs.com)
- **Tailwind CSS:** [Tailwind Docs](https://tailwindcss.com/docs)

---

## Quick Command Reference

```bash
# Development
yarn dev          # Start dev server at localhost:3000
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Content
# Just ask Claude Code:
"Create a blog post about [topic]"
"Edit my latest post to add [content]"
"Fix any build errors in my posts"
```

---

**Last Updated:** 2025-10-27
**Version:** 1.0
