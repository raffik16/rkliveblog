'use client'

import React from 'react'

interface Token {
  type: 'tag' | 'attr' | 'string' | 'keyword' | 'comment' | 'punctuation' | 'text' | 'number'
  value: string
}

/**
 * HTML tokenizer that tracks whether it is inside a tag, so every attribute gets colored (not
 * just the first), and hands inline <script> bodies to the JS tokenizer. Every character of the
 * input ends up in exactly one token.
 */
function tokenizeHTML(code: string): Token[] {
  const tokens: Token[] = []
  const outside = /(<!--[\s\S]*?(?:-->|$))|(<\/?)([A-Za-z][\w-]*)|([^<]+)|([\s\S])/y
  const inside = /(\s+)|(\/?>)|("[^"]*"?|'[^']*'?)|(=)|([^\s"'=<>/]+)|([\s\S])/y
  let i = 0
  let inTag = false
  let tagName = ''
  let closing = false

  while (i < code.length) {
    const re = inTag ? inside : outside
    re.lastIndex = i
    const m = re.exec(code)
    if (!m) break
    i = re.lastIndex

    if (!inTag) {
      if (m[1]) tokens.push({ type: 'comment', value: m[1] })
      else if (m[3]) {
        tokens.push({ type: 'tag', value: m[2] + m[3] })
        inTag = true
        closing = m[2] === '</'
        tagName = m[3].toLowerCase()
      } else tokens.push({ type: 'text', value: m[4] || m[5] })
      continue
    }

    if (m[1]) tokens.push({ type: 'text', value: m[1] })
    else if (m[2]) {
      tokens.push({ type: 'punctuation', value: m[2] })
      inTag = false
      if (tagName === 'script' && !closing && m[2] === '>') {
        const end = code.toLowerCase().indexOf('</script', i)
        const stop = end === -1 ? code.length : end
        tokens.push(...tokenizeJS(code.slice(i, stop)))
        i = stop
      }
    } else if (m[3]) tokens.push({ type: 'string', value: m[3] })
    else if (m[4]) tokens.push({ type: 'punctuation', value: m[4] })
    else if (m[5]) tokens.push({ type: 'attr', value: m[5] })
    else tokens.push({ type: 'text', value: m[6] })
  }
  return tokens
}

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = []
  const keywords = new Set([
    'const',
    'let',
    'var',
    'function',
    'return',
    'async',
    'await',
    'if',
    'else',
    'for',
    'while',
    'import',
    'export',
    'from',
    'true',
    'false',
    'null',
    'undefined',
    'new',
    'typeof',
    'class',
    'try',
    'catch',
    'throw',
    'instanceof',
    'in',
  ])

  // The last alternative catches any character the others miss, so nothing is dropped.
  const re =
    /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|([a-zA-Z_$][\w$]*)|([{}()[\];:.,=<>+\-*/%!?&|^~])|(\s+)|([\s\S])/gm
  let match: RegExpExecArray | null

  while ((match = re.exec(code)) !== null) {
    if (match[1]) tokens.push({ type: 'comment', value: match[1] })
    else if (match[2]) tokens.push({ type: 'string', value: match[2] })
    else if (match[3]) tokens.push({ type: 'number', value: match[3] })
    else if (match[4])
      tokens.push({
        type: keywords.has(match[4]) ? 'keyword' : 'text',
        value: match[4],
      })
    else if (match[5]) tokens.push({ type: 'punctuation', value: match[5] })
    else tokens.push({ type: 'text', value: match[0] })
  }
  return tokens
}

const colorMap: Record<Token['type'], string> = {
  tag: 'text-orange-400',
  attr: 'text-sky-400',
  string: 'text-emerald-400',
  keyword: 'text-violet-400',
  comment: 'text-gray-500 italic',
  punctuation: 'text-gray-400',
  text: 'text-gray-200',
  number: 'text-amber-300',
}

export function CodeBlock({ code, language }: { code: string; language: 'html' | 'js' }) {
  const tokens = language === 'html' ? tokenizeHTML(code) : tokenizeJS(code)

  return (
    <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm leading-relaxed">
      <code>
        {tokens.map((token, i) => (
          <span key={i} className={colorMap[token.type]}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  )
}
