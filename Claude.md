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
- **summary**: Brief description (150-200 characters)
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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | Post title (appears in heading and metadata) |
| `date` | date | ✅ Yes | Publication date (YYYY-MM-DD) |
| `tags` | array | ❌ No | List of tags for categorization |
| `lastmod` | date | ❌ No | Last modified date (for SEO) |
| `draft` | boolean | ❌ No | `true` to hide from production builds |
| `summary` | string | ❌ No | Brief description (shown in listings, SEO) |
| `images` | array | ❌ No | Featured images for Open Graph/Twitter cards |
| `authors` | array | ❌ No | Author slugs (e.g., `['default', 'sparrowhawk']`) |
| `layout` | string | ❌ No | Layout template (see below) |
| `bibliography` | string | ❌ No | BibTeX file for citations |
| `canonicalUrl` | string | ❌ No | Canonical URL if content is republished |

---

## Common Layouts

### Available Layout Options

1. **PostLayout** (default)
   - 2-column layout with sidebar
   - Shows author info, date, reading time
   - Table of contents in sidebar
   - Related posts section
   - **Use for**: Standard blog posts

2. **PostSimple**
   - Single column, centered content
   - Minimal UI, focus on content
   - No sidebar or extras
   - **Use for**: Essays, long-form content

3. **PostBanner**
   - Featured banner image at top
   - Great for visual posts
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
- **Bold**, *italic*, `code`
- Headings (H1-H6)
- Lists (ordered/unordered)
- Blockquotes
- Tables

**Code Blocks:**
````markdown
```javascript
const greeting = "Hello World";
console.log(greeting);
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

# Welcome!

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
