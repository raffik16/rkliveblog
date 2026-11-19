import type { Demo } from '@/data/demosData'
import { postHref } from '@/lib/posts'

// The site search (components/SiteSearch.tsx): what it can find and how it ranks a match. Lab
// demos come from data/demosData.ts and ship with the page; posts come from the static index
// that contentlayer.config.ts writes to /search.json.

export type SearchKind = 'lab' | 'post'

export interface SearchItem {
  kind: SearchKind
  title: string
  href: string
  /** YYYY-MM-DD */
  date: string
  summary: string
  /** A post's topics, or what a Lab demo is built with */
  tags: string[]
}

export function labItems(demos: Demo[]): SearchItem[] {
  return demos.map((demo) => ({
    kind: 'lab',
    title: demo.title,
    href: demo.href,
    date: demo.date,
    summary: demo.description,
    tags: demo.tech,
  }))
}

/** Published posts from the search index. Entries without a title or a path are skipped. */
export function postItems(index: unknown): SearchItem[] {
  if (!Array.isArray(index)) return []
  return index.flatMap((entry): SearchItem[] => {
    const { title, path, date, summary, tags, draft } = (entry ?? {}) as Record<string, unknown>
    if (draft === true || typeof title !== 'string' || typeof path !== 'string') return []
    return [
      {
        kind: 'post',
        title,
        href: postHref(path),
        date: typeof date === 'string' ? date.slice(0, 10) : '',
        summary: typeof summary === 'string' ? summary : '',
        tags: Array.isArray(tags)
          ? tags.filter((tag): tag is string => typeof tag === 'string')
          : [],
      },
    ]
  })
}

// Dropped from a query unless they are all it has
const STOP_WORDS = new Set(['a', 'an', 'and', 'the', 'of', 'to', 'in', 'on', 'for', 'with'])

// Searching "lab" or "demo" lists the Lab
const KIND_WORDS: Record<SearchKind, string> = { lab: 'lab demo', post: 'post' }

/** Lowercase, without accents, with straight apostrophes: "Set’s Café" reads "set's cafe" */
function fold(text: string) {
  return text.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[‘’]/g, "'").toLowerCase()
}

/** Letters and digits only, so "nextjs" finds "Next.js" and "webgl2" finds "WebGL 2" */
const compact = (text: string) => text.replace(/[^a-z0-9]/g, '')

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function queryWords(query: string) {
  const all = fold(query)
    .split(/[\s,;:!?"()[\]{}]+/)
    .map((word) => word.replace(/^[-.'_/]+|[-.'_/]+$/g, ''))
    .filter(Boolean)
  const meaningful = all.filter((word) => !STOP_WORDS.has(word))
  return Array.from(new Set(meaningful.length ? meaningful : all))
}

const newestFirst = (a: SearchItem, b: SearchItem) => b.date.localeCompare(a.date)

/**
 * Builds a search over `items`. With no query it lists everything, newest first. Otherwise an
 * item has to match every word of the query, each at the start of a word ("syn" finds
 * "Synth", not "async"), and the best matches come first: the title counts most, then topics or
 * what a demo is built with, then the summary.
 */
export function createSearch(items: SearchItem[]) {
  const entries = items.map((item) => ({
    item,
    title: fold(item.title),
    compactTitle: compact(fold(item.title)),
    tags: fold(item.tags.join(' · ')),
    compactTags: item.tags.map((tag) => compact(fold(tag))),
    summary: fold(item.summary),
    kind: KIND_WORDS[item.kind],
  }))
  const everything = [...items].sort(newestFirst)

  return function search(query: string): SearchItem[] {
    const words = queryWords(query)
    if (!words.length) return everything

    const tests = words.map((word) => {
      const startsWord = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(word)}`)
      const squeezed = compact(word)
      return {
        startsWord,
        squeezed,
        // "forty-winks" or "three.js": also try it without the punctuation
        punctuated: squeezed.length >= 4 && squeezed !== word,
      }
    })
    const phrase = words.join(' ')

    const hits: { item: SearchItem; score: number }[] = []
    for (const entry of entries) {
      let score = 0
      // Each word scores for the best place it appears
      for (const { startsWord, squeezed, punctuated } of tests) {
        const points =
          startsWord.test(entry.title) || (punctuated && entry.compactTitle.includes(squeezed))
            ? 4
            : startsWord.test(entry.tags) ||
                (squeezed.length > 1 && entry.compactTags.some((tag) => tag.startsWith(squeezed)))
              ? 3
              : startsWord.test(entry.kind)
                ? 2
                : startsWord.test(entry.summary)
                  ? 1
                  : 0
        if (!points) {
          score = 0
          break
        }
        score += points
      }
      if (!score) continue
      if (entry.title.startsWith(phrase)) score += 6
      else if (words.length > 1 && entry.title.includes(phrase)) score += 3
      hits.push({ item: entry.item, score })
    }

    return hits
      .sort((a, b) => b.score - a.score || newestFirst(a.item, b.item))
      .map((hit) => hit.item)
  }
}
