'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from '@/components/Link'
import type { ToolAnnotationKey, ToolDefinition, ToolParam } from './types'
import { generateDeclarativeHTML, generateImperativeJS } from './generators'
import { validate, toolNameError, consequentialWord, TOOL_NAME_HINT } from './validator'
import { CodeBlock } from './highlight'

/* ------------------------------------------------------------------ */
/*  Fade-in animation variant                                         */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const SPEC_REPO = 'https://github.com/webmachinelearning/webmcp'
const POST_HREF = '/blog/webmcp-six-months-later'

/* ------------------------------------------------------------------ */
/*  Default tool for the generator                                    */
/* ------------------------------------------------------------------ */
const defaultTool: ToolDefinition = {
  name: 'search_products',
  title: 'Search products',
  description: 'Search the product catalog by keyword, category, or price range',
  autoSubmit: false,
  annotations: { readOnlyHint: true },
  params: [
    { name: 'query', type: 'string', description: 'Search keyword', required: true },
    { name: 'category', type: 'string', description: 'Product category filter', required: false },
    { name: 'max_price', type: 'number', description: 'Maximum price in USD', required: false },
  ],
}

const annotationOptions: { key: ToolAnnotationKey; hint: string }[] = [
  { key: 'readOnlyHint', hint: 'Only reads data, so agents can call it freely' },
  {
    key: 'consequentialHint',
    hint: 'Real-world or irreversible effects (payments, bookings); agents should confirm first',
  },
  {
    key: 'untrustedContentHint',
    hint: "Returns content you don't control, like user posts or third-party data",
  },
]

/* ================================================================== */
/*  Hero Section                                                       */
/* ================================================================== */
function Hero() {
  return (
    <motion.section
      className="mb-12 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
    >
      <span className="bg-primary-500/10 text-primary-500 mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
        Updated November 2026
      </span>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
        WebMCP Toolkit
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        Make your website agent-ready. Generate a{' '}
        <code className="text-base break-words">document.modelContext.registerTool()</code> call or
        an experimental declarative form, then check your code against the current spec draft.
      </p>
    </motion.section>
  )
}

/* ================================================================== */
/*  Spec status                                                        */
/* ================================================================== */
function SpecStatus() {
  const linkClass =
    'text-primary-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium underline underline-offset-2'

  return (
    <motion.section
      className="mx-auto mb-16 max-w-3xl rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={1}
      aria-labelledby="webmcp-spec-status"
    >
      <h2
        id="webmcp-spec-status"
        className="mb-3 text-lg font-semibold text-gray-900 dark:text-white"
      >
        Spec status (Nov 2026)
      </h2>
      <ul className="list-disc space-y-2 pl-5 text-sm break-words text-gray-600 dark:text-gray-400">
        <li>
          The API lives on <code>document.modelContext</code>. Chrome 150 and 151 still answer on{' '}
          <code>navigator.modelContext</code> with a deprecation warning; Chrome 152 removed it.
        </li>
        <li>
          <code>registerTool(tool, {'{ signal, exposedTo }'})</code> returns a Promise. There is no{' '}
          <code>unregisterTool()</code>, <code>provideContext()</code> or{' '}
          <code>clearContext()</code>: abort the signal to unregister.
        </li>
        <li>
          Annotations are <code>readOnlyHint</code>, <code>consequentialHint</code>,{' '}
          <code>untrustedContentHint</code> and <code>debugging</code>. MCP&apos;s{' '}
          <code>openWorldHint</code>, <code>destructiveHint</code> and <code>idempotentHint</code>{' '}
          are dropped, and <code>title</code> is a top-level field.
        </li>
        <li>
          Declarative forms were taken out of the spec draft &quot;for now&quot; on October 8, 2026.
          Chromium still ships them experimentally, behind the same origin trial.
        </li>
        <li>
          HTTPS only, and the <code>tools</code> Permissions Policy defaults to <code>self</code>.
        </li>
      </ul>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href={POST_HREF} className={linkClass}>
          Read: WebMCP, six months later
        </Link>
        <Link href={SPEC_REPO} className={linkClass}>
          The spec on GitHub<span className="sr-only"> (opens in a new tab)</span>
        </Link>
      </p>
    </motion.section>
  )
}

/* ================================================================== */
/*  Generator Section                                                  */
/* ================================================================== */
function Generator() {
  const [tool, setTool] = useState<ToolDefinition>(defaultTool)
  const [tab, setTab] = useState<'html' | 'js'>('js')
  const [submitHandler, setSubmitHandler] = useState(false)
  const [copied, setCopied] = useState(false)

  const updateField = useCallback(
    <K extends keyof ToolDefinition>(key: K, value: ToolDefinition[K]) => {
      setTool((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const updateAnnotation = useCallback((key: ToolAnnotationKey, value: boolean) => {
    setTool((prev) => ({ ...prev, annotations: { ...prev.annotations, [key]: value } }))
  }, [])

  const updateParam = useCallback(
    (index: number, field: keyof ToolParam, value: string | boolean) => {
      setTool((prev) => {
        const params = [...prev.params]
        params[index] = { ...params[index], [field]: value }
        return { ...prev, params }
      })
    },
    []
  )

  const addParam = useCallback(() => {
    setTool((prev) => ({
      ...prev,
      params: [...prev.params, { name: '', type: 'string', description: '', required: false }],
    }))
  }, [])

  const removeParam = useCallback((index: number) => {
    setTool((prev) => ({
      ...prev,
      params: prev.params.filter((_, i) => i !== index),
    }))
  }, [])

  const output =
    tab === 'html' ? generateDeclarativeHTML(tool, { submitHandler }) : generateImperativeJS(tool)

  const nameError = toolNameError(tool.name)
  const autoSubmitRisk =
    tool.autoSubmit &&
    (tool.annotations?.consequentialHint ||
      consequentialWord(`${tool.name} ${tool.title ?? ''} ${tool.description}`))

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  return (
    <motion.section
      className="mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={1}
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Generator</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Form inputs */}
        <div className="min-w-0 space-y-4 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <div>
            <label
              htmlFor="webmcp-tool-name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tool Name
            </label>
            <input
              id="webmcp-tool-name"
              type="text"
              value={tool.name}
              onChange={(e) => updateField('name', e.target.value)}
              aria-invalid={nameError ? true : undefined}
              aria-describedby="webmcp-tool-name-hint"
              spellCheck={false}
              autoCapitalize="off"
              className={`focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:outline-none dark:bg-gray-900 dark:text-white ${
                nameError
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            <p
              id="webmcp-tool-name-hint"
              aria-live="polite"
              className={`mt-1 text-xs ${
                nameError ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {nameError ?? `${TOOL_NAME_HINT}.`}
            </p>
          </div>

          <div>
            <label
              htmlFor="webmcp-tool-title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
            </label>
            <input
              id="webmcp-tool-title"
              type="text"
              value={tool.title ?? ''}
              onChange={(e) => updateField('title', e.target.value)}
              aria-describedby="webmcp-tool-title-hint"
              placeholder="Search products"
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <p
              id="webmcp-tool-title-hint"
              className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              Shown to people in browser UI. A top-level <code>title</code> (or{' '}
              <code>tooltitle</code>), never <code>annotations.title</code>.
            </p>
          </div>

          <div>
            <label
              htmlFor="webmcp-tool-description"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="webmcp-tool-description"
              value={tool.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Annotations{' '}
              <span className="font-normal text-gray-500 dark:text-gray-400">
                (imperative JS; all default to false)
              </span>
            </legend>
            {annotationOptions.map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={!!tool.annotations?.[option.key]}
                  onChange={(e) => updateAnnotation(option.key, e.target.checked)}
                  className="text-primary-500 focus:ring-primary-500 mt-0.5 rounded border-gray-300"
                />
                <span className="min-w-0 font-mono text-xs">
                  {option.key}
                  <span className="block font-sans text-xs text-gray-500 dark:text-gray-400">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={tool.autoSubmit}
                onChange={(e) => updateField('autoSubmit', e.target.checked)}
                className="text-primary-500 focus:ring-primary-500 rounded border-gray-300"
              />
              Auto-submit (toolautosubmit, declarative only)
            </label>
            <p
              aria-live="polite"
              className={`mt-1 text-xs ${
                autoSubmitRisk
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {autoSubmitRisk
                ? 'This tool looks consequential. Leave auto-submit off so the user reviews and submits.'
                : 'Leave it off for payments, deletions, messages and bookings.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Parameters
              </span>
              <button
                type="button"
                onClick={addParam}
                className="bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 rounded-lg px-3 py-1 text-xs font-medium transition"
              >
                + Add
              </button>
            </div>

            {tool.params.map((param, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:grid sm:grid-cols-[1fr_1fr_auto] dark:border-gray-700 dark:bg-gray-900/50"
              >
                <input
                  type="text"
                  placeholder="name"
                  aria-label={`Parameter ${i + 1} name`}
                  value={param.name}
                  onChange={(e) => updateParam(i, 'name', e.target.value)}
                  className="w-full min-w-0 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="description"
                  aria-label={`Parameter ${i + 1} description`}
                  value={param.description}
                  onChange={(e) => updateParam(i, 'description', e.target.value)}
                  className="w-full min-w-0 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                <div className="flex items-center justify-end gap-2 sm:justify-start">
                  <select
                    aria-label={`Parameter ${i + 1} type`}
                    value={param.type === 'number' ? 'number' : 'string'}
                    onChange={(e) => updateParam(i, 'type', e.target.value)}
                    className="rounded border border-gray-300 bg-white py-1 pr-8 pl-2 text-xs dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                  </select>
                  <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(i, 'required', e.target.checked)}
                      className="text-primary-500 rounded border-gray-300"
                    />
                    Req
                  </label>
                  <button
                    type="button"
                    onClick={() => removeParam(i)}
                    className="text-red-400 transition hover:text-red-500"
                    aria-label={`Remove parameter ${param.name || i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code output */}
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
              {(['js', 'html'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    tab === t
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {t === 'html' ? 'Declarative HTML' : 'Imperative JS'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {tab === 'html' && (
            <div className="mb-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Experimental:
                </span>{' '}
                Chromium only, and not in the current spec draft. Ship the imperative version as
                your stable path.
              </p>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={submitHandler}
                  onChange={(e) => setSubmitHandler(e.target.checked)}
                  className="text-primary-500 focus:ring-primary-500 rounded border-gray-300"
                />
                Add a submit handler that answers agents with <code>respondWith()</code>
              </label>
            </div>
          )}

          <CodeBlock code={output} language={tab} />
        </div>
      </div>
    </motion.section>
  )
}

/* ================================================================== */
/*  Validator Section                                                  */
/* ================================================================== */
const statusText = { pass: 'Pass', warn: 'Warning', fail: 'Fail' } as const

function Validator() {
  const [code, setCode] = useState('')
  const result = code.trim() ? validate(code) : null

  return (
    <motion.section
      className="mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={2}
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Validator</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <label
            htmlFor="webmcp-validator-input"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Paste your WebMCP code
          </label>
          <textarea
            id="webmcp-validator-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            spellCheck={false}
            placeholder={
              'document.modelContext.registerTool({ ... }, { signal })\n\nor\n\n<form toolname="..." tooldescription="...">\n  ...\n</form>'
            }
            className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:ring-1 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          {result ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium tracking-wide text-gray-600 uppercase dark:bg-gray-900 dark:text-gray-400">
                  {result.type === 'html'
                    ? 'Declarative HTML'
                    : result.type === 'js'
                      ? 'Imperative JS'
                      : 'Unknown'}
                </span>
              </div>
              <ul className="space-y-2">
                {result.rules.map((rule) => (
                  <li
                    key={rule.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        rule.status === 'pass'
                          ? 'bg-emerald-500'
                          : rule.status === 'warn'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                    >
                      {rule.status === 'pass' ? '✓' : rule.status === 'warn' ? '!' : '✗'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        <span className="sr-only">{statusText[rule.status]}: </span>
                        {rule.label}
                      </p>
                      <p className="text-xs break-words text-gray-500 dark:text-gray-400">
                        {rule.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Paste WebMCP code on the left to see validation results.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}

/* ================================================================== */
/*  Quick Reference                                                    */
/* ================================================================== */
function Reference() {
  const declarativeAttrs = [
    { attr: 'toolname', desc: 'Tool name: 1-128 of A-Z a-z 0-9 _ - .', on: '<form>' },
    { attr: 'tooldescription', desc: 'What the tool does and when to use it', on: '<form>' },
    { attr: 'tooltitle', desc: 'Human-readable title for browser UI', on: '<form>' },
    {
      attr: 'toolautosubmit',
      desc: 'Agent may submit without the user (safe forms only)',
      on: '<form>',
    },
    { attr: 'name', desc: 'Parameter key in the input schema', on: '<input>' },
    {
      attr: 'toolparamdescription',
      desc: 'Parameter description (also on <fieldset>); else the <label> text, then aria-description',
      on: '<input>',
    },
    {
      attr: 'respondWith()',
      desc: 'When event.agentInvoked, answer the agent without navigating; call preventDefault() first',
      on: 'SubmitEvent',
    },
    {
      attr: ':tool-form-active',
      desc: 'Style the form (and :tool-submit-active its button) while an agent uses it',
      on: 'CSS',
    },
  ]

  const imperativeProps = [
    { prop: 'name', desc: 'Unique id: 1-128 of A-Z a-z 0-9 _ - .', required: true },
    { prop: 'title', desc: 'Human-readable label for browser UI', required: false },
    { prop: 'description', desc: 'What the tool does and when to use it', required: true },
    {
      prop: 'inputSchema',
      desc: 'JSON Schema for the input (not enforced; validate yourself)',
      required: false,
    },
    {
      prop: 'execute',
      desc: '(input, { signal }) => result; return errors as values',
      required: true,
    },
    {
      prop: 'annotations',
      desc: 'readOnlyHint, consequentialHint, untrustedContentHint, debugging',
      required: false,
    },
    {
      prop: '{ signal }',
      desc: 'Second argument to registerTool(); abort it to unregister',
      required: false,
    },
    {
      prop: '{ exposedTo }',
      desc: 'Origins of other frames that may use the tool',
      required: false,
    },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={3}
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Quick Reference</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Imperative API
          </h3>
          <p className="mb-4 text-xs break-words text-gray-500 dark:text-gray-400">
            <code>document.modelContext.registerTool(tool, options)</code>
          </p>
          <div className="space-y-3">
            {imperativeProps.map((p) => (
              <div
                key={p.prop}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:flex-nowrap"
              >
                <code className="text-primary-500 shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 text-xs font-medium">
                  {p.prop}
                </code>
                <span className="order-last min-w-0 basis-full text-sm break-words text-gray-600 sm:order-none sm:basis-auto dark:text-gray-400">
                  {p.desc}
                </span>
                <span
                  className={`ml-auto shrink-0 text-xs ${
                    p.required ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {p.required ? 'required' : 'optional'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <h3 className="mb-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            Declarative API
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
              Experimental · Chromium only
            </span>
          </h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Removed from the spec draft on October 8, 2026; still in Chromium&apos;s origin trial.
            <code> toolparamtitle</code> is gone.
          </p>
          <div className="space-y-3">
            {declarativeAttrs.map((a) => (
              <div
                key={a.attr}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:flex-nowrap"
              >
                <code className="text-primary-500 shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 text-xs font-medium">
                  {a.attr}
                </code>
                <span className="order-last min-w-0 basis-full text-sm break-words text-gray-600 sm:order-none sm:basis-auto dark:text-gray-400">
                  {a.desc}
                </span>
                <span className="ml-auto shrink-0 text-xs text-gray-400">{a.on}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ================================================================== */
/*  Main Toolkit Page                                                  */
/* ================================================================== */
export default function WebMCPToolkit() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Hero />
      <SpecStatus />
      <Generator />
      <Validator />
      <Reference />
    </div>
  )
}
