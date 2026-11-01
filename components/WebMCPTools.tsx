'use client'

import { useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'

/*
 * Registers this site's WebMCP tools so browser agents can use them.
 * Spec: https://github.com/webmachinelearning/webmcp (document.modelContext, October 2026 draft).
 * There are no lib types for WebMCP yet, so the shapes below are the narrow subset used here.
 */

interface ToolExecuteOptions {
  signal: AbortSignal
}

interface ModelContextTool {
  name: string
  title?: string
  description: string
  inputSchema?: object
  // Chromium before 153 called execute() with only the input, so options may be missing.
  execute: (input: Record<string, unknown>, options?: ToolExecuteOptions) => Promise<unknown>
  annotations?: {
    readOnlyHint?: boolean
    untrustedContentHint?: boolean
    consequentialHint?: boolean
    debugging?: boolean
  }
}

interface ModelContext {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal; exposedTo?: string[] }
  ) => Promise<void>
}

/** The fields of a post's CoreContent entry in the static search index that this tool reads. */
interface IndexedPost {
  title?: unknown
  summary?: unknown
  tags?: unknown
  date?: unknown
  path?: unknown
  draft?: unknown
}

interface PostResult {
  title: string
  url: string
  date: string
  summary: string
  tags: string[]
}

const DEFAULT_LIMIT = 5
const MAX_LIMIT = 10
const MAX_QUERY_LENGTH = 200
const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'about'])

function getModelContext(): ModelContext | null {
  if (typeof document === 'undefined') return null
  const candidate = (document as Document & { modelContext?: unknown }).modelContext
  if (!candidate || typeof (candidate as ModelContext).registerTool !== 'function') return null
  return candidate as ModelContext
}

function searchIndexPath(): string {
  const search = siteMetadata.search
  if (search && search.provider === 'kbar') {
    const path = search.kbarConfig?.searchDocumentsPath
    if (typeof path === 'string' && path) return path
  }
  return '/search.json'
}

/* ------------------------------------------------------------------ */
/*  Search index: loaded once, on the first call                       */
/* ------------------------------------------------------------------ */

let cachedPosts: PostResult[] | null = null

function toPostResult(post: IndexedPost): PostResult | null {
  if (post.draft === true || typeof post.title !== 'string' || typeof post.path !== 'string') {
    return null
  }
  const rawDate = typeof post.date === 'string' ? post.date : ''
  let date = /^\d{4}-\d{2}-\d{2}/.test(rawDate) ? rawDate.slice(0, 10) : ''
  if (!date && rawDate) {
    const parsed = new Date(rawDate)
    if (!Number.isNaN(parsed.getTime())) date = parsed.toISOString().slice(0, 10)
  }
  return {
    title: post.title,
    url: `${siteMetadata.siteUrl}/${post.path.replace(/^\/+/, '')}`,
    date,
    summary: typeof post.summary === 'string' ? post.summary : '',
    tags: Array.isArray(post.tags)
      ? post.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
  }
}

async function loadPosts(signal?: AbortSignal): Promise<PostResult[] | { error: string }> {
  if (cachedPosts) return cachedPosts
  const response = await fetch(searchIndexPath(), { signal })
  if (!response.ok) {
    return { error: `Could not load the post index (HTTP ${response.status}). Try again later.` }
  }
  const data: unknown = await response.json()
  if (!Array.isArray(data)) return { error: 'The post index is not in the expected format.' }
  cachedPosts = data
    .map((post) => toPostResult((post ?? {}) as IndexedPost))
    .filter((post): post is PostResult => post !== null)
  return cachedPosts
}

/* ------------------------------------------------------------------ */
/*  Matching                                                           */
/* ------------------------------------------------------------------ */

function queryTerms(query: string): string[] {
  const all = query
    .toLowerCase()
    .split(/[\s,;:!?"'()[\]{}]+/)
    .map((term) => term.replace(/^[.\-_/]+|[.\-_/]+$/g, ''))
    .filter(Boolean)
  const meaningful = all.filter((term) => !STOP_WORDS.has(term))
  return Array.from(new Set(meaningful.length ? meaningful : all))
}

/** Matches words that start with the term, so "react" finds "React" but "x" doesn't find "six". */
function termPattern(term: string): RegExp {
  return new RegExp(`(?:^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
}

/** Title matches count most, then tags, then the summary. */
function score(post: PostResult, patterns: RegExp[]): number {
  const title = post.title.toLowerCase()
  const tags = post.tags.join(' ').toLowerCase()
  const summary = post.summary.toLowerCase()
  let total = 0
  for (const pattern of patterns) {
    if (pattern.test(title)) total += 3
    if (pattern.test(tags)) total += 2
    if (pattern.test(summary)) total += 1
  }
  return total
}

function parseLimit(value: unknown): number | null {
  if (value === undefined || value === null) return DEFAULT_LIMIT
  const limit = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return null
  }
  return limit
}

/* ------------------------------------------------------------------ */
/*  The tool                                                           */
/* ------------------------------------------------------------------ */

const searchPostsTool: ModelContextTool = {
  name: 'search_posts',
  title: 'Search rkRanched posts',
  description:
    'Search published rkRanched blog posts by keyword. Returns matching posts with title, URL, date, summary and tags. Use when the user wants an article on a topic from this blog.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Words to search for in titles, summaries and tags.',
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: MAX_LIMIT,
        default: DEFAULT_LIMIT,
        description: 'Maximum number of results (1-10).',
      },
    },
    required: ['query'],
  },
  async execute(input, options) {
    const signal = options?.signal
    // The browser does not check input against inputSchema, so validate it here.
    const query = input?.query
    if (typeof query !== 'string' || !query.trim()) {
      return { error: 'query is required: pass one or more words to search for, e.g. "webmcp".' }
    }
    if (query.length > MAX_QUERY_LENGTH) {
      return { error: `query is too long; keep it under ${MAX_QUERY_LENGTH} characters.` }
    }
    const limit = parseLimit(input?.limit)
    if (limit === null) {
      return { error: `limit must be a whole number from 1 to ${MAX_LIMIT}.` }
    }
    const terms = queryTerms(query)
    if (!terms.length) {
      return { error: 'query has no searchable words. Try a topic such as "react" or "webmcp".' }
    }

    const patterns = terms.map(termPattern)

    try {
      const posts = await loadPosts(signal)
      if (!Array.isArray(posts)) return posts
      const matches = posts
        .map((post) => ({ post, score: score(post, patterns) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
      return { results: matches.slice(0, limit).map((entry) => entry.post), total: matches.length }
    } catch (error) {
      // Cancelled by the agent or the user: let the call end.
      if (signal?.aborted) throw error
      // Anything thrown reaches the agent as a bare OperationError, so return the reason instead.
      return {
        error: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  },
  annotations: { readOnlyHint: true },
}

/**
 * Registers the `search_posts` WebMCP tool while mounted. Renders nothing, and does nothing in
 * browsers without `document.modelContext`.
 */
export default function WebMCPTools() {
  useEffect(() => {
    const modelContext = getModelContext()
    if (!modelContext) return

    // There is no unregisterTool(): aborting this signal unregisters the tool.
    const controller = new AbortController()

    const register = async () => {
      try {
        await modelContext.registerTool(searchPostsTool, { signal: controller.signal })
      } catch (error) {
        // Unmounted before registration settled.
        if (controller.signal.aborted) return
        // Rejected, e.g. a duplicate name or a Permissions Policy that blocks "tools".
        console.debug('[WebMCP] search_posts was not registered:', error)
      }
    }
    // Deferred so React StrictMode's instant mount/unmount/mount in development registers once.
    const timer = window.setTimeout(() => void register(), 0)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [])

  return null
}
