// Tags are stored as lowercase slugs ("nextjs", "claude-code") and shown that way on the page.
// Page titles and descriptions read better with the name written properly, so the slugs that
// aren't plain words are spelled out here. Anything not listed falls back to the slug with its
// hyphens turned into spaces.
const LABELS: Record<string, string> = {
  'ab-testing': 'A/B testing',
  agents: 'AI agents',
  ai: 'AI',
  canvas: 'Canvas',
  'claude-code': 'Claude Code',
  css: 'CSS',
  'game-dev': 'game development',
  'go-ped': 'Go-Ped',
  gsap: 'GSAP',
  html: 'HTML',
  'html5-games': 'HTML5 games',
  interactive: 'interactive demos',
  javascript: 'JavaScript',
  llm: 'LLMs',
  nextjs: 'Next.js',
  react: 'React',
  saas: 'SaaS',
  threejs: 'three.js',
  'two-stroke': 'two-stroke engines',
  'web-platform': 'the web platform',
  webgl: 'WebGL',
  webmcp: 'WebMCP',
  wordpress: 'WordPress',
}

export const tagLabel = (tag: string) => LABELS[tag] ?? tag.replace(/-/g, ' ')

/** Where search results cut a description off. */
const DESCRIPTION_MAX = 155

/**
 * A description for a list of posts that names the posts: "3 posts about CSS, newest first:
 * First title; Second title; and more." Titles are added while they fit in a search result.
 */
export function listDescription(lead: string, titles: string[], max = DESCRIPTION_MAX) {
  let text = lead
  for (let i = 0; i < titles.length; i++) {
    const last = i === titles.length - 1
    const next = `${text}${i === 0 ? ' ' : '; '}${titles[i]}`
    // Leave room to say there is more when this isn't the last title.
    if (next.length + (last ? 1 : '; and more.'.length) > max) {
      return i === 0 ? `${lead.replace(/:$/, '')}.` : `${text}; and more.`
    }
    text = next
  }
  return `${text}.`
}
