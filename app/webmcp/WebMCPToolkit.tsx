'use client'

import { useState, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import type { ToolDefinition, ToolParam } from './types'
import { generateDeclarativeHTML, generateImperativeJS } from './generators'
import { validate } from './validator'
import { CodeBlock } from './highlight'

/* ------------------------------------------------------------------ */
/*  Fade-in animation variant                                         */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

/* ------------------------------------------------------------------ */
/*  Default tool for the generator                                    */
/* ------------------------------------------------------------------ */
const defaultTool: ToolDefinition = {
  name: 'search_products',
  description: 'Search the product catalog by keyword, category, or price range',
  autoSubmit: false,
  params: [
    { name: 'query', type: 'string', description: 'Search keyword', required: true },
    { name: 'category', type: 'string', description: 'Product category filter', required: false },
    { name: 'max_price', type: 'number', description: 'Maximum price in USD', required: false },
  ],
}

/* ================================================================== */
/*  Hero Section                                                       */
/* ================================================================== */
function Hero() {
  return (
    <motion.section
      className="mb-16 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
    >
      <span className="mb-4 inline-block rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-500">
        Google I/O 2026
      </span>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        WebMCP Toolkit
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        Make your website agent-ready. Generate declarative HTML or imperative
        JavaScript for the WebMCP standard, then validate your implementation
        against the spec.
      </p>
    </motion.section>
  )
}

/* ================================================================== */
/*  Generator Section                                                  */
/* ================================================================== */
function Generator() {
  const [tool, setTool] = useState<ToolDefinition>(defaultTool)
  const [tab, setTab] = useState<'html' | 'js'>('html')
  const [copied, setCopied] = useState(false)

  const updateField = useCallback(
    <K extends keyof ToolDefinition>(key: K, value: ToolDefinition[K]) => {
      setTool((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const updateParam = useCallback((index: number, field: keyof ToolParam, value: string | boolean) => {
    setTool((prev) => {
      const params = [...prev.params]
      params[index] = { ...params[index], [field]: value }
      return { ...prev, params }
    })
  }, [])

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

  const output = tab === 'html' ? generateDeclarativeHTML(tool) : generateImperativeJS(tool)

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
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Generator
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Form inputs */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tool Name
            </label>
            <input
              type="text"
              value={tool.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={tool.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={tool.autoSubmit}
              onChange={(e) => updateField('autoSubmit', e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            Auto-submit (toolautosubmit)
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Parameters
              </span>
              <button
                onClick={addParam}
                className="rounded-lg bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-500 transition hover:bg-primary-500/20"
              >
                + Add
              </button>
            </div>

            {tool.params.map((param, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50"
              >
                <input
                  type="text"
                  placeholder="name"
                  value={param.name}
                  onChange={(e) => updateParam(i, 'name', e.target.value)}
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="description"
                  value={param.description}
                  onChange={(e) => updateParam(i, 'description', e.target.value)}
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(i, 'required', e.target.checked)}
                      className="rounded border-gray-300 text-primary-500"
                    />
                    Req
                  </label>
                  <button
                    onClick={() => removeParam(i)}
                    className="text-red-400 transition hover:text-red-500"
                    aria-label="Remove parameter"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Code output */}
        <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
              {(['html', 'js'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
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
              onClick={handleCopy}
              className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <CodeBlock code={output} language={tab} />
        </div>
      </div>
    </motion.section>
  )
}

/* ================================================================== */
/*  Validator Section                                                  */
/* ================================================================== */
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
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Validator
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste your WebMCP code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            placeholder={'<form toolname="..." tooldescription="...">\n  ...\n</form>\n\nor\n\nnavigator.modelContext.registerTool({ ... })'}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          {result ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-gray-600 dark:bg-gray-900 dark:text-gray-400">
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
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        rule.status === 'pass'
                          ? 'bg-emerald-500'
                          : rule.status === 'warn'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      }`}
                    >
                      {rule.status === 'pass' ? 'â' : rule.status === 'warn' ? '!' : 'â'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
    { attr: 'toolname', desc: 'Unique tool identifier', on: '<form>' },
    { attr: 'tooldescription', desc: 'What the tool does (for agents)', on: '<form>' },
    { attr: 'toolautosubmit', desc: 'Allow agents to submit without user confirm', on: '<form>' },
    { attr: 'toolparamtitle', desc: 'Parameter name for agents', on: '<input>' },
    { attr: 'toolparamdescription', desc: 'Parameter description for agents', on: '<input>' },
  ]

  const imperativeProps = [
    { prop: 'name', desc: 'Unique tool identifier', required: true },
    { prop: 'description', desc: 'What the tool does', required: true },
    { prop: 'inputSchema', desc: 'JSON Schema for parameters', required: true },
    { prop: 'execute', desc: 'Async handler function', required: true },
    { prop: 'annotations', desc: 'Hints: title, readOnlyHint, openWorldHint', required: false },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={3}
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Quick Reference
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Declarative API
          </h3>
          <div className="space-y-3">
            {declarativeAttrs.map((a) => (
              <div key={a.attr} className="flex items-baseline gap-2">
                <code className="shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 text-xs font-medium text-primary-500">
                  {a.attr}
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {a.desc}
                </span>
                <span className="ml-auto shrink-0 text-xs text-gray-400">
                  {a.on}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/60">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Imperative API
          </h3>
          <div className="space-y-3">
            {imperativeProps.map((p) => (
              <div key={p.prop} className="flex items-baseline gap-2">
                <code className="shrink-0 rounded bg-orange-500/10 px-1.5 py-0.5 text-xs font-medium text-primary-500">
                  {p.prop}
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-400">
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
      <Generator />
      <Validator />
      <Reference />
    </div>
  )
}
