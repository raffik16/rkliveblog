import type { ValidationRule } from './types'

type CodeType = 'html' | 'js' | 'unknown'

/* ------------------------------------------------------------------ */
/*  Shared checks (also used by the generator UI)                      */
/* ------------------------------------------------------------------ */

export const TOOL_NAME_HINT =
  '1-128 characters: letters, digits, underscore (_), hyphen (-) or period (.)'

/**
 * Why `registerTool()` would reject this tool name (InvalidStateError), or null when it is valid.
 * Chromium also silently skips declarative forms whose toolname fails this check.
 */
export function toolNameError(name: string): string | null {
  if (name.length === 0) return 'A tool name is required.'
  if (name.length > 128) return `Too long: ${name.length} characters (the maximum is 128).`
  const bad = Array.from(new Set(name.replace(/[A-Za-z0-9_.-]/g, '').split('')))
  if (bad.length > 0) {
    // JSON.stringify escapes control characters but not U+2028/U+2029, which would end a `//`
    // comment in the generated code.
    const shown = bad
      .map((c) =>
        c === ' '
          ? 'spaces'
          : JSON.stringify(c)
              .replace(/\u2028/g, '\\u2028')
              .replace(/\u2029/g, '\\u2029')
      )
      .join(', ')
    return `Not allowed: ${shown}. Use ${TOOL_NAME_HINT}.`
  }
  return null
}

const CONSEQUENTIAL_RE =
  /(?:^|[^a-z])(pay|pays|paid|paying|payment|payments|purchase|purchases|purchased|purchasing|buy|buys|buying|checkout|delete|deletes|deleted|deleting|remove|removes|removed|removing|send|sends|sending|book|booked|booking|transfer|transfers|transferred|transferring|refund|refunds|withdraw|withdrawal|donate|donation|subscribe)(?![a-z])/

/** The first word that makes a tool look consequential (payments, deletions, messages...). */
export function consequentialWord(text: string): string | null {
  const match = CONSEQUENTIAL_RE.exec(text.toLowerCase())
  return match ? match[1] : null
}

const VALID_ANNOTATIONS = ['readOnlyHint', 'untrustedContentHint', 'consequentialHint', 'debugging']
const MCP_ONLY_ANNOTATIONS = ['openWorldHint', 'destructiveHint', 'idempotentHint']

/* ------------------------------------------------------------------ */
/*  Detection                                                          */
/* ------------------------------------------------------------------ */

const JS_MARKERS = /modelContext|registerTool|inputSchema|provideContext|unregisterTool/

function detectCodeType(code: string): CodeType {
  const trimmed = code.trim()
  if (/<form[\s>]/i.test(trimmed) || /\stoolname\s*=/i.test(trimmed)) return 'html'
  if (JS_MARKERS.test(trimmed)) return 'js'
  if (trimmed.startsWith('<') || /<input[\s>]/i.test(trimmed)) return 'html'
  return 'unknown'
}

/* ------------------------------------------------------------------ */
/*  Small JS scanner: brackets, strings and comments                   */
/* ------------------------------------------------------------------ */

const OPENERS = '{[('
const CLOSERS = '}])'

/** If code[i] starts a string or comment, the index just past it; otherwise -1. */
function skipLiteral(code: string, i: number): number {
  const c = code[i]
  if (c === '"' || c === "'" || c === '`') {
    let j = i + 1
    while (j < code.length) {
      const d = code[j]
      if (d === '\\') {
        j += 2
        continue
      }
      if (d === c) return j + 1
      if (c !== '`' && d === '\n') return j
      j++
    }
    return code.length
  }
  if (c === '/' && code[i + 1] === '/') {
    const end = code.indexOf('\n', i)
    return end === -1 ? code.length : end
  }
  if (c === '/' && code[i + 1] === '*') {
    const end = code.indexOf('*/', i + 2)
    return end === -1 ? code.length : end + 2
  }
  return -1
}

/** Index of the bracket closing the one at code[start], or -1 when unbalanced. */
function matchBracket(code: string, start: number): number {
  let depth = 0
  for (let i = start; i < code.length; i++) {
    const skip = skipLiteral(code, i)
    if (skip !== -1) {
      i = skip - 1
      continue
    }
    if (OPENERS.includes(code[i])) depth++
    else if (CLOSERS.includes(code[i])) {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/** Split on commas that are not nested inside brackets, strings or comments. */
function splitTopLevel(inner: string): string[] {
  const parts: string[] = []
  let depth = 0
  let last = 0
  for (let i = 0; i < inner.length; i++) {
    const skip = skipLiteral(inner, i)
    if (skip !== -1) {
      i = skip - 1
      continue
    }
    const c = inner[i]
    if (OPENERS.includes(c)) depth++
    else if (CLOSERS.includes(c)) depth--
    else if (c === ',' && depth === 0) {
      parts.push(inner.slice(last, i))
      last = i + 1
    }
  }
  parts.push(inner.slice(last))
  return parts.map(stripLeadingTrivia).filter((p) => p.length > 0)
}

function stripLeadingTrivia(text: string): string {
  let s = text.trim()
  for (;;) {
    if (s.startsWith('//')) {
      const end = s.indexOf('\n')
      s = end === -1 ? '' : s.slice(end + 1).trim()
    } else if (s.startsWith('/*')) {
      const end = s.indexOf('*/')
      s = end === -1 ? '' : s.slice(end + 2).trim()
    } else {
      return s
    }
  }
}

/** Replace comments with spaces (keeping newlines and offsets) so they can't trigger rules. */
function blankComments(code: string): string {
  let out = ''
  let i = 0
  while (i < code.length) {
    const end = skipLiteral(code, i)
    if (end === -1) {
      out += code[i]
      i++
      continue
    }
    const chunk = code.slice(i, end)
    out += code[i] === '/' ? chunk.replace(/[^\n]/g, ' ') : chunk
    i = end
  }
  return out
}

interface Prop {
  kind: 'value' | 'method' | 'shorthand'
  /** Text after the colon (value), from the parameter list on (method), or '' (shorthand). */
  value: string
}

const PROP_RE =
  /^(?:(?:async|get|set)\s+)?\*?\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([A-Za-z_$][\w$]*))\s*([:(]|$)/

/** Top-level properties of the object literal whose `{` is at code[open]. */
function parseObject(code: string, open: number): Map<string, Prop> {
  const props = new Map<string, Prop>()
  const close = matchBracket(code, open)
  const inner = code.slice(open + 1, close === -1 ? code.length : close)
  for (const part of splitTopLevel(inner)) {
    const match = PROP_RE.exec(part)
    if (!match) continue
    const key = match[1] ?? match[2] ?? match[3]
    if (props.has(key)) continue
    const sep = match[4]
    if (sep === ':') props.set(key, { kind: 'value', value: part.slice(match[0].length).trim() })
    else if (sep === '(') props.set(key, { kind: 'method', value: part.slice(match[0].length - 1) })
    else props.set(key, { kind: 'shorthand', value: '' })
  }
  return props
}

/** Parse a value that is a plain string literal; null for anything else. */
function stringLiteral(value: string): string | null {
  const v = value.trim()
  if (/^"(?:[^"\\\n]|\\.)*"$/.test(v)) {
    try {
      return JSON.parse(v) as string
    } catch {
      return v.slice(1, -1)
    }
  }
  if (/^'(?:[^'\\\n]|\\.)*'$/.test(v)) return v.slice(1, -1).replace(/\\(.)/g, '$1')
  if (/^`[^`$\\]*`$/.test(v)) return v.slice(1, -1)
  return null
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function mentions(text: string, identifier: string): boolean {
  return new RegExp(`(?:^|[^\\w$])${escapeRegExp(identifier)}(?![\\w$])`).test(text)
}

interface RegisterCall {
  /** Index of `registerTool` in the code. */
  index: number
  /** Text after the call's closing parenthesis. */
  after: string
  /** Second argument (registration options), if any. */
  options: string | null
  /** Index of the tool object's `{`, when it could be located. */
  toolOpen: number
}

function findRegisterCall(code: string): RegisterCall | null {
  const match = /\bregisterTool\s*\(/.exec(code)
  if (!match) return null
  const paren = match.index + match[0].length - 1
  const close = matchBracket(code, paren)
  const args = splitTopLevel(code.slice(paren + 1, close === -1 ? code.length : close))
  const after = close === -1 ? '' : code.slice(close + 1)
  const first = args[0] ?? ''
  let toolOpen = -1

  if (first.startsWith('{')) {
    toolOpen = code.indexOf(first, paren)
  } else if (/^[A-Za-z_$][\w$]*$/.test(first)) {
    // registerTool(tool): look for `tool = {`
    const decl = new RegExp(`(?:^|[^\\w$.])${escapeRegExp(first)}\\s*(?::[^=]*)?=\\s*\\{`).exec(
      code
    )
    if (decl) toolOpen = decl.index + decl[0].length - 1
  }

  return { index: match.index, after, options: args[1] ?? null, toolOpen }
}

/** Fallback for factories and other shapes: the first `{ name: ... }` object with a description. */
function findToolObjectByShape(code: string): number {
  const re = /\{\s*(?:\/\/[^\n]*\n\s*)*["']?name["']?\s*:/g
  let match: RegExpExecArray | null
  while ((match = re.exec(code)) !== null) {
    const props = parseObject(code, match.index)
    if (props.has('description') || props.has('execute')) return match.index
  }
  return -1
}

interface ExecuteInfo {
  params: string[]
  body: string
}

function analyzeExecute(prop: Prop): ExecuteInfo | null {
  let text = prop.value.trim()
  if (prop.kind === 'value') {
    text = text.replace(/^async\b\s*/, '').replace(/^function\s*\*?\s*[\w$]*\s*/, '')
    const single = /^([A-Za-z_$][\w$]*)\s*=>/.exec(text)
    if (single) return { params: [single[1]], body: text.slice(single[0].length) }
  }
  if (!text.startsWith('(')) return null
  const close = matchBracket(text, 0)
  if (close === -1) return null
  return { params: splitTopLevel(text.slice(1, close)), body: text.slice(close + 1) }
}

/* ------------------------------------------------------------------ */
/*  Imperative (JavaScript) rules                                      */
/* ------------------------------------------------------------------ */

const NAVIGATOR_RE =
  /navigator\s*(?:\?\.|\.)\s*modelContext|["']modelContext["']\s+in\s+navigator|navigator\s*\[\s*["']modelContext["']\s*\]/
const DOCUMENT_RE =
  /document\s*(?:\?\.|\.)\s*modelContext|["']modelContext["']\s+in\s+document|document\s*\[\s*["']modelContext["']\s*\]/
const FEATURE_DETECT_RE =
  /["']modelContext["']\s+in\s+(?:document|navigator|window)|modelContext\s*(?:\?\.|\?\?|&&|\)|!==?|===?)|if\s*\(\s*!\s*(?:window\.)?(?:document|navigator)\s*\.\s*modelContext/

function validateJS(source: string): ValidationRule[] {
  const rules: ValidationRule[] = []
  const code = blankComments(source)

  // --- Where the API lives ------------------------------------------------
  const usesNavigator = NAVIGATOR_RE.test(code)
  const usesDocument = DOCUMENT_RE.test(code)
  rules.push({
    id: 'js-api',
    label: 'document.modelContext',
    status: usesNavigator ? (usesDocument ? 'warn' : 'fail') : usesDocument ? 'pass' : 'warn',
    message: usesNavigator
      ? usesDocument
        ? 'navigator.modelContext only helps Chrome 149 and earlier (deprecated in 150, removed in 152). Drop the fallback when you can.'
        : 'navigator.modelContext was deprecated in Chrome 150 and removed in Chrome 152. Use document.modelContext.'
      : usesDocument
        ? 'Uses document.modelContext, where the current spec puts the API'
        : 'Could not find document.modelContext. registerTool() lives on document.modelContext.',
  })

  const removed = Array.from(
    new Set(code.match(/\b(?:unregisterTool|provideContext|clearContext)\b/g) ?? [])
  )
  rules.push({
    id: 'js-removed',
    label: 'Removed methods',
    status: removed.length ? 'fail' : 'pass',
    message: removed.length
      ? `${removed.join(', ')} ${removed.length > 1 ? 'are' : 'is'} no longer in the spec. Register each tool with registerTool() and abort its AbortSignal to unregister it.`
      : 'No unregisterTool(), provideContext() or clearContext() calls',
  })

  // --- The registerTool() call ---------------------------------------------
  const call = findRegisterCall(code)
  rules.push({
    id: 'js-register',
    label: 'registerTool() call',
    status: call ? 'pass' : 'fail',
    message: call ? 'registerTool call found' : 'Missing document.modelContext.registerTool()',
  })

  if (call) {
    const before = code.slice(Math.max(0, call.index - 120), call.index)
    const handled =
      /\b(?:await|return)\s+[\w$.?\s]*$/.test(before) ||
      /^\s*\.\s*(?:then|catch)\s*\(/.test(call.after)
    rules.push({
      id: 'js-promise',
      label: 'Registration errors handled',
      status: handled ? 'pass' : 'warn',
      message: handled
        ? 'The Promise from registerTool() is awaited or handled'
        : 'registerTool() returns a Promise that rejects on an invalid or duplicate name or a bad inputSchema. await it in try/catch, or add .catch().',
    })

    const hasSignal = call.options !== null && /\bsignal\b/.test(call.options)
    rules.push({
      id: 'js-unregister',
      label: 'AbortSignal for unregistering',
      status: hasSignal ? 'pass' : 'warn',
      message: hasSignal
        ? 'A signal is passed; aborting it unregisters the tool'
        : 'There is no unregisterTool(). Pass { signal: controller.signal } as the second argument and call controller.abort() to unregister.',
    })
  }

  // --- The tool dictionary -------------------------------------------------
  let toolOpen = call ? call.toolOpen : -1
  if (toolOpen === -1) toolOpen = findToolObjectByShape(code)
  const props = toolOpen === -1 ? null : parseObject(code, toolOpen)
  // Without a located object literal, fall back to "the key appears somewhere".
  const has = (key: string) =>
    props ? props.has(key) : new RegExp(`(?:^|[^\\w$])["']?${key}["']?\\s*[:(]`).test(code)

  const nameProp = props?.get('name')
  const nameValue = nameProp?.kind === 'value' ? stringLiteral(nameProp.value) : null
  const nameProblem = nameValue !== null ? toolNameError(nameValue) : null
  rules.push({
    id: 'js-name',
    label: 'name property',
    status: !has('name') || nameProblem ? 'fail' : 'pass',
    message: !has('name')
      ? 'Missing required name property'
      : nameProblem
        ? `registerTool() rejects this name. ${nameProblem}`
        : nameValue !== null
          ? `"${nameValue}" is a valid tool name`
          : 'name property present',
  })

  const annotationsProp = props?.get('annotations')
  const annotations =
    annotationsProp?.kind === 'value' && annotationsProp.value.startsWith('{')
      ? parseObject(annotationsProp.value, 0)
      : null

  if (has('title') || annotations?.has('title')) {
    const topLevel = has('title')
    rules.push({
      id: 'js-title',
      label: 'title property',
      status: topLevel ? 'pass' : 'warn',
      message: topLevel
        ? 'Top-level title set; browsers show it to people'
        : 'title belongs at the top level of the tool, not in annotations. annotations.title is MCP-only and is dropped.',
    })
  }

  const descProp = props?.get('description')
  const descValue = descProp?.kind === 'value' ? stringLiteral(descProp.value) : null
  rules.push({
    id: 'js-desc',
    label: 'description property',
    status: !has('description') || descValue === '' ? 'fail' : 'pass',
    message: !has('description')
      ? 'Missing required description'
      : descValue === ''
        ? 'registerTool() rejects an empty description'
        : 'description property present',
  })

  const schemaProp = props?.get('inputSchema')
  let schemaMessage = 'inputSchema defined'
  let schemaStatus: ValidationRule['status'] = 'pass'
  if (!has('inputSchema')) {
    schemaStatus = 'warn'
    schemaMessage =
      'No inputSchema: agents will call the tool with no arguments. Fine only for tools without parameters.'
  } else if (schemaProp?.kind === 'value' && schemaProp.value.startsWith('{')) {
    const schema = parseObject(schemaProp.value, 0)
    const properties = schema.get('properties')
    const undocumented: string[] = []
    if (properties?.kind === 'value' && properties.value.startsWith('{')) {
      parseObject(properties.value, 0).forEach((p, key) => {
        if (p.kind === 'value' && p.value.startsWith('{')) {
          if (!parseObject(p.value, 0).has('description')) undocumented.push(key)
        }
      })
    }
    if (!schema.has('type')) {
      schemaStatus = 'warn'
      schemaMessage = 'inputSchema should be a JSON Schema object: { type: "object", properties }'
    } else if (undocumented.length) {
      schemaStatus = 'warn'
      schemaMessage = `No description for ${undocumented.join(', ')}. Describe what each value means.`
    }
  }
  rules.push({
    id: 'js-schema',
    label: 'inputSchema property',
    status: schemaStatus,
    message: schemaMessage,
  })

  rules.push({
    id: 'js-execute',
    label: 'execute function',
    status: has('execute') ? 'pass' : 'fail',
    message: has('execute') ? 'execute handler found' : 'Missing execute function',
  })

  const executeProp = props?.get('execute')
  const execute = executeProp ? analyzeExecute(executeProp) : null
  if (execute) {
    const second = execute.params[1] ?? ''
    const aliases = second.match(/[A-Za-z_$][\w$]*/g) ?? []
    const forwards = aliases.some((alias) => mentions(execute.body, alias))
    const asyncWork = /\bfetch\s*\(|\bawait\b|\.then\s*\(|\bsetTimeout\s*\(/.test(execute.body)
    let status: ValidationRule['status'] = 'pass'
    let message = 'execute(input, { signal }) uses the signal'
    if (!second) {
      status = asyncWork ? 'warn' : 'pass'
      message = asyncWork
        ? 'execute() ignores its second argument. Use execute(input, { signal }) and pass signal to fetch() so cancelled calls stop.'
        : 'Synchronous execute; it can ignore the signal'
    } else if (!forwards && asyncWork) {
      status = 'warn'
      message =
        'execute() takes a signal but never uses it. Pass it to fetch() and other async work.'
    }
    rules.push({ id: 'js-signal', label: 'Cancellation signal', status, message })

    if (/\bthrow\s+(?:new\s+[\w$]*Error\b|["'`])/.test(execute.body)) {
      rules.push({
        id: 'js-throw',
        label: 'Errors returned as values',
        status: 'warn',
        message:
          'A thrown error reaches the agent as an OperationError with no message. Return { error: "..." } instead.',
      })
    }
  }

  // --- Annotations ---------------------------------------------------------
  const annotationKeys = annotations ? Array.from(annotations.keys()) : []
  const mcpOnly = annotationKeys.filter((k) => MCP_ONLY_ANNOTATIONS.includes(k))
  const unknown = annotationKeys.filter(
    (k) => k !== 'title' && !VALID_ANNOTATIONS.includes(k) && !MCP_ONLY_ANNOTATIONS.includes(k)
  )
  rules.push({
    id: 'js-annotations',
    label: 'annotations object',
    status: has('annotations') && !unknown.length ? 'pass' : 'warn',
    message: !has('annotations')
      ? 'No annotations. Set readOnlyHint: true for tools that only read, or consequentialHint: true for irreversible ones.'
      : unknown.length
        ? `Unknown annotation${unknown.length > 1 ? 's' : ''} ${unknown.join(', ')} will be ignored. Valid: ${VALID_ANNOTATIONS.join(', ')}.`
        : 'annotations present',
  })

  if (mcpOnly.length) {
    rules.push({
      id: 'js-annotations-mcp',
      label: 'MCP-only annotations',
      status: 'warn',
      message: `${mcpOnly.join(', ')} ${mcpOnly.length > 1 ? 'are' : 'is'} MCP-only and silently dropped by WebMCP. Use consequentialHint for destructive or irreversible actions.`,
    })
  }

  const consequential = consequentialWord(`${nameValue ?? ''} ${descValue ?? ''}`)
  const consequentialSet =
    annotations?.get('consequentialHint')?.kind === 'value' &&
    annotations.get('consequentialHint')?.value === 'true'
  if (consequential && !consequentialSet) {
    rules.push({
      id: 'js-consequential',
      label: 'consequentialHint',
      status: 'warn',
      message: `This tool looks consequential ("${consequential}"). Set consequentialHint: true so agents ask the user first.`,
    })
  }

  const detects = FEATURE_DETECT_RE.test(code)
  rules.push({
    id: 'js-feature-detect',
    label: 'Feature detection',
    status: detects ? 'pass' : 'warn',
    message: detects
      ? 'Checks that document.modelContext exists before using it'
      : 'Could not find a check like if ("modelContext" in document). Most browsers do not support WebMCP yet.',
  })

  return rules
}

/* ------------------------------------------------------------------ */
/*  Declarative (HTML) rules                                           */
/* ------------------------------------------------------------------ */

interface Tag {
  name: string
  attrs: Map<string, string>
  index: number
}

/** Opening tags with the given names; quote-aware so `>` inside attribute values is fine. */
function findTags(code: string, names: string[]): Tag[] {
  const tags: Tag[] = []
  const re = /<([A-Za-z][\w-]*)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(code)) !== null) {
    const name = match[1].toLowerCase()
    if (!names.includes(name)) continue
    let quote = ''
    let end = match.index + match[0].length
    for (; end < code.length; end++) {
      const c = code[end]
      if (quote) {
        if (c === quote) quote = ''
      } else if (c === '"' || c === "'") quote = c
      else if (c === '>') break
    }
    tags.push({
      name,
      attrs: parseAttrs(code.slice(match.index + match[0].length, end)),
      index: match.index,
    })
  }
  return tags
}

/** Attribute names (lowercased) to decoded values; boolean attributes map to ''. */
function parseAttrs(body: string): Map<string, string> {
  const attrs = new Map<string, string>()
  const re = /([^\s"'=<>/`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let match: RegExpExecArray | null
  while ((match = re.exec(body)) !== null) {
    const name = match[1].toLowerCase()
    if (!attrs.has(name)) attrs.set(name, decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''))
  }
  return attrs
}

/** An attribute's value ('' for boolean attributes), or null when absent. */
function getAttr(tag: Tag | undefined, attr: string): string | null {
  return tag?.attrs.get(attr) ?? null
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

const NON_DATA_INPUTS = ['submit', 'button', 'reset', 'image', 'hidden']

function validateHTML(source: string): ValidationRule[] {
  const rules: ValidationRule[] = []
  // Blank out comments but keep offsets, so commented-out markup is ignored.
  const code = source.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))

  rules.push({
    id: 'html-status',
    label: 'Declarative API status',
    status: 'warn',
    message:
      'Experimental: declarative forms were removed from the spec draft on Oct 8, 2026 and only ship in Chromium, behind the same origin trial. Keep an imperative version as the stable path.',
  })

  const forms = findTags(code, ['form'])
  const form =
    forms.find((f) => f.attrs.has('toolname') || f.attrs.has('tooldescription')) ?? forms[0]
  rules.push({
    id: 'html-form',
    label: '<form> element',
    status: form ? 'pass' : 'fail',
    message: form
      ? forms.length > 1
        ? `${forms.length} forms found; checking the first tool form`
        : 'Form element found'
      : 'Missing <form> element',
  })

  const toolName = getAttr(form, 'toolname')
  const nameProblem = toolName !== null ? toolNameError(toolName) : null
  rules.push({
    id: 'html-toolname',
    label: 'toolname attribute',
    status: toolName === null || nameProblem ? 'fail' : 'pass',
    message:
      toolName === null
        ? 'Missing required toolname attribute on <form>'
        : nameProblem
          ? `Chromium skips forms with an invalid toolname. ${nameProblem}`
          : `"${toolName}" is a valid tool name`,
  })

  const toolDesc = getAttr(form, 'tooldescription')
  rules.push({
    id: 'html-tooldesc',
    label: 'tooldescription attribute',
    status: toolDesc === null || !toolDesc.trim() ? 'fail' : 'pass',
    message:
      toolDesc === null
        ? 'Missing required tooldescription attribute'
        : !toolDesc.trim()
          ? 'tooldescription is empty'
          : 'tooldescription attribute present',
  })

  const toolTitle = getAttr(form, 'tooltitle')
  if (toolTitle !== null) {
    rules.push({
      id: 'html-tooltitle',
      label: 'tooltitle attribute',
      status: toolTitle.trim() ? 'pass' : 'warn',
      message: toolTitle.trim()
        ? 'tooltitle set; browsers show it to people'
        : 'tooltitle is empty; remove it or give the tool a readable title',
    })
  }

  const usesParamTitle = findTags(code, ['input', 'select', 'textarea', 'fieldset', 'form']).some(
    (tag) => tag.attrs.has('toolparamtitle')
  )
  if (usesParamTitle) {
    rules.push({
      id: 'html-paramtitle',
      label: 'toolparamtitle',
      status: 'fail',
      message:
        'toolparamtitle was removed (it only shipped in Chrome 146-147). The name attribute is the parameter key; describe it with a <label> or toolparamdescription.',
    })
  }

  const controls = findTags(code, ['input', 'select', 'textarea']).filter((tag) => {
    const type = (getAttr(tag, 'type') ?? '').toLowerCase()
    return tag.name !== 'input' || !NON_DATA_INPUTS.includes(type)
  })

  const unnamed = controls.filter((tag) => !getAttr(tag, 'name'))
  rules.push({
    id: 'html-names',
    label: 'name on inputs',
    status: controls.length && !unnamed.length ? 'pass' : 'warn',
    message: !controls.length
      ? 'No inputs found; the tool will take no parameters'
      : unnamed.length
        ? `${unnamed.length} input${unnamed.length > 1 ? 's have' : ' has'} no name attribute and will be left out of the tool's input schema`
        : 'Every input has a name (its parameter key)',
  })

  if (controls.length) {
    const labelFor = new Set(
      findTags(code, ['label'])
        .map((tag) => getAttr(tag, 'for'))
        .filter((v): v is string => !!v)
    )
    const lower = code.toLowerCase()
    const undescribed = controls.filter((tag) => {
      if (getAttr(tag, 'toolparamdescription') || getAttr(tag, 'aria-description')) {
        return false
      }
      const id = getAttr(tag, 'id')
      if (id && labelFor.has(id)) return false
      const before = lower.slice(0, tag.index)
      return before.lastIndexOf('<label') <= before.lastIndexOf('</label')
    })
    rules.push({
      id: 'html-paramdesc',
      label: 'Parameter descriptions',
      status: undescribed.length ? 'warn' : 'pass',
      message: undescribed.length
        ? `${undescribed.length} input${undescribed.length > 1 ? 's have' : ' has'} no toolparamdescription, <label> or aria-description, so agents only see the name`
        : 'Inputs are described by toolparamdescription or a <label>',
    })
  }

  const autoSubmit = getAttr(form, 'toolautosubmit') !== null
  const risky = autoSubmit
    ? consequentialWord(`${toolName ?? ''} ${toolDesc ?? ''} ${toolTitle ?? ''}`)
    : null
  rules.push({
    id: 'html-autosubmit',
    label: 'toolautosubmit attribute',
    status: risky ? 'warn' : 'pass',
    message: risky
      ? `This form looks consequential ("${risky}"). Remove toolautosubmit so the user reviews and submits it.`
      : autoSubmit
        ? 'Auto-submit enabled: agents can submit without the user. Keep it to searches and other safe forms.'
        : 'No toolautosubmit: the browser focuses the submit button and the user submits',
  })

  return rules
}

/* ------------------------------------------------------------------ */
/*  Entry point                                                        */
/* ------------------------------------------------------------------ */

export function validate(code: string): { type: CodeType; rules: ValidationRule[] } {
  const type = detectCodeType(code)
  if (type === 'html') return { type, rules: validateHTML(code) }
  if (type === 'js') return { type, rules: validateJS(code) }
  return {
    type,
    rules: [
      {
        id: 'detect-fail',
        label: 'Code detection',
        status: 'fail',
        message:
          'Could not detect WebMCP code. Paste a <form> with toolname or a document.modelContext.registerTool() call.',
      },
    ],
  }
}
