import type { ToolAnnotationKey, ToolDefinition, ToolParam } from './types'
import { toolNameError } from './validator'

export const ANNOTATION_KEYS: ToolAnnotationKey[] = [
  'readOnlyHint',
  'consequentialHint',
  'untrustedContentHint',
]

export interface DeclarativeOptions {
  /** Append a small submit handler that answers agents with SubmitEvent.respondWith(). */
  submitHandler?: boolean
}

/* ------------------------------------------------------------------ */
/*  Escaping                                                           */
/* ------------------------------------------------------------------ */

/** Safe inside a double-quoted HTML attribute value. */
function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Safe as HTML text content. */
function text(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** A double-quoted JS string literal that is also safe inside an inline <script>. */
function js(value: string): string {
  return JSON.stringify(value).replace(/<\//g, '<\\/')
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

function jsKey(key: string): string {
  return IDENTIFIER.test(key) ? key : js(key)
}

/** `input.name`, or `input["odd-name"]` when the name isn't an identifier. */
function inputAccess(name: string): string {
  return IDENTIFIER.test(name) ? `input.${name}` : `input[${js(name)}]`
}

/** A readable JS object literal (unquoted keys where possible, primitive arrays inline). */
function jsLiteral(value: unknown, indent: string): string {
  const inner = indent + '  '
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== 'object')) {
      return `[${value.map((v) => jsLiteral(v, inner)).join(', ')}]`
    }
    return `[\n${value.map((v) => inner + jsLiteral(v, inner)).join(',\n')}\n${indent}]`
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const lines = entries.map(([k, v]) => `${inner}${jsKey(k)}: ${jsLiteral(v, inner)}`)
    return `{\n${lines.join(',\n')}\n${indent}}`
  }
  if (typeof value === 'string') return js(value)
  return String(value)
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Params with a non-empty, unique (trimmed) name. `__proto__` is skipped: as an object-literal
 * key it sets the prototype instead of adding a property.
 */
function usableParams(tool: ToolDefinition): ToolParam[] {
  const seen = new Set<string>()
  const params: ToolParam[] = []
  for (const p of tool.params) {
    const name = p.name.trim()
    if (!name || name === '__proto__' || seen.has(name)) continue
    seen.add(name)
    params.push({ ...p, name, description: p.description.trim() })
  }
  return params
}

function isNumber(p: ToolParam): boolean {
  return p.type === 'number'
}

/** "max_price" -> "Max price" */
function humanize(name: string): string {
  const words = name.replace(/[_\-.]+/g, ' ').trim()
  return words ? words[0].toUpperCase() + words.slice(1) : name
}

/** Something usable in an id attribute. */
function slug(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'tool'
}

function nameWarning(tool: ToolDefinition, lead: string, open: string, close = ''): string {
  const problem = toolNameError(tool.name)
  return problem ? `${open} Warning: ${lead} ${problem}${close}\n` : ''
}

/* ------------------------------------------------------------------ */
/*  Declarative HTML (experimental, Chromium only)                     */
/* ------------------------------------------------------------------ */

export function generateDeclarativeHTML(
  tool: ToolDefinition,
  options: DeclarativeOptions = {}
): string {
  const params = usableParams(tool)
  const title = tool.title?.trim() ?? ''
  const formId = `${slug(tool.name)}-form`

  const formAttrs = [
    `id="${attr(formId)}"`,
    `toolname="${attr(tool.name)}"`,
    title ? `tooltitle="${attr(title)}"` : '',
    `tooldescription="${attr(tool.description)}"`,
    tool.autoSubmit ? 'toolautosubmit' : '',
  ]
    .filter(Boolean)
    .map((a) => `\n  ${a}`)
    .join('')

  const fields = params
    .map((p) => {
      const id = `${slug(tool.name)}-${slug(p.name)}`
      const inputAttrs = [
        `id="${attr(id)}"`,
        `type="${isNumber(p) ? 'number' : 'text'}"`,
        isNumber(p) ? 'step="any"' : '',
        `name="${attr(p.name)}"`,
        p.description ? `toolparamdescription="${attr(p.description)}"` : '',
        p.required ? 'required' : '',
      ]
        .filter(Boolean)
        .map((a) => `\n    ${a}`)
        .join('')
      return `  <label for="${attr(id)}">${text(humanize(p.name))}</label>\n  <input${inputAttrs}\n  />`
    })
    .join('\n\n')

  const header = `<!--
  WebMCP declarative form: experimental and Chromium only.
  Removed from the WebMCP spec draft "for now" in October 2026, but still
  shipping in Chromium behind the WebMCP origin trial. Other browsers ignore
  the tool* attributes, so the form keeps working as a normal form.
-->
${nameWarning(tool, 'Chromium skips forms with this toolname.', '<!--', ' -->')}`

  const form = `<form${formAttrs}
>
${fields ? fields + '\n\n' : ''}  <button type="submit">Run</button>
</form>`

  if (!options.submitHandler) return header + form

  const endpoint = js(`/api/${encodeURIComponent(tool.name.trim() || 'tool')}`)
  const handler = `
<script>
  // Answer agents without navigating. People submitting the form get the
  // normal submission; only agent-invoked submits are intercepted.
  document.getElementById(${js(formId)}).addEventListener("submit", (event) => {
    if (!event.agentInvoked) return;
    event.preventDefault(); // required before respondWith()
    const input = Object.fromEntries(new FormData(event.target));
    event.respondWith(
      fetch(${endpoint}, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })
        .then((response) =>
          response.ok
            ? response.json()
            : { error: "Request failed with status " + response.status }
        )
        .catch((err) => ({ error: String(err) }))
    );
  });
</script>`

  return header + form + '\n' + handler
}

/* ------------------------------------------------------------------ */
/*  Imperative JS (document.modelContext)                              */
/* ------------------------------------------------------------------ */

function validationChecks(params: ToolParam[], indent: string): string {
  return params
    .map((p) => {
      const value = inputAccess(p.name)
      let condition: string
      let message: string
      if (isNumber(p)) {
        condition = p.required
          ? `typeof ${value} !== "number"`
          : `${value} !== undefined && typeof ${value} !== "number"`
        message = p.required
          ? `${p.name} is required and must be a number.`
          : `${p.name} must be a number.`
      } else {
        condition = p.required
          ? `typeof ${value} !== "string" || ${value}.trim() === ""`
          : `${value} !== undefined && typeof ${value} !== "string"`
        message = p.required
          ? `${p.name} is required and must be a non-empty string.`
          : `${p.name} must be a string.`
      }
      return `${indent}if (${condition}) {\n${indent}  return { error: ${js(message)} };\n${indent}}`
    })
    .join('\n')
}

export function generateImperativeJS(tool: ToolDefinition): string {
  const params = usableParams(tool)
  const title = tool.title?.trim() ?? ''

  const properties: Record<string, { type: string; description?: string }> = {}
  for (const p of params) {
    properties[p.name] = {
      type: isNumber(p) ? 'number' : 'string',
      ...(p.description ? { description: p.description } : {}),
    }
  }
  const required = params.filter((p) => p.required).map((p) => p.name)
  const schema = jsLiteral(
    { type: 'object', properties, ...(required.length ? { required } : {}) },
    '    '
  )

  const enabled = ANNOTATION_KEYS.filter((key) => tool.annotations?.[key])
  const annotations = enabled.length
    ? `,\n    annotations: {\n${enabled.map((key) => `      ${key}: true`).join(',\n')}\n    }`
    : ''
  const annotationsNote = enabled.length
    ? ''
    : '\n    // annotations: readOnlyHint, consequentialHint, untrustedContentHint and\n    // debugging all default to false.'

  const checks = validationChecks(params, '      ')
  const endpoint = js(`/api/${encodeURIComponent(tool.name.trim() || 'tool')}`)
  const label = js(`WebMCP: could not register ${tool.name}`)

  return `// WebMCP imperative API, current spec draft (October 2026). HTTPS only.
// Chrome 152+ exposes it on document.modelContext only.
${nameWarning(tool, 'registerTool() rejects this name.', '//')}if ("modelContext" in document) {
  const controller = new AbortController();

  document.modelContext.registerTool({
    name: ${js(tool.name)},${title ? `\n    title: ${js(title)},` : ''}
    description: ${js(tool.description)},
    inputSchema: ${schema},
    async execute(input, { signal }) {
${checks ? `      // The browser doesn't check input against inputSchema, so validate here.\n${checks}\n` : ''}      try {
        const response = await fetch(${endpoint}, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
          signal
        });
        if (!response.ok) {
          return { error: "Request failed with status " + response.status };
        }
        return await response.json();
      } catch (err) {
        // Cancelled by the agent or the user: let the call end.
        if (signal.aborted) throw err;
        // A thrown error reaches the agent as an OperationError with no
        // message, so return errors as values the agent can read.
        return { error: err instanceof Error ? err.message : String(err) };
      }
    }${annotations}${annotationsNote}
  }, { signal: controller.signal }).catch((err) => {
    // Rejects on an invalid or duplicate name, or an inputSchema that
    // can't be serialized.
    console.warn(${label}, err);
  });

  // There is no unregisterTool(). To remove the tool (route change,
  // component unmount), abort the signal it was registered with:
  // controller.abort();
}`
}
